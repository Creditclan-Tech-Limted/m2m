export default {
  data() {
    return {
      tab: 0,
      request: this.$store.state.request,
      views: {
        analysis: false,
        more: false,
        schedule: false,
        payment: false,
        customer: false,
        repayment: false,
        eligibility: false,
        email: false,
        data: false,
      }
    }
  },
  metaInfo() {
    return {
      title: 'Order details',
    }
  },
  created() {
    this.check();
  },
  methods: {
    check() {
      if (this.status > 2) return;
      if (!this.onCredit) {
        if (!this.paid) this.showView('payment');
      } else {
        if (!this.analysisDone) this.showView('eligibility');
      }
    },
    reset() {
      this.closeViews();
      this.check();
    },
    async handlePaymentDone(payment_ref) {
      this.closeViews();
      try {
        const { global_request_id } = this.$store.state.request;
        const res = await this.$http.post(`/global/${ global_request_id }/confirm/payment`, { payment_ref });
        if (!res.data.status) {
          return this.$bus.$emit('toast', { message: res.data.message });
        }
        await this.$store.dispatch('request/load', this.$store.state.request.global_request_id);
      } catch (e) {
        return this.$bus.$emit('toast', { message: e.response.data?.message || e?.message });
      }
    },
  },
  computed: {
    analysisDone() {
      return this.$store.getters["request/analysisDone"]
    },
    status() {
      return this.$store.getters['request/status']
    },
    emailVerified() {
      return this.$store.getters["request/emailVerified"]
    },
    paid() {
      return this.$store.getters["request/paid"]
    },
    onCredit() {
      return !this.$store.getters["request/totalOutright"]
    },
  }
}
