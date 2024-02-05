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
      <v-divider class="my-4" v-if="item.variations"></v-divider>
      <div>
        <!-- <v-radio-group v-model="row" column v-if="item.specM2Ms">
          <v-radio v-for="option in item.specM2Ms" :key="option.id" :label="option.name" :value="option.id"></v-radio>
        </v-radio-group> -->

        <div v-for="(options, key) in item.variations" :key="key">
          <span class="text-uppercase" style="font-weight: bold;">{{ key }}</span>
          <v-radio-group v-model="selectedOptions[key]" column v-if="options.length > 0">
            <v-radio class="text-capitalize" v-for="option in options" :key="option.id" :label="option.name"
              :value="option.name"></v-radio>
          </v-radio-group>
        </div>

        <v-divider class="" v-if="item.variations"></v-divider>
        <div class="d-flex justify-space-between mt-6">
          <div class="qtyBtn-wrapper">
            <button :disabled="disableAction(item.categoryM2MId)" @click=handleQtyDecrement() class="qtyBtn">-</button>
            <span>{{ quantity }}</span>
            <button @click=handleQtyIncrement() class="qtyBtn">+</button>
          </div>
          <v-btn :disabled="!validateOptions(item.variations, selectedOptions) || loading" @click="addToCart(item)"
            class="flex-grow- rounded-lg" color="primary" depressed>
            <v-icon left>mdi-cart</v-icon>
            <span v-if="loading">Adding...</span> Add to cart
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
      row: '',
      selectedOptions: {},
      cart: this.$store.state.cart.items,
      maxtItemIds: [114],
      quantity: 1,
      loading: false,
      cc_endpoint: 'https://ccendpoints.herokuapp.com/api/v2/m2m',

    }
  },
  mounted() {
    this.updateQuantity(this.item);
  },
  watch: {
    item: {
      immediate: true, // This will trigger the watch callback immediately after the component is created
      handler(newValue) {
        this.updateQuantity(newValue);
      },
    },
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
    async addToCart(item) {
      try {
        this.loading = true;
        const spec_name = Object.values(this.selectedOptions).join(', ');
        const payload = { product_id: item.id, spec_name }
        const { data } = await this.$http.post(`${this.cc_endpoint}/create/spec`, payload);
        console.log(data.data.id);
        this.loading = false;
        this.$store.commit('cart/addItem', { ...item, quantity: this.quantity, spec: data.data.id });
        this.$bus.$emit('cart');
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
      // this.$emit('close')
    },
    handleQtyIncrement() {
      this.quantity++;
    },
    handleQtyDecrement() {
      this.quantity--;
    },
    updateQuantity(item) {
      const foundItem = this.$store.state.cart.items.find(r => +r.id === +item.id);
      this.quantity = foundItem ? foundItem.qty : [114].includes(+item?.categoryM2MId) ? 3 : 1;
    },
    disableAction(id) {
      if (this.maxtItemIds?.includes(+id) && (+this.quantity === 3)) {
        return true
      }
      else if (!this.maxtItemIds?.includes(+id) && (+this.quantity === 1)) {
        return true
      } else {
        return false
      }
    },
    validateOptions(validations, selectedOptions) {
      for (const key in validations) {
        if (
          Object.prototype.hasOwnProperty.call(validations, key) &&
          (!selectedOptions[key] || selectedOptions[key].length === 0)
        ) {
          return false;
        }
      }

      return true;
    }

  }

}
</script>

<style scoped>
.qtyBtn {
  background-color: dodgerblue;
  padding: 2px 3px 2px 3px;
  border-radius: 6px;
  color: white;
  width: 40px;
  font-weight: bolder;
}

.qtyBtn:disabled {
  background-color: rgb(110, 175, 240);
  cursor: not-allowed;
}

.qtyBtn-wrapper {
  display: flex;
  gap: 20px;
}

.item-wrapper {
  display: flex;
  gap: 10px;
}
</style>
