# app.py - API Flask para recomendaciones de películas
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix
import joblib
import os

app = Flask(__name__)

# Variables globales para el modelo y datos
knn_model = None
movies_df = None
final_dataset = None
csr_data = None

# Función para cargar el modelo y datos
def load_model_and_data():
    global knn_model, movies_df, final_dataset, csr_data
    
    print("Cargando modelo y datos...")
    # Cargar el modelo KNN
    knn_model = joblib.load('modelo/knn_model.pkl')
    
    # Cargar la matriz CSR
    csr_data = joblib.load('modelo/csr_data.pkl')
    
    # Cargar el DataFrame de películas
    movies_df = pd.read_csv('modelo/movies_data.csv')
    
    # Cargar el DataFrame final con los IDs
    final_dataset = pd.read_csv('modelo/final_dataset_ids.csv', index_col=0)
    
    print("Datos cargados correctamente")

# Cargar modelo al iniciar la aplicación
load_model_and_data()

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

        ## 
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

# Endpoint para obtener recomendaciones basadas en múltiples películas
@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    try:
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
        return jsonify({"error": str(e)}), 500

# Endpoint para buscar películas (útil para autocompletar en el frontend)
@app.route('/search', methods=['GET'])
def search_movies():
    try:
        query = request.args.get('q', '')
        
        if not query:
            return jsonify({"results": []}), 200
        
        # Buscar películas que coincidan con la consulta
        matching_movies = movies_df[movies_df['title'].str.contains(query, case=False)]
        
        # Limitar resultados a 10 películas
        results = matching_movies.head(10)[['movieId', 'title']].to_dict('records')
        
        return jsonify({"results": results})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint simple para verificar que la API está funcionando
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "online",
        "message": "API de recomendación de películas",
        "endpoints": {
            "/recommendations": "POST - Obtener recomendaciones basadas en múltiples películas",
            "/search": "GET - Buscar películas por nombre"
        }
    })

if __name__ == '__main__':
    # Iniciar la aplicación Flask
    app.run(debug=True, host='0.0.0.0', port=5000)