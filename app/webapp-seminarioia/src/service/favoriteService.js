// favoriteService.js

/**
 * Servicio para gestionar películas favoritas
 */
const FavoriteService = (() => {
    // Configuración por defecto
    let config = {
      baseUrl: 'https://proyecto-d1.site/api',
      userId: null
    };
  
    /**
     * Inicializa el servicio con la configuración proporcionada
     * @param {Object} options - Opciones de configuración
     */
    const initialize = (options = {}) => {
      config = { ...config, ...options };
      console.log('FavoriteService inicializado con:', config);
    };
  

  
    /**
     * Obtiene los favoritos del usuario especificado o del usuario actual
     * @param {string} [userId=config.userId] - ID del usuario opcional
     * @returns {Promise<Array>} - Lista de películas favoritas
     */
    const getFavorites = async (userId) => {
      if (!userId) {
        throw new Error('Se requiere un userId para obtener favoritos');
      }
  
      try {
        const response = await fetch(`${config.baseUrl}/favorites/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}: No se pudieron obtener los favoritos`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error al obtener favoritos:', error);
        throw error;
      }
    };
  
    /**
     * Alterna una película como favorita (agrega o quita)
     * @param {Object} movieData - Datos de la película
     * @returns {Promise<Object>} - Resultado de la operación
     */
    const toggleFavorite = async (movieData, userId) => {
      // Usar el userId de la configuración si no se proporciona
  
      
      if (!userId) {
        throw new Error('Se requiere un userId para alternar favoritos');
      }
      
      if (!movieData.movieId) {
        throw new Error('Se requiere un movieId para alternar favoritos');
      }
  
      // Preparar datos para enviar
      const favoriteData = {
        userId,
        movieId: movieData.movieId,
        genres: movieData.genres || null,
        imdbId: movieData.imdbId || null,
        posterUrl: movieData.posterUrl || null,
        title: movieData.title || null,
        tmdbId: movieData.tmdbId || null
      };
  
      try {
        const response = await fetch(`${config.baseUrl}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(favoriteData)
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}: No se pudo procesar la solicitud`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error al alternar favorito:', error);
        throw error;
      }
    };
  
    /**
     * Verifica si una película está en favoritos
     * @param {number} movieId - ID de la película
     * @param {string} [userId=config.userId] - ID del usuario opcional
     * @returns {Promise<boolean>} - true si está en favoritos
     */
    const isMovieFavorite = async (movieId, userId) => {
      if (!userId) {
        throw new Error('Se requiere un userId para verificar favoritos');
      }
  
      try {
        const favorites = await getFavorites(userId);
        return favorites.some(movie => movie.movieId === movieId);
      } catch (error) {
        console.error('Error al verificar si la película es favorita:', error);
        throw error;
      }
    };
  
    /**
     * Agrega una película a favoritos
     * @param {Object} movieData - Datos de la película
     * @returns {Promise<Object>} - Resultado de la operación
     */
    const addFavorite = async (movieData, userId) => {
      // Verificar primero si ya es favorita
  
      
      try {
        const isFavorite = await isMovieFavorite(movieData.movieId, userId);
        
        // Si ya es favorita, no hacer nada
        if (isFavorite) {
          return {
            success: true,
            action: 'none',
            message: 'La película ya está en favoritos'
          };
        }
        
        // Si no es favorita, agregarla
        return await toggleFavorite(movieData);
      } catch (error) {
        console.error('Error al agregar favorito:', error);
        throw error;
      }
    };
  
    /**
     * Quita una película de favoritos
     * @param {number} movieId - ID de la película
     * @param {string} [userId=config.userId] - ID del usuario opcional
     * @returns {Promise<Object>} - Resultado de la operación
     */
    const removeFavorite = async (movieId, userId) => {
      try {
        const isFavorite = await isMovieFavorite(movieId, userId);
        
        // Si no es favorita, no hacer nada
        if (!isFavorite) {
          return {
            success: true,
            action: 'none',
            message: 'La película no estaba en favoritos'
          };
        }
        
        // Si es favorita, quitarla
        return await toggleFavorite({ userId, movieId });
      } catch (error) {
        console.error('Error al quitar favorito:', error);
        throw error;
      }
    };
  
    // Exponer la API pública del servicio
    return {
      initialize,

      getFavorites,
      toggleFavorite,
      isMovieFavorite,
      addFavorite,
      removeFavorite
    };
  })();
  
  // Exportar el servicio para uso con ES modules
  export default FavoriteService;