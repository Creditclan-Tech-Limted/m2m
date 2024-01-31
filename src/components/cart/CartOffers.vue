<template>
  <v-card elevation="0">
    <v-card-text class="py-10 px-6 px-md-10">
      <p class="mb-10 text-left text-title">Select a payment plan below</p>
      <ItemPlans :plans="plans" :show-title="false" @select="$emit('done')"/>
    </v-card-text>
  </v-card>
</template>

<script>
import { formatCurrency, roundToNearestHundred } from "@/lib/utils";
import ItemPlans from "@/components/item/ItemPlans";

export default {
  name: "CartOffers",
  components: { ItemPlans },
  data() {
    return {
      plans: []
    }
  },
  created() {
    const { total: total_repayment, months: no_of_months, monthly } = this.$store.getters['cart/repayment'];
    const upfront = this.$store.getters['cart/payableAmount'];
    this.plans = this.generatePaymentPlans({
      total_repayment, upfront, no_of_months, monthly_repayment: monthly
    });
    if (!this.plans.length) this.$emit('done');
  },
  methods: {
    generatePaymentPlans({ no_of_months, upfront, total_repayment, monthly_repayment }) {
      let plans = [];
      if (!total_repayment) return [];
      const price = total_repayment + upfront;
      plans.push({
        no_of_months,
        monthly_amount: roundToNearestHundred(monthly_repayment),
        upfront_amount: roundToNearestHundred(upfront),
        sell_on_credit: 1
      });
      if (no_of_months > 2) {
        if (upfront <= (price / 2)) {
          plans.push({
            monthly_amount: roundToNearestHundred(price / 2),
            no_of_months: 1,
            upfront_amount: roundToNearestHundred(price / 2),
            sell_on_credit: 1
          });
        } else {
          plans.push({
            monthly_amount: roundToNearestHundred(price - upfront),
            no_of_months: 1,
            upfront_amount: roundToNearestHundred(upfront),
            sell_on_credit: 1
          });
        }
      }
      if (no_of_months > 3) {
        if (no_of_months % 2 === 0) {
          plans.push({
            monthly_amount: roundToNearestHundred((price - upfront) / (no_of_months / 2)),
            no_of_months: no_of_months / 2,
            upfront_amount: roundToNearestHundred(upfront),
            sell_on_credit: 1
          });
        } else {
          plans.push({
            monthly_amount: roundToNearestHundred((price - upfront) / ((no_of_months - 1) / 2)),
            no_of_months: (no_of_months - 1) / 2,
            upfront_amount: roundToNearestHundred(upfront),
            sell_on_credit: 1
          });
        }
      }
      if (no_of_months > 1) {
        plans.push({
          monthly_amount: roundToNearestHundred((price - upfront) / (no_of_months - 1)),
          no_of_months: no_of_months - 1,
          upfront_amount: roundToNearestHundred(upfront),
          sell_on_credit: 1
        });
      }

      plans = plans.map((plan, i) => {
        const monthly_amount = plan.monthly_amount;
        const upfront_amount = plan.upfront_amount;
        const text = plan.sell_on_credit === 1 ?
          `Pay ${ formatCurrency(upfront_amount) } now and ${ formatCurrency(monthly_amount) } in ${ plan.no_of_months } month(s)`
          : `Pay ${ formatCurrency(upfront_amount) } in outright purchase`;
        return { ...plan, value: i, text, monthly_amount, upfront_amount }
      });

      return plans;
    },
  }
}
</script>
