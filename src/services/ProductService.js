import httpClient from "../api/httpClient";

export const productService = {
  async getProducts() {
    // Cambiado a POST según tu indicación
    try {
      const response = await httpClient.post("/productos/productoscatalogo");
      return response.productos?.filter(p => p.is_catalogo === "1") || [];
    } catch (error) {
      console.error("Error cargando productos:", error);
      return [];
    }
  }
};