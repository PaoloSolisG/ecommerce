import httpClient from "../api/httpClient";

/**
 * @typedef {Object} Banner
 * @property {string} id
 * @property {string} imagen_url
 * @property {string} estado
 */

export const bannerService = {
  /**
   * Petición de banners filtrando solo los activos (estado "1")
   * @returns {Promise<Banner[]>}
   */
  async fetchActiveBanners() {
    try {
      const data = await httpClient.get("/banners/banners");

      // Retorna array filtrado o vacío si no hay datos
      return data.banners?.filter((b) => b.estado === "1") || [];
    } catch (error) {
      console.error("Error en BannerService:", error);
      throw error;
    }
  }
};
