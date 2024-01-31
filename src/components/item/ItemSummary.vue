<template>
  <div>
    <div class="pa-6">
      <p class="mb-4 text-title font-weight-bold">Kindly confirm</p>
      <div class="d-flex align-center">
        <v-list class="flex-grow-1" dense two-line>
          <v-list-item-group>
            <v-list-item class="px-0" disabled>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold text-title mb-1">
                  {{ (selected.upfront_amount * quantity) | currency }}
                </v-list-item-title>
                <v-list-item-subtitle class="blue-grey--text" v-text="'Upfront Payment'"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="selected.monthly_amount"></v-divider>
            <v-list-item class="px-0" disabled v-if="selected.monthly_amount">
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold text-title mb-1">
                  {{ (selected.monthly_amount * quantity) | currency }}
                </v-list-item-title>
                <v-list-item-subtitle class="blue-grey--text" v-text="'Monthly Repayment'"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="px-0" disabled v-if="selected.no_of_months">
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold text-title mb-1" v-text="selected.no_of_months"></v-list-item-title>
                <v-list-item-subtitle class="blue-grey--text" v-text="'Number of months'"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="selected.no_of_months"></v-divider>
            <v-list-item class="px-0" disabled>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold text-title mb-1" v-text="quantity"></v-list-item-title>
                <v-list-item-subtitle class="blue-grey--text" v-text="'Quantity'"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-avatar class="ml-7" color="teal lighten-5" size="70">
          <v-icon color="teal" size="40">mdi-format-list-checks</v-icon>
        </v-avatar>
      </div>
    </div>
    <v-divider></v-divider>
    <div class="pa-6 d-flex">
      <v-btn @click="$emit('back')" outlined>Back</v-btn>
      <v-btn @click="addToCart" class="ml-2 px-8 flex-grow-1" color="primary" dark elevation="0">
        <v-icon left>mdi-cart</v-icon>
        Add to cart
      </v-btn>
    </div>
  </div>
</template>
<script>
	export default {
		name: 'ItemSummary',
		props: {
			item: {},
			quantity: {},
			selected: {},
		},
		methods: {
			addToCart() {
				const plan = this.item.sell_on_credit === 1
					? { ...this.selected, id: this.item.id, quantity: this.quantity }
					: {
						id: this.item.id,
						quantity: this.quantity,
						monthly_amount: 0,
						no_of_months: 0,
						upfront_amount: this.item.price,
						sell_on_credit: 0
					};

				this.$store.commit('cart/addItem', { ...this.item, plan });
				this.$emit('close')
			},
		}
	}
</script>
