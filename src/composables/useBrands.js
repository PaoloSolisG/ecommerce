import { ref } from "vue";
import { brandService } from "../services/BrandService";

export function useBrands() {
  const brands = ref([]);
  const loadingBrands = ref(false);

  const getBrands = async () => {
    loadingBrands.value = true;
    try {
      brands.value = await brandService.fetchBrands();
    } finally {
      loadingBrands.value = false;
    }
  };

  return { brands, loadingBrands, getBrands };
}
