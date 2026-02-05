<template>
    <div class="product-card">
        <button class="wishlist-btn" @click="isFavorite = !isFavorite" :class="{ 'active': isFavorite }">
            <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
        </button>

        <div class="image-box">
            <img :src="p.producto_imagen" :alt="p.producto_nombre" loading="lazy">
        </div>

        <div class="info-box">
            <div class="meta-row">
                <span class="brand">{{ p.brand_name || p.marca || 'Genérico' }}</span>
                <button v-if="tieneVariosPrecios" class="btn-wholesale-tag" @click="showWholesale = true">
                    Por mayor <i class="fas fa-tag"></i>
                </button>
                <span class="code">#{{ p.codigo }}</span>
            </div>

            <h6 class="product-name">{{ p.producto_nombre }}</h6>

            <div class="variants-row" v-if="hasVariants">
                <div class="dots-group">
                    <span v-for="c in uniqueColors" :key="c" class="color-dot" :style="{ background: c }"></span>
                </div>
                <div class="sizes-group">
                    <span v-for="t in uniqueSizes" :key="t" class="size-badge">{{ t }}</span>
                </div>
            </div>

            <div class="price-row">
                <div class="main-price">
                    <span class="symbol">S/</span>
                    <span class="val">{{ mainPrice }}</span>
                </div>
                <span class="unit">x {{ unitName }}</span>
            </div>

            <div class="qty-selector" v-if="!hasVariants">
                <button class="qty-nav" @click="handleStep(-1)">
                    <i class="fas fa-minus"></i>
                </button>
                <input type="number" v-model.number="displayQty" class="qty-input" @change="handleManualInput">
                <button class="qty-nav" @click="handleStep(1)">
                    <i class="fas fa-plus"></i>
                </button>
            </div>

            <button class="action-btn"
                :class="{ 'has-vars': hasVariants, 'btn-gradient': !hasVariants, 'is-added': isAdded }"
                @click="handleMainAction">
                <i v-if="!hasVariants" class="fas fa-shopping-cart me-1"></i>
                {{ buttonText }}
            </button>
        </div>

        <ModalPrecios :is-open="showWholesale" :producto="p" @close="showWholesale = false"
            @confirm="onWholesaleConfirm" />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import ModalPrecios from './ModalPrecios.vue';

const props = defineProps({ p: Object });
const isFavorite = ref(false);
const showWholesale = ref(false);
const cartTrigger = ref(0);

// Cantidad local para cuando aún no se ha dado a "Agregar"
const tempQty = ref(1);

// --- LÓGICA DE PRECIOS ---
const tieneVariosPrecios = computed(() => (props.p.unidad_precio || []).length > 1);
const mainPriceObj = computed(() => {
    const unidades = props.p.unidad_precio || [];
    return unidades.find(u => u.id_unidad == "1") || unidades[0];
});
const mainPrice = computed(() => parseFloat(mainPriceObj.value?.precio || 0).toFixed(2));
const unitName = computed(() => mainPriceObj.value?.nombre_unidad || 'Unid');

const uniqueColors = computed(() => [...new Set((props.p.productotallacolor || []).filter(i => i.paleta_color).map(i => i.paleta_color))]);
const uniqueSizes = computed(() => [...new Set((props.p.productotallacolor || []).map(i => i.nombre_talla).filter(t => t && t !== 'null'))]);
const hasVariants = computed(() => uniqueColors.value.length > 0 || uniqueSizes.value.length > 0);

// --- ESTADO DEL CARRITO ---
const currentQtyInCart = computed(() => {
    cartTrigger.value;
    const carrito = JSON.parse(localStorage.getItem('mi_carrito')) || [];
    const item = carrito.find(i => i.id === props.p.producto_id);
    return item ? item.cantidad_unidades : 0;
});

const isAdded = computed(() => currentQtyInCart.value > 0);

// Lo que se muestra en el input
const displayQty = computed({
    get: () => isAdded.value ? currentQtyInCart.value : tempQty.value,
    set: (val) => {
        const v = Math.max(0, val);
        if (isAdded.value) {
            console.log(`🔄 Actualizando carrito en tiempo real: ${v} unidades.`);
            syncToCart(v);
        } else {
            console.log(`📝 Preparando cantidad (fuera de carrito): ${v}`);
            tempQty.value = v;
        }
    }
});

