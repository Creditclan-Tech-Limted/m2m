<template>
    <v-dialog
      v-if="$vuetify.breakpoint.smAndDown && fullscreen" max-width="500" inset scrollable v-model="visible"
      transition="dialog-bottom-transition" fullscreen :persistent="persistent"
    >
      <slot/>
    </v-dialog>
    <v-bottom-sheet
      v-else-if="$vuetify.breakpoint.smAndDown && !fullscreen" v-model="visible"
      inset max-width="500" scrollable :persistent="persistent"
    >
      <slot/>
    </v-bottom-sheet>
    <div v-else>
      <v-navigation-drawer fixed right :temporary="!persistent" width="550" v-model="visible">
        <slot/>
      </v-navigation-drawer>
    </div>
  </template>
  
  <script>
  export default {
    name: "Modal",
    props: {
      value: {
        type: Boolean,
        required: true
      },
      fullscreen: {
        type: Boolean,
        default: false
      },
      persistent: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        visible: this.value
      }
    },
    watch: {
      value(val) {
        if (val !== this.visible) {
          this.visible = val
        }
      },
      visible() {
        this.$emit('input', this.visible);
      }
    },
  }
  </script>
  