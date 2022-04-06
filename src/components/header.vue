<template>
    <header class="header container">
    <div class="header__wrapper">
      <router-link class="header__info" to="/">Каталог</router-link>

      <router-link class="header__logo" to="/">
        <img src="img/svg/logo-moire.svg" alt="Логотип интернет магазина Moire" width="116" height="34">
      </router-link>

      <a class="header__tel" href="tel:8 800 600 90 09">
        8 800 600 90 09
      </a>

      <CartIndicator/>
    </div>
  </header>
</template>
<script>
import CartIndicator from '@/components/CartIndicator.vue'

export default {
    components: {CartIndicator},
}
</script>