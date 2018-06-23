<template>
	<div id="main-view">
		<router-view class="auth-child"/>
	</div>
</template>

<style lang="less" scoped>
@import 'variables.less';

#main-view {
	min-height: 90vh;
	display: flex;
	justify-content: center;
	align-items: center;
}

</style>

<style lang="less">
@import 'variables.less';

.auth-child {
	padding: @s-md;
	margin: @s-md;
	background: white;
	border: @border;
	box-shadow: @shadow;
	display: flex;
	flex-direction: column;
	align-items: center;

	.auth-nav {
		font-size: 13px;
		margin-top: @s-sm;
		color: @c-text-grey;
	}

	h1 {
		font-size: 14px;
		font-weight: bolder;
		margin-bottom: @s-sm;
	}

	input {
		width: 250px;
		margin-bottom: @s-md;
	}

	input:focus {
		border-color: @c-2;
	}

	button {
		width: 100%;
	}
}
</style>

<script>
export default {
	name: "Auth",
	computed: {
		routeName: function() {
			return this.$route.name;
		}
	},
}
</script>
