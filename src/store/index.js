import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';
import { API_BASE_URL } from "../config";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        cartProducts: [],
        
        userAccessKey: null,
        cartProductsData: [],

        orderInfo: null,
    },
    mutations: {
        updateOrderInfo(state, orderInfo){
            state.orderInfo = orderInfo;
        },
        updateCartProductAmount(state,{basketItemId, quantity}){
            const item = state.cartProducts.find(item => item.id === basketItemId);

            if(item) {
                item.quantity = quantity;
            }
        },
        updateUserAccessKey(state,accessKey){
            state.userAccessKey = accessKey;
        },
        updateCartProductsData(state, items){
            state.cartProductsData = items;
        },
        syncCartProducts(state){
            state.cartProducts = state.cartProductsData.map(item => {
                return {
                    productId: item.product.id,
                    amount: item.quantity, 
                    colorId: item.color.color.id,
                    sizeId: item.size.id,
                }
            });
        },
        resetCart(){
            this.state.cartProducts = [];
        },
        deleteCartProduct(state, id){
            state.cartProductsData = state.cartProductsData.filter(item => item.id !== id)
        }
    },
    getters: {
        cartDetailProducts(state,){
            return state.cartProducts.map(item => {
                const product = state.cartProductsData.find(p => p.product.id === item.productId).product;
                return {
                    ...item,
                    product
                }
            });
        },
        cartTotalPrice(state, getters){
            return state.cartProductsData.reduce((acc, item) => (item.price * item.quantity ) + acc, 0);
        },

        cartTotalAmount(state,) {
            return state.cartProductsData.reduce((acc, item) => (item.quantity) + acc, 0);
        }
    },
    actions: {
        loadOrderInfo(context, orderId) {
            return axios
                .get(API_BASE_URL + '/api/orders/' + orderId, {
                    params: {
                        userAccessKey: context.state.userAccessKey
                    }
                })
                .then(response => {
                    context.commit('updateOrderInfo', response.data);
                });
        },
        loadCart(context){
        return axios
                .get(API_BASE_URL + 'api/baskets', {
                    params: {
                        userAccessKey: context.state.userAccessKey,
                    }
                })
                .then(response => {
                    if(!context.state.userAccessKey){
                        localStorage.setItem('userAccessKey', response.data.user.accessKey);
                        context.commit('updateUserAccessKey',response.data.user.accessKey);
                    }

                    context.commit('updateCartProductsData', response.data.items);
                    context.commit('syncCartProducts');
                });

        },
        addProductToCart(context, {productId, amount, colorId, sizeId}){
            return axios
                .post(API_BASE_URL + 'api/baskets/products', {
                    productId: productId,
                    quantity: amount, 
                    colorId: colorId,
                    sizeId: sizeId
                }, {
                    params: {
                        userAccessKey: context.state.userAccessKey,
                    }
                })
                .then(response => {
                    context.commit('updateCartProductsData', response.data.items);
                    context.commit('syncCartProducts');
                })
        },
        updateCartProductAmount(context, {basketItemId, quantity}){
            context.commit('updateCartProductAmount', basketItemId, quantity)

            if(quantity < 1){
                return;
            }

        return axios
            .put(API_BASE_URL + 'api/baskets/products', {
                basketItemId: basketItemId,
                quantity: quantity, 
            }, {
                params: {
                    userAccessKey: context.state.userAccessKey,
                }
            })
            .then(response => {
                context.commit('updateCartProductsData', response.data.items);   
            })
            .catch(() => {
                context.commit('syncCartProducts');
            })
        },

        deleteProductFromCart(context, basketItemId){
            return axios
            .delete(API_BASE_URL + 'api/baskets/products', {
                params: {
                    userAccessKey: context.state.userAccessKey,
                },
                data: {
                    basketItemId:basketItemId
                }
            })
            .then(response => {
                context.commit('updateCartProductsData', response.data.items); 
                context.commit('syncCartProducts');  
            })
            
        }
    }

});