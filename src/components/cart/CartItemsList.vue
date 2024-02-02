<template>
  <div class="mt-3" dense>
    <div v-for="item in $store.state.cart.items" :key="item.id" class="d-flex flex-column border-bottom py-5">
      <div class="item-wrapper">
        <img :src="item.primary_picture" alt="product" class="w-25 rounded-lg border" style="height:80px" />
        <div class="d-flex flex-column">
          <div class="mb-1" style="font-size: 15px;">{{ item.name }}</div>
          <div class="desc">{{ item.description }}</div>
        </div>
      </div>
      <div class="d-flex justify-space-between align-item-center mt-4" style="">
        <button @click="handleRemoveItem(item.id)" class="remove-btn">
          <v-icon style="color: red; font-size: medium;">mdi-delete</v-icon>
          Remove
        </button>
        <div class="qtyBtn-wrapper">
          <button :disabled="disableAction(item)" @click=handleQtyDecrement(item.id) class="qtyBtn">-</button>
          <span>{{ item.qty || 0 }}</span>
          <button @click=handleQtyIncrement(item.id) class="qtyBtn">+</button>
        </div>
      </div>
    </div>
    <!-- <button class="btn btn-primary mt-4 mx-3 mx-sm-5">Checkout</button> -->



    <!-- <v-bottom-sheet inset max-width="500" v-if="$vuetify.breakpoint.smAndDown" v-model="preview">
      <CartListItemContent :item="selected" @close="preview = false" />
    </v-bottom-sheet>

    <v-navigation-drawer fixed right temporary v-else v-model="preview" width="450">
      <CartListItemContent :item="selected" @close="preview = false" />
    </v-navigation-drawer> -->
  </div>
</template>

<script>
// import CartListItemContent from "./CartListItemContent";
// import ProxyImage from "../ProxyImage";

export default {
  name: "CartListItems",
  // components: { ProxyImage, CartListItemContent },
  data() {
    return {
      preview: false,
      selected: null,
      maxtItemIds: [114],
    }
  },
  methods: {
    select(item) {
      this.selected = item;
      this.preview = true;
    },
    handleRemoveItem(id) {
      this.$store.commit('cart/removeCartItem', id);
    },
    handleQtyIncrement(id) {
      this.$store.commit('cart/increaseQuantity', id);
    },
    handleQtyDecrement(id) {
      this.$store.commit('cart/decreaseQuantity', id);
    },
    disableAction(item) {
      if (
        this.maxtItemIds?.includes(+item.categoryM2MId) &&
        +item.qty === 3
      ) {
        return true;
      } else if (
        !this.maxtItemIds?.includes(+item.categoryM2MId) &&
        +item.qty === 1
      ) {
        return true;
      } else {
        return false;
      }
    }

  },
  watch: {
    preview(v) {
      if (!v) this.selected = null
    }
  }
}
</script>

<style scoped>
.remove-btn {
  outline: none;
  border: 1px solid red;
  padding: 3px 5px 3px 5px;
  border-radius: 6px;
  font-size: 13px;
  color: red;
}

.remove-btn:hover {
  background-color: rgb(235, 164, 164);
}

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

.desc {
  color: gray;
  font-size: 15px;
}
</style>

