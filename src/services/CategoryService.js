import httpClient from "../api/httpClient";

/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} nombre
 * @property {string} imagen_url
 */

export const CategoryService = {
  /**
   * Obtiene categorías para el menú horizontal
   * @returns {Promise<Array>}
   */
  async fetchCategories() {
    try {
      const data = await httpClient.get("/categorizacion/categorias");
      return data.categorias || [];
    } catch (error) {
      return [];
    }
  }
};