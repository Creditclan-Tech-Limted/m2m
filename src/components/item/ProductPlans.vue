<template>
  <v-card elevation="0" rounded="0">
    <v-card-text class="py-8 px-6 px-md-8">
      <div v-if="view === 'plans'">
        <div class="d-flex align-center justify-space-between">
          <h2 class="py-1 black--text">Choose a plan</h2>
          <v-btn @click="$emit('close')" color="red" outlined small icon>
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="mt-8">
          <v-card outlined rounded="4" class="px-4 py-3 mb-4">
            <v-subheader class="pa-0 mb-2 font-weight-bold" style="height: initial;">Product</v-subheader>
            <div class="d-flex align-center">
              <v-img
                :src="item.primary_picture || item.images[0]" :aspect-ratio="1" contain class="border rounded-lg mr-2"
                style="max-width: 50px; min-width: 50px"
              />
              {{ item.name }}
            </div>
          </v-card>
          <v-row v-if="loading">
            <v-col cols="8">
              <v-skeleton-loader max-width="100%" type="image"></v-skeleton-loader>
            </v-col>
            <v-col cols="4">
              <v-skeleton-loader max-width="100%" type="image"></v-skeleton-loader>
            </v-col>
          </v-row>
          <p v-if="!loading && !plans.length" class="mt-6">No plans for this product</p>
          <swiper v-if="!loading && plans.length" :options="swiperOptions" ref="el">
            <template v-for="(plan, i) of plans">
              <swiper-slide :key="i">
                <v-card class="d-flex flex-column pb-4 pt-2" outlined :color="['blue', 'teal', 'orange'][i]">
                  <v-card-title class="font-weight-bold d-flex align-center white--text px-8">
                    <h1 style="font-size: 2rem">
                      {{ plan.monthly | currency }}
                    </h1>
                    <span class="ml-2">/mo</span>
                  </v-card-title>
                  <v-card-subtitle class="pt-1 white--text px-8" style="opacity: .8">
                    for {{ plan.duration }} months + {{ plan.upfront | currency }} upfront
                  </v-card-subtitle>
                  <v-divider class="mb-1" style="border-color: rgba(255, 255, 255, .4)"></v-divider>
                  <v-card-text class="white--text px-8 pt-2 pb-2">
                    <v-list dense flat color="transparent">
                      <v-list-item class="px-0 py-1" style="min-height: initial">
                        <v-list-item-icon class="my-0 mr-2 white--text" style="min-width: initial;">
                          <v-icon size="10">mdi-circle-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content class="my-0 pa-0 white--text">
                          <v-list-item-title
                            style="font-size: .9rem!important; white-space: break-spaces; line-height: 1.4"
                          >
                            No free delivery
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item class="px-0 py-1" style="min-height: initial">
                        <v-list-item-icon class="my-0 mr-2 white--text" style="min-width: initial;">
                          <v-icon size="10">mdi-circle-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content class="my-0 pa-0 white--text">
                          <v-list-item-title
                            style="font-size: .9rem!important; white-space: break-spaces; line-height: 1.4"
                          >
                            Early repayment Bonus
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item
                      >
                      <v-list-item class="px-0 py-1" style="min-height: initial">
                        <v-list-item-icon class="my-0 mr-2 white--text" style="min-width: initial;">
                          <v-icon size="10">mdi-circle-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content class="my-0 pa-0 white--text">
                          <v-list-item-title
                            style="font-size: .9rem!important; white-space: break-spaces; line-height: 1.4"
                          >
                            5% late payment penalty
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item
                      >
                    </v-list>
                    <v-btn
                      v-if="plan.items.slice(4, plan.items.length).length"
                      @click="show[i] = !show[i]" text block class="d-flex justify-space-between" rounded color="white"
                    >
                      {{ show[i] ? 'Show less' : 'Show more' }}
                      <v-icon>{{ show[i] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                    </v-btn>
                  </v-card-text>
                  <v-card-actions class="px-8 mt-auto">
                    <v-btn
                      v-if="!inCart || planSelected.id !== plan.id" class="d-flex justify-space-between px-6"
                      @click="handleAddToCart(plan)" color="white" elevation="0" block rounded
                    >
                      Add to cart
                      <v-icon>mdi-arrow-right</v-icon>
                    </v-btn>
                    <v-chip v-else color="white" class="green--text px-4">
                      <v-icon class="mr-2">mdi-check</v-icon>
                      Added to cart
                    </v-chip>
                  </v-card-actions>
                </v-card>
              </swiper-slide>
            </template>
            <swiper-slide>
              <v-card class="d-flex flex-column pb-4 pt-2" outlined color="red">
                <v-card-title class="font-weight-bold d-flex align-center white--text px-8">
                  <h1 style="font-size: 2rem">
                    {{ outright | currency }}
                  </h1>
                </v-card-title>
                <v-card-subtitle class="pt-1 white--text px-8" style="opacity: .8">
                  Outright purchase
                </v-card-subtitle>
                <v-divider class="mb-3" style="border-color: rgba(255, 255, 255, .4)"></v-divider>
                <v-card-actions class="px-8 mt-auto">
                  <v-btn
                    class="d-flex justify-space-between px-6"
                    @click="purchaseOutright()" color="white" elevation="0" block rounded
                  >
                    Add to cart
                    <v-icon>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import item from "@/mixins/item.js";
import { getPlan, nPercentOf, roundToNearestTen } from "@/lib/utils.js";

export default {
  name: "ProductPlans",
  mixins: [item],
  data() {
    return {
      show: { 0: false, 1: false, 2: false, },
      loading: false,
      view: 'plans',
      plans: [],
      swiperOptions: {
        slidesPerView: 1.3,
        spaceBetween: 20,
        breakpoints: {
          640: { slidesPerView: 1.5 },
          700: { slidesPerView: 1.5 },
          900: { slidesPerView: 1.5 }
        }
      }
    }
  },
  created() {
    this.generatePlans();
  },
  methods: {
    async generatePlans() {
      this.plans = [
        getPlan({
          credit: this.credit,
          upfront: this.upfront,
          duration: 2
        }),
        getPlan({
          credit: this.credit,
          upfront: this.upfront,
          duration: 3
        }),
        getPlan({
          credit: roundToNearestTen(nPercentOf(50, +this.item.price)),
          upfront: roundToNearestTen(nPercentOf(50, +this.item.price)),
          duration: 6
        }),
      ];
    },
    handleAddToCart(plan) {
      if (this.$store.getters['cart/outright']) {
        return this.$bus.$emit('toast', {
          message: `Sorry, you're already making an outright purchase, you can no longer buy on credit`,
          color: 'red'
        });
      }
      this.$store.commit('cart/addItem', {
        ...this.item, plan: { ...plan, unit: 1 }
      });
      this.$emit('close');
      this.$bus.$emit('cart');
    },
    purchaseOutright() {
      if (this.$store.getters['cart/repayment'].monthly) {
        return this.$bus.$emit('toast', {
          message: `Sorry, you're already buying on credit, you cannot make an outright purchase`,
          color: 'red'
        });
      }
      this.$store.commit('cart/addItem', {
        ...this.item, plan: { outright: this.outright, unit: 1 }
      });
      this.$emit('close');
      this.$bus.$emit('cart');
    },
  },
  computed: {
    inCart() {
      return this.$store.state.cart.items.some(i => i.id === this.item.id);
    },
    planSelected() {
      return this.$store.state.cart.items.find(i => i.id === this.item.id)?.plan;
    },
  }
}
</script>
