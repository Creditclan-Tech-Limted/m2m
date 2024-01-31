<template>
  <v-carousel
    :show-arrows="request.items.length > 1"
    continuous height="100%" hide-delimiter-background
  >
    <v-carousel-item :key="item.id + i" v-for="(item, i) in request.items">
      <div class="rounded-lg overflow-hidden">
        <ProxyImage :src="item.primary_picture" alt="product"/>
      </div>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
	import ProxyImage from "../ProxyImage";

	export default {
		name: "ItemsCarousel",
		components: { ProxyImage },
		data() {
			return {
				request: this.$store.state.request,
			};
		}
	}
</script>

<style lang="scss" scoped>
  .product-image {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .item-texts {
    position: absolute;
    bottom: 0;
    left: 0;
    background: linear-gradient(to top, black, transparent)
  }
</style>
