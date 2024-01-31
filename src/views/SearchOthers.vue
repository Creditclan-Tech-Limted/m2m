<template>
  <div class="bg-light-gray overflow-x-hidden" style="min-height: 100vh">
    <Navbar :initialValue="query" :count="items.length" @search="handleSearch($event)"
      @watch="handleSearchChange($event)" />

    <div class="container px-0 py-md-8 bottom-nav-spacing" style="max-width: 1000px;">
      <v-row>
        <v-col cols="12" md="12">
          <v-row dense v-if="!loading && !isSearching">
            <v-col v-for="(item, i) in items" :key="i" class="px-md-2 pb-0" cols="12" sm="4">
              <ItemCardMerchant :item="item" @select="handleSelect(item)" @plans="current = item; views.plans = true;" />
            </v-col>
          </v-row>
          <v-row v-if="loading || isSearching" dense>
            <v-col v-for="i in 4" :key="i" class="px-2 pb-0 mb-3" cols="12" sm="4">
              <ItemCardLoading />
            </v-col>
          </v-row>

          <div v-if="!items.length && !loading && !isSearching">
            <div class="text-center py-10 py-md-16 d-flex flex-column align-center">
              <br><br><br><br>
              <img src="@/assets/images/shopping-app.svg/" alt="" style="width: 250px" />
              <p class="mt-10" style="font-size: 1.5rem">No results</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <BottomNav />

    <v-dialog v-if="$vuetify.breakpoint.smAndDown" v-model="views.details" fullscreen hide-overlay
      transition="dialog-bottom-transition">
      <ProductDetailsOther v-if="current" :item="current" @close="views.details = false; current = null;"
        @plans="views.details = false; views.plans = true" />
    </v-dialog>
    <v-navigation-drawer v-else v-model="views.details" fixed right temporary width="550">
      <ProductDetailsOther v-if="current" :item="current" @close="views.details = false; current = null;"
        @plans="views.details = false; views.plans = true" />
    </v-navigation-drawer>

    <!-- <v-dialog v-if="$vuetify.breakpoint.smAndDown" v-model="views.plans" fullscreen hide-overlay
      transition="dialog-bottom-transition">
      <ProductPlans v-if="current" :item="current" @close="views.plans = false" />
    </v-dialog>
    <v-navigation-drawer v-else v-model="views.plans" fixed right temporary width="550">
      <ProductPlans v-if="current" :item="current" @close="views.plans = false" />
    </v-navigation-drawer> -->

    <v-btn v-if="$vuetify.breakpoint.smAndDown" @click="handleSearch(query)" fab fixed bottom right color="primary"
      style="margin-bottom: 80px; z-index: 1" elevation="0">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </div>
</template>

<script>
import Navbar from "@/components/nav/Navbar.vue";
import ItemCardLoading from "@/components/item/ItemCardLoading.vue";
// import ProductPlans from "@/components/item/ProductPlans.vue";
import ProductDetailsOther from "@/components/item/ProductDetailsOther.vue";
import ItemCardMerchant from "@/components/item/ItemCardMerchant.vue";
// import getItem from "@/lib/products.js"
import BottomNav from "@/components/BottomNav.vue";

export default {
  name: "SearchOthers",
  components: {
    BottomNav,
    ItemCardMerchant,
    ProductDetailsOther,
    // ProductPlans,
    ItemCardLoading,
    Navbar
  },
  metaInfo() {
    return {
      title: this.current ? this.current.name : `${this.items.length} search result(s)`,
    }
  },
  data() {
    return {
      query: '',
      views: { search: false, details: false, plans: false, },
      pagination: { page: 1, end: false, limit: 50, cursor: 0 },
      items: [],
      category_id: null,
      current: null,
      loading: false,
      isSearching: false,
      searched: false,
      params: {},
      // cc_endpoint: 'https://ccendpoints.herokuapp.com/api/v2/m2m',
      cc_endpoint: 'http://localhost:4100/api/v2/m2m',
    }
  },
  created() {
    this.handleRouteChange();
  },
  methods: {
    async handleRouteChange() {
      const { q: search, id: category_id } = this.$route.query;
      this.query = search;
      this.category_id = category_id;
      this.items = [];
      await this.fetchItems();
    },
    handleSearchChange(search) {
      if (!search.length) this.items = this.$store.state.global.products;
    },
    handleSearch(q) {
      this.views.search = false;
      this.isSearching = true;
      this.items = this.items.filter(r => r.name.toLowerCase().includes(q?.toLowerCase()))
      setTimeout(() => {
        this.isSearching = false;
      }, 2000)
      // this.$bus.$emit('modal', 'search');
    },
    async fetchItems() {
      try {
        this.loading = true;
        let url = '';
        if (this.category_id !== 'all') {
          url = `${this.cc_endpoint}/retrieve/products?cursor=${this.pagination.cursor}&page_size=${this.pagination.limit}&category_id=${this.category_id}`
        } else {
          url = `${this.cc_endpoint}/retrieve/products?cursor=${this.pagination.cursor}&page_size=${this.pagination.limit}`
        }

        const { data } = await this.$http.get(url);
        this.items = data.response;
        this.pagination.cursor = data.cursor;
        this.pagination.end = data.end;
        this.$store.commit('global/set', { products: data.response });
        this.loading = false;
      } catch (e) {
        this.loading = false;
        console.log(e);
      }
    },
    handleSelect(item) {
      this.views.details = true;
      this.current = item;
    },
    loadMore() {
      const { end } = this.pagination;
      if (!end) this.fetchItems();
    },
  },
  watch: {
    '$route': 'handleRouteChange',
    views: {
      handler(v) {
        if (!v.plans && !v.details) this.current = null;
      },
      deep: true,
    }
  },
}
</script>
