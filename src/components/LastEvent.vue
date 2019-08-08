<template>
  <vuestro-panel stretch scroll>
    <template #title>Last Event</template>
    <vuestro-object-browser :data="lastEvent" start-expanded></vuestro-object-browser>
    <div v-if="!lastEvent" class="no-data">Waiting for next event...</div>
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

.no-data {
  padding: 2px 10px;
  font-size: 18px;
  font-weight: 300;
}

</style>
