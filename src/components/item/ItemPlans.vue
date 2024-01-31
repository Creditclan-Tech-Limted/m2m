<template>
  <div class="">
    <p class="mb-10 text-left text-title" v-if="showTitle">Select a payment plan below</p>
    <v-row dense v-if="plans && plans.length">
      <v-col :key="i" cols="12" v-for="(plan, i) in plans">
        <v-card @click="$emit('select', plan)" flat outlined>
          <v-card-text class="d-flex align-center">
            <div class="flex-grow-1">
              <div class="title ma-0 font-weight-bold">
                {{ plan.text }}
              </div>
            </div>
            <v-btn class="ml-3" icon>
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
	export default {
		name: 'ItemPlans',
		props: {
			showTitle: { type: Boolean, default: true },
			plans: { type: Array, required: true },
		},
	}
</script>
