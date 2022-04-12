<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="products[0].product.colors[0].gallery[0].file.url"
        width="120"
        height="120"
        :alt="item.product.title"
      />
    </div>
    <h3 class="product__title">
      {{  }}
    </h3>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i style="background-color: #ff9b78"></i>
        Персиковый
      </span>
      <span> Размер {{  }}</span>
    </p>
    

    <span class="product__code"> Артикул: {{  }} </span>

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
        v-model.number="amount"
        name="count"
      />

      <button type="button" aria-label="Добавить один товар" @click="amount++">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{ (item.amount * item.product.price) | numberFormat }} ₽
    </b>

    <button
        @click.prevent="deleteProduct(item.productId)"
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
import { mapMutations } from "vuex";

export default {
  props: ["item"],
  filters: { numberFormat },
  computed: {
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.commit("updateCartProductAmount", {
          productId: this.item.productId,
          amount: value,
        });
      },
    },
  },

  methods: {
    cartProductLess() {
      if (this.amount <= 1) {
        return;
      }
      return this.amount--;
    },

    ...mapMutations({deleteProduct: 'deleteCartProduct'}),
  }
};
</script>