<template>
  <div class="page-wrapper">
    <AppHeader @search="onSearch" />

    <BannerSlider v-if="!isLoading" :items="banners" />

    <CategoryBar :items="categories" :activeCategory="selectedCategory"
      @change-category="(name) => selectedCategory = name" />

    <main class="container-fluid px-lg-5 mt-4">
      <div class="row gx-4 justify-content-center">

        <div class="col-md-3 col-xl-2 mb-4 d-none d-md-block">
          <div class="sticky-top" style="top: 20px; z-index: 10;">
            <BrandFilter :items="brands" :loading="loadingBrands" @filter-brand="handleBrandFilter" />
          </div>
        </div>

        <div class="col-md-9 col-xl-10">

          <div class="d-flex flex-column mb-4 gap-3">

            <div class="d-flex align-items-center gap-3">
              <div style="width: 46px; height: 46px;">
                <transition name="scale">
                  <button v-if="selectedCategory" @click="selectedCategory = null" class="btn-back-circle">
                    <i class="fas fa-arrow-left"></i>
                  </button>
                </transition>
              </div>

              <div class="search-box-dynamic shadow-sm">
                <i class="fas fa-search ms-3 text-muted"></i>
                <input type="text" v-model="searchQuery" placeholder="Buscar productos...">
              </div>
            </div>

            <div class="d-md-none">
              <BrandFilter :items="brands" :loading="loadingBrands" mode="mobile" @filter-brand="handleBrandFilter" />
            </div>

            <transition name="fade">
              <h2 v-if="selectedCategory" class="cat-label animate__animated animate__fadeInLeft m-0">
                {{ selectedCategory }}
              </h2>
            </transition>
          </div>

          <div v-if="loadingProducts" class="dynamic-loader-container">
            <div class="loader-bar"></div>
          </div>

          <div v-else class="products-area">
            <transition name="view-switch" mode="out-in">
              <div v-if="selectedCategory" :key="selectedCategory" class="row gx-2 gy-2 px-1">
                <div v-for="prod in productsByCategory[selectedCategory]" :key="prod.producto_id"
                  class="col-6 col-md-4 col-lg-3 col-xxl-2">
                  <ProductCard :p="prod" />
                </div>
              </div>

              <div v-else key="all-sliders">
                <section v-for="(items, catName) in productsByCategory" :key="catName" class="category-block mb-5">
                  <div class="d-flex justify-content-between align-items-end mb-3">
                    <div class="cat-info">
                      <h4 class="cat-title-text">{{ catName }}</h4>
                      <span class="cat-subtitle">{{ items.length }} productos</span>
                    </div>
                    <button @click="selectedCategory = catName" class="btn-view-more">
                      Ver todo <i class="fas fa-arrow-right ms-1"></i>
                    </button>
                  </div>

                  <div class="slider-wrapper">
                    <button class="nav-btn prev" @click="scrollSlider(catName, -1)">
                      <i class="fas fa-chevron-left"></i>
                    </button>

                    <div class="product-slider-mask" :ref="el => { if (el) sliderRefs[catName] = el }">
                      <div class="slider-track-flex">
                        <ProductCard v-for="prod in items" :key="prod.producto_id" :p="prod" />
                      </div>
                    </div>

                    <button class="nav-btn next" @click="scrollSlider(catName, 1)">
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </section>
              </div>
            </transition>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import BannerSlider from '../components/BannerSlider.vue';
import CategoryBar from '../components/CategoryBar.vue';
import BrandFilter from '../components/BrandFilter.vue';
import ProductCard from '../components/ProductCard.vue';

import { useBanners } from '../composables/useBanners';
import { useCategories } from '../composables/useCategories';
import { useBrands } from '../composables/useBrands';
import { useProducts } from '../composables/useProducts';

const { banners, isLoading, getBanners } = useBanners();
const { categories, getCategories } = useCategories();
const { brands, loadingBrands, getBrands } = useBrands();
const { loadingProducts, getProducts, productsByCategory, searchQuery, selectedCategory } = useProducts();

const sliderRefs = ref({});

const scrollSlider = (cat, dir) => {
  const el = sliderRefs.value[cat];
  if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
};

const handleBrandFilter = () => { selectedCategory.value = null; };
const onSearch = (v) => { searchQuery.value = v; };

onMounted(() => { getBanners(); getCategories(); getBrands(); getProducts(); });
</script>
