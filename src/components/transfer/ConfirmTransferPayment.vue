<template>
  <v-sheet class="d-flex flex-column align-center justify-center text-center py-16">
    <br><br><br>
    <div class="d-flex align-center">
      <v-progress-circular color="primary" indeterminate size="24" class="mr-3"></v-progress-circular>
      <SecondsCountdown/>
    </div>
    <div class="mx-auto mt-6 black--text">Confirming your transfer</div>
    <p class="mt-1">
      Any issue? cancel confirmation
      <span @click="$emit('close')" class="blue--text mt-1 cursor-pointer">here</span>
    </p>
    <br><br><br>
  </v-sheet>
</template>

<script>
import SecondsCountdown from "@/components/SecondsCountdown.vue";

export default {
  name: "ConfirmTransferPayment",
  components: { SecondsCountdown },
  props: {
    transaction_reference: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    retries: 10,
    interval: null
  }),
  async created() {
    this.interval = setInterval(async () => {
      await this.confirm();
      if (this.retries > 0) this.retries -= 1;
      if (this.retries === 0) {
        clearInterval(this.interval);
        return this.$emit("close");
      }
    }, 5000);
  },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval);
  },
  methods: {
    async confirm() {
      try {
        const { data } = await this.$http.post("https://wema.creditclan.com/api/v3/wema/verify_transaction", {
          transaction_reference: this.transaction_reference,
        });
        if (!data.status) {
          if (this.retries === 1) {
            this.$bus.$emit("toast", { message: data.status_desc, color: "red" });
          }
        } else {
          this.retries = 0;
          this.$emit('done');
        }
      } catch (e) {
        this.$bus.$emit("toast", {
          message: `Unable to confirm transfer, ensure you've made the transfer and try again`,
          color: "red",
        });
      }
    },
  }
}
</script>
