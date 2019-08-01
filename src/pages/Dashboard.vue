<template>
  <vuestro-grid :layout.sync="layout">
    <template #default="{ item }">
      <component :is="item.component" :data="item.data" :options="item.options"></component>
    </template>
  </vuestro-grid>
</template>

<script>

/* global Vuex */

import LastEvent from '@/components/LastEvent';
import TopologyWidget from '@/components/TopologyWidget';

export default {
	name: 'Dashboard',
	components: {
	  LastEvent,
	  TopologyWidget,
	},
  data() {
    return {
      cnt: 0,
      layout: [],
      moduleCounter: [{ stat: 0 }],
      eventCounter: [{ stat: 0 }],
      logCounter: [{ stat: 0 }],
    };
  },
	computed: {
		...Vuex.mapGetters(['topology', 'events', 'logEvents']),
	},
	watch: {
	  topology(newVal) {
	    this.moduleCounter[0].stat = newVal.length;
	  },
	  events(newVal) {
	    this.eventCounter[0].stat = newVal.length;
	  },
	  logEvents(newVal) {
	    this.logCounter[0].stat = newVal.length;
	  }
	},
	mounted() {
	  this.loadDefaultLayout();
	},
	methods: {
	  loadDefaultLayout() {
	    this.layout = [
        {
          id: 'spokeCount',
          component: 'vuestro-stat-panel',
          data: this.moduleCounter,
          options: {
            title: 'Modules',
            color: 'var(--vuestro-primary)',
            icon: 'puzzle-piece',
          },
          position: {
            x: 0,
            y: 0,
            w: 4,
            h: 1,
          }
        },
        {
          id: 'eventCount',
          component: 'vuestro-stat-panel',
          data: this.eventCounter,
          options: {
            title: 'Captured Events',
            color: 'var(--vuestro-green)',
            icon: 'exchange-alt',
          },
          position: {
            x: 4,
            y: 0,
            w: 4,
            h: 1,
          }
        },
        {
          id: 'logCount',
          component: 'vuestro-stat-panel',
          data: this.logCounter,
          options: {
            title: 'Captured Logs',
            color: 'var(--vuestro-indigo)',
            icon: 'th-list',
          },
          position: {
            x: 8,
            y: 0,
            w: 4,
            h: 1,
          }
        },
        {
          id: 'lastevent0',
          component: 'last-event',
          position: {
            x: 0,
            y: 1,
            w: 6,
            h: 4,
          },
        },
        {
          id: 'nodes',
          component: 'topology-widget',
          position: {
            x: 6,
            y: 1,
            w: 6,
            h: 4,
          },
        }
      ];
	  },
	},
};

</script>

<style scoped>

</style>

