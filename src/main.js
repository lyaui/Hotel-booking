import Vue from 'vue';
import Lightbox from 'vue-easy-lightbox';
import VModal from 'vue-js-modal';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Toasted from 'vue-toasted';
import Vuelidate from 'vuelidate';
import App from './App.vue';
import router from './router';

Vue.use(Toasted);
Vue.use(Lightbox);
Vue.use(VModal);
Vue.use(VueAxios, axios);
Vue.component('Loading', Loading);
Vue.use(Vuelidate);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
