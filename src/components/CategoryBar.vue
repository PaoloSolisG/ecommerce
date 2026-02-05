<template>
    <div class="category-wrapper py-3">
        <div class="container-fluid px-md-5">
            <div class="d-flex flex-nowrap overflow-auto gap-2 no-scrollbar">

                <button 
                  class="btn-category" 
                  :class="{ active: activeCategory === null }"
                  @click="$emit('change-category', null)"
                >
                    <i class="fas fa-th-large me-2"></i> Todos
                </button>

                <button 
                  v-for="cat in items" 
                  :key="cat.id" 
                  class="btn-category"
                  :class="{ active: activeCategory === cat.nombre }"
                  @click="$emit('change-category', cat.nombre)"
                >
                    <i class="fas fa-tag me-2"></i> {{ cat.nombre }}
                </button>

            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({ 
    items: Array,
    activeCategory: String // Recibe qué categoría está seleccionada desde la Tienda
});
defineEmits(['change-category']); // Avisa al padre cuando el usuario hace clic
</script>

<style scoped>
/* Tu CSS original se mantiene igual */
.category-wrapper { background-color: #f8f9fa; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.btn-category {
    display: flex; align-items: center; padding: 8px 20px; border-radius: 50px;
    border: 1px solid #dee2e6; background: white; color: #495057;
    white-space: nowrap; font-size: 0.9rem; font-weight: 500; transition: all 0.2s;
    cursor: pointer;
}
.btn-category:hover { background: #e9ecef; }
.btn-category.active { background: #0d6efd; color: white; border-color: #0d6efd; }
</style>