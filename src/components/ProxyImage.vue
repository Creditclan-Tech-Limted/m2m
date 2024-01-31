<template>
  <SquareBox :aspect-ratio="1" :width="width" v-if="src && src.includes('cdninstagram.com')">
    <img
      :src="`https://proxy.cclan.cc/${src}`" @click="$emit('click', $event)" alt="Product"
      class="fill-height fill-width rounded-lg" crossorigin="anonymous"
      ref="image" style="object-fit: cover"
    />
  </SquareBox>
  <v-img
    :aspect-ratio="4/4" :src="src" :width="width" @click="$emit('click', $event)"
    class="ma-0 fill-height rounded-lg" v-else
  />
</template>

<script>
import SquareBox from "./SquareBox";

export default {
  name: "ProxyImage",
  components: { SquareBox },
  props: {
    src: {
      type: String,
      required: true,
      default: ''
    },
    width: {
      type: String,
      default: '100%'
    }
  }
}
</script>
