<template>
  <RequestMobile v-if="$vuetify.breakpoint.smAndDown"/>
  <RequestDesktop v-else/>
</template>

<script>
	import RequestMobile from "../components/request/RequestMobile";
	import RequestDesktop from "../components/request/RequestDesktop";

	export default {
		name: 'Request',
		components: { RequestDesktop, RequestMobile },
	}
</script>
