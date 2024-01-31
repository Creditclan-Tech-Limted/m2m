<template>
  <v-card class="fill-height lighten-4">
    <v-card-text class="pa-0 fill-height d-flex flex-column">
      <div v-if="view === 'default'">
        <div class="px-8 pt-10 pb-6 white border-bottom">
          <div class="d-flex align-center justify-space-between">
            <div class="text-h5 font-weight-bold black--text mb-2" style="max-width: 300px">
              Which iPhone 14 do you want to buy?
            </div>
            <v-btn @click="$emit('close')" icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <p class="mt-1 black--text">Kindly select one from the list below</p>
        </div>
        <div class="py-2 px-8">
          <v-card
            class="d-flex flex-row align-center mb-3 px-3 py-3 bg-transparent" outlined
            v-for="(item, i) in list" :key="i" @click="view = 'checkout'; selected = item; "
          >
            <div class="position-relative d-flex">
              <v-img :src="item.image" width="80" height="80" class="rounded-lg" cover></v-img>
            </div>
            <div class="flex-grow-1 d-flex flex-column align-start justify-center px-2">
              <div :title="item.title" class="text-title black--text mb-1 fill-width">
                {{ item.title }}
              </div>
              <div class="text-title grey--text text--darken-3">
                {{ item.span | currency }}
              </div>
            </div>
            <v-btn icon text>
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card>
        </div>
      </div>
      <div v-if="view === 'checkout'">
        <div class="px-8 pt-10 pb-6 white border-bottom">
          <div class="d-flex align-center justify-space-between">
            <div class="text-h5 font-weight-bold black--text mb-2" style="max-width: 300px">
              How would you like to proceed?
            </div>
            <v-btn @click="view = 'default' " icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
        <div class="py-4 px-8">
          <v-card class="d-flex flex-row align-center mb-8 px-3 py-4 bg-transparent" outlined>
            <div class="position-relative d-flex">
              <v-img :src="selected.image" width="80" height="80" class="rounded-lg" cover></v-img>
            </div>
            <div class="pr-1 flex-grow-1 d-flex flex-column align-start justify-center">
              <div :title="selected.title" class="text-title black--text mb-1 fill-width">
                {{ selected.title }}
              </div>
              <div class="text-title grey--text text--darken-3">
                {{ selected.span | currency }}
              </div>
            </div>
            <v-btn @click="view = 'default'" text rounded>
              <v-icon class="mr-3" color="grey" size="18">mdi-pencil</v-icon>
              Change
            </v-btn>
          </v-card>
          <v-card outlined class="d-flex flex-column align-stretch overflow-hidden">
            <v-card elevation="0" class="d-flex align-center px-6 py-3" rounded="0">
              <v-icon color="blue" size="28">mdi-cart-arrow-right</v-icon>
              <div class="px-4">Checkout</div>
              <v-btn icon text class="ml-auto" disabled>
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-card>
            <v-divider></v-divider>
            <v-card @click="view = 'swaps'" elevation="0" class="d-flex align-center px-6 py-3" rounded="0">
              <v-icon color="red" size="28">mdi-swap-horizontal-circle</v-icon>
              <div class="px-4">Swap deal</div>
              <v-btn icon text class="ml-auto" disabled>
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-card>
          </v-card>
        </div>
      </div>
      <Swappable v-if="view === 'swaps'" @back="view = 'checkout' "/>
    </v-card-text>
  </v-card>
</template>

<script>
import Swappable from './SwapDevice.vue'

export default {
  name: 'iPhone14Purchase',
  components: { Swappable },
  data() {
    return {
      list: [
        {
          id: 1,
          image: 'https://m-cdn.phonearena.com/images/phones/83636-350/Apple-iPhone-14-Pro-Max.jpg',
          title: 'iPhone 14',
          span: '799'
        },
        {
          id: 2,
          image: 'https://m-cdn.phonearena.com/images/phones/83636-350/Apple-iPhone-14-Pro-Max.jpg',
          title: 'iPhone 14 Plus',
          span: '899'
        },
        {
          id: 3,
          image: 'https://m-cdn.phonearena.com/images/phones/83636-350/Apple-iPhone-14-Pro-Max.jpg',
          title: 'iPhone 14 Pro',
          span: '999'
        },
        {
          id: 4,
          image: 'https://m-cdn.phonearena.com/images/phones/83636-350/Apple-iPhone-14-Pro-Max.jpg',
          title: 'iPhone 14 Pro Max',
          span: '1099'
        },
      ],
      view: 'default',
      selected: null
    }
  }
}
</script>
