<template>
  <vuestro-panel stretch scroll>
    <template #title>Last Event</template>
    <template #toolbar>
      <vuestro-button pill no-border @click="paused = !paused" :value="paused">
      	<template #icon>
	        <template v-if="paused">
	          <vuestro-icon name="play"></vuestro-icon>
        	</template>
	        <template v-else>
	          <vuestro-icon name="pause"></vuestro-icon>
          </template>
        </template>
        <template v-if="paused">
	        Play
        </template>
        <template v-else>
          Pause
        </template>
      </vuestro-button>
    </template>
    <vuestro-object-browser :data="lastEventCache" start-expanded></vuestro-object-browser>
    <div v-if="!lastEvent" class="no-data">Waiting for next event...</div>
  </vuestro-panel>
</template>

<script>

/* global Vuex, _ */
export default {
  name: 'LastEvent',
	computed: {
		...Vuex.mapGetters(['lastEvent']),
	},
  data() {
    return {
      paused: false,
      lastEventCache: {},
    };
  },
  watch: {
    lastEvent(newVal) {
      if (!this.paused) {
        this.lastEventCache = _.cloneDeep(newVal);
      }
    },
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
