<template>
  <main class="content container" v-if="productLoading">
    <p>Загрузка товаров</p>
    <img
      src="https://miro.medium.com/max/1400/1*CsJ05WEGfunYMLGfsT2sXA.gif"
      width="250"
      height="100"
      alt="loading"
    />
  </main>
  <main class="content container" v-else-if="!productData">
    Не удалось получить товар
  </main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" to="/"> Каталог </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" to="/">
            {{ category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img
            width="570"
            height="570"
            :src="productMainImage" :alt="product.title"
          />
        </div>
        <ul class="pics__list">
          <li class="pics__item" v-for="(colors, index) in productData.colors" :key="index" @click.prevent="chooseProductImage(colors)">
            <a href="#" class="pics__link ">
              <img
                width="98"
                height="98"
                :src="product.colors[index].gallery[0].file.url" :alt="product.title"
              />
            </a>
          </li>
         
        </ul>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form
            class="form"
            action="#"
            method="POST"
            @submit.prevent="addToCart"
          >
            <div class="item__row item__row--center">
              <div class="form__counter">
                <button
                  type="button"
                  aria-label="Убрать один товар"
                  @click="lessProduct"
                >
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input
                  type="text"
                  pattern="^[1-9]\d*$"
                  v-model.number="productAmount"
                />

                <button
                  type="button"
                  aria-label="Добавить один товар"
                  @click="productAmount++"
                >
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <b class="item__price"> {{ product.price | numberFormat }} ₽ </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ul class="colors colors--black">
                  <li class="colors__item" v-for="(color, index) in productData.colors" :key="color.id" @click.prevent="chooseProductImage(color)">
                    <label class="colors__label">
                      <input
                        class="colors__radio sr-only"
                        type="radio"
                        name="color-item"
                        
                      />
                      <span
                        class="colors__value"
                        :style="{'background-color': product.colors[index].color.code }" style="border: 1px solid black"
                      >
                      </span>
                    </label>
                  </li>
                </ul>
              </fieldset>

              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select">
                  <select class="form__select" type="text" name="category" v-model.number="size">
                    <option :value="size" v-for="size in product.sizes" :key="size.id">{{ size.title }}</option> 
                  </select>
                </label>
              </fieldset>
            </div>

            <button class="item__button button button--primery" type="submit">
              В корзину
            </button>
            <div v-show="productAdded">Товар добавлен в корзину</div>
            <div v-show="productAddSendind" v-if="!formErrorMessage">Добавляем товар в корзину</div>
            <p  v-if="formErrorMessage">
            {{ formErrorMessage }}
          </p>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link tabs__link--current"> Информация о товаре </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#"> Доставка и возврат </a>
          </li>
        </ul>

        <div class="item__content">
          <h3>Состав:</h3>

          <span v-for="material in productData.materials" :key="material.id">
            {{ material.title }} <br>
          </span>

          <h3>Уход:</h3>
          <!-- Реализовать уход -->
          <p>
            Машинная стирка при макс. 30ºC короткий отжим<br />
            Гладить при макс. 110ºC<br />
            Не использовать машинную сушку<br />
            Отбеливать запрещено<br />
            Не подвергать химчистке<br />
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
<script>
import numberFormat from "@/helpers/numberFormat";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      productAmount: 1,
      size: {},
      colorId: 0,
      productData: null,
      productLoading: false,
      productLoadingFailed: false,
      productMainImage: null,

      productAdded:false,
      productAddSendind: false,
      formError: {},
      formErrorMessage: '',
    };
  },
  filters: {
    numberFormat,
  },
  computed: {
    product() {
      return this.productData;
    },

    category() {
      return this.productData.category;
    },
  },
  methods: {
    ...mapActions(['addProductToCart']),

   

    addToCart() {
      this.productAdded = false;
      this.productAddSendind = true;
      this.formError = {},
      this.formErrorMessage = '',

      this.addProductToCart({productId: this.product.id, amount: this.productAmount, colorId: this.colorId, sizeId: this.size.id})
          .then(() => {
            this.productAdded = true;
            this.productAddSendind = false;
          })
          .catch(error => {
             this.formError = error.response.data.error.request || {};
             this.formErrorMessage = error.response.data.error.request.sizeId;
          })
          

    },

    lessProduct() {
      if (this.productAmount <= 1) {
        return;
      }
      this.productAmount--;
    },

    loadProduct() {
      this.productLoading = true;
      this.productLoadingFailed = false;

      axios
        .get(API_BASE_URL + "api/products/" + this.$route.params.id)
        .then((response) => {
          this.productData = response.data
          this.chooseProductImage(this.productData.colors[0])
        })
        .catch(() => (this.productLoadingFailed = true))
        .then(() => (this.productLoading = false));
    },

    chooseProductImage(item){
      this.productMainImage = item.gallery[0].file.url;
      this.colorId = item.color.id
    }
  
  },
  watch: {
    '$route.params.id':{
      handler(){
        this.loadProduct();
      },
      immediate: true,
    }
  }
};
</script>