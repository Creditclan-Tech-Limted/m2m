import Vue from 'vue'
import VueRouter from 'vue-router'
import PageNotFound from "@/views/404";
import NProgress from 'nprogress';
import NetworkError from "@/views/NetworkError";
import Search from "@/views/SearchGlobal.vue";
import Request from "@/views/Request.vue";
import store from "@/store/index.js";
import Home from "@/views/Home.vue";
import SearchOthers from "@/views/SearchOthers.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/', exact: true, name: 'home', component: Home,
    async beforeEnter(to, from, next) {
      if (!store.state.global.prices?.length) await store.dispatch('global/prices');
      next();
    }
  },
  {
    path: '/search', name: 'search', component: Search,
    async beforeEnter(to, from, next) {
      if (!store.state.global.prices?.length) await store.dispatch('global/prices');
      next();
    }
  },
  {
    path: '/search/others', name: 'search-others', component: SearchOthers,
    async beforeEnter(to, from, next) {
      if (!store.state.global.prices?.length) await store.dispatch('global/prices');
      next();
    }
  },
  {
    path: '/request/:rid',
    name: 'request',
    component: Request,
    async beforeEnter(to, from, next) {
      const { rid } = to.params;
      await store.dispatch('request/load', rid);
      if (!store.state.request.global_request_id) return next('/error/404');
      localStorage.setItem('request', rid);
      next();
    }
  },
  { path: '/error/network', name: 'network-error', component: NetworkError },
  { path: '/error/404', name: 'not-found', component: PageNotFound },
  { path: '*', component: PageNotFound },
]

const router = new VueRouter({
  routes,
  mode: 'history',
  base: process.env.BASE_URL,
});

router.beforeResolve(async (to, from, next) => {
  if (to.name) NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
})

export default router;
