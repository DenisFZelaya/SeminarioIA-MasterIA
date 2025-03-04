# test_api.py - Script para probar la API
import requests
import json

# URL base de la API (ajusta según sea necesario)
BASE_URL = "http://localhost:5000"

def test_search():
    """Prueba el endpoint de búsqueda de películas"""
    query = "matrix"
    response = requests.get(f"{BASE_URL}/search?q={query}")
    
    print("--- TEST DE BÚSQUEDA ---")
    print(f"Búsqueda: '{query}'")
    print(f"Código de respuesta: {response.status_code}")
    
    if response.status_code == 200:
        results = response.json()
        print(f"Resultados encontrados: {len(results['results'])}")
        for movie in results['results']:
            print(f"- {movie['title']} (ID: {movie['movieId']})")
    else:
        print(f"Error: {response.text}")
    
    print("\n")

def test_recommendations():
    """Prueba el endpoint de recomendaciones"""
    # Datos para la solicitud
    data = {
        "movies": ["Matrix", "Inception", "Interstellar"],
        "n_recommendations": 5
    }
    
    # Hacer la solicitud POST
    response = requests.post(f"{BASE_URL}/recommendations", json=data)
    
    print("--- TEST DE RECOMENDACIONES ---")
    print(f"Películas de entrada: {data['movies']}")
    print(f"Número de recomendaciones solicitadas: {data['n_recommendations']}")
    print(f"Código de respuesta: {response.status_code}")
    
    if response.status_code == 200:
        results = response.json()
        
        print(f"Películas encontradas: {results['input_movies']}")
        print(f"Recomendaciones ({len(results['recommendations'])}):")
        
        for i, rec in enumerate(results['recommendations'], 1):
            print(f"{i}. {rec['title']} (Score: {rec['score']:.2f})")
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    test_search()
    test_recommendations()