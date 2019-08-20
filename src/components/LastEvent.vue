<template>
  <vuestro-panel stretch scroll>
    <template #title>Last Event</template>
    <template #toolbar>
      <vuestro-button pill no-border @click="paused = !paused" :value="paused">
        <template v-if="paused">
          <vuestro-icon name="play"></vuestro-icon>
          <span>Play</span>
        </template>
        <template v-else>
          <vuestro-icon name="pause"></vuestro-icon>
          <span>Pause</span>
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
