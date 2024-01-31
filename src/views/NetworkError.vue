<template>
  <div class="container--fluid fill-height d-flex flex-column justify-center align-center text-center">
    <v-icon size="200" color="red lighten-4">mdi-access-point-network-off</v-icon>
    <div class="display-1 mt-12 font-weight-bold text--primary">Network Error</div>
    <p class="mt-5" style="max-width: 300px">Cannot connect to server, please check your internet and try again</p>
  </div>
</template>

<script>
export default {
  name: "NetworkError",
}
</script>
