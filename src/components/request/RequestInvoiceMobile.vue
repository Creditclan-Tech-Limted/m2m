<template>
  <div class="position-relative fill-width">
    <div class="pa-5 grey lighten-5 position-relative overflow-hidden">
      <div class="mb-4">
        <div class="text-title font-weight-bold">{{ customer.personal.full_name }}</div>
        <div class="text-small mt-2 blue-grey--text text--darken-1">{{ customer.personal.phone }}</div>
        <div class="text-small mt-1">{{ customer.personal.address }}</div>
      </div>
      <v-divider></v-divider>
      <template v-if="$store.getters['request/totalOutright']">
        <div class="text-title py-2 font-weight-bold">
          {{ $store.getters['request/totalOutright'] | currency }}
        </div>
        <v-divider></v-divider>
        <div class="text-title py-2">
          Outright payment
        </div>
      </template>
      <template v-else>
        <div class="text-title py-2 font-weight-bold">
          {{ $store.getters['request/monthlyAmount'] | currency }} / mo
        </div>
        <v-divider></v-divider>
        <div class="text-title py-2">
          {{ $store.getters['request/noOfMonths'] }} month(s)
        </div>
        <template v-if="$store.getters['request/upfrontAmount']">
          <v-divider></v-divider>
          <div class="text-title py-2 d-flex align-center">
            {{ $store.getters['request/upfrontAmount'] | currency }} upfront
          </div>
        </template>
      </template>
      <RequestStatus @open="$emit('open', $event)"/>
      <v-icon class="bg-cart" size="100">mdi-cart</v-icon>
    </div>

    <v-divider/>

    <div class="pa-5">
      <div class="d-flex justify-space-between align-center">
        <span>Item</span>
        <span v-if="!$store.getters['request/hasOffer']">Amount</span>
      </div>
      <v-divider class="my-3"/>
      <template v-for="item in request.items">
        <div :key="item.id">
          <div class="d-flex justify-space-between text-small">
            <div class="d-flex flex-column">
              <span style="max-width: 250px">{{ item.name }}</span>
            </div>
            <div
              v-if="!$store.getters['request/hasOffer']" class="ml-3 font-weight-bold"
              :class="{ 'text-strikethrough': item.available === -1 }"
            >
              <div v-if="item.plan">
                <template v-if="item.plan.outright">
                  {{ +item.plan.outright | currency }}
                </template>
                <template v-else>
                  {{ roundToNearestTen((+item.plan.total) / $store.getters['request/noOfMonths']) | currency }}/mo
                </template>
              </div>
              <div v-else>
                {{ roundToNearestTen((+item.price) / $store.getters['request/noOfMonths']) | currency }}/mo
              </div>
            </div>
          </div>
          <div class="d-flex align-center mt-1">
            <span class="mr-2">x 1</span>
            <v-chip v-if="item.available === 0" x-small color="orange" outlined>Pending</v-chip>
            <v-chip v-if="item.available === -1" x-small color="red" outlined>Not available</v-chip>
            <v-chip v-if="item.available === 1" x-small color="green" outlined>Confirmed</v-chip>
            <div v-if="item.plan.upfront" class="text-smaller font-weight-regular ml-auto">
              + {{ item.plan.upfront | currency }} upfront
            </div>
          </div>
          <v-divider class="my-3"/>
        </div>
      </template>
      <div v-if="!$store.getters['request/hasOffer']" class="d-flex justify-space-between text-small">
        <div>Total</div>
        <div v-if="$store.getters['request/totalOutright']" class="ml-3 font-weight-bold">
          {{ $store.getters['request/totalOutright'] | currency }}
        </div>
        <div v-else class="ml-3 font-weight-bold text-right">
          {{ $store.getters['request/monthlyAmount'] | currency }}/mo
          <div v-if="$store.getters['request/totalUpfront']" class="text-smaller font-weight-regular">
            + {{ $store.getters['request/totalUpfront'] | currency }} upfront
          </div>
        </div>
      </div>
    </div>

    <br><br><br>
    <br><br><br>

    <v-btn
      @click="views.menu = true" bottom class="mb-16" color="primary" elevation="1" fab fixed right
      style="transform: translateY(-10px) translateX(-15px)" v-if="$vuetify.breakpoint.smAndDown && !paid"
    >
      <v-icon>mdi-dots-horizontal</v-icon>
    </v-btn>

    <v-bottom-sheet inset max-width="500" right v-model="views.menu">
      <v-sheet class="px-4 py-8">
        <v-row>
          <v-col
            v-if="!$store.getters['request/analysisDone'] && onCredit"
            @click="$emit('open', 'schedule')" class="text-center py-8 cursor-pointer" cols="6"
          >
            <v-icon color="blue">mdi-book</v-icon>
            <div class="text-small mt-1">Schedule</div>
          </v-col>
          <v-col class="text-center py-8 cursor-not-allowed disabled" cols="6">
            <v-icon color="orange">mdi-comment</v-icon>
            <div class="text-small mt-1">Make comment</div>
          </v-col>
          <v-col
            v-if="!$store.getters['request/analysisDone'] && !$store.getters['request/totalOutright']"
            @click="$emit('open', 'eligibility')" class="text-center py-8 cursor-pointer" cols="6"
          >
            <v-icon color="teal">mdi-account-search</v-icon>
            <div class="text-small mt-1">Fund me</div>
          </v-col>
          <v-col
            v-if="!paid && status < 2"
            @click="views.cancel = true" class="text-center py-8 cursor-pointer" cols="6"
          >
            <v-icon color="red">mdi-close</v-icon>
            <div class="text-small mt-1">Cancel request</div>
          </v-col>
        </v-row>
      </v-sheet>
    </v-bottom-sheet>

    <v-dialog max-width="350" persistent v-model="views.cancel">
      <v-card>
        <v-card-title>Are you sure?</v-card-title>
        <v-card-text>
          This action is irreversible and the link to this request will no longer work.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="views.cancel = false" color="green darken-1" text>No</v-btn>
          <v-btn @click="cancel()" color="red darken-1" text>Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import RequestStatus from "./RequestStatus";
import { roundToNearestTen } from "@/lib/utils.js";

export default {
  name: "RequestInvoiceMobile",
  components: { RequestStatus },
  data() {
    return {
      customer: this.$store.state.customer,
      request: this.$store.state.request,
      views: {
        menu: false,
        cancel: false
      },
      roundToNearestTen
    }
  },
  methods: {
    async cancel() {
      this.views.cancel = false;
      await this.$store.dispatch('request/cancel');
      await this.$router.replace(`/`);
      this.$store.commit('request/clear');
      localStorage.removeItem('request');
    }
  },
  computed: {
    status() {
      return this.$store.getters['request/status'];
    },
    paid() {
      return this.$store.getters['request/paid'];
    },
    onCredit() {
      return !this.$store.getters['request/totalOutright'];
    },
  }
}
</script>

<style lang="scss">
.bg-cart {
  position: absolute !important;
  bottom: -30px;
  left: calc(100% - 60px);
  transform: rotate(5deg);
  opacity: .1;
}
</style>
