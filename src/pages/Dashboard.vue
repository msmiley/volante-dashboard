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
import ClientList from '@/components/ClientList';

export default {
	name: 'Dashboard',
	components: {
	  LastEvent,
	  TopologyWidget,
	  ClientList,
	},
  data() {
    return {
      cnt: 0,
      layout: [],
      moduleCounter: [{ stat: 0 }],
      eventCounter: [{ stat: 0 }],
      logCounter: [{ stat: 0 }],
      errorCounter: [{ stat: 0 }],
    };
  },
	computed: {
		...Vuex.mapGetters(['topology', 'events', 'logEvents', 'errorLogs']),
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
	  },
	  errorLogs(newVal) {
	    this.errorCounter[0].stat = newVal.length;
	  },
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
            clickRoute: 'topology',
          },
          position: {
            x: 0,
            y: 0,
            w: 3,
            h: 1,
          }
        },
        {
          id: 'eventCount',
          component: 'vuestro-stat-panel',
          data: this.eventCounter,
          options: {
            title: 'Captured Events',
            color: 'var(--vuestro-indigo)',
            icon: 'exchange-alt',
            clickRoute: 'events',
          },
          position: {
            x: 3,
            y: 0,
            w: 3,
            h: 1,
          }
        },
        {
          id: 'logCount',
          component: 'vuestro-stat-panel',
          data: this.logCounter,
          options: {
            title: 'Captured Logs',
            color: 'var(--vuestro-green)',
            icon: 'th-list',
            clickRoute: 'logs',
          },
          position: {
            x: 6,
            y: 0,
            w: 3,
            h: 1,
          }
        },
        {
          id: 'errorCount',
          component: 'vuestro-stat-panel',
          data: this.errorCounter,
          options: {
            title: 'Error Logs',
            color: 'var(--vuestro-danger)',
            icon: 'exclamation-triangle',
            clickRoute: 'logs',
          },
          position: {
            x: 9,
            y: 0,
            w: 3,
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
        },
        {
          id: 'clients',
          component: 'client-list',
          position: {
            x: 0,
            y: 5,
            w: 12,
            h: 4,
          }
        }
      ];
	  },
	},
};

</script>

<style scoped>

</style>

