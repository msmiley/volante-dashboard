<template>
  <vuestro-modal :active="active || isOpen" @close="onClose">
		<template #title>Create Event</template>
		<vuestro-container>
			<vuestro-card>
				<vuestro-text-field v-model="sendEventType" placeholder="Event Type" hint="e.g. hello.world"></vuestro-text-field>
  			<vuestro-panel gutter="none">
  			  <template #title>Event Arguments (as JSON)</template>
  			  <template #toolbar>
  			    <vuestro-button round no-border @click="onAddArg">
  			      <vuestro-icon name="plus"></vuestro-icon>
  			    </vuestro-button>
  			  </template>
          <div v-for="(arg, idx) in argBuffers" class="event-arg-block">
            <div class="event-arg-sidebar">
              <span>{{ idx }}</span>
              <vuestro-button round no-border variant="danger" size="lg" @click="onDeleteArg(idx)">
                <vuestro-icon name="trash"></vuestro-icon>
              </vuestro-button>
            </div>
    			  <div class="editor-wrapper">
      				<vuestro-editor :lang="'json'" :value="arg" :options="editorOptions" @input="onContentUpdate(idx, ...arguments)"></vuestro-editor>
    				</div>
          </div>
  			</vuestro-panel>
			</vuestro-card>
			<vuestro-card>
			  <vuestro-container gutter="none">
  			  <vuestro-button checkbox v-model="provideCallback" size="lg">Append callback function argument</vuestro-button>
			  </vuestro-container>
			  <vuestro-panel v-if="provideCallback">
			    <template #title>Last Callback Result</template>
			    <template v-if="lastCallbackResult && lastCallbackResult.length == 2">
    			  <vuestro-object-browser :data="lastCallbackResult[1]"></vuestro-object-browser>
  			  </template>
			    <div v-else class="waiting-for-callback">Waiting for callback result...</div>
			  </vuestro-panel>
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

/* global Vue, Vuex */

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
			sendEventArgs: [],
			argBuffers: [],
      editorOptions: {
        useSoftTabs: true,
        tabSize: 2,
      },
      provideCallback: false,
    };
  },
  computed: {
		...Vuex.mapGetters(['lastCallbackResult']),
  },
  methods: {
    openForEvent(evt) {
      this.argBuffers = [];
      this.provideCallback = false;
      // see if there are arguments
      let sig = evt.match(/\((.*)\)/);
      if (sig && sig.length > 0 && sig[1].length > 0) {
        let args = sig[1].split(/, ?/);
        if (args) {
          if (args[args.length-1] === 'callback') {
            this.provideCallback = true;
            args.pop();
          }

          for (let a of args) {
            // add argument var name as starting buffer value
            this.argBuffers.push(`"${a}"`);
          }
        }
      }
      this.sendEventType = evt.split('(')[0];
      this.isOpen = true;
    },
    onClose() {
      // reset and close
      this.isOpen = false;
      this.$emit('update:active', false);
      this.valid = true;
      this.provideCallback = false;
      this.argBuffers = [];
      this.$store.dispatch('setLastCallbackResult', {});
    },
    onContentUpdate(idx, newVal) {
      // update text
      this.argBuffers[idx] = newVal;
      this.validateBuffers();
    },
    validateBuffers() {
      // try to validate as JSON
      try {
        this.sendEventArgs = [];
        for (let a of this.argBuffers) {
          this.sendEventArgs.push(JSON.parse(a));
        }
        this.valid = true;
      } catch(e) {
        this.valid = false;
      }
    },
    onSend() {
      this.validateBuffers();
      // send it server-side
      Vue.socket.emit('event', {
        eventType: this.sendEventType,
        eventArgs: this.sendEventArgs,
        eventCallback: this.provideCallback,
      });
      if (!this.provideCallback) {
        // close if not waiting on callback result
        this.onClose();
      }
    },
    onAddArg() {
      this.argBuffers.push('');
    },
    onDeleteArg(idx) {
      this.argBuffers.splice(idx, 1);
    },
  }
};

</script>

<style scoped>

.event-arg-block {
  display: flex;
  align-items: stretch;
  border-top: 1px solid var(--vuestro-outline);
}

.event-arg-sidebar {
  font-size: 22px;
  flex-basis: 30px;
  text-align: center;
  padding-top: 2px;
  padding-bottom: 5px;
  background-color: var(--vuestro-light);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.editor-wrapper {
  flex-grow: 1;
  height: 80px;
  position: relative;
  z-index: 1;
}

.editor-title {
  font-size: 15px;
  color: var(--vuestro-text-color-muted);
  padding: 8px;
}

.waiting-for-callback {
  padding-bottom: 5px;
  padding-left: 10px;
}

</style>