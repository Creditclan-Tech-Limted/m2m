<template>
  <v-card class="pa-0" elevation="0">
    <v-card-text class="px-6 py-6">
      <div class="py-16 text-center">
        <br><br><br>
        <v-progress-circular color="primary" indeterminate size="25"></v-progress-circular>
        <div class="mx-auto mt-10 text-h6" style="max-width: 300px">
          {{ loading || 'Please wait..' }}
        </div>
        <br><br><br>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
const CcEligibilityWidget = window['CcEligibilityWidget'];

export default {
  name: "EligibilityWidget",
  data() {
    return {
      loading: '',
      widget: null,
    }
  },
  created() {
    this.launch();
  },
  beforeDestroy() {
    if (this.widget) this.widget.close();
  },
  methods: {
    async launch() {
      const { customer, request } = this.$store.state;
      const plans = this.$store.state.request.items.map(i => i.plan).filter(i => !!i);
      const amount = this.$store.state.request.items.map(item => +item.price).reduce((acc, p) => acc + p, 0);
      this.loading = `Connecting with banks..`;
      this.widget = CcEligibilityWidget.init({
        data: {
          request: {
            amount,
            tenor: request.no_of_months,
          },
          profile: {
            full_name: customer.personal.full_name,
            email: customer.personal.email,
            phone: customer.personal.phone,
            date_of_birth: customer.personal.date_of_birth,
            profile_image: '',
          },
          home_address: {
            address: customer.personal.address,
            state_id: customer.personal.state,
            lga_id: customer.personal.lga
          },
          stage: request.stage,
          request_id: request.creditclan_request_id,
          lender: request.lender || null,
          config: {
            no_frequently_called_numbers: 1,
            analyze_bank_statement: true,
            tokenize_card: true,
            show_offers: true,
            show_bank_account: true,
            show_work_information: true,
            platform: 'shop-global',
            show_signature: true,
            show_address: true,
            show_nok: true,
            show_income: true,
            show_profile: true,
            bs_name_match: true,
            account_name_match: true,
            bvn_name_match: true,
            needs_review: true,
            show_multiple_accounts: true,
          },
          extra: {
            global_request_id: this.$store.state.request.global_request_id
          },
          email_verified: request.email_verified,
          plans: plans.length ? plans : null,
        },
        onReady: () => {
          this.loading = '';
        },
        onClose: () => {
          this.handleWidgetClose();
        },
        onCancel: () => {
          this.handleWidgetClose();
        },
        onCompleted: () => {
          this.handleWidgetClose();
        }
      });
      this.widget.open();
    },
    handleWidgetClose() {
      this.widget.close();
      this.$emit('cancel');
      this.$store.dispatch('request/load', this.$store.state.request.global_request_id);
    },
  }
}
</script>
