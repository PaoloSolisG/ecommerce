<template>
  <div class="brand-filter-root">
    
    <div v-if="mode === 'mobile'" class="mobile-trigger d-md-none">
      <button class="btn-filter-trigger" @click="openModal">
        <i class="fas fa-filter me-2"></i> Filtrar por Marcas
      </button>
    </div>

    <aside v-if="mode === 'desktop'" class="brand-sidebar d-none d-md-block">
      <div class="brand-card">
        <div class="brand-header d-flex justify-content-between align-items-center mb-3">
          <h6 class="text-uppercase fw-bold m-0">Marcas</h6>
          <span class="count-badge">{{ filteredBrands.length }}</span>
        </div>

        <div class="search-container mb-3">
          <i class="fas fa-search search-icon"></i>
          <input v-model="searchQuery" type="text" class="search-input" placeholder="Buscar marca..." />
        </div>
        
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border spinner-border-sm text-primary opacity-50"></div>
        </div>

        <div v-else>
          <div class="brand-scroll-area">
            <ul class="list-unstyled m-0">
              <li v-for="brand in visibleBrands" :key="brand.id_marca" class="brand-item-wrapper">
                <label class="brand-item">
                  <div class="checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      class="custom-checkbox" 
                      :checked="selectedBrands.includes(brand.id_marca)"
                      @change="toggleBrand(brand.id_marca)"
                    >
                    <span class="checkmark"></span>
                  </div>
                  <span class="brand-name">{{ brand.nombre_marca.toLowerCase() }}</span>
                </label>
              </li>
            </ul>
          </div>
          <div v-if="filteredBrands.length > limitInitial && !searchQuery" class="footer-actions">
            <button @click="showAll = !showAll" class="btn-show-more">
              {{ showAll ? 'Mostrar menos' : `Ver todas (${filteredBrands.length})` }}
              <i class="fas" :class="showAll ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <Transition name="slide-up">
      <div v-if="isModalOpen" class="brand-modal-mobile d-md-none">
        <div class="modal-header-fixed">
          <button class="btn-close-modal" @click="closeModal"><i class="fas fa-times"></i></button>
          <h5 class="m-0 fw-bold">Marcas</h5>
          <div style="width: 40px;"></div> 
        </div>

        <div class="modal-search-box">
          <div class="search-container">
            <i class="fas fa-search search-icon"></i>
            <input v-model="searchQuery" type="text" class="search-input" placeholder="Buscar marca..." />
          </div>
        </div>

        <div class="modal-list-content">
          <div 
            v-for="brand in filteredBrands" 
            :key="brand.id_marca" 
            class="mobile-row" 
            @click="toggleBrand(brand.id_marca)"
          >
            <span class="mobile-brand-name">{{ brand.nombre_marca.toLowerCase() }}</span>
            <div class="checkbox-wrapper">
              <input 
                type="checkbox" 
                class="custom-checkbox"
                :checked="selectedBrands.includes(brand.id_marca)"
                @click.stop
              >
              <span class="checkmark"></span>
            </div>
          </div>
        </div>

        <div class="modal-footer-fixed">
          <button class="btn-apply-results" @click="closeModal">
            Ver resultados {{ selectedBrands.length > 0 ? `(${selectedBrands.length})` : '' }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  loading: Boolean,
  mode: { type: String, default: 'desktop' }
});

const emit = defineEmits(['filter-brand']);
const searchQuery = ref('');
const showAll = ref(false);
const isModalOpen = ref(false);
const limitInitial = 10;
const selectedBrands = ref([]); // Estado para los checks

const filteredBrands = computed(() => props.items.filter(b => b.nombre_marca.toLowerCase().includes(searchQuery.value.toLowerCase())));
const visibleBrands = computed(() => (showAll.value || searchQuery.value) ? filteredBrands.value : filteredBrands.value.slice(0, limitInitial));

