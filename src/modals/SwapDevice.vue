<template>
  <div>
    <div class="fill-height lighten-4" v-if="view === 'swap' ">
      <div class="px-8 pt-10 pb-6 white border-bottom">
        <div class="d-flex align-center justify-space-between">
          <div class="text-h5 font-weight-bold black--text mb-2" style="max-width: 300px">
            Swap your phone
          </div>
          <v-btn @click="$emit('back')" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <p class="mt-1 black--text">Kindly select your current device from the list below</p>
      </div>
      <div class="py-4 px-8">
        <v-select v-model="values.keywords" :items="list" outlined label="Select iphone you want to swap with"
          return-object hide-details @change="selectItem($event)" rounded>
        </v-select>

        <v-card class="fill-height lighten-4 mt-10" outlined v-if="selected.loading">
          <div class="d-flex px-6 py-3">
            Swappable product worth
            <div class="ms-auto font-weight-bold">{{ +selected.details.product | currency }}</div>
          </div>
          <v-divider />
          <div class="d-flex px-6 py-3">
            Product price
            <div class="ms-auto font-weight-bold"> {{ product_price | currency }}</div>
          </div>
          <v-divider />
          <div class="d-flex px-6 py-3">
            Upfront amount
            <div class="ms-auto font-weight-bold">{{ selected.details.upfront | currency }}</div>
          </div>
          <v-divider />
          <div class="d-flex px-6 py-3">
            Total credit
            <div class="ms-auto font-weight-bold"> {{ selected.details.total_credit | currency }}</div>
          </div>
        </v-card>
        <v-btn class="mt-10" elevation="0" rounded large color="primary" :disabled="!selected_item"
          @click="view = 'checkout' ">Continue</v-btn>
      </div>
    </div>
    <IPone14Checkout v-if="view === 'checkout'" @back="view = 'swap'"/> 
  </div>
</template>

<script>
import IPone14Checkout from './iPone14Checkout.vue';
export default {
  name: "SwapDevice",
  data() {
    return {
      list: [
        {
          id: 1,
          image: "https://m-cdn.phonearena.com/images/phones/83636-350/Apple-iPhone-14-Pro-Max.jpg",
          text: "iPhone 11",
          span: "799"
        },
        {
          id: 2,
          image: "https://m-cdn.phonearena.com/images/phones/83636-350/Apple-iPhone-14-Pro-Max.jpg",
          text: "iPhone 11 Pro",
          span: "899"
        },
        {
          id: 3,
          image: "https://m-cdn.phonearena.com/images/phones/83636-350/Apple-iPhone-14-Pro-Max.jpg",
          text: "iPhone 11 Pro Max",
          span: "999"
        },
        {
          id: 4,
          image: "https://m-cdn.phonearena.com/images/phones/83636-350/Apple-iPhone-14-Pro-Max.jpg",
          text: "iPhone SE",
          span: "1099"
        },
        {
          id: 5,
          image: "https://m-cdn.phonearena.com/images/phones/83636-350/Apple-iPhone-14-Pro-Max.jpg",
          text: "iPhone 12 mini",
          span: "799"
        },
        {
          id: 6,
          image: "https://m-cdn.phonearena.com/images/phones/83636-350/Apple-iPhone-14-Pro-Max.jpg",
          text: "iPhone 12",
          span: "899"
        },
        {
          id: 7,
          image: "https://m-cdn.phonearena.com/images/phones/83636-350/Apple-iPhone-14-Pro-Max.jpg",
          text: "iPhone 12 Pro",
          span: "999"
        },
        {
          id: 8,
          image: "https://m-cdn.phonearena.com/images/phones/83636-350/Apple-iPhone-14-Pro-Max.jpg",
          text: "iPhone 12 Pro Max",
          span: "1099"
        },
        {
          id: 9,
          image: "https://m-cdn.phonearena.com/images/phones/83636-350/Apple-iPhone-14-Pro-Max.jpg",
          text: "iPhone 13 Mini",
          span: "799"
        },
        {
          id: 6,
          image: "https://m-cdn.phonearena.com/images/phones/83636-350/Apple-iPhone-14-Pro-Max.jpg",
          text: "iPhone 13",
          span: "899"
        },
        {
          id: 7,
          image: "https://m-cdn.phonearena.com/images/phones/83636-350/Apple-iPhone-14-Pro-Max.jpg",
          text: "iPhone 13 Pro",
          span: "999"
        },
        {
          id: 8,
          image: "https://m-cdn.phonearena.com/images/phones/83636-350/Apple-iPhone-14-Pro-Max.jpg",
          text: "iPhone 13 Pro Max",
          span: "1099"
        },
      ],
      loading: false,
      view: "swap",
      selected_item: "",
      values: {
        keywords: ""
      },
      selected: {
        loading: "",
        details: {}
      },
      product_price: 1400000
    };
  },
  methods: {
    selectItem(event) {
      this.selected.loading = event;
      this.selected_item = event
      this.selected.details["product"] = event.span;
      this.selected.details["upfront"] = this.product_price / 10;
      this.selected.details["total_credit"] = this.product_price - (+this.selected.details["upfront"]);
    }
  },
  components: { IPone14Checkout }
}
</script>

<style lang="scss" scoped>
.product {
  width: 100%;
}

.product-image {
  width: 100%;
  height: 100%;
  // overflow: hidden;
  cursor: zoom-in;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
