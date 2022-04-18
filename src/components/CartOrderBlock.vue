<template>
  <div class="cart__block">
    <ul class="cart__orders">
        <CartOrderItem
          v-for="(item, index) in $store.state.cartProductsData"
          :key="index"
          :cart-item="item"
        />
    </ul>

    <div class="cart__total">
      <p>
        Доставка:
        <b v-if="this.$route.name === 'order'"> Выберите тип дставки </b>
        <b v-if="this.$route.name === 'orderInfo'">{{
          this.$store.state.orderInfo.deliveryType.price
        }}</b>
      </p>
      <p>
        Итого: <b>{{ $store.getters.cartTotalAmont }}</b> товара на сумму
        <b v-if="this.$route.name === 'order'"
          >{{ $store.getters.cartTotalPrice }} ₽</b
        ><b v-if="this.$route.name === 'orderInfo'"
          >{{ $store.state.orderInfo.totalPrice }} ₽</b
        >
      </p>
    </div>

    <button
      v-show="this.$route.name === 'order'"
      class="cart__button button button--primery"
      type="submit"
    >
      Оформить заказ
    </button>
  </div>
</template>

<script>
import CartOrderItem from "@/components/CartOrderItem.vue";
import numberFormat from "@/helpers/numberFormat";

export default {
  components: { CartOrderItem },
  filters: { numberFormat },
  prop: ["delivery"],
};
</script>