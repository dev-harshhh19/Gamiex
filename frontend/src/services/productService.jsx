import api from '../config/api.js';

const productService = {
  /**
   * Fetches a list of games from the backend.
   * @param {number} limit - The maximum number of games to fetch.
   * @param {number} skip - The number of games to skip.
   * @returns {Promise<Array>} A promise that resolves to an array of game objects.
   */
  fetchGames: async (limit = 20, skip = 0) => {
    try {
      const response = await api.get(`/api/products?limit=${limit}&skip=${skip}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching games:', error);
      return [];
    }
  },

  /**
   * Fetches details for a single game by its ID.
   * @param {string} id - The ID of the game.
   * @returns {Promise<Object|null>} A promise that resolves to a game object or null if not found.
   */
  fetchGameDetails: async (id) => {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching game details for ID ${id}:`, error);
      return null;
    }
  },

  /**
   * Fetches games by category (genre).
   * @param {string} category - The category (genre) of games to fetch.
   * @param {number} limit - The maximum number of games to fetch.
   * @returns {Promise<Array>} A promise that resolves to an array of game objects.
   */
  fetchGamesByCategory: async (category, limit = 20) => {
    try {
      const response = await api.get(`/api/products/category/${category}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching games for category ${category}:`, error);
      return [];
    }
  },

  /**
   * Fetches all available game categories (genres).
   * @returns {Promise<Array>} A promise that resolves to an array of category strings.
   */
  fetchGameCategories: async () => {
    try {
      const response = await api.get('/api/products/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching game categories:', error);
      return [];
    }
  },

  /**
   * Searches for games based on a query.
   * @param {string} query - The search query.
   * @param {number} limit - The maximum number of games to fetch.
   * @returns {Promise<Array>} A promise that resolves to an array of game objects.
   */
  searchGames: async (query, limit = 20) => {
    try {
      const response = await api.get(`/api/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching games for query "${query}":`, error);
      return [];
    }
  },
};

export default productService;