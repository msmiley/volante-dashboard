<template>
  <vuestro-app :title="title">

    <template slot="footer">
      <div class="default-footer"><strong>{{ title }} v{{ version }}</strong> powered by volante-dashboard v{{ dashboardVersion }} <img :src="logo"/></div>
    </template>

  </vuestro-app>
</template>

<script>

/* global __VERSION__, Vuex */

export default {
  name: 'app',
  data() {
    return {
      dashboardVersion: __VERSION__,
      logo: require('@/assets/volante.svg'),
    };
  },
  computed: {
    ...Vuex.mapGetters(['title', 'version']),
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

</style>
