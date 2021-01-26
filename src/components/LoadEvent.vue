<template>
  <vuestro-dropdown right click-to-open close-on-content-click>
    <template #button>
      <vuestro-button pill value variant="success" size="sm">
        <template #icon>
          <vuestro-icon name="hdd"></vuestro-icon>
        </template>
        Load Event
      </vuestro-button>
    </template>
    <template #default>
      <vuestro-list-button v-for="(v, k) in savedEvents" :key="k" @click="onLoad(v)">
        {{ k }}
      </vuestro-list-button>
      <div v-if="showNoSavedEvents">No events yet</div>
    </template>
    <template #buttons>
      <vuestro-button variant="info" value @click="onManageSaved">
        <template #icon>
          <vuestro-icon name="list-ul"></vuestro-icon>
        </template>
        Manage Events
      </vuestro-button>
    </template>
  </vuestro-dropdown>
</template>

<script>

/* global Vuex */
export default {
  name: 'LoadEvent',
  computed: {
    ...Vuex.mapGetters(['savedEvents']),
    showNoSavedEvents() {
      if (this.savedEvents) {
        return Object.keys(this.savedEvents).length === 0;
      } else {
        return true;
      }
    },
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