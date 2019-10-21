<template>
	<vuestro-container no-wrap shrink class="events-container">
		<vuestro-card cols="3" color="var(--vuestro-green)">
			<template #heading>
				<span class="events-toolbar">
					<span>Events</span>
					<vuestro-button round no-border variant="text" @click="toggleEventSortDirection">
						<vuestro-icon v-if="eventSortAsc" name="arrow-up"></vuestro-icon>
						<vuestro-icon v-else name="arrow-down"></vuestro-icon>
					</vuestro-button>
				</span>
				<span class="events-toolbar">
					<vuestro-button round no-border @click="createOpen = true">
						<vuestro-icon name="plus"></vuestro-icon>
					</vuestro-button>
					<vuestro-button round no-border @click="onClear">
						<vuestro-icon name="ban"></vuestro-icon>
					</vuestro-button>
				</span>
			</template>
			<template #description>
			</template>
			<div class="events-sidebar">
				<div>
					<vuestro-search-box history placeholder="Search" v-model="searchTerm" @input="onSearch"></vuestro-search-box>
				</div>
				<div class="events-list">
					<div v-if="filteredEvents.length == 0" class="no-data">No events, yet...</div>
					<div v-for="(e, idx) in filteredEvents" class="event" @click="onSelectEvent(idx, e)" :class="{ selected: idx == currentIdx }">
						<div class="type">
							<vuestro-button round no-border @click="reEmit(e)">
								<vuestro-icon name="share-square"></vuestro-icon>
							</vuestro-button>
							{{ e.eventType }}
						</div>
						<div>{{ e.ts | vuestroHMS }}</div>
					</div>
				</div>
			</div>
		</vuestro-card>
		<vuestro-card cols="9">
			<vuestro-panel stretch scroll class="event-data-panel">
				<template #title>Event Data</template>
				<template #toolbar>
					<vuestro-button pill no-border @click="$refs.ob.expandAll()"><vuestro-icon name="plus"></vuestro-icon><span>Expand All</span></vuestro-button>
					<vuestro-button pill no-border @click="$refs.ob.collapseAll()"><vuestro-icon name="minus"></vuestro-icon><span>Collapse All</span></vuestro-button>
					<vuestro-tooltip position="bottom" no-wrap rounded>
	          <template #content>Download event data as JSON</template>
						<vuestro-button round no-border @click="vuestroDownloadAsJson(currentObject, 'event.json')"><vuestro-icon name="download"></vuestro-icon></vuestro-button>
					</vuestro-tooltip>
				</template>
				<div class="event-data">
					<div v-if="Object.keys(currentObject).length === 0" class="no-data">Select an event to view the data object</div>
					<vuestro-object-browser v-else ref="ob" expand-all :data="currentObject"></vuestro-object-browser>
				</div>
			</vuestro-panel>
		</vuestro-card>
		<send-event ref="sendEvent" :active.sync="createOpen"/>
	</vuestro-container>
</template>

<script>

/* global _, Vuex */
import SendEvent from '@/components/SendEvent';

export default {
	name: 'Events',
	components: {
		SendEvent,
	},
	computed: {
		...Vuex.mapGetters(['events', 'eventSortAsc']),
		filteredEvents() {
			let f;
			if (this.searchTerm.length == 0) {
				f = this.events;
			} else {
				f = _.filter(this.events, (d) => {
					return JSON.stringify(d).indexOf(this.searchTerm) > -1;
				});
			}
			return _.orderBy(f, 'ts', this.eventSortAsc ? 'asc':'desc');
		}
	},
	data() {
		return {
			createOpen: false,
			searchTerm: '',
			currentObject: {},
			currentIdx: -1,
			showLogs: false,
		};
	},
	methods: {
		...Vuex.mapActions(['clearEvents', 'toggleEventSortDirection']),
		onClear() {
			this.clearEvents();
			this.currentIdx = -1;
			this.currentObject = {};
		},
		onSelectEvent(idx, d) {
			this.currentIdx = idx;
			this.currentObject = d;
		},
		onSearch() {
			if (this.searchTerm.length > 0) {
				this.currentObject = {};
			}
		},
		reEmit(e) {
			this.$refs.sendEvent.openWithEvent(e);
		},
	}
};

</script>

<style scoped>

.events-container {
	overflow: hidden;
}

.event {
	padding: 5px 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: pointer;
}
.event.selected {
	background-color: var(--vuestro-active);
}
.event:hover {
	background-color: var(--vuestro-hover);
}
.event > .type {
	font-weight: 600;
	color: var(--vuestro-indigo);
	display: flex;
}
.events-sidebar {
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.events-list {
	overflow: auto;
}
.no-data {
	font-size: 22px;
	font-weight: 300;
	text-align: center;
	padding: 20px;
}
.events-toolbar {
	display: flex;
}

</style>

