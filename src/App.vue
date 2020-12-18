<template>
  <vuestro-app :title="title" :loading="!isSavedLoaded">

    <template #navbar-slot>
      <navbar-stats></navbar-stats>
    </template>

    <template #sidebar>
      <vuestro-sidebar :mini="isMiniSidebar"
                       @update:mini="$store.dispatch('toggleSidebar')">
      </vuestro-sidebar>
    </template>

    <template #footer>
      <div class="default-footer"><strong>{{ title }} v{{ version }}</strong> powered by volante-dashboard v{{ dashboardVersion }}</div>
    </template>

  </vuestro-app>
</template>

<script>

/* global VERSION, Vuex */

import NavbarStats from '@/components/NavbarStats';

export default {
  name: 'app',
  components: {
    NavbarStats,
  },
  data() {
    return {
      dashboardVersion: VERSION,
    };
  },
  computed: {
    ...Vuex.mapGetters(['title', 'version', 'isMiniSidebar', 'isSavedLoaded']),
  },
  mounted() {
    this.$store.dispatch('loadSavedSettings');
  },
};
</script>

<style>

body {
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
}

.default-footer {
  font-size: 13px;
  text-align: right;
  padding: 5px;
}
.default-footer img {
  width: 13px;
  height: 13px;
}

.vuestro-app {
  --vuestro-navbar-separator: none !important;
}

</style>
