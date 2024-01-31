<template>
  <div class="bg-light-gray overflow-x-hidden">
    <template :class="{ 'bottom-nav-spacing': $vuetify.breakpoint.smAndDown }">
      <Navbar :initialValue="values.described_item" :count="items.length" @search="handleSearch($event)"/>
      <div class="container px-0 py-md-8 bottom-nav-spacing" style="max-width: 900px;">
        <v-row>
          <v-col cols="12" md="9">
            <v-row dense>
              <v-col v-for="item in items" :key="item.id" class="px-md-2 pb-0" cols="12" sm="6">
                <ItemCardMerchant
                  :item="item" @select="handleSelect(item)" @plans="current = item; views.plans = true;"
                />
              </v-col>
            </v-row>
            <v-row v-if="loading" dense>
              <v-col v-for="i in 4" :key="i" class="px-2 pb-0 mb-3" cols="12" sm="6">
                <ItemCardLoading/>
              </v-col>
            </v-row>
            <div v-if="!pagination.end && !loading" class="my-12 d-flex justify-center">
              <v-btn @click="loadMore()" outlined rounded>
                Load more
                <v-icon class="ml-4">mdi-chevron-down</v-icon>
              </v-btn>
            </div>
          </v-col>
          <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12" md="3">
            <div style="position: sticky; top: 100px;" class="mt-6">
              <div class="banner-title font-weight-medium" style="font-size: 4rem; line-height: 1; color: #162c5d">
                {{ items.length }} <br> items
              </div>
              <div class="d-flex flex-column mt-8">
                <div class="mt-8">
                  <div
                    v-for="c in categories.slice(0, 5)" :key="c.id"
                    @click="handleCategoryClick(c)"
                    class="desktop-link active cursor-pointer"
                  >
                    {{ c.name }}
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </template>

    <SpeedDial/>

    <BottomNav/>

    <v-dialog
      v-if="$vuetify.breakpoint.smAndDown" v-model="views.details" fullscreen hide-overlay
      transition="dialog-bottom-transition"
    >
      <ProductDetails
        v-if="current" :item="current" @close="views.details = false; current = null;"
        @plans="views.details = false; views.plans = true"
      />
    </v-dialog>
    <v-navigation-drawer v-else v-model="views.details" fixed right temporary width="550">
      <ProductDetails
        v-if="current" :item="current" @close="views.details = false; current = null;"
        @plans="views.details = false; views.plans = true"
      />
    </v-navigation-drawer>

    <v-dialog
      v-if="$vuetify.breakpoint.smAndDown" v-model="views.plans" fullscreen hide-overlay
      transition="dialog-bottom-transition"
    >
      <ProductPlans v-if="current" :item="current" @close="views.plans = false"/>
    </v-dialog>
    <v-navigation-drawer v-else v-model="views.plans" fixed right temporary width="550">
      <ProductPlans v-if="current" :item="current" @close="views.plans = false"/>
    </v-navigation-drawer>
  </div>
</template>

<script>
import ItemCardMerchant from "@/components/item/ItemCardMerchant.vue";
import ItemCardLoading from "@/components/item/ItemCardLoading.vue";
import Navbar from "@/components/nav/Navbar.vue";
import BottomNav from "@/components/BottomNav.vue";
import categories from "@/lib/categories.js";
import SpeedDial from "@/components/SpeedDial.vue";
import ProductPlans from "@/components/item/ProductPlans.vue";
import ProductDetails from "@/components/item/ProductDetails.vue";

export default {
  name: "Search",
  components: {
    ProductDetails,
    ProductPlans,
    SpeedDial,
    BottomNav,
    Navbar,
    ItemCardLoading,
    ItemCardMerchant
  },
  metaInfo() {
    return {
      title: this.current ? this.current.name : `${ this.items.length } search result(s)`,
    }
  },
  data() {
    return {
      items: [],
      loading: false,
      merchantsCount: 0,
      query: '',
      values: {
        described_item: '',
        minimum_amount: 0,
        maximum_amount: 0,
        category_id: null
      },
      pagination: {
        page: 1,
        end: false,
        next_cursor: null
      },
      views: {
        search: false,
        categories: false,
        call: false,
        details: false,
        plans: false,
      },
      current: null,
      categories,
    }
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
  created() {
    this.handleRouteChange();
  },
  methods: {
    async handleRouteChange() {
      const { pid, q, ...rest } = this.$route.query;
      if (pid) {
        this.current = await this.getItem(pid);
        this.views.details = true;
      }
      if (q !== this.values.described_item || Object.keys(rest).length) {
        this.initSearch();
      }
    },
    handleSelect(item) {
      const q = this.$route.query;
      if (q.pid && q.pid === item.slug) {
        this.views.details = true;
        this.current = item;
        return;
      }
      this.$router.push({ query: { ...q, pid: item.slug } });
    },
    async runSearch(page) {
      this.loading = true;
      const payload = Object.keys(this.values).reduce((acc, key) => {
        if (this.values[key]) acc[key] = this.values[key];
        return acc;
      }, {});
      if (payload.described_item.includes(', ')) payload.described_item = payload.described_item.split(', ');
      const res = await this.$http.post(`/shop/web`, { ...payload, show_result: true }, {
        params: { page, next_cursor: this.pagination.next_cursor }
      });
      const { data = [], next_cursor, end } = res.data?.data?.results_data;
      this.items = page === 1 ? data : [...this.items, ...data];
      this.pagination.next_cursor = next_cursor;
      this.pagination.end = end;
      this.pagination.page = page;
      this.merchantsCount = new Set(this.items.map(item => item.merchant_slug)).size;
      this.loading = false;
    },
    loadMore() {
      const { page, end } = this.pagination;
      if (!end) this.runSearch(page + 1);
    },
    handleSearch(q) {
      this.views.search = false;
      this.$router.replace({ query: { q } });
    },
    initSearch() {
      this.values.described_item = this.$route.query?.q || '';
      this.values.category_id = this.$route.query?.category_id || '';
      this.values.minimum_amount = this.$route.query?.minimum_amount || '';
      this.values.maximum_amount = this.$route.query?.maximum_amount || '';
      this.pagination = { page: 1, end: false, next_cursor: null };
      this.items = [];
      if (this.values.category_id) this.values.described_item = this.getQueryFromCategory(this.values.category_id) || this.values.described_item;
      this.runSearch(this.pagination.page);
    },
    getQueryFromCategory(category_id) {
      return categories.find(c => `${ c.id }` === `${ category_id }`)?.keyword;
    },
    async getItem(slug) {
      const found = this.items.find(item => item.slug === slug);
      if (found) return found;
      const id = await this.$store.dispatch('global/resolveItemId', slug);
      // eslint-disable-next-line no-unused-vars
      const { data: { data: { merchant, ...item } } } = await this.$http.get(`/item/${ id || slug }`);
      return item;
    },
    handleCategoryClick(category) {
      this.$router.push({ path: '/search', query: { category_id: category.id } });
    }
  },
}
</script>

<style scoped lang="scss">
::v-deep .desktop-link {
  text-decoration: none;
  font-size: 1.3rem;
  color: #2e3c55 !important;
  opacity: .5;
  margin-bottom: 4px;

  &.active {
    opacity: 1;
  }
}
</style>
