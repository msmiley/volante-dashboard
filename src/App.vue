<template>
  <vuestro-app title="volante">
    <template slot="logo">
      <img :src="logo"/>
    </template>

    <!--<template slot="navbar"></template>-->
    <!--<template slot="sidebar"></template>-->
    <!--<template slot="sidebar-footer"></template>-->

  </vuestro-app>
</template>

<script>

/* global __VERSION__ */

export default {
  name: 'app',
  data() {
    return {
      version: __VERSION__,
      logo: require('@/assets/volante.svg'),
    };
  },
};
</script>

<style>

html, body {
  margin: 0;
  padding: 0;
}

body {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

</style>
