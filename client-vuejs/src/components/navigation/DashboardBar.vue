<template lang="html">
<ul class="dashboard-bar">

	<h2>Market</h2>
	<router-link :to="{ name: 'dashboard-market' }">
		<li :class="{ on: route.name == 'dashboard-market' }"><img src="../../assets/images/online-shop.svg" alt="">Presentation</li>
	</router-link>
	<!-- <router-link :to="{ name: 'dashboard-categories' }">
		<li :class="{ on: route.name == 'dashboard-categories' }"><img src="../../assets/images/tag.svg" alt="">Categories</li>
	</router-link> -->
	<router-link :to="{ name: 'dashboard-products' }">
		<li :class="{ on: route.name == 'dashboard-products' }"><img src="../../assets/images/package-1.svg" alt="">Products</li>
	</router-link>
	<router-link :to="{ name: 'user-market', params: { userId: currentUser.userId } }">
		<li class="dashboard-button--white">Visit <img class="right-arrow" src="../../assets/images/right-arrow.svg"/></li>
	</router-link>

	<div class="dashboard-separator"></div>
	<h2>User</h2>

	<router-link :to="{ name: 'wallets' }">
		<li :class="{ on: route.name == 'wallets' }"><img src="../../assets/images/megaphone.svg" alt="">Wallet</li>
	</router-link>
	<router-link :to="{ name: 'dashboard-todo' }">
		<li :class="{ on: route.name == 'dashboard-todo' }"><img src="../../assets/images/megaphone.svg" alt="">Orders</li>
	</router-link>
	<router-link :to="{ name: 'settings' }">
		<li>Preferences</li>
	</router-link>
	<router-link :to="{ name: 'settings' }">
		<li>Security</li>
	</router-link>
</ul>
</template>

<script>
export default {
	name: "DashboardBar",
	computed: {
		currentUser: function() { return this.$store.state.currentUser },
		route: function() { return this.$route }
	}
}
</script>

<style lang="less" scoped>
@import 'variables.less';

@c-separator: @c-border;

h2 {
	padding: @s-sm @s-md;
	padding-bottom: @s-xs;
	font-size: 13px;
	font-weight: bold;
	color: rgb(99, 127, 167);
}

.user-image {
	margin-right: @s-sm;
}

.right-arrow {
	height: 16px;
}

.member-since {
	font-size: 12px;
	color: @c-text-clear;
}

.dashboard-user {
	padding: @s-md;
}

.dashboard-separator {
	align-self: stretch;
	border-top: 1px solid @c-separator;
	margin: @s-xs 0;
}

.dashboard-store-name {
	font-size: 16px;
}

.dashboard-bar {
	position: absolute;
	left: 0;
	top: @s-topbar;
	bottom: 0;
	width: @s-dashboard-bar;
	background: @c-bg-2;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	color: rgb(235, 235, 235);
	font-weight: bold;
	border-right: @border;
	li {
		padding: @s-sm @s-md;
		display: flex;
		align-items: center;
		color: @c-text;
		opacity: 0.45;
		img {
			opacity: 0.5;
			width: 18px;
			margin-right: @s-md - 4px;
		}
	}
	li.on, li:hover {
		opacity: 1;
		background: @c-dark;
		color: white;
		img {
			opacity: 1;
		}
	}
}

</style>
