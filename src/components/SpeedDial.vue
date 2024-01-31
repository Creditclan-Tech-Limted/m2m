<template>
  <div>
    <v-overlay :value="fab" :z-index="99"></v-overlay>
    <v-speed-dial
      v-model="fab" class="mr-4 mb-md-8" direction="top" style="margin-bottom: 90px; z-index: 1"
      fixed bottom right transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="blue lighten-1" dark fab large elevation="0" class="updown-animation">
          <v-icon v-if="fab">mdi-close</v-icon>
          <v-icon v-else>mdi-magnify</v-icon>
        </v-btn>
      </template>
      <v-tooltip
        left :value="true" :open-on-hover="false" :open-on-focus="false" :open-on-click="false" z-index="99"
        nudge-top="15px" color="white"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn @click="fab = false; $bus.$emit('modal', 'support')" fab v-bind="attrs" v-on="on">
            <v-icon color="red">mdi-face-agent</v-icon>
          </v-btn>
        </template>
        <span class="black--text">Get help</span>
      </v-tooltip>
      <v-tooltip
        left :value="true" :open-on-hover="false" :open-on-focus="false" :open-on-click="false" z-index="99"
        nudge-top="15px" color="white"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn @click="fab = false; $bus.$emit('modal', 'filter')" fab v-bind="attrs" v-on="on">
            <v-icon color="teal">mdi-filter</v-icon>
          </v-btn>
        </template>
        <span class="black--text">Filter</span>
      </v-tooltip>
      <v-tooltip
        v-if="$vuetify.breakpoint.smAndDown" z-index="99"
        left :value="true" :open-on-hover="false" :open-on-focus="false" :open-on-click="false"
        nudge-top="15px" color="white"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="fab = false; $bus.$emit('modal', 'search')" fab elevation="0" v-bind="attrs" v-on="on"
          >
            <v-icon color="indigo">mdi-magnify</v-icon>
          </v-btn>
        </template>
        <span class="black--text">Search</span>
      </v-tooltip>
    </v-speed-dial>
  </div>
</template>

<script>

export default {
  name: "SpeedDial",
  data() {
    return {
      fab: false,
    }
  }
}
</script>
