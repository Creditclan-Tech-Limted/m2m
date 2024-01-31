<template>
  <div>
    <template v-if="!totalOutright">
      <div class="mt-4 mb-2" v-if="status < 3">
        <template v-if="!analysisDone">
          <v-btn @click="$emit('open', 'eligibility')" color="primary" outlined>
            <span v-if="!stage">Get funded</span>
            <span v-else-if="stage === 'offers'">View offers</span>
            <span v-else-if="stage === 'offer-selected'">Pay upfront</span>
            <span v-else-if="stage === 'card'">Add repayment card</span>
            <span v-else>Continue funding</span>
          </v-btn>
        </template>
        <div class="text-small d-flex align-center" v-else>
          <v-icon color="orange" size="20">mdi-circle-medium</v-icon>
          <span class="ml-2">Request under review</span>1
        </div>
      </div>
      <template v-else>
        <template v-if="nextPayment.amount">
          <div class="text-small d-flex align-center mt-4 mb-2">
            <v-icon color="blue" style="width:10px">mdi-circle-medium</v-icon>
            <div class="ml-2">
              Your next payment is {{ nextPayment.amount | currency }} <span
              v-if="nextPayment.date">{{ nextPayment.date | timeago }}</span>
            </div>
          </div>
        </template>
        <div class="text-small d-flex align-center mt-4 mb-2" v-else>
          <v-icon color="green" style="width:10px">mdi-circle-medium</v-icon>
          <span class="ml-2">Payment is complete, you will be notified soon</span>
        </div>
      </template>
    </template>
    <div class="mt-4" v-else>
      <v-btn v-if="!paid" @click="$emit('open', 'payment')" color="primary" outlined rounded>
        Make payment
      </v-btn>
      <v-chip v-else color="green" dark>
        <v-icon class="mr-2" size="20">mdi-check</v-icon> Paid
      </v-chip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RequestStatus',
  data() {
    return {
      customer: this.$store.state.customer,
      request: this.$store.state.request,
    }
  },
  computed: {
    paid() {
      return this.$store.getters["request/paid"]
    },
    status() {
      return this.$store.getters["request/status"]
    },
    stage() {
      return this.$store.getters["request/stage"]
    },
    nextPayment() {
      return this.$store.getters["request/nextPayment"]
    },
    emailVerified() {
      return this.$store.getters["request/emailVerified"]
    },
    analysisDone() {
      return this.$store.getters["request/analysisDone"]
    },
    totalOutright() {
      return this.$store.getters['request/totalOutright']
    },
  }
}
</script>
