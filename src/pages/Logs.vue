<template>
	<vuestro-container>
		<vuestro-card color="var(--vuestro-indigo)">
			<template #heading>
				<span>Logs</span>
				<span class="log-toolbar">
					<vuestro-button pill no-border v-model="showDebug" variant="info">Debug</vuestro-button>
					<vuestro-button pill no-border v-model="showNormal" variant="success">Normal</vuestro-button>
					<vuestro-button pill no-border v-model="showWarning" variant="warning">Warning</vuestro-button>
					<vuestro-button pill no-border v-model="showError" variant="danger">Error</vuestro-button>
					<vuestro-button pill no-border @click="clearLogEvents">
						<vuestro-icon name="ban"></vuestro-icon>
						<span>Clear</span>
					</vuestro-button>
					<vuestro-button round no-border @click="vuestroDownloadAsJson(logEvents, 'log.json')">
						<vuestro-icon name="download"></vuestro-icon>
					</vuestro-button>
				</span>
			</template>
			<vuestro-panel stretch>
				<vuestro-table :data="filteredLogEvents" :columns="columns">
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
							<span v-for="o in item.msg" class="align-left">
								<vuestro-pill v-if="typeof(o) == 'string'" :title="o"></vuestro-pill>
								<vuestro-object-browser v-else :data="o"></vuestro-object-browser>
							</span>
						</td>
					</template>
				</vuestro-table>
			</vuestro-panel>
		</vuestro-card>
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
			columns: [
				{
					title: 'Timestamp',
					field: 'ts',
					sortable: true,
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
		};
	},
	computed: {
		...Vuex.mapGetters(["logEvents"]),
		filteredLogEvents() {
			let logs = _.flatMap(this.logEvents, 'eventObj');
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
		}
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

</style>

