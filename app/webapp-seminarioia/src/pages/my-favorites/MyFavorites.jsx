// MyFavorites.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import MOVIES from './../../data/movies.json'
import LINKS from './../../data/links.json'
import MovieCard from "../../components/MovieCard";

const MyFavorites = () => {
    // Estado para los datos de películas
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [displayedMovies, setDisplayedMovies] = useState([]); // Nuevo estado para paginación
    const [favorites, setFavorites] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [sortOrder, setSortOrder] = useState('title-asc');
    const [isLoading, setIsLoading] = useState(true);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false); // Nuevo estado para filtro de favoritos

    // Estado para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const moviesPerPage = 12; // Ajusta según tus necesidades

    // Obtener datos del usuario de Auth0
    const { user } = useAuth0();

    const handleSaveFavorite = (newMovieId) => {
        if (!favorites.includes(newMovieId)) {
            setFavorites([...favorites, newMovieId]);
        }
    }

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

                // Inicialmente filtramos y configuramos la paginación
                updateFilteredMovies(combinedData, searchTerm, selectedGenre, sortOrder, showOnlyFavorites, favorites);

                // Cargar favoritos del usuario
                //loadUserFavorites();
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
                //setFavorites([1, 6]);
            } catch (error) {
                console.error("Error loading favorites:", error);
            }
        };

        loadMovies();
    }, [user, searchTerm, selectedGenre, sortOrder, showOnlyFavorites]);

    // Función para actualizar películas filtradas
    const updateFilteredMovies = (moviesData, search, genre, order, onlyFavs, favs) => {
        let result = [...moviesData];

        // Filtrar por término de búsqueda
        if (search) {
            result = result.filter(movie =>
                movie.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filtrar por género
        if (genre !== 'All') {
            result = result.filter(movie =>
                movie.genres && movie.genres.includes(genre)
            );
        }

        // Filtrar solo favoritos si está activado
        if (onlyFavs) {
            result = result.filter(movie =>
                favs.includes(parseInt(movie.movieId))
            );
        }

        // Ordenar películas
        result = [...result].sort((a, b) => {
            if (order === 'title-asc') {
                return a.title.localeCompare(b.title);
            } else if (order === 'title-desc') {
                return b.title.localeCompare(a.title);
            } else if (order === 'id-asc') {
                return a.movieId - b.movieId;
            } else {
                return b.movieId - a.movieId;
            }
        });

        setFilteredMovies(result);
        setTotalPages(Math.ceil(result.length / moviesPerPage));
        setCurrentPage(1); // Resetear a la primera página cuando cambian los filtros
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

    // Actualizar películas filtradas cuando cambian los filtros
    useEffect(() => {
        updateFilteredMovies(movies, searchTerm, selectedGenre, sortOrder, showOnlyFavorites, favorites);
    }, [movies, searchTerm, selectedGenre, sortOrder, showOnlyFavorites, favorites]);

    // Actualizar películas mostradas cuando cambia la página o las películas filtradas
    useEffect(() => {
        const startIndex = (currentPage - 1) * moviesPerPage;
        const endIndex = startIndex + moviesPerPage;
        setDisplayedMovies(filteredMovies.slice(startIndex, endIndex));
    }, [filteredMovies, currentPage]);

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

    // Cambiar de página
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            // Scroll al inicio de la lista
            window.scrollTo({ top: document.getElementById('movie-list').offsetTop - 100, behavior: 'smooth' });
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                        {/* Filtro de favoritos */}
                        <div className="flex items-end">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={showOnlyFavorites}
                                    onChange={() => setShowOnlyFavorites(!showOnlyFavorites)}
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                                <span className="ml-3 text-sm font-medium text-cyan-300">Solo favoritos</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información de resultados y paginación */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-cyan-300/70 mb-2 sm:mb-0">
                        Mostrando {filteredMovies.length > 0 ? (currentPage - 1) * moviesPerPage + 1 : 0} - {Math.min(currentPage * moviesPerPage, filteredMovies.length)} de {filteredMovies.length} películas
                    </p>

                    {totalPages > 1 && (
                        <div className="flex items-center space-x-1">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-cyan-300 hover:bg-gray-700'}`}
                            >
                                <i className="fas fa-angle-double-left"></i>
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-cyan-300 hover:bg-gray-700'}`}
                            >
                                <i className="fas fa-angle-left"></i>
                            </button>

                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-md">
                                {currentPage} / {totalPages}
                            </span>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-cyan-300 hover:bg-gray-700'}`}
                            >
                                <i className="fas fa-angle-right"></i>
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-cyan-300 hover:bg-gray-700'}`}
                            >
                                <i className="fas fa-angle-double-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Lista de películas */}
            <div id="movie-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        {displayedMovies.map(movie => (
                            <MovieCard
                                key={movie.movieId}
                                movie={movie}
                                favorites={favorites}
                                handleSaveFavorite={handleSaveFavorite}
                                handleMovieClick={handleMovieClick} />
                        ))}
                    </div>
                )}
            </div>

            {/* Paginación inferior */}
            {totalPages > 1 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex justify-center">
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-cyan-300 hover:bg-gray-700'}`}
                        >
                            <i className="fas fa-angle-double-left"></i>
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-700  text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-cyan-300 hover:bg-gray-700'}`}
                        >
                            <i className="fas fa-angle-left"></i>
                        </button>

                        {/* Números de página */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-cyan-500 text-gray-100' : 'bg-gray-800 text-cyan-300 hover:bg-gray-700'}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-cyan-300 hover:bg-gray-700'}`}
                        >
                            <i className="fas fa-angle-right"></i>
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-cyan-300 hover:bg-gray-700'}`}
                        >
                            <i className="fas fa-angle-double-right"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyFavorites;