<template>
	<vuestro-container>
		<vuestro-card color="var(--vuestro-indigo)">
			<template #heading>
				<span>Logs</span>
				<span class="log-toolbar">
					<vuestro-button pill no-border size="sm" @click="clearLogEvents">
						<icon name="ban"></icon>
						<span>Clear</span>
					</vuestro-button>
				</span>
			</template>
			<vuestro-panel stretch>
				<vuestro-table :data="logEvents" :columns="columns">
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

/* global Vuex */

export default {
	name: 'Logs',
	data() {
		return {
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
					return 'var(--vuestro-critical)';
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
}

</style>

