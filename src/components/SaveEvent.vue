<template>
  <vuestro-dropdown right click-to-open @hover="onShown">
    <template #button>
      <vuestro-button pill value variant="info" size="sm">
        <template #icon>
          <vuestro-icon name="save"></vuestro-icon>
        </template>
        Save Event
      </vuestro-button>
    </template>
    <template #default>
      <vuestro-text-field ref="textField" size="lg" placeholder="Save Event As..." variant="outline" v-model="eventName" clearable></vuestro-text-field>
    </template>
    <template #buttons>
      <vuestro-button variant="success" value @click="onSave">
        <template #icon>
          <vuestro-icon name="save"></vuestro-icon>
        </template>
        Save
      </vuestro-button>
    </template>
  </vuestro-dropdown>
</template>

<script>

export default {
  name: 'SaveEvent',
  props: {
    eventType: { type: String, required: true },
    eventArgs: { type: Array, required: true },
    provideCallback: { type: Boolean, required: true },
  },
  data() {
    return {
      eventName: '',
    };
  },
  computed: {

  },
  methods: {
    onShown() {
      this.$refs.textField.focus();
    },
    onSave() {
      if (this.eventName.length > 0) {
        this.$store.dispatch('saveEvent', {
          name: this.eventName,
          type: this.eventType,
          args: this.eventArgs,
          provideCallback: this.provideCallback
        });
        this.$children[0].onBlur();
      }
    },
  },
};

</script>

<style scoped>

</style>