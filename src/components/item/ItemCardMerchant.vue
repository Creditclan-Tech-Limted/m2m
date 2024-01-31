<template>
  <div class="fill-height d-flex flex-column">
    <v-hover v-if="item" v-slot="{ hover }">
      <v-card class="position-relative flex-grow-1 rounded-lg d-flex flex-column mb-2 item-card" light
        style="box-shadow: 0 4px 5px -1px rgba(0, 0, 0, .05); border: 1px solid rgba(0, 0, 0, .08)">
        <div @click="$emit('select')" class="border-bottom position-relative d-block cursor-pointer">
          <div class="slight-overlay position-relative">
            <template v-if="item.secondary_picture">
              <ProxyImage :src="item.secondary_picture"
                v-show="hover && item.secondary_picture && !item.secondary_picture.match(/undefined|null/gi)" />
            </template>
            <ProxyImage :src="item.primary_picture"
              v-show="!hover || !item.secondary_picture || item.secondary_picture.match(/undefined|null/gi)" />
            <!-- <div class="in-cart-indicator ml-4 mt-4">
              <v-chip color="green" class="white--text px-4">
                <v-icon small class="mr-2">mdi-cart-arrow-down</v-icon>
                Added to cart
              </v-chip>
            </div> -->
          </div>
        </div>
        <div style="box-shadow: 0 -8px 7px rgba(0, 0, 0, .09); z-index: 1;"
          class="px-4 py-4 px-md-4 flex-grow-1 d-flex flex-column align-start">
          <div class="d-flex flex-column justify-space-betwee fill-width py-1">
            <div :title="item.name" class="title black--text text-body-2 font-weight-bold ma-0">
              {{ item.name }}
            </div>
            <div class="ma-0 text-sm mt-2" style="font-size: 15px; color: gray;">
              {{ item.description }}
            </div>
          </div>
        </div>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import ProxyImage from "../ProxyImage.vue";
import item from "@/mixins/item.js";

export default {
  name: "ItemCardMerchant",
  components: { ProxyImage },
  mixins: [item],
  methods: {
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
      return this.item?.name && this.item?.name?.substring(0, 2).toUpperCase();
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
