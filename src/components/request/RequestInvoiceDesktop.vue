<template>
  <div class="position-relative fill-width">
    <div class="pa-8 position-relative overflow-hidden d-flex">
      <div>
        <div class="text-title font-weight-bold">{{ customer.personal.full_name }}</div>
        <div class="text-small mt-2 blue-grey--text text--darken-1">{{ customer.personal.phone }}</div>
        <div class="text-small mt-1">{{ customer.personal.address }}</div>
      </div>
      <div class="ml-auto text-right">
        <div class="text-title font-weight-bold">Invoice</div>
        <div class="text-title font-weight-bold mt-1 grey--text text--darken-1">
          <div v-if="$store.getters['request/totalOutright']">
            {{ $store.getters['request/totalOutright'] | currency }}
          </div>
          <div v-else>
            {{ $store.getters['request/monthlyAmount'] | currency }} / mo
          </div>
        </div>
      </div>

      <v-icon class="bg-cart" size="100">mdi-cart</v-icon>
    </div>

    <p class="py-8 px-6" v-if="!request.items.length">
      <v-icon class="mr-2" size="18">mdi-alert-circle-outline</v-icon>
      Items will be added by merchant
    </p>
    <div class="px-5 pb-10" v-else>
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">S/N</th>
            <th class="text-left">Product</th>
            <th class="text-left">Qty</th>
            <th v-if="!$store.getters['request/hasOffer']" class="text-right">Total</th>
            <th>Status</th>
          </tr>
          </thead>
          <tbody>
          <tr :key="item.id + i" v-for="(item, i) in request.items">
            <td>{{ i + 1 }}</td>
            <td>
              <div style="max-width: 300px">{{ item.name }}</div>
            </td>
            <td>{{ 1 }}</td>
            <td
              v-if="!$store.getters['request/hasOffer']" class="text-right"
              :class="{ 'text-strikethrough': item.available === -1 }"
            >
              <div v-if="item.plan">
                <div v-if="item.plan.outright">
                  {{ item.plan.outright | currency }}
                </div>
                <div v-else>
                  {{ roundToNearestTen((+item.plan.total) / $store.getters['request/noOfMonths']) | currency }}/mo
                  <div v-if="item.plan.upfront" class="text-smaller">+ {{ item.plan.upfront | currency }} upfront</div>
                </div>
              </div>
              <div v-else>
                {{ roundToNearestTen((+item.price) / $store.getters['request/noOfMonths']) | currency }}/mo
              </div>
            </td>
            <td>
              <v-chip v-if="item.available === 0" x-small color="orange" outlined>Pending</v-chip>
              <v-chip v-if="item.available === -1" x-small color="red" outlined>Not available</v-chip>
              <v-chip v-if="item.available === 1" x-small color="green" outlined>Confirmed</v-chip>
            </td>
          </tr>
          <tr v-if="!$store.getters['request/hasOffer']">
            <td></td>
            <td></td>
            <td>Total</td>
            <td class="text-right">
              <div v-if="$store.getters['request/totalOutright']">
                {{ $store.getters['request/totalOutright'] | currency }}
              </div>
              <div v-else>
                {{ $store.getters['request/monthlyAmount'] | currency }}/mo
                <div v-if="$store.getters['request/totalUpfront']" class="text-smaller">
                  + {{ $store.getters['request/totalUpfront'] | currency }} upfront
                </div>
              </div>
            </td>
            <td></td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>

    <div v-if="!$store.getters['request/totalOutright']">
      <template v-if="!$store.getters['request/hasOffer']">
        <v-divider style="border-color: rgba(206,25,25,0.2)"/>
        <div class="red lighten-5 py-1 text-small text-center red--text">Estimated offer</div>
        <v-divider style="border-color: rgba(206,25,25,0.2)"/>
      </template>
      <div class="text-center d-flex flex-column" style="background: #fefefe">
        <v-divider v-if="request.offer"/>
        <v-row class="py-8">
          <v-col v-if="$store.getters['request/upfrontAmount']">
            <div class="text-title font-weight-bold">
              {{ $store.getters['request/upfrontAmount'] | currency }}
            </div>
            <small class="mt-1">Upfront</small>
          </v-col>
          <v-col>
            <div class="text-title font-weight-bold">
              {{ $store.getters['request/monthlyAmount'] | currency }}
            </div>
            <small class="mt-1">Monthly amount</small>
          </v-col>
          <v-col>
            <div class="text-title font-weight-bold">
              {{ $store.getters['request/noOfMonths'] }} month(s)
            </div>
            <small class="mt-1">Duration</small>
          </v-col>
        </v-row>
      </div>
    </div>
    <v-divider/>
  </div>
</template>

<script>
import { roundToNearestTen } from "@/lib/utils.js";

export default {
  name: "RequestInvoiceDesktop",
  data() {
    return {
      request: this.$store.state.request,
      customer: this.$store.state.customer,
      roundToNearestTen
    }
  },
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
