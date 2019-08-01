<template>
  <vuestro-panel stretch>
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
	    },
	  };
	},
};

</script>