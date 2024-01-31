<template>
  <div :style="{ width: width }" class="aspect-ratio-parent square">
    <div class="aspect-ratio">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
	export default {
		name: "SquareBox",
		props: {
			width: {
				type: String,
				default: '100%'
			}
		}
	}
</script>

<style scoped>
  .aspect-ratio-parent.square {
    display: block;
    max-width: 100%;
    flex: 1;
    border-radius: 4px;
    overflow: hidden;
  }

  .aspect-ratio-parent.square .aspect-ratio {
    padding-top: 100%;
    position: relative;
  }

  .aspect-ratio-parent.square .aspect-ratio .content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
  }
</style>
