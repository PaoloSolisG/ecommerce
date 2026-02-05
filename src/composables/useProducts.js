import { ref, computed } from 'vue';
import { productService } from '../services/ProductService';

export function useProducts() {
  const products = ref([]);
  const loadingProducts = ref(false);
  const searchQuery = ref("");
  const selectedCategory = ref(null); // Para el "Ver más"

  const getProducts = async () => {
    loadingProducts.value = true;
    try {
      products.value = await productService.getProducts();
    } finally { loadingProducts.value = false; }
  };

  const filteredProducts = computed(() => {
    let list = products.value;
    // Filtro por búsqueda
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      list = list.filter(p => 
        p.producto_nombre.toLowerCase().includes(q) || 
        p.marca?.toLowerCase().includes(q) || 
        p.codigo?.toLowerCase().includes(q)
      );
    }
    // Filtro por categoría seleccionada (Ver más)
    if (selectedCategory.value) {
      list = list.filter(p => p.categoria?.nombre === selectedCategory.value);
    }
    return list;
  });

  const productsByCategory = computed(() => {
    const map = {};
    filteredProducts.value.forEach(p => {
      const catName = p.categoria?.nombre || 'Otros';
      if (!map[catName]) map[catName] = [];
      map[catName].push(p);
    });
    return map;
  });

  return { 
    products, loadingProducts, getProducts, 
    productsByCategory, searchQuery, selectedCategory 
  };
}