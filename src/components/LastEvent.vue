<template>
  <vuestro-panel stretch scroll>
    <template #title>Last Event</template>
    <vuestro-object-browser :data="lastEvent" start-expanded></vuestro-object-browser>
  </vuestro-panel>
</template>

<script>

/* global Vuex */
export default {
  name: 'LastEvent',
	computed: {
		...Vuex.mapGetters(['lastEvent']),
	},

};

</script>

<style scoped>

</style>
