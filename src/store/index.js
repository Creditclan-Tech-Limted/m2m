import Vuex from 'vuex'
import Vue from 'vue'
import loader from './modules/loader';
import cart from './modules/cart';
import request from './modules/request';
import customer from './modules/customer';
import global from './modules/global';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    loader,
    cart,
    request,
    customer,
    global
  }
});
