<template>
    <header class="header-top">
        <div class="container-fluid px-3">
            <div class="row align-items-center g-2">

                <!-- ============================================
             LOGO - Solo visible en Desktop
             ============================================ -->
                <div class="col-2 d-none d-md-block">
                    <router-link to="/" class="logo-wrapper">
                        <img src="https://demov7.valeapp.pe/recursos/img/logo/1757456796.jpg" alt="Logo"
                            class="logo-image">
                    </router-link>
                </div>

                <!-- ============================================
             BUSCADOR - Solo visible en Desktop
             ============================================ -->
                <div class="col-md-5 d-none d-md-block">
                    <div class="search-bar">
                        <input type="text" class="search-input" placeholder="¿Qué estás buscando hoy?"
                            @input="$emit('search', $event.target.value)">
                        <button class="search-btn">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                <!-- ============================================
             ICONOS - Siempre visibles
             ============================================ -->
                <div class="col-12 col-md-5">
                    <div class="cart-icons">

                        <!-- Botón Home - Solo móvil -->
                        <router-link to="/" class="icon-btn d-md-none" title="Inicio">
                            <div class="icon-wrapper">
                                <i class="fas fa-home"></i>
                            </div>
                        </router-link>

                        <!-- Botón PDF -->
                        <button class="icon-btn pdf-btn" title="Catálogo PDF">
                            <div class="icon-wrapper">
                                <i class="fas fa-file-pdf"></i>
                            </div>
                        </button>

                        <!-- Botón Favoritos -->
                        <button class="icon-btn" title="Favoritos">
                            <div class="icon-wrapper">
                                <i class="fas fa-heart"></i>
                                <span class="icon-badge">0</span>
                            </div>
                        </button>

                        <!-- Botón Carrito -->
                        <button class="icon-btn" title="Carrito">
                            <div class="icon-wrapper">
                                <i class="fas fa-shopping-cart"></i>
                                <span v-if="totalItemsUnicos > 0" class="icon-badge">
                                    {{ totalItemsUnicos }}
                                </span>
                            </div>
                        </button>

                        <!-- Botón Usuario -->
                        <button class="icon-btn-user" data-bs-toggle="modal" data-bs-target="#loginModal"
                            title="Mi cuenta">
                            <div class="icon-wrapper">
                                <i class="fas fa-user-circle"></i>
                            </div>
                        </button>

                    </div>
                </div>

            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Emite evento de búsqueda al padre
defineEmits(['search']);

// Referencia reactiva para el conteo de productos únicos
const totalItemsUnicos = ref(0);

// Función para contar cuántos IDs diferentes hay en el carrito
const actualizarConteoCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem('mi_carrito')) || [];
    // Contamos el largo del array (cada objeto es un producto diferente)
    totalItemsUnicos.value = carrito.length;
    console.log("🔔 Header: Actualizando badge a", totalItemsUnicos.value);
};

onMounted(() => {
    // 1. Cargamos el valor inicial al entrar
    actualizarConteoCarrito();

    // 2. Escuchamos cambios desde OTROS componentes (como ProductCard)
    window.addEventListener('storage', actualizarConteoCarrito);
});

onUnmounted(() => {
    // Limpiamos el evento al destruir el componente
    window.removeEventListener('storage', actualizarConteoCarrito);
});
</script>

<style scoped>
/* ============================================================================
   APPHEADER.VUE - ESTILOS MEJORADOS
   ============================================================================ */

/* ============================================================================
   1. CONFIGURACIÓN BASE DEL HEADER (DESKTOP)
   ============================================================================ */
.header-top {
    background: #ffffff;
    padding: 12px 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 1100;
    width: 100%;
    user-select: none;
    /* Evita selección de texto */
}

/* ============================================================================
   2. LOGO
   ============================================================================ */
.logo-wrapper {
    display: flex;
    align-items: center;
    height: 50px;
    text-decoration: none;
    cursor: pointer;
}

.logo-image {
    max-height: 45px;
    width: auto;
    object-fit: contain;
    transition: transform 0.3s ease;
    user-select: none;
    -webkit-user-drag: none;
}

.logo-image:hover {
    transform: scale(1.05);
}

/* ============================================================================
   3. BUSCADOR DEL HEADER
   ============================================================================ */
.search-bar {
    display: flex;
    background: #f1f5f9;
    border-radius: 12px;
    padding: 5px 15px;
    border: 1px solid transparent;
    transition: all 0.3s ease;
    width: 100%;
}

.search-bar:focus-within {
    background: #ffffff;
    border-color: #0d6efd;
    box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
}

.search-input {
    border: none;
    background: transparent;
    width: 100%;
    padding: 8px;
    outline: none;
    font-size: 0.95rem;
    color: #333;
}

.search-input::placeholder {
    color: #94a3b8;
}

.search-btn {
    border: none;
    background: transparent;
    color: #64748b;
    padding: 0 10px;
    cursor: pointer;
    transition: all 0.3s;
    flex-shrink: 0;
    user-select: none;
}

.search-btn:hover {
    color: #0d6efd;
    transform: scale(1.1);
}

/* ============================================================================
   4. CONTENEDOR DE ICONOS
   ============================================================================ */
.cart-icons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 15px;
    user-select: none;
}

/* ============================================================================
   5. BOTONES DE ICONOS - DESKTOP
   ============================================================================ */
.icon-btn,
.icon-btn-user {
    background: #f8fafc;
    border: none;
    border-radius: 12px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-decoration: none;
    flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    /* Elimina el resaltado en móvil */
    outline: none;
}

