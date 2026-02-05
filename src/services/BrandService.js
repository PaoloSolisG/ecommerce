import httpClient from "../api/httpClient";

/**
 * @typedef {Object} Marca
 * @property {string} id_marca
 * @property {string} nombre_marca
 * @property {string} estatus_marca
 */

export const brandService = {
  /**
   * Obtiene la lista de marcas y filtra las activas
   * @returns {Promise<Marca[]>}
   */
  async fetchBrands() {
    try {
      const data = await httpClient.get("/categorizacion/marcas");
      // Filtramos por estatus_marca === "1"
      return data.marcas?.filter((m) => m.estatus_marca === "1") || [];
    } catch (error) {
      console.error("Error en BrandService:", error);
      return [];
    }
  }
};
