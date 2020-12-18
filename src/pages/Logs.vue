<template>
	<vuestro-container>
		<vuestro-card color="var(--vuestro-indigo)">
			<template #heading>
				<span>Logs</span>
				<span class="log-toolbar">
					<vuestro-button rounded v-model="showDebug" variant="info">Debug</vuestro-button>
					<vuestro-button rounded v-model="showNormal" variant="success">Normal</vuestro-button>
					<vuestro-button rounded v-model="showWarning" variant="warning">Warning</vuestro-button>
					<vuestro-button rounded v-model="showError" variant="danger">Error</vuestro-button>
					<vuestro-button rounded no-border @click="clearLogEvents">
						<template #icon>
							<vuestro-icon name="ban"></vuestro-icon>
						</template>
						Clear
					</vuestro-button>
					<vuestro-tooltip position="bottom" no-wrap rounded>
	          <template #content>Download entire log as JSON</template>
						<vuestro-button round no-border @click="vuestroDownloadAsJson(logEvents, 'log.json')">
							<vuestro-icon name="download"></vuestro-icon>
						</vuestro-button>
					</vuestro-tooltip>
				</span>
			</template>
			<vuestro-panel stretch>
				<vuestro-table :data="filteredLogEvents" :options="tableOptions">
					<template #no-data>
						No log messages
					</template>
					<template #row="{ item }">
						<td>
							<span class="ts-format">
								{{ item.ts }}
							</span>
						</td>
						<td>
							<span class="align-left">
								<vuestro-pill :title="item.lvl" :color="getLevelColor(item.lvl)"></vuestro-pill>
							</span>
						</td>
						<td>
							<span class="align-left">
								<vuestro-pill :title="item.src" color="var(--vuestro-purple)"></vuestro-pill>
							</span>
						</td>
						<td>
							<span v-for="o in item.msg" class="message-column align-left">
								<vuestro-pill v-if="typeof(o) == 'string'" :title="o"></vuestro-pill>
								<vuestro-container space-between v-else gutter="none" no-grow overflow-hidden>
									<vuestro-object-browser :data="o"></vuestro-object-browser>
								</vuestro-container>
							</span>
						</td>
					</template>
					<template #row-buttons="{ item }">
						<vuestro-tooltip position="left" no-wrap rounded>
		          <template #content>Download Message as JSON</template>
							<vuestro-button round no-border @click="vuestroDownloadAsJson(item, 'log.json')">
								<vuestro-icon name="download"></vuestro-icon>
							</vuestro-button>
						</vuestro-tooltip>
						<vuestro-tooltip position="left" no-wrap rounded>
		          <template #content>View Raw Message</template>
							<vuestro-button round no-border @click="onShowRaw(item)">
								<vuestro-icon name="stream"></vuestro-icon>
							</vuestro-button>
						</vuestro-tooltip>
					</template>
				</vuestro-table>
			</vuestro-panel>
		</vuestro-card>
		<vuestro-modal :active.sync="showRaw" close-on-blur>
			<template #title>
				Raw Message
			</template>
			<template #toolbar>
				<vuestro-button round no-border @click="vuestroDownloadAsJson(selectedItem, 'log.json')">
					<vuestro-icon name="download"></vuestro-icon>
				</vuestro-button>
			</template>
			<vuestro-editor lang="json" :value="JSON.stringify(selectedItem, null, 2)" :options="{ maxLines: Infinity }"></vuestro-editor>
			<template #footer>
				<vuestro-hr></vuestro-hr>
			</template>
			<template #buttons>
				<vuestro-button @click="showRaw = false">Close</vuestro-button>
			</template>
		</vuestro-modal>
	</vuestro-container>
</template>

<script>

/* global Vuex, _ */

export default {
	name: 'Logs',
	data() {
		return {
			showDebug: true,
			showNormal: true,
			showWarning: true,
			showError: true,
			showRaw: false,
			selectedItem: null,
			tableOptions: {
				columns: [
					{
						title: 'Timestamp',
						field: 'ts',
						sortable: true,
						sort: 'desc',
					},
					{
						title: 'Level',
						field: 'lvl',
						sortable: true,
					},
					{
						title: 'Source',
						field: 'src',
						sortable: true,
					},
					{
						title: 'Message',
						field: 'msg'
					},
				]
			},
		};
	},
	computed: {
		...Vuex.mapGetters(["logEvents"]),
		filteredLogEvents() {
			let logs = _.flatMap(this.logEvents, 'eventArgs');
			if (!this.showDebug) {
				logs = _.reject(logs, { lvl: 'debug' });
			}
			if (!this.showNormal) {
				logs = _.reject(logs, { lvl: 'normal' });
			}
			if (!this.showWarning) {
				logs = _.reject(logs, { lvl: 'warning' });
			}
			if (!this.showError) {
				logs = _.reject(logs, { lvl: 'error' });
			}
			return logs;
		}
	},
	methods: {
		...Vuex.mapActions(['clearLogEvents']),
		getLevelColor(l) {
			switch (l) {
				case 'normal':
					return 'var(--vuestro-success)';
				case 'warning':
					return 'var(--vuestro-warning)';
				case 'error':
					return 'var(--vuestro-danger)';
				default:
					return 'var(--vuestro-info)';
			}
		},
		onShowRaw(d) {
			this.selectedItem = d;
			this.showRaw = true;
		},
	}
};

</script>

<style scoped>

.align-left {
	display: flex;
	flex-wrap: wrap;
}

.ts-format {
	white-space: nowrap;
	padding: 0 10px;
	font-weight: 500;
	color: var(--vuestro-text-color-muted);
}

.log-toolbar {
	font-size: 13px;
	display: flex;
}

.message-column {
	margin-right: 2px;
}

</style>

