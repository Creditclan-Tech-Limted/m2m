<template>
  <div class="overflow-x-hidden pb-4">
    <template v-if="!loading && categories.length">
      <div class="py-4 position-relative overflow-hidden px-0">
        <div class="container text-left overflow-hidden position-relative" style="max-width: 1200px; z-index: 2">
          <div v-if="$vuetify.breakpoint.mdAndUp" class="d-flex mb-12 mb-md-8">
            <!-- <router-link class="mr-6 grey--text text--darken-4" style="border-bottom: 2px solid #969696" to="/">
            Home
          </router-link> -->
            <button @click="goToMyAccount()" class="mr-6 grey--text text--darken-4">My Account</button>
            <button @click="goToCart()" class="mr-6 grey--text text--darken-4">Cart</button>
          </div>
          <div :style="{ maxWidth: `${$vuetify.breakpoint.mdAndDown ? '320px' : '100%'}` }" class="mt-2 mt-md-10">
            <div class="banner-title black--text font-weight-bold pr-5 d-flex align-center pr-12 pr-md-0">
              Pay later from 50,000 merchants
            </div>
            <div class="body-1 black--text d-flex flex-column mt-2 pr-16 pr-md-0">
              Connect with credit stores from Instagram, Jiji, Jumia, Konga, etc
            </div>
            <v-btn @click="handleCategoryClick({ name: 'All', id: 'all' })" color="primary" class="mt-6 px-6" elevation="0"
              rounded large>
              Start shopping
            </v-btn>
          </div>
        </div>
        <div class="absolute right top" style="transform: translate(40%, 10px); opacity: .7">
          <img src="/img/instagram-phone-half.png" alt="ig phone" />
        </div>
      </div>
      <div class="container--fluid px-4 py-4 bottom-nav-spacing">
        <swiper :options="swiperOptions" ref="el">
          <template v-for="(category, i) in categories">
            <swiper-slide :key="category.id">
              <v-responsive :aspect-ratio="9 / 11">
                <v-card @click="handleCategoryClick(category)" class="fill-height position-relative" outlined
                  :img="category.image || `https://picsum.photos/200/${300 + i}`">
                  <v-card-text class="d-flex flex-column fill-height pa-6 white--text py-8"
                    style="background: rgba(0, 0, 0, .3)">
                    <h3 class="white--text font-weight-bold text-capitalize" style="font-size: 1.5rem">{{ category.name }}
                    </h3>
                    <p class="white--text text-body-1 mt-3">1,000+ merchants</p>
                    <div class="mt-auto text-right">
                      <v-icon size="100" color="gray">mdi-cart</v-icon>
                    </div>
                    <v-img class="absolute bottom left mb-4 ml-6" src="@/assets/images/logo-icon.png" width="40"
                      style="opacity: .3" />
                  </v-card-text>
                </v-card>
              </v-responsive>
            </swiper-slide>
          </template>
        </swiper>
      </div>

      <SpeedDial />

      <BottomNav />

      <v-navigation-drawer v-if="!$vuetify.breakpoint.smAndDown" fixed right temporary v-model="views.noOrder"
        width="550">
        <NoOrderFound @close="views.noOrder = false" />
      </v-navigation-drawer>

    </template>

    <v-row v-if="loading" dense>
      <v-col v-for="i in 4" :key="i" class="px-2 pb-0 mb-3" cols="12" sm="4">
        <ItemCardLoading />
      </v-col>
    </v-row>

    <div v-if="!loading && !categories.length"
      class="container--fluid fill-height d-flex flex-column justify-center align-center text-center mt-5">
      <v-icon size="200">mdi-link-off</v-icon>
      <div class="display-1 mt-12 font-weight-bold text--primary">Oops! No category found</div>
      <p class="mt-5" style="max-width: 300px">You do not have any category at the moment, please check back.</p>
    </div>


  </div>
</template>

<script>
import BottomNav from "@/components/BottomNav.vue";
// import categories from "@/lib/categories.js";
import SpeedDial from "@/components/SpeedDial.vue";
import NoOrderFound from "@/components/NoOrderFound.vue";
import ItemCardLoading from "@/components/item/ItemCardLoading";

export default {
  name: "Home",
  components: { NoOrderFound, SpeedDial, BottomNav, ItemCardLoading },
  data() {
    return {
      categories: [],
      current: null,
      backendDomain: 'http://localhost:4200',
      cc_endpoint: 'https://ccendpoints.herokuapp.com/api/v2/m2m',
      // cc_endpoint: 'http://localhost:4100/api/v2/m2m',
      loading: false,
      swiperOptions: {
        slidesPerView: 1.3,
        spaceBetween: 15,
        breakpoints: {
          640: {
            slidesPerView: 2.5
          },
          700: {
            slidesPerView: 3.5
          },
          900: {
            slidesPerView: 4.5
          }
        },
        loop: true,
        autoplay: {
          delay: 0,
          disableOnInteraction: false
        },
        speed: 6000
      },
      views: {
        list: true,
        search: false,
        noOrder: false
      }
    }
  },
  created() {
    this.getCategories();
  },
  methods: {
    gotoOrder() {
      const slug = localStorage.getItem('request') || this.$store.state.request.global_request_id;
      if (slug) this.$router.push(`/request/${slug}`)
      else this.views.noOrder = true;
    },
    handleCategoryClick(category) {
      this.$store.commit('global/set', { query: category.name });
      // this.$bus.$emit('modal', 'search');
      let query = { q: category.name, id: category.id };
      this.$router.push({ path: '/search/others', query });
    },
    goToMyAccount() {
      window.location.href = this.backendDomain;
    },
    goToCart() {
      this.$bus.$emit('cart');
    },
    async getCategories() {
      try {
        this.loading = true;
        const { data } = await this.$http.get(`${this.cc_endpoint}/retrieve/categories`);
        this.categories = data.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error.message);
        console.log(error);
      }
    },

  }
}
</script>
