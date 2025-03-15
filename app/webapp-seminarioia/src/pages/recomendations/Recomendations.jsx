import React, { useEffect } from "react";
import FavoriteService from "../../service/favoriteService";
import { useAuth0 } from "@auth0/auth0-react";
import MOVIES_LINKS from "./../../data/links.json";
import CardRecomendationMovie from "./components/CardRecomendationMovie";

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
      fetch("http://127.0.0.1:5000/recommendations", requestOptions)
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
      setFavorites(result);
    });
  };

  // Ejecutar al inicializar el componente
  React.useEffect(() => {
    fetchFavorites();
  }, []);

  // Datos de ejemplo para visualización
  React.useEffect(() => {
    if (favorites.length === 0 && !loading && !error) {
      setFavorites([
        { id: 1, title: "Blade Runner 2049", genre: "Sci-Fi", year: 2017 },
        { id: 2, title: "Ghost in the Shell", genre: "Anime", year: 1995 },
        { id: 3, title: "The Matrix", genre: "Sci-Fi", year: 1999 },
      ]);
    }
  }, [favorites, loading, error]);

  return (
    <div className="flex w-full flex-col min-h-screen bg-gray-900">
      {/* Contenedor principal */}
      <div className="w-full flex flex-col p-4 lg:p-8">
        <div className="relative w-full max-w-6xl mx-auto p-6 lg:p-8 overflow-hidden rounded-lg shadow-2xl bg-gray-800 border border-cyan-500/30">
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
                  "ACTUALIZAR FAVORITOS"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {Array.isArray(favorites?.favorites) &&
                favorites?.favorites?.map((movie) => (
                  <div>
                    <a
                      style={{ width: "100%" }}
                      target="_blank"
                      href={`https://www.imdb.com/es-es/title/tt${movie?.link?.imdbId}/`}
                    >
                      <div
                        key={movie.id}
                        className="relative overflow-hidden rounded-lg border border-cyan-500/30 bg-gray-800/80 hover:border-purple-500/50 transition-all duration-300 group"
                      >
                        {/* Efectos de hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-600/0 group-hover:from-cyan-500/10 group-hover:to-purple-600/10 transition-all duration-500"></div>

                        {/* Línea superior con efecto neón */}
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/70 to-cyan-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        {/* Imagen de la película */}
                        <div className="relative aspect-[2/3] bg-gray-900">
                          <img
                            src={`https://placehold.co/300x450/121218/00f0ff?text=${encodeURIComponent(
                              movie.title.split(" (")[0]
                            )}`}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-60"></div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
                            {movie.title}
                          </h3>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {movie.genres &&
                              movie.genres.split("|").map((genre) => (
                                <span
                                  key={`${movie.movieId}-${genre}`}
                                  className="inline-block px-2 py-1 text-xs rounded-md bg-gray-700 text-cyan-300/80"
                                >
                                  {genre}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
