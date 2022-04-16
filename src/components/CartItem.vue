<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.color.gallery[0].file.url"
        width="120"
        height="120"
        :alt="item.product.title"
      />
    </div>
    <h3 class="product__title">
      {{ item.product.title }}
    </h3>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i  :style="{'background-color': item.color.color.code }"></i>
        {{ item.color.color.title }}
      </span>
      <span> Размер {{ item.size.title}}</span>
    </p>
    

    <span class="product__code"> Артикул: {{ item.id }} </span>

    <div class="product__counter form__counter">
      <button
        type="button"
        aria-label="Убрать один товар"
        @click="cartProductLess"
      >
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input
        type="text"
        pattern="^[1-9]\d*$"
        v-model.number="quantity"
        name="count"
      />

      <button type="button" aria-label="Добавить один товар" @click="quantity++">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{ (item.quantity * item.product.price) | numberFormat }} ₽
    </b>

    <button
        @click.prevent="deleteProduct(item.id)"
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>
<script>
import numberFormat from "@/helpers/numberFormat";
import { mapActions } from "vuex";


export default {
  props: ["item"],
  filters: { numberFormat },
  computed: {
    quantity: {
      get() {
        return this.item.quantity;
      },
      set(value) {
        this.$store.dispatch("updateCartProductAmount", {
          basketItemId: this.item.id,
          quantity: value,
        });
      },
    },
  },

  methods: {
    cartProductLess() {
      if (this.quantity <= 1) {
        return;
      }
      return this.quantity--;
    },

    deleteProduct(){
      this.deleteProductFromCart(this.item.id)
    },

    ...mapActions(['deleteProductFromCart'])
  },

  watch: {
    quantity(value){
     value;
    }
  }

};
</script>