<template>
  <div>
    <Header/>
    <router-view/>
    <Footer/>
  </div>  
</template>
<script>
import Header from './components/header.vue';
import Footer from './components/footer.vue';
import { mapActions, mapMutations } from 'vuex';

export default {
  components: { Header, Footer },
  created(){
    const userAccessKey = localStorage.getItem('userAccessKey');
    if(userAccessKey){
      this.updateUserAccessKey(userAccessKey);
    }

    this.loadCart();
  },
  methods: {
    ...mapActions(['loadCart']),
    ...mapMutations(['updateUserAccessKey'])
  }
}   
</script>
