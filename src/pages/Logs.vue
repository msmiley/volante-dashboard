<template>
	<vuestro-card-container>
		<vuestro-card color="var(--vuestro-indigo)">
			<template #heading>Logs</template>
			<vuestro-panel stretch>
				<vuestro-table :data="logEvents" :columns="columns">
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
								<vuestro-pill v-for="(v,k) in o" :title="k" :value="v"></vuestro-pill>
							</span>
						</td>
					</template>
				</vuestro-table>
			</vuestro-panel>
		</vuestro-card>
	</vuestro-card-container>
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

</style>

