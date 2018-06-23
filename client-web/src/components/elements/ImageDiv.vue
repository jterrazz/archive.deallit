<template>
	<div class="centered-div-image" :style="{'background-image': 'url(' + url + ')'}"></div>
</template>

<script>
	export default {
		name: 'ImageDiv',
		props: {
			url: {type: String, default: ''},
		}
	}
</script>

<style>
</style>
