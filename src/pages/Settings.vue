<template>
  <vuestro-container no-wrap column shrink>
    <vuestro-card color="var(--vuestro-yellow)">
      <template #heading>Settings</template>
      <vuestro-container no-wrap gutter="sm">
        <vuestro-card cols="6">
          <vuestro-panel>
            <template #title>General</template>
            <template #default>
              <vuestro-container items-start column>
                <vuestro-button checkbox :value="isMiniSidebar" @click="toggleSidebar">Mini Sidebar</vuestro-button>
                <vuestro-button checkbox :value="isDarkUI" @click="toggleIsDarkUI">Dark UI</vuestro-button>
              </vuestro-container>
            </template>
          </vuestro-panel>
        </vuestro-card>
        <vuestro-card cols="6">
          <vuestro-panel>
            <template #title>Saved Events</template>
            <template #default>
              <div v-for="(v, k) in savedEvents" :key="k" class="saved-event">
                {{ k }}
                <vuestro-tooltip rounded position="left" no-padding>
                  <template #content>
                    <vuestro-button dark rounded value variant="danger" @click="deleteSavedEvent(k)">
                      Delete
                    </vuestro-button>
                  </template>
                  <template #default>
                    <vuestro-button round no-border variant="danger" @click="">
                      <vuestro-icon name="trash"></vuestro-icon>
                    </vuestro-button>
                  </template>
                </vuestro-tooltip>
              </div>
              <div class="saved-event" v-if="Object.keys(savedEvents).length === 0">No saved events</div>
            </template>
          </vuestro-panel>
        </vuestro-card>
      </vuestro-container>
    </vuestro-card>
  </vuestro-container>
</template>

<script>

/* global Vuex */
export default {
  name: 'Settings',
  computed: {
    ...Vuex.mapGetters(['isMiniSidebar', 'savedEvents', 'isDarkUI']),
  },
  methods: {
    ...Vuex.mapActions(['toggleSidebar', 'deleteSavedEvent', 'toggleIsDarkUI']),
  },
};

</script>

<style scoped>

.saved-event {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 15px;
}
.saved-event:nth-child(odd) {
  background-color: rgba(0,0,0,0.1);
}

</style>