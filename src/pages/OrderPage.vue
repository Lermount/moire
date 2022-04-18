<template>
     <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link :to="{name:'main'}" class="breadcrumbs__link" >
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link :to="{name:'cart'}" class="breadcrumbs__link" >
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Оформление заказа
        </h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText v-model="formData.name" title="ФИО" :error="formError.name" placeholder="Введите ваше полное имя"/>
            <BaseFormText v-model="formData.address" title="Адрес доставки" :error="formError.address" placeholder="Введите ваш адрес"/>
            <BaseFormText v-model="formData.phone" title="Телефон" :error="formError.phone" placeholder="Введите ваш телефон"/>
            <BaseFormText v-model="formData.email" title="Email" :error="formError.email" placeholder="Введи ваш Email"/>
            <BaseFormTextarea v-model="formData.comment" title="Комментарий к заказу" :error="formError.comment" placeholder="Ваши пожелания"/>
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="delivery in deliveryTypeId" :key="delivery.id" >
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" :value="delivery.id" v-model="deliveryId">
                  <span class="options__value">
                    {{ delivery.title }} <b>{{ delivery.price }}</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="payment in paymentTypeId" :key="payment.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" :value="payment.id" v-model="paymentId">
                  <span class="options__value">
                    {{ payment.title }}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <CartOrderBlock/>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import CartOrderBlock from "@/components/CartOrderBlock.vue";
import { API_BASE_URL } from "../config";
import axios from 'axios';

export default {
    components: {BaseFormText, BaseFormTextarea, CartOrderBlock},
    data(){
        return {
            formData: {},
            formError: {},
            formErrorMessage: '',
            deliveryTypeId:null,
            paymentTypeId:null,

            deliveryId:null,
            paymentId:null,
        }
    },

    methods: {
        order(){
            this.formError = {};
            this.formErrorMessage = '',

            axios
                .post(API_BASE_URL + 'api/orders',{
                    ...this.formData,
                    deliveryTypeId:this.deliveryId,
                    paymentTypeId:this.paymentId,
                    
                },{
                    params: {
                        userAccessKey: this.$store.state.userAccessKey,
                    }
                })
                .then(response => {
                    this.$store.commit('resetCart');
                    this.$store.commit('updateOrderInfo', response.data);
                    this.$router.push({name:'orderInfo', params: {id: response.id}});
                })
                .catch(error => {
                    this.formError = error.response.data.error.request || {};
                    this.formErrorMessage = error.response.data.error.message;
                    this.formErrorMessage = error.response.data.error.request.deliveryTypeId;
                    this.formErrorMessage = error.response.data.error.request.paymentTypeId;
                })
        },
        delivery(){
          axios
            .get(API_BASE_URL + "api/deliveries")
            .then(response => {
              this.deliveryTypeId = response.data;
            })
          
        },
          payments(){
          axios
            .get(API_BASE_URL + "api/payments", {
              params:{
                deliveryTypeId: 1
              }
            })
            .then(response => this.paymentTypeId = response.data)
          
        }     
    },
    created(){
      this.delivery();
      this.payments();
    }
}
</script>