<template>
  <div class="navbar-stats">
    <div class="evt-chart"><vuestro-area-chart :data="stats" :options="eventOptions"></vuestro-area-chart></div>
    <div class="cpu-chart"><vuestro-area-chart :data="stats" :options="cpuOptions"></vuestro-area-chart></div>
    <div class="mem-chart"><vuestro-area-chart :data="stats" :options="memOptions"></vuestro-area-chart></div>
  </div>
</template>

<script>

/* global Vuex, Vue */

export default {
  name: 'NavbarStats',
  data() {
    return {
      cpuOptions: {
        categoryKey: 'ts',
        series: [
          {
            title: 'CPU',
            field: 'cpu',
            render(d) {
              return `${d}%`;
            },
          },
        ],
      },
      memOptions: {
        categoryKey: 'ts',
        series: [
          {
            title: 'Memory',
            field: 'memory',
            color: "var(--vuestro-purple)",
            render: Vue.filter('vuestroBytes'),
          },
        ],
      },
      eventOptions: {
        categoryKey: 'ts',
        series: [
          {
            title: 'Events',
            field: 'events',
            color: "var(--vuestro-orange)",
          },
        ],
      },
    };
  },
  computed: {
    ...Vuex.mapGetters(['stats']),
  }
};

</script>

<style scoped>

.navbar-stats {
  display: flex;
  flex: 1;
  height: calc(var(--vuestro-navbar-height) - 10px);
  margin-right: 5px;
  overflow: hidden;
}

.navbar-stats > div {
  margin: 4px;
  display: flex;
  flex: 1;
  position: relative;
  background-color: var(--vuestro-light-med);
  overflow: hidden;
}

.cpu-chart:before {
  content: "CPU";
  position: absolute;
  top: 0;
  left: 2px;
}

.mem-chart:before {
  content: "Memory";
  position: absolute;
  top: 0;
  left: 2px;
}

.evt-chart:before {
  content: "Events";
  position: absolute;
  top: 0;
  left: 2px;
}

</style>