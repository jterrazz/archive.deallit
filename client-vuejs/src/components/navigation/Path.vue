<template>
	<div class="view--max window-padding">
		<nav class="path">
			<router-link :to="{ name: 'home' }">Home</router-link>
			<span v-for="path in paths"> <span class="path-separator">></span> <router-link :to="path.path">{{ path.name }}</router-link></span>
		</nav>
	</div>
</template>

<script>
	export default {
		name: "PathNav",
		props: {
			paths: {type: Array, default: function() { return [] }}
		},
		created: function() {

		}
	}
</script>

<style>
</style>
