import React, { useEffect } from "react";
import FavoriteService from "../../service/favoriteService";
import { useAuth0 } from "@auth0/auth0-react";
import MOVIES_LINKS from "./../../data/links.json";
import MoviesCover from "./../../data/urls/MoviesCovers.json";
import CardRecomendationMovie from "./components/CardRecomendationMovie";
import CardFavoriteMovie from "./components/CardFavoriteMovie";

export default function Recomentations() {
  const [favorites, setFavorites] = React.useState([]);
  const [recomendations, setRecomendations] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const { user } = useAuth0();

  useEffect(() => {
    console.log(recomendations);
  }, [recomendations]);

  useEffect(() => {
    if (Array.isArray(favorites.favorites)) {
      getMovieRecommendations(
        favorites?.favorites.map(
          (movie) => movie.title.replace(/\s*\(\d{4}\)$/, "").split(",")[0]
        ),
        parseInt(favorites?.favorites?.length * 10)
      )
        .then((recommendations) => {
          console.log("Películas de entrada:", recommendations.input_movies);
          console.log("Recomendaciones:");

          if (Array.isArray(recommendations?.recommendations)) {
            setRecomendations(
              recommendations?.recommendations.map((movie) => ({
                ...movie,
                cover: MoviesCover.find((c) => c.title === movie?.title)?.cover,
                link:
                  MOVIES_LINKS.find((c) => c.movieId === movie.movieId) || null, // Tomar solo el primer enlace encontrado
              }))
            );
          }

          // Mostrar cada recomendación con su puntuación
          recommendations.recommendations.forEach((movie, index) => {
            console.log(
              `${index + 1}. ${movie.title} (Score: ${movie.score.toFixed(2)})`
            );
            console.log(
              MOVIES_LINKS.filter((c) => c.movieId === movie.movieId)
            );
          });
        })
        .catch((error) => {
          console.error("Error al obtener recomendaciones:", error);
        });
    }
  }, [favorites]);

  function getMovieRecommendations(
    movies = ["Wag the Dog"],
    n_recommendations = 15
  ) {
    return new Promise((resolve, reject) => {
      // Datos para enviar en la petición
      const requestData = {
        movies: movies,
        n_recommendations: n_recommendations,
      };

      // Opciones para la petición fetch
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      };

      // Realizar la petición
      fetch("https://proyecto-d1.site/api/recommendations", requestOptions)
        .then((response) => {
          // Verificar si la respuesta es exitosa
          if (!response.ok) {
            throw new Error(
              `Error en la petición: ${response.status} ${response.statusText}`
            );
          }
          return response.json();
        })
        .then((data) => {
          // Resolver la promesa con los datos recibidos
          resolve(data);
        })
        .catch((error) => {
          // Rechazar la promesa en caso de error
          reject(error);
        });
    });
  }

  // Función para obtener favoritos
  const fetchFavorites = async () => {
    FavoriteService.getFavorites(user.sub).then((result) => {
      console.log("result: ", result.favorites);
      var resultSend = result.favorites.map((movie) => {
        // Obtner el cover
        var cover = MoviesCover.find((c) => c.movieId === movie?.movieId);

        return {
          ...movie,
          cover: cover?.cover,
        };
      });

      var response = {};
      response.favorites = resultSend;

      console.log("response: ", response);

      setFavorites(response);
    });
  };

  // Ejecutar al inicializar el componente
  React.useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="flex w-full flex-col min-h-screen bg-gray-900">
      {/* Contenedor principal */}
      <div className="w-full flex flex-col">
        <div className="relative w-full mx-auto p-6 lg:p-8 overflow-hidden rounded-lg shadow-2xl bg-gray-800 border border-cyan-500/30">
          {/* Efectos de fondo cyberpunk */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-1">
                Mis Películas Favoritas
              </h2>
              <p className="text-cyan-300/70 text-xs lg:text-sm tracking-widest uppercase">
                Sistema de recomendación personalizado
              </p>
            </div>

            {/* Botón para actualizar favoritos */}
            <div className="mb-8 flex justify-center">
              <button
                type="button"
                disabled={loading}
                className={`flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-500 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                onClick={fetchFavorites}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Actualizando...
                  </span>
                ) : (
                  "Obtener recomendaciones"
                )}
              </button>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="mb-6 p-4 border border-red-500/50 rounded-md bg-red-500/10">
                <p className="text-red-400 text-center">Error: {error}</p>
              </div>
            )}

            {/* Grid de favoritos */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 "
              style={{ display: "flex", overflowX: "auto" }}
            >
              {Array.isArray(favorites?.favorites) &&
                favorites?.favorites?.map((movie) => (
                  <CardFavoriteMovie movie={movie} key={movie?.movieId} />
                ))}
            </div>

            {/* Mensaje si no hay favoritos */}
            {favorites.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center p-10 border border-dashed border-cyan-500/30 rounded-lg bg-gray-800/50 mb-8">
                <div className="w-16 h-16 mb-4 relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-600/10 animate-pulse"></div>
                  <div className="absolute inset-2 rounded-full border border-cyan-400/30"></div>
                </div>
                <p className="text-cyan-300/70 text-center">
                  No se encontraron películas favoritas
                </p>
              </div>
            )}

            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-1">
                Peliculas Recomendadas Para Ti
              </h2>
            </div>

            {/* Grid de recomendaciones */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {Array.isArray(recomendations) &&
                recomendations?.map((movie) => (
                  <CardRecomendationMovie movie={movie} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
