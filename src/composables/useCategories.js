import { ref } from 'vue';
import { CategoryService } from '../services/CategoryService';

export function useCategories() {
  const categories = ref([]);
  const loadingCategories = ref(false);

  const getCategories = async () => {
    loadingCategories.value = true;
    try {
      categories.value = await CategoryService.fetchCategories();
    } finally {
      loadingCategories.value = false;
    }
  };

  return { categories, loadingCategories, getCategories };
}