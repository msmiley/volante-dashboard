<template>
  <vuestro-panel stretch scroll>
    <template #title>Dashboard Connections</template>
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
    <vuestro-table :options="options" :data="clients"></vuestro-table>
  </vuestro-panel>
</template>

<script>

/* global Vuex, _ */

export default {
  name: 'ClientList',
	data() {
	  return {
	    paused: false,
	    options: {
	      columns: [
	        {
	          title: 'IP Address',
	          field: 'ip',
	          sortable: true,
	        },
	        {
	          title: 'User-Agent',
	          field: 'ua',
	          sortable: true,
	        },
	        {
	          title: 'Connected Since',
	          field: 'since',
	          sortable: true,
	          render: (d) => {
	            return new Date(d).toISOString();
	          },
	        },
        ],
	    },
	    clients: [],
	  };
	},
	computed: {
		...Vuex.mapGetters(["stats"]),
	},
	watch: {
		stats(newVal) {
		  if (!this.paused) {
		    this.refresh();
		  }
		},
	},
	mounted() {
	  this.refresh();
	},
  methods: {
    refresh() {
		  let lastStats = this.stats[this.stats.length - 1];
		  if (lastStats && lastStats.clients) {
  		  this.clients = _.cloneDeep(lastStats.clients);
		  }
    },
  },
};

</script>

<style scoped>

</style>