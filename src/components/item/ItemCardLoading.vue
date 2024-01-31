<template>
  <v-responsive :aspect-ratio="4/4">
    <v-skeleton-loader
      :type="'image'"
      class="fill-width fill-height align-self-stretch"
      height="100%"
    ></v-skeleton-loader>
    <v-icon class="empty-icon">mdi-cart</v-icon>
  </v-responsive>
</template>

<script>
export default {
  name: "ItemCardLoading"
}
</script>

<style scoped>
::v-deep .v-skeleton-loader__image {
  height: 100%
}

.empty-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  color: rgba(0, 0, 0, .05);
}
</style>
