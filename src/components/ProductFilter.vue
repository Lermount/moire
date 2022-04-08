<template>
    <aside class="filter">
        <form class="filter__form form" action="#" method="get" @submit.prevent="submit">
          <fieldset class="form__block">
            <legend class="form__legend">Цена</legend>
            <label class="form__label form__label--price">
              <input
                class="form__input"
                type="text"
                name="min-price"
                v-model.number="currentPriceFrom"
              />
              <span class="form__value">От</span>
            </label>
            <label class="form__label form__label--price">
              <input
                class="form__input"
                type="text"
                name="max-price"
                v-model.number="currentPriceTo"
              />
              <span class="form__value">До</span>
            </label>
          </fieldset>

          <fieldset class="form__block">
            <legend class="form__legend">Категория</legend>
            <label class="form__label form__label--select">
              <select class="form__select" type="text" name="category" v-model.number="currentCategoryId">
                <option value="0">Все категории</option>
                <option :value="category.id" v-for="category in categories" :key="category.id">{{ category.title }}</option>
              </select>
            </label>
          </fieldset>

          <fieldset class="form__block">
            <legend class="form__legend">Материал</legend>
            <ul class="check-list">
              <li class="check-list__item" v-for="material in materials" :key="material.id">
                <label class="check-list__label">
                  <input
                    class="check-list__check sr-only"
                    type="checkbox"
                    name="material"
                    :value="material.id"
                     v-model.number="currentMaterialId"
                    
                  />
                  <span class="check-list__desc">
                    {{ material.title }}
                    <span>({{ material.productsCount }})</span>
                  </span>
                </label>
              </li>
            </ul>
          </fieldset>

          <fieldset class="form__block">
            <legend class="form__legend">Коллекция</legend>
            <ul class="check-list">
              <li class="check-list__item"  v-for="collection in collections" :key="collection.id">
                <label class="check-list__label">
                  <input
                    class="check-list__check sr-only"
                    type="checkbox"
                    name="collection"
                    :value="collection.id"
                    v-model.number="currentCollectionId"
                    
                    
                  />
                  <span class="check-list__desc">
                    {{ collection.title }}
                    <span>({{ collection.productsCount }})</span>
                  </span>
                </label>
              </li>
            </ul>
          </fieldset>

          <button class="filter__submit button button--primery" type="submit">
            Применить
          </button>
          <button class="filter__reset button button--second" type="button" @click.prevent="reset">
            Сбросить
          </button>
        </form>
      </aside>
</template>
<script>
import axios from 'axios';
import { API_BASE_URL } from "../config";

export default {
    data(){
        return {
            currentPriceFrom:0,
            currentPriceTo:0,
            currentCategoryId:0, 
            currentMaterialId: [],
            currentCollectionId: [],
            
            categoriesData: null,
            materailData: null,
            collectionData: null,
        }
    },

    props: ['priceFrom', 'priceTo', 'categoryId', 'materialId','collectionId'],
    
    computed: {
       
        categories(){
            return this.categoriesData ? this.categoriesData.items : [];
        }, 
        
        materials(){
            return this.materailData ? this.materailData.items : [];
        },

        collections(){
            return this.collectionData ? this.collectionData.items : [];
        },
       
    },

    watch: {
        priceFrom(value){
            this.currentPriceFrom = value;
        },
        priceTo(value) {
            this.currentPriceTo = value;
        },
        categoryId(value) {
            this.currentCategoryId = value;
        },
        materialId(value) {
            this.currentMaterialId = value;
        },
        collectionId(value) {
            this.currentCollectionId = value;
        },
    },

    methods: {
        submit() {
            this.$emit('update:priceFrom',this.currentPriceFrom);
            this.$emit('update:priceTo',this.currentPriceTo);
            this.$emit('update:categoryId',this.currentCategoryId);
            this.$emit('update:materialId',this.currentMaterialId);
            this.$emit('update:collectionId',this.currentCollectionId);
        },
          reset() {
            this.$emit('update:priceFrom',0);
            this.$emit('update:priceTo',0);
            this.$emit('update:categoryId',0);
            this.$emit('update:materialId',0);
            this.$emit('update:collectionId',0);
        },

        loadCategories(){
          axios.get(API_BASE_URL + "api/productCategories")
                .then(response => this.categoriesData = response.data);
        },
        loadMaterials(){
          axios.get(API_BASE_URL + "api/materials")
                .then(response => this.materailData = response.data);
        },
        loadCollection(){
          axios.get(API_BASE_URL + "api/seasons")
                .then(response => this.collectionData = response.data);
        }
    },
    created(){
      this.loadCategories();
      this.loadMaterials();
      this.loadCollection();
    },
}
</script>