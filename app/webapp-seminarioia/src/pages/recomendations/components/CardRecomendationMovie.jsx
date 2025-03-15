import React from "react";

export default function CardRecomendationMovie({ movie }) {
    console.log("movie: ", movie)
  return (
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

            <div className="flex justify-between text-sm text-cyan-300/70 mb-3">
              <span>{movie.genre}</span>
              <span>{movie.year}</span>
            </div>

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

            <div className="flex justify-between items-center">
              <span className="text-xs text-cyan-300/50">
                Score: {movie.score?.toFixed(2)}
              </span>
              <span className="text-xs text-cyan-300/50">
                AVG: {movie.avg_distance?.toFixed(2)}
              </span>
              <span className="text-xs text-cyan-300/50">
                tmdbId: {movie.link?.tmdbId}
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