// Función única para marcar/desmarcar
const toggleBrand = (id) => {
  const index = selectedBrands.value.indexOf(id);
  if (index > -1) {
    selectedBrands.value.splice(index, 1);
  } else {
    selectedBrands.value.push(id);
  }
  emit('filter-brand', id);
};

const openModal = () => { isModalOpen.value = true; document.body.style.overflow = 'hidden'; };
const closeModal = () => { isModalOpen.value = false; document.body.style.overflow = 'auto'; };
</script>

<style scoped>
/* --- TU DISEÑO WEB ORIGINAL (SIN CAMBIOS) --- */
.brand-sidebar { position: sticky; top: 20px; z-index: 10; }
.brand-card { background: white; border: 1px solid #f0f0f0; border-radius: 12px; padding: 1.25rem; }
.count-badge { background: #f8f9fa; color: #888; font-size: 0.75rem; padding: 2px 8px; border-radius: 6px; border: 1px solid #eee; }
.search-container { position: relative; display: flex; align-items: center; width: 100%; }
.search-icon { position: absolute; left: 12px; color: #adb5bd; font-size: 0.9rem; }
.search-input { width: 100%; padding: 10px 10px 10px 35px; border: 1px solid #eee; border-radius: 8px; font-size: 0.85rem; background: #fdfdfd; }
.brand-scroll-area { max-height: 320px; overflow-y: auto; overscroll-behavior: contain; padding-right: 8px; }
.brand-item { display: flex; align-items: center; padding: 6px 0; cursor: pointer; user-select: none; }
.brand-name { font-size: 0.9rem; color: #495057; text-transform: capitalize; margin-left: 10px; }
.checkbox-wrapper { position: relative; width: 18px; height: 18px; flex-shrink: 0; }
.custom-checkbox { position: absolute; opacity: 0; cursor: pointer; height: 100%; width: 100%; left: 0; top: 0; margin: 0; z-index: 1; }
.checkmark { position: absolute; top: 0; left: 0; height: 18px; width: 18px; background-color: #fff; border: 2px solid #dee2e6; border-radius: 4px; }
.custom-checkbox:checked ~ .checkmark { background-color: #0d6efd; border-color: #0d6efd; }
.checkmark:after { content: ""; position: absolute; display: none; left: 5px; top: 2px; width: 5px; height: 10px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }
.custom-checkbox:checked ~ .checkmark:after { display: block; }
.btn-show-more { background: none; border: none; color: #0d6efd; font-size: 0.8rem; font-weight: 600; padding: 0; display: flex; align-items: center; gap: 5px; }

/* --- DISEÑO MÓVIL RESPONSIVO --- */
.btn-filter-trigger {
  width: 100%; padding: 12px; background: white; border: 1px solid #0d6efd; color: #0d6efd; border-radius: 8px; font-weight: 600; margin-bottom: 1rem;
}

.brand-modal-mobile {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: white; z-index: 10000; display: flex; flex-direction: column; overflow: hidden;
}

.modal-header-fixed {
  display: flex; align-items: center; justify-content: space-between; padding: 15px; border-bottom: 1px solid #eee; flex-shrink: 0;
}

.btn-close-modal { border: none; background: #f5f5f5; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

.modal-search-box { padding: 10px 15px; flex-shrink: 0; }

.modal-list-content {
  flex: 1; overflow-y: auto; padding: 0 15px 120px 15px; /* Espacio para el botón flotante */
}

.mobile-row {
  display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid #f8f8f8; cursor: pointer;
}

.mobile-brand-name { text-transform: capitalize; font-size: 1rem; color: #333; font-weight: 400; }

/* Pie de página con botón flotante real */
.modal-footer-fixed {
  position: fixed; bottom: 0; left: 0; width: 100%; padding: 20px; background: white; border-top: 1px solid #eee; box-shadow: 0 -4px 10px rgba(0,0,0,0.03);
}

.btn-apply-results {
  width: 100%; padding: 15px; background: #0d6efd; color: white; border: none; border-radius: 12px; font-weight: 700; font-size: 1rem;
}

/* Transición */
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>