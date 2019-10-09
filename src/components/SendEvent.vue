<template>
  <vuestro-modal :active="active || isOpen" @close="onClose" close-on-blur>
		<template #title>Create Event</template>
		<template #toolbar>
		  <vuestro-dropdown right click-to-open>
		    <template #button>
    		  <vuestro-button pill variant="info">
    		    <vuestro-icon name="save"></vuestro-icon>
    		    <span>Save Event</span>
    		  </vuestro-button>
  		  </template>
		  </vuestro-dropdown>
		  <vuestro-dropdown right click-to-open>
		    <template #button>
    		  <vuestro-button pill variant="success">
    		    <vuestro-icon name="save"></vuestro-icon>
    		    <span>Load Event</span>
    		  </vuestro-button>
  		  </template>
		  </vuestro-dropdown>
		</template>
		<vuestro-container>
			<vuestro-card>
				<vuestro-text-field v-model="sendEventType" placeholder="Event Type" hint="e.g. hello.world" :presets="allHandledEvents"></vuestro-text-field>
  			<vuestro-panel gutter="none" collapsible>
  			  <template #title>Event Arguments (as JSON)</template>
  			  <template #toolbar>
  			    <vuestro-button round no-border @click="onAddArg">
  			      <vuestro-icon name="plus"></vuestro-icon>
  			    </vuestro-button>
  			  </template>
          <div v-for="(arg, idx) in args" class="event-arg-block">
            <div class="event-arg-sidebar">
              <span>{{ idx }}</span>
              <vuestro-button round no-border variant="danger" size="lg" @click="onDeleteArg(idx)">
                <vuestro-icon name="trash"></vuestro-icon>
              </vuestro-button>
            </div>
    			  <div class="editor-wrapper" :style="{ height: arg.height }">
      				<vuestro-editor lang="json" :value="arg.buffer" :options="editorOptions" @input="onContentUpdate(idx, ...arguments)"></vuestro-editor>
    				</div>
    				<div class="event-arg-block-resize-handle"
    				     @mousedown="onArgResizeStart(idx, ...arguments)"></div>
          </div>
  			</vuestro-panel>
			</vuestro-card>
			<vuestro-card>
			  <vuestro-container gutter="none">
  			  <vuestro-button checkbox v-model="provideCallback" size="lg">Append callback function argument</vuestro-button>
			  </vuestro-container>
			  <vuestro-panel v-if="provideCallback" collapsible>
			    <template #title>Last Callback Result</template>
			    <template #toolbar>
			      <span v-if="lastCallbackResult && lastCallbackResult.ts">{{ lastCallbackResult.ts | vuestroHMS }}</span>
			      <vuestro-button round no-border @click="$store.dispatch('setLastCallbackResult', null)">
			        <vuestro-icon name="ban"></vuestro-icon>
			      </vuestro-button>
			      <vuestro-button round no-border @click="vuestroDownloadAsJson(lastCallbackResult.result, 'result.json')">
			        <vuestro-icon name="download"></vuestro-icon>
			      </vuestro-button>
			    </template>
			    <template v-if="lastCallbackResult && lastCallbackResult.result && lastCallbackResult.result.length === 2">
      			<template v-if="lastCallbackResult.result[0]">
      			  <span class="callback-error">ERROR</span>
      			  <vuestro-object-browser :data="lastCallbackResult.result[0]"></vuestro-object-browser>
      			</template>
			      <template v-else>
      			  <vuestro-object-browser :data="lastCallbackResult.result[1]"></vuestro-object-browser>
    			  </template>
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
			args: [],
      editorOptions: {
        useSoftTabs: true,
        tabSize: 2,
      },
      provideCallback: false,
      resizingIdx: null,
    };
  },
  computed: {
		...Vuex.mapGetters(['lastCallbackResult', 'allHandledEvents']),
  },
  methods: {
    openForEvent(evt) {
      this.args = [];
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
            this.args.push({
              buffer: `"${a}"`
            });
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
    },
    onContentUpdate(idx, newVal) {
      // update text
      this.args[idx].buffer = newVal;
      this.validateBuffers();
    },
    validateBuffers() {
      // try to validate as JSON
      try {
        this.sendEventArgs = [];
        for (let a of this.args) {
          this.sendEventArgs.push(JSON.parse(a.buffer));
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
      } else {
        this.$store.dispatch('setLastCallbackResult', null);
      }
    },
    onAddArg() {
      this.args.push({
        buffer: 'null',
        height: '80px',
      });
    },
    onDeleteArg(idx) {
      this.args.splice(idx, 1);
    },
    onArgResizeStart(idx, evt) {
      this.resizingIdx = idx;
      evt.preventDefault();
      evt.stopPropagation();
      window.dragging = true;

      let mouseY = evt.clientY;
      let originalHeight = parseInt(this.args[this.resizingIdx].height, 10);

      const handleMouseUp = evt => {
        window.removeEventListener('mouseup', handleMouseUp, true);
        window.removeEventListener('mousemove', handleMouseMove, true);
        window.dispatchEvent(new Event('resize'));
      };

      const handleMouseMove = evt => {
        let newHeight = originalHeight + evt.clientY - mouseY;
        if (newHeight > 80) {
          this.args[this.resizingIdx].height = `${newHeight}px`;
          window.dispatchEvent(new Event('resize'));
        }
      };

      window.addEventListener('mouseup', handleMouseUp, true);
      window.addEventListener('mousemove', handleMouseMove, true);
    },
  }
};

</script>

<style scoped>

.event-arg-block {
  display: flex;
  align-items: stretch;
  position: relative;
}

.event-arg-block:first-child {
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
  position: relative;
  z-index: 1;
  padding-bottom: 2px;
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

.callback-error {
  color: var(--vuestro-danger);
  margin-left: 20px;
  font-weight: 600;
}

.event-arg-block-resize-handle {
  height: 2px;
  position: absolute;
  bottom: 0;
  width: 100%;
  cursor: row-resize;
  background-color: rgba(0,0,0,0.2);
  z-index: 100;
}

</style>