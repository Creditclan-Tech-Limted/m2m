<template>
  <div>
    <v-carousel :class="`carousel-${$vuetify.breakpoint.name}`" :hide-delimiters="pictures.length < 2"
      :show-arrows="pictures.length > 1" cycle delimiter-icon="mdi-minus" height="50%" hide-delimiter-background>
      <v-carousel-item :key="i" v-for="(src, i) in pictures">
        <v-sheet color="grey lighten-4" dark height="50%" tile>
          <div @click="showPreview(src)" class="product" fill-height>
            <div class="product-image elevation-20">
              <ProxyImage :src="src" alt="product" />
            </div>
          </div>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>

    <v-dialog :scrollable="false" eager v-model="preview.visible" width="600">
      <v-card>
        <ProxyImage :src="preview.src" />
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import ProxyImage from "../ProxyImage";

export default {
  name: 'ItemPicturesCarousel',
  components: { ProxyImage },
  props: {
    item: { type: Object, required: true }
  },
  data() {
    return {
      preview: {
        visible: false,
        src: ''
      },
    }
  },
  methods: {
    showPreview(src) {
      this.preview.visible = true;
      this.preview.src = src;
    }
  },
  computed: {
    pictures() {
      const { primary_picture, secondary_picture, tertiary_picture, fourth_picture, fifth_picture, images } = this.item;
      if (images && images.length) return images;
      const arr = [primary_picture];
      secondary_picture && !secondary_picture.includes('undefined') && arr.push(secondary_picture)
      tertiary_picture && !tertiary_picture.includes('undefined') && arr.push(tertiary_picture)
      fourth_picture && !fourth_picture.includes('undefined') && arr.push(fourth_picture)
      fifth_picture && !fifth_picture.includes('undefined') && arr.push(fifth_picture)
      return arr;
    },
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/variables';

.product {
  width: 100%;
}

.product-image {
  width: 100%;
  height: 20%;
  overflow: hidden;
  cursor: zoom-in;

  img {
    width: 100%;
    height: 20%;
    object-fit: cover;
  }
}
</style>
