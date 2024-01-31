<template>
  <div class="d-flex flex-column align-start justify-center px-8 px-md-10 py-16 mt-10">
    <img alt="Hourglass" src="@/assets/images/time-lady.svg" style="max-width: 250px"/>
    <h2 class="text-h4 mt-4 mt-8">
      Before you continue, please note that:
    </h2>
    <ul class="mt-4 text-h6">
      <li>Fulfilment can take up to 48 hours</li>
      <li>Your bank statement will be required for analysis</li>
    </ul>
    <v-btn @click="$emit('continue')" elevation="0" rounded color="primary" class="mt-10" large>
      Continue
      <v-icon class="ml-2">mdi-arrow-right</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'CheckoutAlert',
}
</script>
