<template>
  <div v-if="$vuetify.breakpoint.smAndDown">
    <v-bottom-navigation background-color="blue-grey darken-4" dark fixed grow height="70" mandatory style="z-index: 2;">
      <v-btn to="/" :color="$route.path === '/' ? 'primary' : ''">
        <span>Home</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn @click="gotoCollections()" :color="$route.path === '/search/others' ? 'primary' : ''">
        <span>Collections</span>
        <v-icon>mdi-view-agenda</v-icon>
      </v-btn>
      <v-btn @click="$store.dispatch('cart/show')">
        <span>Cart</span>
        <v-badge :value="!!$store.state.cart.items.length" :content="`${$store.state.cart.items.length}`" color="red"
          overlap>
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>
      <v-btn @click="gotoOrder()"
        :color="$route.path === `/request/${$store.state.request.global_request_id}` ? 'primary' : ''">
        <span>Order</span>
        <v-icon>mdi-file-document</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <v-bottom-sheet v-if="$vuetify.breakpoint.smAndDown" v-model="views.noOrder" max-width="500" inset persistent
      scrollable>
      <NoOrderFound @close="views.noOrder = false" />
    </v-bottom-sheet>
  </div>
</template>

<script>
import NoOrderFound from "@/components/NoOrderFound.vue";

export default {
  name: "BottomNav",
  components: { NoOrderFound },
  data() {
    return {
      views: {
        noOrder: false,
      },
    }
  },
  methods: {
    gotoOrder() {
      const slug = localStorage.getItem('request') || this.$store.state.request.global_request_id;
      if (slug) this.$router.push(`/request/${slug}`)
      else this.views.noOrder = true;
    },
    gotoCollections() {
      const { query: q, stores } = this.$store.state.global;
      let query = {
        q: q || 'phones, laptops',
        jumia: stores.includes('jumia') || true,
        konga: stores.includes('konga') || true,
        jiji: stores.includes('jiji') || true,
        instagram: stores.includes('instagram') || true,
      };
      this.$store.commit('global/set', { query: query.q, stores });
      this.$router.push({ path: '/search/others', query });
    }
  }
}
</script>
