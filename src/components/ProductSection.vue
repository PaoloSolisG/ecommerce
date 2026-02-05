<template>
  <div v-for="(productos, catName) in groupedProducts" :key="catName" class="category-block mb-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="fw-bold h5 m-0">{{ catName }}</h3>
      <a href="#" class="text-primary small fw-bold">Ver más</a>
    </div>

    <div class="slider-container position-relative">
      <div class="horizontal-slider d-flex gap-3 overflow-auto pb-3 no-scrollbar">
        <ProductCard v-for="prod in productos" :key="prod.producto_id" :p="prod" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ProductCard from './ProductCard.vue';

const props = defineProps({ items: Array });

const groupedProducts = computed(() => {
  const map = {};
  props.items.forEach(p => {
    const name = p.categoria?.nombre || 'Otros';
    if (!map[name]) map[name] = [];
    map[name].push(p);
  });
  return map;
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.horizontal-slider { scroll-behavior: smooth; }
</style>