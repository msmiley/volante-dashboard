<template>
	<vuestro-card-container no-wrap>
		<vuestro-card cols="3" color="var(--vuestro-green)">
			<template #heading>Events</template>
			<template #description>
			</template>
			<div>
				<div>
					<vuestro-search-box history></vuestro-search-box>
				</div>
				<div class="events-list">
					<div v-for="e in allEvents" class="event">
						<div class="type">{{ e.eventType }}</div>
						<div>{{ e.ts | vuestroHMS }}</div>
					</div>
				</div>
			</div>
		</vuestro-card>
		<vuestro-card cols="9">
			<vuestro-panel stretch>

			</vuestro-panel>
		</vuestro-card>
	</vuestro-card-container>
</template>

<script>

/* global Vuex */

export default {
	name: 'Events',
	computed: {
		...Vuex.mapGetters(["allEvents"]),
	},
};

</script>

<style scoped>

.event {
	padding: 5px 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: pointer;
}
.event:hover {
	background-color: var(--vuestro-hover);
}
.event > .type {
	font-weight: 600;
	color: var(--vuestro-indigo);
}

</style>

