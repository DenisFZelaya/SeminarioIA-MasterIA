import React from 'react'

export default function MovieCard({
    handleMovieClick, movie,
    favorites,
    handleSaveFavorite

}) {
    return (
        <div
            key={movie.movieId}
            className={`relative group cursor-pointer transition-all duration-300 transform hover:-translate-y-2 ${favorites.includes(parseInt(movie.movieId)) ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-900' : ''}`}
            onClick={() => handleMovieClick(parseInt(movie.movieId))}
        >
            <div className="relative bg-gray-800 rounded-lg overflow-hidden border border-cyan-500/30 shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-500/50">
                {/* Indicador de favorito */}
                {favorites.includes(parseInt(movie.movieId)) && (
                    <div className="absolute top-2 right-2 z-10 bg-cyan-500/80 text-black rounded-full w-8 h-8 flex items-center justify-center">
                        <i className="fas fa-heart"></i>
                    </div>
                )}

                {/* Imagen de la película */}
                <div className="relative aspect-[2/3] bg-gray-900">
                    <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-60"></div>
                </div>

                {/* Información de la película */}
                <div className="p-4">
                    <h3 className="text-lg font-medium text-cyan-300 mb-1 truncate">{movie.title}</h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {movie.genres && movie.genres.split('|').map(genre => (
                            <span
                                key={`${movie.movieId}-${genre}`}
                                className="inline-block px-2 py-1 text-xs rounded-md bg-gray-700 text-cyan-300/80"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-cyan-300/60">
                        <span>ID: {movie.movieId}</span>
                        <span>IMDB: {movie.imdbId}</span>
                    </div>
                </div>

                {/* Efecto hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
        </div>
    )
}
