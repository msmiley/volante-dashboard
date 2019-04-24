<template>
  <vuestro-grid :layout.sync="layout">
    <vuestro-card slot-scope="{ item }">
      <template slot="heading"><span class="drag">{{ item.title }}</span></template>
      <vuestro-panel :color="item.color">
      </vuestro-panel>
    </vuestro-card>
  </vuestro-grid>
</template>

<script>

export default {
	name: 'Dashboard',
  data() {
    return {
      cnt: 0,
      layout: [
        {
          id: 'w1',
          title: 'What is traversing volante right now?',
          value: 73,
          position: {
            x: 0,
            y: 0,
            w: 12,
            h: 4,
          }
        },
        {
          id: 'w2',
          title: 'volante spokes',
          position: {
            x: 0,
            y: 4,
            w: 4,
            h: 4,
          }
        },
      ],
    };
  },
};

</script>

<style scoped>

</style>

