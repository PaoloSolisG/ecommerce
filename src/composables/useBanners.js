import { ref } from 'vue';
import { bannerService } from '../services/BannerService.js';

export function useBanners() {
  const banners = ref([]);
  const isLoading = ref(false);

  const getBanners = async () => {
    isLoading.value = true;
    try {
      banners.value = await bannerService.fetchActiveBanners();
    } finally {
      isLoading.value = false;
    }
  };

  return { banners, isLoading, getBanners };
}