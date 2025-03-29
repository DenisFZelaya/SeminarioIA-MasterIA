# app.py - API Flask para recomendaciones y favoritos de películas
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix
import psycopg2
import joblib
import os
import logging

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://proyecto-d1.site"],
        "supports_credentials": True
    }
})
@app.before_request
def enforce_https():
    if request.headers.get('X-Forwarded-Proto') == 'http':
        url = request.url.replace('http://', 'https://', 1)
        return redirect(url, code=301)
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

# Variables globales para el modelo y datos
knn_model = None
movies_df = None
final_dataset = None
csr_data = None

# Función para establecer conexión con la base de datos
def get_db_connection():
    """Establece una conexión con la base de datos PostgreSQL."""
    try:
        conn = psycopg2.connect(**db_config)
        return conn
    except Exception as e:
        logger.error(f"Error al conectar a la base de datos: {e}")
        return None

# Función para cargar el modelo y datos
def load_model_and_data():
    global knn_model, movies_df, final_dataset, csr_data

    try:
        logger.info("Cargando modelo y datos...")
        # Cargar el modelo KNN
        knn_model = joblib.load('modelo/knn_model.pkl')

        # Cargar la matriz CSR
        csr_data = joblib.load('modelo/csr_data.pkl')

        # Cargar el DataFrame de películas
        movies_df = pd.read_csv('modelo/movies_data.csv')

        # Cargar el DataFrame final con los IDs
        final_dataset = pd.read_csv('modelo/final_dataset_ids.csv', index_col=0)

        logger.info("Datos cargados correctamente")
        return True
    except Exception as e:
        logger.error(f"Error al cargar modelo y datos: {e}")
        return False

# Cargar modelo al iniciar la aplicación
model_loaded = load_model_and_data()

# Función de recomendación para múltiples películas
def get_recommendations_from_multiple_movies(movie_names_list, n_recommendations=10):
    # Para almacenar los índices de las películas encontradas
    found_movie_indices = []
    found_movie_titles = []

    # Encontrar cada película en la lista
    for movie_name in movie_names_list:
        movie_list = movies_df[movies_df['title'].str.contains(movie_name, case=False)]

        if len(movie_list) > 0:
            movie_id = movie_list.iloc[0]['movieId']
            # Verificar que la película esté en el dataset final
            if any(final_dataset['movieId'] == movie_id):
                movie_idx = final_dataset[final_dataset['movieId'] == movie_id].index[0]
                found_movie_indices.append(movie_idx)
                found_movie_titles.append(movie_list.iloc[0]['title'])

    if not found_movie_indices:
        return {"error": "No se encontraron películas. Por favor verifica tu entrada."}

    # Diccionario para almacenar películas candidatas con sus puntajes
    candidates = {}

    # Obtener vecinos para cada película encontrada
    for idx in found_movie_indices:
        distances, indices = knn_model.kneighbors(csr_data[idx], n_neighbors=n_recommendations+1)

        # Convertir a lista y omitir la primera (que es la película misma)
        movie_indices = indices.squeeze().tolist()[1:]
        movie_distances = distances.squeeze().tolist()[1:]

        # Agregar cada vecino al diccionario de candidatos
        for i, val in enumerate(movie_indices):
            movie_id = final_dataset.iloc[val]['movieId']

            # Evitar recomendar películas que ya están en la lista de entrada
            if movie_id not in [final_dataset.iloc[x]['movieId'] for x in found_movie_indices]:
                # Si la película ya está en candidatos, promediamos las distancias
                if movie_id in candidates:
                    candidates[movie_id]['count'] += 1
                    candidates[movie_id]['total_distance'] += movie_distances[i]
                else:
                    title = movies_df[movies_df['movieId'] == movie_id].iloc[0]['title']
                    candidates[movie_id] = {
                        'movieId': int(movie_id),  # Se agrega movieId
                        'title': title,
                        'count': 1,
                        'total_distance': movie_distances[i]
                    }

    # Calcular puntaje final para cada película candidata
    recommendations = []
    for movie_id, data in candidates.items():
        avg_distance = data['total_distance'] / data['count']
        freq_score = data['count'] / len(found_movie_indices)
        distance_score = 1 - (avg_distance / 2)
        combined_score = (0.6 * freq_score) + (0.4 * distance_score)

        recommendations.append({
            'movieId': data['movieId'],  # Se incluye movieId en la salida
            'title': data['title'],
            'score': float(combined_score),
            'frequency': int(data['count']),
            'avg_distance': float(avg_distance)
        })

    # Ordenar por puntaje combinado
    recommendations = sorted(recommendations, key=lambda x: x['score'], reverse=True)

    # Limitar al número de recomendaciones solicitadas
    recommendations = recommendations[:n_recommendations]

    return {
        "input_movies": found_movie_titles,
        "recommendations": recommendations
    }

