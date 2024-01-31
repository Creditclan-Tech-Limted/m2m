<template>
  <div elevation="0" v-if="cart.items.length" class="px-6" style="background-color: white;">
    <div class="py-10">
      <CartListItems @close="$emit('close')" />
      <div class="d-flex justify-space-between mt-6" style="background-color: ble;">
        <v-btn @click="$emit('close')" class="s
        flex-grow-1 flex-shrink-0 rounded-md" elevation="0" text type="primary" outlined>
          <v-icon left>mdi-arrow-left</v-icon>
          Continue shopping
        </v-btn>
        <v-btn @click="navidateToCart" class="d-flex flex-grow-1 ml-3 flex-shrink-0 rounded-md" color="primary"
          elevation="0">
          Checkout
        </v-btn>
      </div>
    </div>
  </div>
  <v-sheet class="d-d-flex flex-column justify-center align-center text-center pt-12" v-else>
    <v-icon color="grey lighten-2" size="150">mdi-cart-outline</v-icon>
    <div class="title mt-10 font-weight-medium blue-grey--text">Cart is empty</div>
    <p class="mt-5 text-center">
      <span>
        Go back to the catalogue and add
        items to your
        cart
      </span>
    </p>
    <br><br>
  </v-sheet>
</template>
<script>
import CartListItems from "./CartItemsList";
import { setCookie } from "../../lib/utils"

export default {
  name: 'CartContent',
  components: { CartListItems },
  data() {
    return {
      scheduleVisible: false,
      backendDomain: 'http://localhost:4200/shop?cart=open'
    };
  },
  computed: {
    cart() {
      return this.$store.state.cart
    },
    repayment() {
      return this.$store.getters["cart/repayment"]
    },
    outright() {
      return this.$store.getters["cart/outright"]
    },
    upfront() {
      return this.$store.getters["cart/upfront"]
    },
  },
  methods: {
    filterArray(arr) {
      return arr.map(item => {
        return {
          product_id: item.id,
          quantity: item.qty,
          spec_id: item.spec
        }
      });
    },


    serializeQueryParams(params) {
      return Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
    },
    navidateToCart() {
      const payload = JSON.stringify(this.filterArray(this.cart.items));
      setCookie('ccShopCart', payload);
      window.location.href = this.backendDomain;
      // eknkjenkeme

      // const queryParams = { queryParam: 'cart' };
      // const destinationUrl = `${this.backendDomain}/shop?${this.serializeQueryParams(queryParams)}`;
      // window.location.href = destinationUrl;
    }
  }

}
</script>

<style lang="scss" scoped>
::v-deep .v-list-group>.v-list-item {
  padding: 0;
}

::v-deep .v-image__image {
  border-radius: 4px;
}
</style>