const buttonText = computed(() => {
    if (hasVariants.value) return 'Ver opciones';
    return isAdded.value ? 'En el carrito' : 'Agregar al carrito';
});

// --- ACCIONES ---

const handleStep = (delta) => {
    console.log(`按钮 clic: ${delta > 0 ? '+1' : '-1'}`);
    displayQty.value += delta;
};

const handleManualInput = () => {
    if (isNaN(displayQty.value)) displayQty.value = 0;
    console.log(`⌨️ Cantidad digitada manualmente: ${displayQty.value}`);
};

const syncToCart = (qty) => {
    let carritoActual = JSON.parse(localStorage.getItem('mi_carrito')) || [];
    const index = carritoActual.findIndex(item => item.id === props.p.producto_id);

    if (qty <= 0) {
        if (index !== -1) {
            carritoActual.splice(index, 1);
            console.log(`🗑️ Cantidad 0: Eliminando producto ${props.p.producto_id} del LocalStorage.`);
        }
    } else {
        const item = {
            id: props.p.producto_id,
            nombre: props.p.producto_nombre,
            imagen: props.p.producto_imagen,
            cantidad_unidades: qty,
            precio_unitario: parseFloat(mainPrice.value),
            subtotal: qty * parseFloat(mainPrice.value),
            id_unidad_medida: "1",
            tipo_venta: 'SIMPLE'
        };

        if (index !== -1) {
            carritoActual[index] = { ...carritoActual[index], ...item };
            console.log(`✅ Registro actualizado en LocalStorage (ID: ${item.id})`);
        } else {
            carritoActual.push(item);
            console.log(`🚀 Nuevo registro creado en LocalStorage (ID: ${item.id})`);
        }
    }

    localStorage.setItem('mi_carrito', JSON.stringify(carritoActual));
    cartTrigger.value++;
    window.dispatchEvent(new Event('storage'));
    console.log("🛒 Estado actual del carrito:", carritoActual);
};

const handleMainAction = () => {
    if (hasVariants.value) return;
    if (!isAdded.value) {
        console.log(`🎯 Botón Agregar clicado. Guardando ${tempQty.value} unidades en el carrito.`);
        syncToCart(tempQty.value);
    } else {
        console.log("💡 El producto ya está en el carrito.");
    }
};

const onWholesaleConfirm = (data) => {
    console.log("💎 Datos recibidos desde Modal Precios:", data);
    const itemUnificado = {
        id: props.p.producto_id,
        nombre: props.p.producto_nombre,
        imagen: props.p.producto_imagen,
        cantidad_unidades: data.total,
        precio_unitario: data.precio,
        subtotal: data.total * data.precio,
        id_unidad_medida: data.id_unidad_ganadora,
        tipo_venta: 'MAYOREO'
    };

    let carritoActual = JSON.parse(localStorage.getItem('mi_carrito')) || [];
    const index = carritoActual.findIndex(item => item.id === itemUnificado.id);

    if (index !== -1) {
        carritoActual[index] = itemUnificado;
        console.log("🔄 Actualizado precio mayorista en registro existente.");
    } else {
        carritoActual.push(itemUnificado);
        console.log("✨ Agregado como nuevo registro mayorista.");
    }

    localStorage.setItem('mi_carrito', JSON.stringify(carritoActual));
    cartTrigger.value++;
    window.dispatchEvent(new Event('storage'));
    showWholesale.value = false;
    console.log("💾 Cambios guardados desde Modal.");
};
</script>

<style scoped>
/* Tus estilos originales se mantienen igual */
.product-card {
    background: #fff;
    border: 1px solid #f2f2f2;
    border-radius: 14px;
    width: 100%;
    max-width: 240px;
    flex-shrink: 0;
    overflow: hidden;
    transition: all 0.25s ease;
    position: relative;
}

.product-card:hover {
    border-color: #0d6efd;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.1);
}

.wishlist-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #fff;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 5;
    transition: 0.2s;
}

.wishlist-btn.active {
    color: #ff4757;
}

