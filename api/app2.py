from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
import logging

app = Flask(__name__)

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuración de la base de datos
db_config = {
    'host': os.environ.get('DB_HOST', 'pg_db_movies'),
    'port': os.environ.get('DB_PORT', '5432'),
    'user': os.environ.get('DB_USER', 'dfz'),
    'password': os.environ.get('DB_PASSWORD', 'strong-password'),
    'database': os.environ.get('DB_NAME', 'db_movies')
}

def get_db_connection():
    """Establece una conexión con la base de datos PostgreSQL."""
    try:
        conn = psycopg2.connect(**db_config)
        return conn
    except Exception as e:
        logger.error(f"Error al conectar a la base de datos: {e}")
        return None

# Endpoint simple para verificar que la API está funcionando
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "online",
        "message": "API de recomendación de películas UNIR D1",
        "endpoints": {
            "/recommendations": "POST - Obtener recomendaciones basadas en múltiples películas",
            "/search": "GET - Buscar películas por nombre"
        }
    })


@app.route('/api/favorites/<user_id>', methods=['GET'])
def get_user_favorites(user_id):
    """
    Endpoint para obtener todos los IDs de películas favoritas de un usuario.

    Args:
        user_id (str): ID del usuario

    Returns:
        JSON con la lista de IDs de películas favoritas
    """
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Error de conexión a la base de datos"}), 500

        cursor = conn.cursor()
        cursor.execute("SELECT movieId FROM user_favorite_movie WHERE userId = %s", (user_id,))
        favorites = [row[0] for row in cursor.fetchall()]

        cursor.close()
        conn.close()

        return jsonify({
            "userId": user_id,
            "favorites": favorites,
            "count": len(favorites)
        })

    except Exception as e:
        logger.error(f"Error al obtener favoritos: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/favorites', methods=['POST'])
def toggle_favorite():
    """
    Endpoint para agregar o quitar una película de favoritos.
    Si la relación ya existe, la elimina. Si no existe, la crea.

    Request body:
    {
        "userId": "string",
        "movieId": integer
    }

    Returns:
        JSON con el resultado de la operación
    """
    try:
        data = request.get_json()

        if not data or 'userId' not in data or 'movieId' not in data:
            return jsonify({"error": "Se requieren userId y movieId"}), 400

        user_id = data['userId']
        movie_id = data['movieId']

        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Error de conexión a la base de datos"}), 500

        cursor = conn.cursor()

        # Verificar si ya existe la relación
        cursor.execute(
            "SELECT id FROM user_favorite_movie WHERE userId = %s AND movieId = %s",
            (user_id, movie_id)
        )
        existing = cursor.fetchone()

        if existing:
            # Si existe, eliminar
            cursor.execute(
                "DELETE FROM user_favorite_movie WHERE userId = %s AND movieId = %s",
                (user_id, movie_id)
            )
            action = "removed"
        else:
            # Si no existe, crear
            cursor.execute(
                "INSERT INTO user_favorite_movie (userId, movieId) VALUES (%s, %s)",
                (user_id, movie_id)
            )
            action = "added"

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "userId": user_id,
            "movieId": movie_id,
            "action": action,
            "success": True
        })

    except psycopg2.IntegrityError as e:
        logger.error(f"Error de integridad: {e}")
        return jsonify({"error": "Error de integridad en la base de datos"}), 400

    except Exception as e:
        logger.error(f"Error al procesar favorito: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)