<template>
	<div class="">
		<h1 class="bold">Categories</h1>
		<div class="categorie-wrap">
			<div class="categorie">

			</div>
			<h2 class="categorie-name">Create a categorie</h2>
		</div>
	</div>
</template>

<style lang="less" scoped>
@import 'variables.less';

.categorie {
	width: 245px;
	height: 160px;
	background: @c-bg-2;
	border-radius: @s-radius;
}

h2 {
	font-weight: bold;
	font-size: 15px;
	color: @c-text-clear;
	margin: @s-sm;
}
</style>

<script>
export default {
	name: "DashboardCategories"
}
</script>
