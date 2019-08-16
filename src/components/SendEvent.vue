<template>
  <vuestro-modal :active="active || isOpen" @close="onClose">
		<template #title>Create Event</template>
		<vuestro-container>
			<vuestro-card>
				<vuestro-text-field v-model="sendEventType" placeholder="Event Type" hint="e.g. hello.world"></vuestro-text-field>
			</vuestro-card>
			<vuestro-card>
			  <div class="editor-title">Event Content (JSON)</div>
			  <div class="editor-wrapper">
  				<vuestro-editor :lang="'json'" :value="sendEventContent" :options="editorOptions" @input="onContentUpdate"></vuestro-editor>
				</div>
			</vuestro-card>
		</vuestro-container>
		<template #buttons>
			<vuestro-button variant="success" :disabled="!valid || sendEventType.length === 0" @click="onSend">
				<vuestro-icon name="rocket"></vuestro-icon>
				<span>Send</span>
			</vuestro-button>
		</template>
	</vuestro-modal>
</template>

<script>

/* global Vue */

export default {
  name: 'SendEvent',
  props: {
    active: { type: Boolean, default: false },
  },
  data() {
    return {
      isOpen: false, // internal open flag
      valid: true,
  		sendEventType: '',
			sendEventContent: '{\n  \n}',
			sendEventObj: {},
      editorOptions: {
        useSoftTabs: true,
        tabSize: 2,
      },
    };
  },
  methods: {
    openForEvent(evt) {
      this.isOpen = true;
      this.sendEventType = evt;
    },
    onClose() {
      this.isOpen = false;
      this.$emit('update:active', false);
    },
    onContentUpdate(newVal) {
      // update text
      this.sendEventContent = newVal;
      // try to validate as JSON
      try {
        this.sendEventObj = JSON.parse(newVal);
        this.valid = true;
      } catch(e) {
        this.valid = false;
      }
    },
    onSend() {
      // send it server-side
      Vue.socket.emit('event', {
        eventType: this.sendEventType,
        eventObj: this.sendEventObj,
      });
      this.onClose();
    },
  }
};

</script>

<style scoped>

.editor-wrapper {
  height: 400px;
  position: relative;
  z-index: 1;
}

.editor-title {
  font-size: 15px;
  color: var(--vuestro-text-color-muted);
  padding: 8px;
}

</style>