<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content animate__animated animate__zoomIn">
        
        <div class="modal-header">
          <div class="header-icon-box">
            <i class="fas fa-tags"></i>
          </div>
          <div class="header-info">
            <h5>Precios por Mayor</h5>
            <p>{{ producto.producto_nombre }}</p>
          </div>
          <button class="close-btn" @click="$emit('close')">&times;</button>
        </div>

        <div class="modal-body">
          <div class="price-steps">
            <div 
              v-for="unid in unidadesOrdenadas" :key="unid.id_unidad"
              class="step-pill"
              :class="{ 'active': idUnidadActiva === unid.id_unidad }"
            >
              <span class="step-label">{{ unid.abr || unid.nombre_unidad.substring(0,3) }}</span>
              <span class="step-val">S/ {{ parseFloat(unid.precio).toFixed(2) }}</span>
            </div>
          </div>

          <div class="selection-rows">
            <div v-for="unid in unidadesOrdenadas" :key="unid.id_unidad" class="unit-row">
              <div class="unit-data">
                <span class="unit-title">{{ unid.nombre_unidad }}</span>
                <small>Equivale a {{ unid.unidades }} unid.</small>
              </div>
              <div class="unit-controls">
                <button @click="modificar(unid.id_unidad, -1)" class="btn-ctrl">-</button>
                <input type="number" :value="cantidades[unid.id_unidad] || 0" readonly>
                <button @click="modificar(unid.id_unidad, 1)" class="btn-ctrl">+</button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="summary-box">
            <div class="sum-item">
              <label>TOTAL UNIDADES:</label>
              <span>{{ totalFisico }}</span>
            </div>
            <div class="sum-total">
              S/ {{ totalDinero.toFixed(2) }}
            </div>
          </div>
          <button class="btn-confirm" @click="handleConfirm" :disabled="totalFisico === 0">
            ACTUALIZAR CARRITO
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  producto: Object,
  isOpen: Boolean
});

const emit = defineEmits(['close', 'confirm']);
const cantidades = ref({});

// Ordenar de mayor a menor escala para la "descomposición"
const unidadesOrdenadas = computed(() => {
  return [...(props.producto.unidad_precio || [])]
    .filter(u => u.is_catalogo == "1" || u.is_catalogo === null)
    .sort((a, b) => b.unidades - a.unidades);
});

// --- LÓGICA DE RECUPERACIÓN (Algoritmo de Descomposición) ---
const cargarDesdeCarrito = () => {
  const carrito = JSON.parse(localStorage.getItem('mi_carrito')) || [];
  const item = carrito.find(i => i.id === props.producto.producto_id);
  
  // Limpiar inputs
  const tempCantidades = {};
  unidadesOrdenadas.value.forEach(u => tempCantidades[u.id_unidad] = 0);

  if (item) {
    let unidadesRestantes = item.cantidad_unidades;

    // Repartimos las unidades totales en los empaques más grandes primero
    unidadesOrdenadas.value.forEach(u => {
      const factor = parseInt(u.unidades);
      if (unidadesRestantes >= factor) {
        tempCantidades[u.id_unidad] = Math.floor(unidadesRestantes / factor);
        unidadesRestantes %= factor; // Lo que sobra pasa al siguiente empaque
      }
    });
  }
  cantidades.value = tempCantidades;
};

watch(() => props.isOpen, (val) => {
  if (val) cargarDesdeCarrito();
});

const modificar = (id, delta) => {
  const actual = cantidades.value[id] || 0;
  cantidades.value[id] = Math.max(0, actual + delta);
};

const totalFisico = computed(() => {
  return unidadesOrdenadas.value.reduce((acc, u) => {
    return acc + ((cantidades.value[u.id_unidad] || 0) * parseInt(u.unidades));
  }, 0);
});

const unidadGanadora = computed(() => {
  if (totalFisico.value === 0) return null;
  return unidadesOrdenadas.value.find(u => totalFisico.value >= parseInt(u.unidades)) 
         || unidadesOrdenadas.value[unidadesOrdenadas.value.length - 1];
});

const idUnidadActiva = computed(() => unidadGanadora.value?.id_unidad || null);
const totalDinero = computed(() => totalFisico.value * parseFloat(unidadGanadora.value?.precio || 0));

const handleConfirm = () => {
  // Enviamos los datos consolidados
  emit('confirm', {
    total: totalFisico.value,
    precio: parseFloat(unidadGanadora.value.precio),
    id_unidad_ganadora: idUnidadActiva.value
  });
};
</script>
<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 9999;
}
.modal-content {
  background: white; width: 90%; max-width: 400px; border-radius: 25px; overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}
.modal-header { padding: 20px; display: flex; align-items: center; gap: 15px; background: #f8faff; position: relative; }
.header-icon-box { width: 45px; height: 45px; background: #0d6efd; color: white; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
.header-info h5 { margin: 0; font-size: 1.1rem; font-weight: 800; }
.header-info p { margin: 0; font-size: 0.8rem; color: #666; }
.close-btn { position: absolute; top: 15px; right: 15px; border: none; background: #eee; border-radius: 50%; width: 25px; height: 25px; }

.modal-body { padding: 20px; }
.price-steps { display: flex; gap: 8px; margin-bottom: 20px; }
.step-pill { flex: 1; border: 1px solid #eee; padding: 8px; border-radius: 12px; text-align: center; transition: 0.3s; }
.step-pill.active { border-color: #0d6efd; background: #eef5ff; transform: scale(1.05); }
.step-label { display: block; font-size: 0.65rem; font-weight: 800; color: #999; text-transform: uppercase; }
.step-val { font-size: 0.9rem; font-weight: 800; color: #333; }
.step-pill.active .step-label { color: #0d6efd; }

.unit-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f9f9f9; }
.unit-title { font-weight: 700; color: #333; display: block; }
.unit-data small { color: #bbb; font-size: 0.7rem; }
.unit-controls { display: flex; align-items: center; gap: 10px; background: #f1f2f6; padding: 4px; border-radius: 10px; }
.btn-ctrl { width: 30px; height: 30px; border: none; background: white; border-radius: 8px; font-weight: 800; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.unit-controls input { width: 30px; border: none; background: transparent; text-align: center; font-weight: 800; }

.modal-footer { padding: 20px; background: #222; }
.summary-box { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.sum-item label { font-size: 0.7rem; color: #888; display: block; }
.sum-item span { color: #00c6ff; font-weight: 800; font-size: 1.2rem; }
.sum-total { color: white; font-size: 1.5rem; font-weight: 800; }
.btn-confirm { width: 100%; border: none; background: #0d6efd; color: white; padding: 14px; border-radius: 12px; font-weight: 700; }
</style>