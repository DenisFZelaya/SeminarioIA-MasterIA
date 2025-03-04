
// MyFavorites.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import MOVIES from './../../data/movies.json'
import LINKS from './../../data/links.json'


const MyFavorites2 = () => {
    // Estado para los datos de películas
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [sortOrder, setSortOrder] = useState('title-asc');
    const [isLoading, setIsLoading] = useState(true);

    // Obtener datos del usuario de Auth0
    const { user } = useAuth0();


    // Cargar datos al iniciar
    useEffect(() => {
        const loadMovies = () => {
            try {
                // Ya no necesitamos hacer fetch ni parsear CSV, los datos JSON ya están importados
                const moviesData = MOVIES;
                const linksData = LINKS;

                // Combinar los datos
                const combinedData = moviesData.map(movie => {
                    // Asegúrate de que movieId sea del mismo tipo para la comparación
                    const movieIdNum = parseInt(movie.movieId);
                    const link = linksData.find(link => parseInt(link.movieId) === movieIdNum);

                    return {
                        ...movie,
                        imdbId: link ? link.imdbId : '',
                        tmdbId: link ? link.tmdbId : '',
                        posterUrl: `https://placehold.co/300x450/121218/00f0ff?text=${encodeURIComponent(movie.title.split(' (')[0])}`
                    };
                });

                setMovies(combinedData);
                setFilteredMovies(combinedData);

                // Cargar favoritos del usuario
                loadUserFavorites();
            } catch (error) {
                console.error("Error loading movie data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const loadUserFavorites = () => {
            try {
                // En un entorno real, aquí harías una llamada a tu API para obtener los favoritos del usuario
                // const response = await fetch(`/api/favorites?userId=${user.sub}`);
                // const data = await response.json();
                // setFavorites(data.map(fav => fav.movieId));

                // Por ahora, simulamos algunos favoritos
                setFavorites([1, 6]);
            } catch (error) {
                console.error("Error loading favorites:", error);
            }
        };

        loadMovies();
    }, [user]);

    // Función para parsear CSV
    const parseCSV = (text) => {
        const lines = text.split('\n');
        const headers = lines[0].split(',');

        return lines.slice(1).filter(line => line.trim()).map(line => {
            const values = line.split(',');
            const entry = {};

            headers.forEach((header, index) => {
                entry[header] = values[index];
            });

            return entry;
        });
    };

    // Extraer todos los géneros únicos de las películas
    const allGenres = useMemo(() => {
        const genreSet = new Set();
        movies.forEach(movie => {
            if (movie.genres) {
                movie.genres.split('|').forEach(genre => {
                    genreSet.add(genre);
                });
            }
        });
        return ['All', ...Array.from(genreSet).sort()];
    }, [movies]);

    // Filtrar películas por búsqueda y género
    useEffect(() => {
        let result = movies;

        // Filtrar por término de búsqueda
        if (searchTerm) {
            result = result.filter(movie =>
                movie.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrar por género
        if (selectedGenre !== 'All') {
            result = result.filter(movie =>
                movie.genres && movie.genres.includes(selectedGenre)
            );
        }

        // Ordenar películas
        result = [...result].sort((a, b) => {
            if (sortOrder === 'title-asc') {
                return a.title.localeCompare(b.title);
            } else if (sortOrder === 'title-desc') {
                return b.title.localeCompare(a.title);
            } else if (sortOrder === 'id-asc') {
                return a.movieId - b.movieId;
            } else {
                return b.movieId - a.movieId;
            }
        });

        setFilteredMovies(result);
    }, [movies, searchTerm, selectedGenre, sortOrder]);

    // Manejar clic en película
    const handleMovieClick = async (movieId) => {
        try {
            // En un entorno real, aquí harías una llamada a tu API
            // const response = await fetch('/api/favorites', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ userId: user.sub, movieId })
            // });

            // Actualizar estado local de favoritos
            if (favorites.includes(movieId)) {
                setFavorites(favorites.filter(id => id !== movieId));
            } else {
                setFavorites([...favorites, movieId]);
            }

            console.log(`Guardando película ${movieId} para usuario ${user.sub}`);
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-cyan-300 pb-12">
            {/* Header de la sección */}
            <div className="relative bg-gray-800 border-b border-cyan-500/30 mb-8">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                        Mis Películas Favoritas
                    </h2>
                    <p className="text-cyan-300/70 mt-2">
                        Explora y guarda tus películas favoritas
                    </p>
                </div>
            </div>

            {/* Controles de filtrado y búsqueda */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="bg-gray-800 rounded-lg border border-cyan-500/30 p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Búsqueda */}
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-cyan-300 mb-1">Buscar película</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fas fa-search text-cyan-500/50"></i>
                                </div>
                                <input
                                    type="text"
                                    id="search"
                                    className="bg-gray-900 block w-full pl-10 pr-3 py-2 border border-cyan-500/30 rounded-md leading-5 placeholder-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-cyan-300"
                                    placeholder="Buscar por título..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Filtro por género */}
                        <div>
                            <label htmlFor="genre" className="block text-sm font-medium text-cyan-300 mb-1">Filtrar por género</label>
                            <select
                                id="genre"
                                className="bg-gray-900 block w-full pl-3 pr-10 py-2 border border-cyan-500/30 rounded-md leading-5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-cyan-300"
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                            >
                                {allGenres.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Ordenar */}
                        <div>
                            <label htmlFor="sort" className="block text-sm font-medium text-cyan-300 mb-1">Ordenar por</label>
                            <select
                                id="sort"
                                className="bg-gray-900 block w-full pl-3 pr-10 py-2 border border-cyan-500/30 rounded-md leading-5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-cyan-300"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="title-asc">Título (A-Z)</option>
                                <option value="title-desc">Título (Z-A)</option>
                                <option value="id-asc">ID (Ascendente)</option>
                                <option value="id-desc">ID (Descendente)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de películas */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                ) : filteredMovies.length === 0 ? (
                    <div className="bg-gray-800 rounded-lg border border-cyan-500/30 p-8 text-center">
                        <p className="text-cyan-300/70">No se encontraron películas que coincidan con tu búsqueda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredMovies.map(movie => (
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyFavorites2;