/* Wrapper interno para el icono */
.icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    color: #475569;
    font-size: 1.3rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efectos hover para desktop */
@media (min-width: 768px) {

    .icon-btn:hover .icon-wrapper,
    .icon-btn-user:hover .icon-wrapper {
        color: #0d6efd;
        transform: translateY(-2px);
    }

    .icon-btn:hover,
    .icon-btn-user:hover {
        background: #e0f2fe;
        box-shadow: 0 4px 12px rgba(13, 110, 253, 0.15);
    }

    .icon-btn:active .icon-wrapper,
    .icon-btn-user:active .icon-wrapper {
        transform: scale(0.95);
    }
}

/* Botón de usuario especial en desktop */
@media (min-width: 768px) {
    .icon-btn-user {
        background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
    }

    .icon-btn-user .icon-wrapper {
        color: #ffffff;
    }

    .icon-btn-user:hover {
        background: linear-gradient(135deg, #0b5ed7 0%, #0a58ca 100%);
        box-shadow: 0 6px 20px rgba(13, 110, 253, 0.3);
    }
}

/* ============================================================================
   6. BADGE DE NOTIFICACIONES
   ============================================================================ */
.icon-badge {
    position: absolute;
    top: 6px;
    right: 6px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    font-size: 10px;
    padding: 3px 6px;
    border-radius: 10px;
    font-weight: 700;
    min-width: 18px;
    text-align: center;
    line-height: 1;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
    border: 2px solid #ffffff;
    animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }
}

/* ============================================================================
   7. RESPONSIVE - TABLETS (768px - 991px)
   ============================================================================ */
@media (max-width: 991px) {
    .cart-icons {
        gap: 12px;
    }

    .icon-wrapper {
        width: 44px;
        height: 44px;
        font-size: 1.2rem;
    }
}

/* ============================================================================
   8. RESPONSIVE - MÓVILES (max-width: 767px)
   HEADER SE CONVIERTE EN TAB BAR INFERIOR
   ============================================================================ */
@media (max-width: 767px) {

    /* Header fijo en la parte inferior */
    .header-top {
        position: fixed !important;
        top: auto !important;
        bottom: 0 !important;
        left: 0;
        right: 0;
        width: 100%;
        height: 70px;
        padding: 0 !important;
        margin: 0;
        border-top: 1px solid #e5e7eb;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
        z-index: 9999 !important;
        display: flex;
        align-items: center;
        background: #ffffff;
    }

    /* Contenedor fluido sin padding extra */
    .container-fluid {
        padding: 0 !important;
        width: 100%;
    }

    /* Row sin márgenes */
    .row {
        margin: 0 !important;
        width: 100%;
    }

    /* Columna ocupa todo el ancho */
    .col-12 {
        padding: 0 !important;
    }

    /* Iconos distribuidos uniformemente */
    .cart-icons {
        justify-content: space-around;
        width: 100%;
        gap: 0;
        padding: 0 5px;
    }

    /* Botones sin fondo en móvil para look minimalista */
    .icon-btn,
    .icon-btn-user {
        background: transparent;
        border-radius: 0;
        position: relative;
    }

    /* Wrapper de iconos más grande para táctil */
    .icon-wrapper {
        width: 56px;
        height: 56px;
        font-size: 1.5rem;
        color: #64748b;
        flex-direction: column;
        gap: 2px;
    }

    /* Efecto de tap en móvil */
    .icon-btn:active .icon-wrapper,
    .icon-btn-user:active .icon-wrapper {
        color: #0d6efd;
        transform: scale(0.9);
    }

    /* Indicador activo inferior */
    .icon-btn::after,
    .icon-btn-user::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 3px;
        background: #0d6efd;
        border-radius: 3px 3px 0 0;
        transition: width 0.3s ease;
    }

    .icon-btn:active::after,
    .icon-btn-user:active::after {
        width: 40px;
    }

    /* Usuario en móvil sin gradiente */
    .icon-btn-user {
        background: transparent;
    }

    .icon-btn-user .icon-wrapper {
        color: #0d6efd;
    }

    /* Badge ajustado para móvil */
    .icon-badge {
        top: 8px;
        right: 10px;
        font-size: 9px;
        padding: 2px 5px;
        min-width: 16px;
    }
}

/* ============================================================================
   9. RESPONSIVE - MÓVILES PEQUEÑOS (max-width: 480px)
   ============================================================================ */
@media (max-width: 480px) {
    .header-top {
        height: 65px;
    }

    .icon-wrapper {
        width: 50px;
        height: 50px;
        font-size: 1.4rem;
    }

    .icon-badge {
        font-size: 8px;
        padding: 2px 4px;
    }
}

/* ============================================================================
   10. CORRECCIÓN PARA EVITAR SCROLL HORIZONTAL
   ============================================================================ */
.container-fluid,
.row,
.col-12,
.col-md-2,
.col-md-5 {
    max-width: 100%;
    overflow-x: hidden;
}

/* Evitar selección y arrastre de iconos */
i {
    user-select: none;
    -webkit-user-drag: none;
    pointer-events: none;
}

/* ============================================================================
   11. ANIMACIONES ESPECIALES
   ============================================================================ */
@keyframes bounce-in {
    0% {
        transform: scale(0.8);
        opacity: 0;
    }

    50% {
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.icon-badge {
    animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* ============================================================================
   FIN DE ESTILOS APPHEADER
   ============================================================================ */
</style>