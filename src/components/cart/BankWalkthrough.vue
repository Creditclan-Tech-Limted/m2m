<template>
  <v-card elevation="0">
    <v-card-text class="py-16 px-6 px-md-10 text-center">
      <div v-if="loading" class="pa-10">
        <br><br><br>
        <v-progress-circular color="primary" indeterminate size="25"></v-progress-circular>
        <div class="mx-auto mt-10 text-h6" style="max-width: 300px">
          Fetching banks
        </div>
        <br><br><br>
      </div>
      <div v-else class="pa-10 border rounded-lg">
        <div class="d-block mx-auto mt-5 mb-5">
          <img alt="Modern life illustration" src="@/assets/images/clan.png" style="width: 120px;"/>
        </div>
        <div class="mt-10 text-center">
          <p class="black--text mt-4 mb-0">
            Congratulations, Clan has partnered financial institutions to fund your request.
            Kindly provide required information to proceed
          </p>
        </div>
        <v-btn class="mt-12" color="primary" outlined @click="$emit('start')">Checkout</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'BankWalkthrough',
  props: {
    lender: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  created() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
}
</script>
