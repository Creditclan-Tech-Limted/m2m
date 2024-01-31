<template>
  <div v-if="$vuetify.breakpoint.mdAndUp">
    <v-app-bar color="transparent" height="80" absolute elevation="0">
      <div class="container" style="max-width: 1000px;">
        <v-row>
          <v-col cols="12" md="12" class="d-flex align-center position-relative">
            <router-link to="/">
              <img src="/img/logos/clan.png" alt="cc logo" style="width: 60px" />
            </router-link>
            <v-spacer></v-spacer>
            <div class="white rounded-xl" style="max-width: 260px;">
              <v-text-field v-model="query" @click:append="$emit('search', query)" @input="$emit('watch', query)"
                @keyup.enter="$emit('search', query)" :hide-details="'auto'" append-icon="mdi-magnify"
                placeholder="Search.." dense filled rounded></v-text-field>
            </div>
            <v-spacer></v-spacer>
            <v-btn @click="$store.dispatch('cart/show')" color="black" icon>
              <v-badge :content="`${$store.state.cart.items.length}`" color="red" overlap>
                <v-icon>mdi-cart-outline</v-icon>
              </v-badge>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-app-bar>
    <div style="height: 60px"></div>
  </div>
  <v-card v-else class="py-6 position-relative overflow-hidden px-0" rounded="0" outlined>
    <div class="container pa-5 pa-md-6 text-left overflow-hidden">
      <div class="banner-title text-h2 black--text font-weight-bold pr-5 d-flex align-center">
        {{ count }}
        <div class="body-1 black--text ml-3">Items</div>
      </div>
    </div>
    <div class="absolute right top" style="transform: translate(40%, 10px); opacity: .7">
      <img src="/img/instagram-phone-half.png" alt="ig phone" />
    </div>
  </v-card>
</template>

<script>
export default {
  name: "Navbar",
  props: {
    initialValue: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
  },
  mounted() {
    console.log('oooooo', this.initialValue);
  },
  created() {
    this.query = this.initialValue;
  },
  data() {
    return {
      query: ''
    }
  },
  watch: {
    initialValue(v) {
      this.query = v;
    }
  }
}
</script>
