<template>
  <v-card elevation="0">
    <ItemPicturesCarousel :item="item"/>
    <v-card-text class="py-5 px-4 px-md-8" ref="content">
      <div class="d-flex align-center justify-space-between mb-6 pa-4" style="position: absolute; top: 0; right: 0;">
        <v-btn @click="$emit('close')" color="white" small icon style="background: tomato">
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="d-flex flex-column align-start fill-width mt-4">
        <div>{{ item.name }}</div>
        <div class="d-flex align-center justify-space-between fill-width">
          <div class="d-flex align-center mr-3">
            <v-rating :value="rating" background-color="orange lighten-3" color="orange" dense readonly size="20"/>
            <span class="text-small ml-2" v-if="item.total_ratings">({{ item.total_ratings }} review(s))</span>
          </div>
          <v-chip color="red" dark x-small>Credit</v-chip>
        </div>
      </div>

      <v-divider class="my-4"></v-divider>

      <div v-if="available">
        <div class="d-flex align-center justify-space-between mt-3">
          <div>
            <div class="title font-weight-bold text--black">
              {{ plan.monthly | currency }} / mo
            </div>
            <div class="text-body-1 mt-1">
              {{ plan.duration }} installment(s)
            </div>
            <div class="text-body-1 font-weight-medium ma-0 mt-1 ml-2">
              + {{ plan.upfront | currency }} upfront
            </div>
          </div>
          <v-btn @click="addLike()" small icon>
            <v-icon color="red" v-if="liked">mdi-heart</v-icon>
            <v-icon v-else>mdi-heart-outline</v-icon>
          </v-btn>
        </div>
        <v-divider class="my-4"></v-divider>
        <div class="d-flex mt-6">
          <v-btn @click="$emit('plans')" class="flex-grow-1 ml-3 rounded-lg" color="primary" elevation="0">
            <v-icon class="mr-2">mdi-animation-outline</v-icon>
            View plans
          </v-btn>
        </div>
      </div>
      <v-chip v-else small class="mb-1">Not available</v-chip>

      <v-container class="mt-4">
        <v-card class="px-8 py-6 mb-5" outlined>
          <v-subheader class="px-0 text--secondary mb-6" style="height: initial" v-if="item.description">
            Description
          </v-subheader>
          <v-subheader class="px-0 text--secondary" style="height: initial" v-if="!item.description">
            No description
          </v-subheader>
          <div class="text-title black--text text--lighten-2 pre-wrap" v-html="item.description"></div>
        </v-card>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import ItemPicturesCarousel from "@/components/item/ItemPicturesCarousel.vue";
import item from "@/mixins/item.js";

export default {
  name: "ProductDetails",
  components: { ItemPicturesCarousel },
  mixins: [item],
  created() {
    if (!`${ this.item.id }`.includes('temp')) this.addView();
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
    created() {
      this.addView();
    },
  }
}
</script>
