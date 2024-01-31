<template>
  <v-sheet class="pa-10">
    <h2 class="text-title text-h5">No order found!</h2>
    <p class="mt-4 black--text">
      Please use link sent via email address or whatsapp to view your order
    </p>
    <div class="d-flex justify-end mt-8">
      <v-btn @click="$emit('close')" color="red darken-1" outlined>Close</v-btn>
    </div>
  </v-sheet>
</template>

<script>
export default {
  name: "NoOrderFound"
}
</script>