# Endpoint simple para verificar que la API está funcionando
@app.route('/api/root', methods=['GET'])
def home():
    return jsonify({
        "status": "online",
        "message": "API de recomendación de películas UNIR D1",
        "endpoints": {
            "/api/favorites/<user_id>": "GET - Obtener películas favoritas de un usuario",
            "/api/favorites": "POST - Agregar o quitar una película de favoritos",
            "/recommendations": "POST - Obtener recomendaciones basadas en múltiples películas",
            "/search": "GET - Buscar películas por nombre PRUEBA"
        }
    })

# Endpoint para obtener todos los IDs de películas favoritas de un usuario
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
        # Modificado para obtener todos los datos de las películas favoritas
        cursor.execute("""
            SELECT movieId, genres, imdbId, posterUrl, title, tmdbId
            FROM user_favorite_movie
            WHERE userId = %s
        """, (user_id,))

        favorites = []
        for row in cursor.fetchall():
            favorites.append({
                "movieId": row[0],
                "genres": row[1],
                "imdbId": row[2],
                "posterUrl": row[3],
                "title": row[4],
                "tmdbId": row[5]
            })

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

# Endpoint para agregar o quitar una película de favoritos
@app.route('/api/favorites', methods=['POST'])
def toggle_favorite():
    """
    Endpoint para agregar o quitar una película de favoritos.
    Si la relación ya existe, la elimina. Si no existe, la crea.

    Request body:
    {
        "userId": "string",
        "movieId": integer,
        "genres": "string",
        "imdbId": integer,
        "posterUrl": "string",
        "title": "string",
        "tmdbId": integer
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

        # Obtener datos adicionales de la película
        genres = data.get('genres')
        imdb_id = data.get('imdbId')
        poster_url = data.get('posterUrl')
        title = data.get('title')
        tmdb_id = data.get('tmdbId')

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
            # Si no existe, crear con todos los datos de la película
            cursor.execute(
                """
                INSERT INTO user_favorite_movie
                (userId, movieId, genres, imdbId, posterUrl, title, tmdbId)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (user_id, movie_id, genres, imdb_id, poster_url, title, tmdb_id)
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

# Endpoint para obtener recomendaciones basadas en múltiples películas
@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    try:
        if not model_loaded:
            return jsonify({"error": "El modelo no está cargado correctamente"}), 500

        # Obtener datos del request
        data = request.get_json()

        if not data or 'movies' not in data:
            return jsonify({"error": "Se requiere una lista de películas"}), 400

        movie_list = data['movies']
        n_recommendations = data.get('n_recommendations', 10)

        if not isinstance(movie_list, list):
            return jsonify({"error": "El parámetro 'movies' debe ser una lista"}), 400

        if not isinstance(n_recommendations, int) or n_recommendations <= 0:
            return jsonify({"error": "El parámetro 'n_recommendations' debe ser un entero positivo"}), 400

        # Obtener recomendaciones
        recommendations = get_recommendations_from_multiple_movies(movie_list, n_recommendations)

        return jsonify(recommendations)

    except Exception as e:
        logger.error(f"Error al obtener recomendaciones: {e}")
        return jsonify({"error": str(e)}), 500

# Endpoint para buscar películas (útil para autocompletar en el frontend)
@app.route('/search', methods=['GET'])
def search_movies():
    try:
        if not model_loaded:
            return jsonify({"error": "El modelo no está cargado correctamente"}), 500

        query = request.args.get('q', '')

        if not query:
            return jsonify({"results": []}), 200

        # Buscar películas que coincidan con la consulta
        matching_movies = movies_df[movies_df['title'].str.contains(query, case=False)]

        # Limitar resultados a 10 películas
        results = matching_movies.head(10)[['movieId', 'title']].to_dict('records')

        return jsonify({"results": results})

    except Exception as e:
        logger.error(f"Error al buscar películas: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)