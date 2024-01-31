<template>
  <v-sheet class="d-flex flex-column align-stretch px-0" color="transparent" elevation="0">
    <v-list class="px-5 grey lighten-5 elevation-0" color="transparent" elevation="0">
      <v-list-item-group class="d-flex flex-row" color="primary">
        <v-list-item
          v-if="onCredit" @click="$emit('open', 'schedule')" style="min-height: initial"
          class="px-6 py-6 rounded-lg overflow-hidden d-flex flex-column justify-center align-center"
        >
          <v-icon :color="`orange ${!onCredit ? 'lighten-4' : ''}`">mdi-book-open</v-icon>
          <div class="text-small mt-2 text-center">View schedule</div>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-if="!$store.getters['request/analysisDone'] && onCredit"
          @click="$emit('open', 'eligibility')" style="min-height: initial"
          class="px-6 py-6 rounded-lg overflow-hidden d-flex flex-column justify-center align-center"
        >
          <v-icon color="teal">mdi-account-search</v-icon>
          <div class="text-small mt-2 text-center">Fund me</div>
        </v-list-item>
        <v-list-item
          class="px-6 py-6 rounded-lg overflow-hidden d-flex flex-column justify-center align-center"
          disabled style="min-height: initial"
        >
          <v-icon color="blue">mdi-comment</v-icon>
          <div class="text-small mt-2 text-center">Make comment</div>
        </v-list-item>
        <template v-if="!paid && status < 2">
          <v-divider></v-divider>
          <v-list-item
            @click="views.cancel = true" style="min-height: initial"
            class="px-6 py-6 rounded-lg overflow-hidden d-flex flex-column justify-center align-center"
          >
            <v-icon color="red">mdi-delete</v-icon>
            <div class="text-small mt-2 text-center">Cancel request</div>
          </v-list-item>
        </template>
      </v-list-item-group>
    </v-list>

    <v-dialog max-width="350" persistent v-model="views.cancel">
      <v-card>
        <v-card-title>Are you sure?</v-card-title>
        <v-card-text>
          This action is irreversible and the link to this request will no longer work.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="views.cancel = false" color="green darken-1" text>No</v-btn>
          <v-btn @click="cancel()" color="red darken-1" text>Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
export default {
  name: "RequestOptions",

  data() {
    return {
      customer: this.$store.state.customer,
      views: {
        cancel: false
      }
    }
  },
  methods: {
    async cancel() {
      this.views.cancel = false;
      await this.$store.dispatch('request/cancel');
      await this.$router.replace(`/`);
      this.$store.commit('request/clear')
      localStorage.removeItem('request');
    }
  },
  computed: {
    paid() {
      return this.$store.getters['request/paid'];
    },
    status() {
      return this.$store.getters['request/status'];
    },
    onCredit() {
      return !this.$store.getters['request/totalOutright'];
    },
  }
}
</script>
