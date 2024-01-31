<template>
  <paystack
    :amount="convertedAmount"
    :callback="callback"
    :close="close"
    :email="email"
    :embed="false"
    :paystackkey="paystackkey"
    :reference="reference"
  >
    <slot></slot>
  </paystack>
</template>

<script type="text/javascript">
import paystack from 'vue-paystack';

export default {
  name: 'Paystack',
  props: {
    email: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  components: {
    paystack
  },
  data() {
    return {
      paystackkey: "pk_test_4a6da03d5f0d03ea64044daacc9dc1967b762b0e",
    }
  },
  computed: {
    reference() {
      let text = "";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
    },
    convertedAmount() {
      return +this.amount * 100;
    }
  },
  methods: {
    callback: function (response) {
      this.$emit('done', response);
    },
    close: function () {
      console.log("Payment closed")
    }
  }
}
</script>
