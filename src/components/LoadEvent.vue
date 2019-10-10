<template>
  <vuestro-dropdown right click-to-open close-on-content-click>
    <template #button>
		  <vuestro-button pill variant="success">
		    <vuestro-icon name="hdd"></vuestro-icon>
		    <span>Load Event</span>
		  </vuestro-button>
	  </template>
	  <template #default>
  	  <vuestro-list-button v-for="(v, k) in savedEvents" :key="k" @click="onLoad(v)">
        {{ k }}
  	  </vuestro-list-button>
	  </template>
	  <template #buttons>
	    <span @click="onManageSaved">Manage Events</span>
	  </template>
  </vuestro-dropdown>
</template>

<script>

/* global Vuex */
export default {
  name: 'LoadEvent',
  computed: {
    ...Vuex.mapGetters(['savedEvents']),
  },
  methods: {
    onLoad(s) {
      this.$emit('load', s);
    },
    onManageSaved() {
      this.$router.push({ name: 'settings'});
    },
  },
};

</script>

<style scoped>

</style>