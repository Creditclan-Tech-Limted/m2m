<template>
  <v-card elevation="0">
    <ItemPicturesCarousel :item="item" />
    <v-card-text class="py-5 px-4 px-md-8" ref="content">
      <div class="d-flex align-center justify-space-between mb-6 pa-4" style="position: absolute; top: 0; right: 0;">
        <v-btn @click="$emit('close')" color="white" small icon style="background: tomato">
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="title text--lighten-2">{{ item.name }}</div>
      <v-divider class="my-4" v-if="item.specM2Ms"></v-divider>
      <div>
        <v-radio-group v-model="row" column v-if="item.specM2Ms">
          <v-radio v-for="option in item.specM2Ms" :key="option.id" :label="option.name" :value="option.id"></v-radio>
        </v-radio-group>
        <v-divider class="" v-if="item.specM2Ms"></v-divider>
        <div class="d-flex mt-6">
          <v-btn @click="addToCart(item)" class="flex-grow-1 rounded-lg" color="primary" elevation="0">
            <v-icon left>mdi-cart</v-icon>
            Add to cart
          </v-btn>
        </div>
      </div>
      <v-card class="px-8 py-6 mb-5 mt-5" outlined>
        <v-subheader class="px-0 text--secondary" style="height: initial" v-if="!item.description">
          No description
        </v-subheader>
        <div v-else>
          <v-subheader class="px-0 text--secondary mb-4" style="height: initial">Description</v-subheader>
          <div class="text-title black--text text--lighten-2 pre-wrap" v-html="item.description">
          </div>
        </div>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import ItemPicturesCarousel from "@/components/item/ItemPicturesCarousel.vue";
import item from "@/mixins/item.js";

export default {
  name: "ProductDetailsOther",
  components: { ItemPicturesCarousel },
  mixins: [item],
  created() {
    if (!`${this.item.id}`.includes('temp')) this.addView();
  },
  data() {
    return {
      row: ''
    }
  },
  methods: {
    requestPrice() {
      this.$store.commit('cart/addItem', {
        ...this.item,
        monthly_amount: 0,
        price: 0,
        credit_price: 0,
        unit: this.quantity
      });
      this.$bus.$emit('cart');
    },
    addToCart(item) {
      this.$store.commit('cart/addItem', { ...item, spec: this.row });
      this.$bus.$emit('cart');
      // this.$emit('close')
    },
    created() {
      this.addView();
    },
  }
}
</script>

<style scoped>
</style>
