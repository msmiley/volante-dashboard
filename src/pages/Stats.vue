<template>
	<vuestro-container>
		<vuestro-card color="var(--vuestro-indigo)">
			<template #heading>
				<span>Stats</span>
				<span class="log-toolbar">
					<vuestro-button round no-border size="sm" @click="vuestroDownloadAsJson(stats, 'stats.json')">
						<vuestro-icon name="download"></vuestro-icon>
					</vuestro-button>
				</span>
			</template>
			<vuestro-panel stretch>
				<vuestro-table :data="stats" :columns="columns">
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
							<div class="text-center">{{ item.events }}</div>
						</td>
						<td>
							<div class="text-center">{{ item.cpu }}%</div>
						</td>
						<td>
							<div class="text-center">{{ item.memory | vuestroBytes }}</div>
						</td>
					</template>
				</vuestro-table>
			</vuestro-panel>
		</vuestro-card>
	</vuestro-container>
</template>

<script>

/* global Vuex */

export default {
	name: 'Stats',
	data() {
		return {
			columns: [
				{
					title: 'Timestamp',
					field: 'ts',
					sortable: true,
				},
				{
					title: 'Event Count',
					field: 'events',
					sortable: true,
				},
				{
					title: 'CPU Usage',
					field: 'cpu',
					sortable: true,
				},
				{
					title: 'Memory Usage',
					field: 'memory',
					sortable: true,
				},
			]
		};
	},
	computed: {
		...Vuex.mapGetters(["stats"]),
	},
	methods: {
		getLevelColor(l) {
			switch (l) {
				case 'normal':
					return 'var(--vuestro-success)';
				case 'warning':
					return 'var(--vuestro-warning)';
				case 'error':
					return 'var(--vuestro-critical)';
				default:
					return 'var(--vuestro-info)';
			}
		},
	}
};

</script>

<style scoped>

.text-center {
	text-align: center;
}

.ts-format {
	white-space: nowrap;
	padding: 0 10px;
	font-weight: 500;
	color: var(--vuestro-text-color-muted);
}

.log-toolbar {
	font-size: 13px;
}

</style>

