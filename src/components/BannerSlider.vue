<template>
    <section class="banner-container" v-if="items.length > 0">
        <div id="heroCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel">

            <div class="carousel-indicators">
                <button v-for="(banner, index) in items" :key="'ind-' + banner.id" type="button"
                    data-bs-target="#heroCarousel" :data-bs-slide-to="index" :class="{ active: index === 0 }"></button>
            </div>

            <div class="carousel-inner">
                <div v-for="(banner, index) in items" :key="banner.id"
                    :class="['carousel-item', { active: index === 0 }]" data-bs-interval="5000">
                    <picture>
                        <source :srcset="banner.imagen_responsive_url" media="(max-width: 768px)">
                        <img :src="banner.imagen_url" class="d-block w-100 banner-img"
                            :alt="banner.titulo || 'Banner Promocional'" loading="priority">
                    </picture>
                </div>
            </div>

            <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
            </button>
        </div>
    </section>
</template>

<script setup>
/**
 * @typedef {Object} Banner
 * @property {number} id
 * @property {string} imagen_url
 * @property {string} imagen_responsive_url
 * @property {string} titulo
 */

defineProps({
    items: { type: Array, required: true }
});
</script>

<style scoped>
/* Estilo Base (Desktop) */
.banner-img {
    width: 100%;
    /* height: 550px; */
    object-fit: cover;
    /* Recorta la imagen para llenar el espacio sin deformar */
    object-position: center;
    /* Centra el recorte */
}

/* Ajustes para Tablets y Laptops pequeñas */
@media (max-width: 992px) {
    .banner-img {
        height: 450px;
    }
}

/* Ajustes para Móviles (Smartphone) */
@media (max-width: 768px) {
    .banner-img {
       
        /* Un poco más de aire para que luzca la imagen vertical */
        object-fit: fill;
        /* Si la imagen móvil ya viene diseñada a medida, usamos fill o cover */
    }

    /* Opcional: hacer los indicadores más grandes para dedos */
    .carousel-indicators button {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin: 0 5px;
    }
}
</style>