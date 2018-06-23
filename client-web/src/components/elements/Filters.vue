<template>
	<div class="filter-div">
		<div class="filter-title">Price</div>
		<div class="">
			<input type="number" v-model="filters.priceMin" placeholder="min">
			<input type="number" v-model="filters.priceMax" placeholder="max">
		</div>
		<div class="filter-title">Shipping method</div>
		<div class="filter-title">Condition</div>
		<div class="filter-title">Localisation</div>
	</div>
</template>

<script>
	export default {
		name: "FilterDiv",
		props: {
			filters: { type: Object },
		}
	}
</script>
