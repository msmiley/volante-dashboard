<template>
  <vuestro-panel stretch class="topology-widget">
  	<template #title>Topology</template>
    <vuestro-force-graph :data="topologyNodelist" :options="options"></vuestro-force-graph>
  </vuestro-panel>
</template>

<script>

/* global Vuex */

export default {
  name: 'TopologyWidget',
	computed: {
		...Vuex.mapGetters(['topologyNodelist']),
	},
	data() {
	  return {
	    options: {
	      labels: true,
	      distance: 100,
	    },
	  };
	},
};

</script>

<style scoped>

.topology-widget {
	overflow: hidden;
}

</style>