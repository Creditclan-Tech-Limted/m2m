<template>
  <div>
    <div class="px-8 pt-10 pb-5 white border-bottom">
      <div class="text-h5">Make payment</div>
      <p class="mt-2 mb-0 black--text">
        Kindly transfer exactly <span class="font-weight-bold">{{ data.amount | currency }}</span> in the account
        below
      </p>
    </div>
    <div v-if="data.amount" class="px-8 pb-8 pt-4">
      <v-list class="transparent" :class="{ 'disabled': expired }">
        <v-list-item class="pa-0">
          <v-list-item-content>
            <v-list-item-title class="d-flex justify-space-between align-center">
              <span class="text--secondary">Merchant name</span>
              <span class="font-weight-medium">{{ data.merchant_name }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item class="pa-0">
          <v-list-item-content>
            <v-list-item-title class="d-flex justify-space-between align-center">
              <span class="text--secondary">Bank</span>
              <span class="font-weight-medium">{{ data.bank_name }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item class="pa-0">
          <v-list-item-content>
            <v-list-item-title class="d-flex justify-space-between align-center">
              <span class="text--secondary">Account number</span>
              <span class="font-weight-medium">{{ data.account_number }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item class="pa-0">
          <v-list-item-content>
            <v-list-item-title class="d-flex justify-space-between align-center">
              <div class="text--secondary">Expires in</div>
              <div v-if="!expired" class="font-weight-medium">
                {{ timer.hours }} : {{ timer.minutes }} :{{ timer.seconds }}
              </div>
              <div v-else class="red--text">
                <v-icon class="mr-1" color="red">mdi-alert-circle</v-icon>
                Expired
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div class="mt-10 d-flex align-center">
        <v-btn color="red" outlined rounded @click="$emit('cancel')">Cancel</v-btn>
        <v-btn v-if="!expired" color="primary" elevation="0" rounded @click="$emit('confirm')" class="ml-2">
          Confirm transfer
        </v-btn>
        <v-btn v-else color="primary" elevation="0" rounded @click="$emit('generate')" class="ml-2">
          <v-icon class="mr-2">mdi-refresh</v-icon>
          Get new account
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountDetails",
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    timer: { days: 0, hours: 0, minutes: 0, seconds: 0, },
    expired: false,
  }),
  created() {
    this.startTimer();
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    startTimer() {
      this.countdown();
      this.interval = setInterval(() => this.countdown(), 1000);
    },
    clearTimer() {
      if (this.interval) clearInterval(this.interval);
    },
    countdown() {
      this.expired = false;
      const future = new Date(this.data.expiry_date);
      const now = new Date(Date.now());
      if (future < now) {
        this.timer = { days: "00", hours: "00", minutes: "00", seconds: "00" };
        this.expired = true;
        return this.clearTimer();
      }
      const diff = future - now;
      this.timer.days = Math.floor(diff / (1000 * 60 * 60 * 24));
      this.timer.hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      this.timer.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      this.timer.seconds = Math.floor((diff % (1000 * 60)) / 1000);
    },
  }
}
</script>
