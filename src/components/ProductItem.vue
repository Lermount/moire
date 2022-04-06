<template>
    <li class="catalog__item">
            <router-link class="catalog__pic" :to="{name:'product', params:{id: product.id}}">
              <img :src="product.colors[value].gallery[0].file.url" :alt="product.title">
            </router-link>

            <h3 class="catalog__title">
              <a href="#">
                {{ product.title }}
              </a>
            </h3>

            <span class="catalog__price">
              {{ product.price | numberFormat }} ₽
            </span>

            <ul class="colors colors--black">
              <li class="colors__item" v-for="(color, index) in product.colors" :key="color.id">
                <label class="colors__label">
                  <input class="colors__radio sr-only" type="radio" :value="index" v-model="value">
                  <span class="colors__value" :style="{'background-color': product.colors[index].color.code }" style="border: 1px solid black"> 
                  </span>
                </label>
              </li>
            </ul>
    </li>
</template>
<script>
import numberFormat from "@/helpers/numberFormat";

export default {
  data(){
    return {
      value: 0,
    }
  },
  filters: {
    numberFormat
  },
  props: ["product"],
  methods: {
   
  }
}
</script>