<template>
  <vuestro-dropdown right click-to-open @hover="onShown">
    <template #button>
		  <vuestro-button pill variant="info">
		    <vuestro-icon name="save"></vuestro-icon>
		    <span>Save Event</span>
		  </vuestro-button>
	  </template>
	  <template #default>
  	  <vuestro-text-field ref="textField" hint="Save Event As..." dark variant="outline" v-model="eventName" clearable></vuestro-text-field>
	  </template>
	  <template #buttons>
	    <span @click="onSave">Save</span>
	  </template>
  </vuestro-dropdown>
</template>

<script>

export default {
  name: 'SaveEvent',
  props: {
    eventType: { type: String, required: true },
    eventArgs: { type: Array, required: true },
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
        });
        this.$children[0].onBlur();
      }
    },
  },
};

</script>

<style scoped>

</style>