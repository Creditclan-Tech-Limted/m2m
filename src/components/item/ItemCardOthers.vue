<template>
  <div class="fill-height d-flex flex-column">
    <v-card class="position-relative flex-grow-1 rounded-lg d-flex flex-column mb-2 item-card" light
      style="box-shadow: 0 4px 5px -1px rgba(0, 0, 0, .05); border: 1px solid rgba(0, 0, 0, .08)">
      <div class="fill-width py-2 px-3">
        <div class="px-2 text-left d-flex justify-start align-center text-capitalize">
          <v-avatar size="30" class="d-flex align-center justify-center my-2 mr-2 text-body-2" color="blue lighten-4">
            {{ initials }}
          </v-avatar>
          <div class="d-flex flex-column">
            <div class="text-small font-weight-bold text-truncate"
              style="letter-spacing: 0; line-height: 1; max-width: 180px">
              {{ item.source }}
            </div>
            <span class="text-small mt-1" style="letter-spacing: 0; line-height: 1">100+ products</span>
          </div>
        </div>
      </div>
      <div @click="$emit('select')" class="border-bottom position-relative d-block cursor-pointer">
        <div class="slight-overlay position-relative">
          <ProxyImage :src="item.images[0]" />
          <div v-if="$store.getters['cart/inCart'](item)" class="in-cart-indicator ml-4 mt-4">
            <v-chip color="green" class="white--text px-4">
              <v-icon small class="mr-2">mdi-cart-arrow-down</v-icon>
              Added to cart
            </v-chip>
          </div>
        </div>
      </div>
      <div style="box-shadow: 0 -8px 7px rgba(0, 0, 0, .09); z-index: 1;"
        class="px-4 py-4 px-md-4 flex-grow-1 d-flex flex-column align-start">
        <div v-if="available">
          <div class="text-small black--text font-weight-bold ma-0">
            {{ plan.monthly | currency }}/mo • {{ plan.duration }} month(s)
          </div>
          <div class="text-small black--text font-weight-bold ma-0 mt-1">
            + {{ plan.upfront | currency }} upfront
          </div>
        </div>
        <v-chip v-else small class="mb-1">Not available</v-chip>
        <div :title="item.name" class="black--text text-body-2 fill-width mt-1 overflow-hidden" style="height: 40px">
          {{ item.name }}
        </div>
        <div v-if="available" class="border-top mt-2 pt-4 fill-width">
          <div class="d-flex align-center fill-width">
            <v-btn @click="$emit('plans')" class="flex-grow-1" color="primary" elevation="0" outlined rounded>
              <v-icon class="mr-2" size="20">mdi-animation-outline</v-icon>
              View plans
            </v-btn>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import ProxyImage from "../ProxyImage.vue";
import item from "@/mixins/item.js";

export default {
  name: "ItemCardOthers",
  components: { ProxyImage },
  mixins: [item],
  methods: {
    addToCart() {
      this.$store.commit('cart/addItem', { ...this.item, unit: this.quantity });
      this.$bus.$emit('cart');
    },
    requestPrice() {
      this.$store.commit('cart/addItem', {
        ...this.item,
        monthly_amount: 0,
        price: 0,
        credit_price: 0,
        unit: this.quantity,
        plan: {
          percent: 0,
          percent_net: 0,
          total: 0,
          gross_net: 0,
          monthly: 0,
          monthly_net: 0,
          duration: 6,
          items: [],
        }
      });
      this.$bus.$emit('cart');
    }
  },
  computed: {
    initials() {
      return this.item.source?.substring(0, 2)?.toUpperCase();
    }
  }
}
</script>

<style lang="scss" scoped>
.offscreen {
  position: absolute;
  top: 0;
  right: -100px;
  transition: all .15s ease-in-out;
  z-index: 1;

  &.visible {
    right: 0
  }
}

.merchant-btn {
  width: 100%;
  transition: all .15s ease-in-out;
  border-radius: 999px;

  &:hover {
    padding: 6px 8px;
    background: #eee;
  }
}


::v-deep {
  .offscreen {
    position: absolute;
    top: 0;
    right: -100px;
    transition: all .15s ease-in-out;
    z-index: 1;

    &.visible {
      right: 0
    }
  }
}
</style>