.image-box {
    width: 100%;
    height: 160px;
    padding: 15px;
    background: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-box img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.info-box {
    padding: 12px;
}

.meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.brand {
    font-size: 0.7rem;
    font-weight: 700;
    color: #0d6efd;
    text-transform: uppercase;
}

.code {
    font-size: 0.65rem;
    color: #bbb;
}

.product-name {
    font-size: 0.88rem;
    font-weight: 600;
    color: #333;
    height: 38px;
    line-height: 1.2;
    overflow: hidden;
    margin-bottom: 10px;
}

.qty-selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f1f2f6;
    border-radius: 8px;
    margin-bottom: 10px;
    padding: 2px;
}

.qty-nav {
    width: 28px;
    height: 28px;
    border: none;
    background: #fff;
    border-radius: 6px;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
}

.qty-nav:hover {
    background: #000;
    color: #fff;
}

.qty-input {
    width: 40px;
    border: none;
    background: transparent;
    text-align: center;
    font-weight: 700;
    font-size: 0.85rem;
    outline: none;
}

.qty-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

.variants-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    height: 18px;
}

.dots-group {
    display: flex;
    gap: 3px;
}

.color-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1px solid #ddd;
}

.size-badge {
    font-size: 0.6rem;
    background: #eee;
    padding: 1px 5px;
    border-radius: 4px;
    color: #666;
}

.price-row {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 12px;
}

.main-price {
    font-weight: 800;
    color: #222;
    font-size: 1.15rem;
}

.main-price .symbol {
    font-size: 0.8rem;
    margin-right: 1px;
}

.unit {
    font-size: 0.7rem;
    color: #999;
}

.action-btn {
    width: 100%;
    border: none;
    padding: 10px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 700;
    background: #f8f9fa;
    color: #333;
    transition: 0.3s;
    text-transform: uppercase;
}

.btn-gradient {
    background: linear-gradient(135deg, #0d6efd 0%, #00c6ff 100%);
    color: #fff;
    box-shadow: 0 4px 10px rgba(13, 110, 253, 0.2);
}

.btn-gradient:hover {
    filter: brightness(1.1);
    transform: scale(1.02);
}

.action-btn.has-vars {
    background: #e7f1ff;
    color: #0d6efd;
}

.action-btn.has-vars:hover {
    background: #0d6efd;
    color: #fff;
}

/* NUEVO ESTILO PARA EL BOTÓN "POR MAYOR" DENTRO DE LA CARD */
.btn-wholesale-tag {
    border: none;
    background: #eef5ff;
    color: #0d6efd;
    font-size: 0.6rem;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 5px;
    text-transform: uppercase;
}

@media (max-width: 480px) {
    .product-card {
        max-width: 184px;
        border-radius: 10px;
    }

    .wishlist-btn {
        top: 6px;
        right: 6px;
        width: 24px;
        height: 24px;
        font-size: 0.7rem;
    }

    .image-box {
        height: 120px;
        padding: 10px;
    }

    .info-box {
        padding: 8px;
    }

    .meta-row {
        margin-bottom: 3px;
    }

    .brand {
        font-size: 0.6rem;
    }

    .code {
        font-size: 0.55rem;
    }

    .btn-wholesale-tag {
        font-size: 0.5rem;
        padding: 2px 5px;
        border-radius: 4px;
    }

    .btn-wholesale-tag i {
        font-size: 0.5rem;
        margin-left: 2px;
    }

    .product-name {
        font-size: 0.75rem;
        height: 32px;
        margin-bottom: 6px;
    }

    .variants-row {
        gap: 6px;
        margin-bottom: 8px;
        height: 14px;
    }

    .color-dot {
        width: 6px;
        height: 6px;
    }

    .size-badge {
        font-size: 0.5rem;
        padding: 1px 4px;
        border-radius: 3px;
    }

    .price-row {
        gap: 3px;
        margin-bottom: 8px;
    }

    .main-price {
        font-size: 0.95rem;
    }

    .main-price .symbol {
        font-size: 0.65rem;
    }

    .unit {
        font-size: 0.6rem;
    }

    .qty-selector {
        margin-bottom: 8px;
        padding: 2px;
        border-radius: 6px;
    }

    .qty-nav {
        width: 24px;
        height: 24px;
        font-size: 0.65rem;
        border-radius: 5px;
    }

    .qty-input {
        width: 32px;
        font-size: 0.75rem;
    }

    .action-btn {
        padding: 8px;
        border-radius: 6px;
        font-size: 0.65rem;
    }

    .action-btn i {
        font-size: 0.6rem;
    }
}
</style>