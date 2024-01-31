import Vue from 'vue';
import App from './App.vue';
import store from './store';
import http from './plugins/http';
import vuetify from './plugins/vuetify';
import router from './router';
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate';
import { email, length, max, required } from 'vee-validate/dist/rules';
import './loader';
import '../node_modules/nprogress/nprogress.css';
import moment from "moment";
// Vue awesome swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
// Simplebar
import simplebar from 'simplebar-vue';
import 'simplebar/dist/simplebar.min.css';
import { EventBus } from "@/lib/event-bus";
import { formatCurrency } from "./lib/utils";
import VueMeta from "vue-meta";
// import './registerServiceWorker';

extend('required', {
  ...required,
  message: 'This field is required'
});

extend('max', {
  ...max,
  message: '{_field_} may not be greater than {length} characters',
})

extend('length', {
  ...length,
  message: '{_field_} must be exactly {length} characters',
})

extend('email', {
  ...email,
  message: 'Email must be valid',
})

extend('phone', {
  validate: value => /^[0]\d{10}$/.test(value),
  message: 'Please enter a valid phone number'
});

extend('address', {
  validate: value => /[\w,.]+( [^\s]+){2,}$/.test(value),
  message: 'Please enter a valid address'
});

extend('emailOrPhone', {
  validate: value => {
    const p = /^[0]\d{10}$/;
    const e = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return p.test(value) || e.test(value);
  },
  message: 'Please enter a valid email or phone'
});

Vue.use(VueMeta)
Vue.use(VueAwesomeSwiper);
Vue.component('simplebar', simplebar);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Vue.config.productionTip = false
Vue.prototype.$http = http;
Vue.prototype.$bus = EventBus;

Vue.filter('currency', (value) => formatCurrency(value));

Vue.filter('timeago', (date) => {
  return moment(new Date(date)).fromNow()
});

Vue.filter('date', (date) => {
  date = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  return `${ date.getDate() }, ${ months[date.getMonth()] } ${ date.getFullYear() }`
});

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
