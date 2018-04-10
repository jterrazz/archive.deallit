<template>
<div id="top-bar-wrap">
	<nav v-if="topBarIsTransparent" id="top-bar" class="transparent">
		<router-link :to="{ name: 'home' }">
			<div id="site-logo">deallit</div>
		</router-link>
		<div class="extend"></div>
		<router-link v-if="!isLogged" :to="{ name: 'register' }">
			<button type="button" class="button--top-bar">Register</button>
		</router-link>
		<router-link v-if="!isLogged" :to="{ name: 'login' }">
			<button type="button" class="button--top-bar">Log In</button>
		</router-link>
	</nav>
	<nav v-if="!topBarIsTransparent" id="top-bar" :class="{ 'top-bar-w-menu': dropdownNavigation }">
		<router-link :to="{ name: 'home' }">
			<div id="site-logo">deallit</div>
		</router-link>

		<router-link :to="{ name: 'home' }">
			<div class="top-bar-el-hover large-padding" :class="{active: route.name === 'home'}">
				Home
			</div>
		</router-link>

		<div class="top-bar-el-hover large-padding" v-on:click="dropdownNavigation = true">
			Categories
		</div>

		<input id="top-bar-input" type="text" name="main-search" value="" v-model="searched" @keyup.enter="search" placeholder="Search" autofocus>

		<router-link v-if="!isLogged" :to="{ name: 'register' }">
			<button type="button" class="button--top-bar button--blue">Register</button>
		</router-link>
		<router-link v-if="!isLogged" :to="{ name: 'login' }">
			<button type="button" class="button--top-bar button--blue">Log In</button>
		</router-link>

		<!-- <router-link v-if="isLogged" :to="{ name: 'payment' }">
			<div class="top-bar-el-hover large-padding" :class="{active: route.name === 'payment'}">
				Waiting payment
			</div>
		</router-link> -->

		<router-link :to="{ name: 'dashboard-products' }">
			<div class="top-bar-el-hover" v-if="isLogged">
				<div class="top-bar-user">
					<image-div class="user-image xs" :url="currentUser.userImage"/>
					<span>My store</span>
				</div>
			</div>
		</router-link>

		<dropdown-status v-if="isLogged"/>
		<dropdown-more v-if="isLogged"/>

		<transition name="menu-transition">
			<div v-if="dropdownNavigation" class="menu-dropdown-content" v-on-clickaway="closeNavigation">
				<div class="view--max window-padding">
					<categories-nav/>
				</div>
			</div>
		</transition>
	</nav>
</div>
</template>

<style lang="less" scoped>
@import 'variables.less';

.transparent {
	#site-logo {
		border-color: white;
		color: white;
	}
	.button--top-bar {
		background: white;
		color: @c-text;
		font-weight: bold;
	}
}

#top-bar-wrap {
	position: absolute;
	left: 0;
	right: 0;
}

.isDashboard {

}

.menu-dropdown-content {
	cursor: auto;
	position: absolute;
	top: @s-topbar;
	left: 0;
	right: 0;
	background: @c-bg;
	border-top: @border;
	border-bottom: @border;
	z-index: 1;
}

#site-logo {
	margin-right: @s-sm;
	color: @c-dark;
	padding: @s-xs 0;
	font-weight: bolder;
	font-family: "Helvetica Neue";
	font-size: 22px;
}

#top-bar {
	width: 100%;
	max-width: 1600px;
	height: @s-topbar;
	position: fixed;
	box-shadow: @shadow;
	color: @c-text-grey;
	z-index: 2;
	font-size: 12.5px;
	user-select: none;
	background: white;

	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;

	display: flex;
	align-items: center;
	padding: 0 @s-md;
}

#top-bar.transparent {
	background: transparent;
	color: white;
	box-shadow: none;
	position: absolute;
}

#top-bar.top-bar-w-menu {
	box-shadow: none;
}

#top-bar-input {
	background: @c-bg-2;
	height: @s-topbar-el;
	flex: 1;
	border-radius: @s-radius;
	margin-right: @s-md;
	margin-left: @s-sm;
	border: 0;
	padding: 0 @s-sm;
}
</style>

<script>
import { mixin as clickaway } from 'vue-clickaway';
import ImageDiv from '../elements/ImageDiv'
import CategoriesNav from './Categories'
import DropdownMore from './dropdowns/DropdownMore';
import DropdownStatus from './dropdowns/DropdownStatus';

export default
{
	name: 'TopBar',
	mixins: [ clickaway ],
	components: {
		ImageDiv,
		CategoriesNav,
		DropdownMore,
		DropdownStatus
	},
	data: function() {
		return {
			searched: '',
			dropdownNavigation: false
		}
	},
	created: function() {
		this.listenRoute()
	},
	watch: {
		$route: 'listenRoute',
	},
	computed: {
		topBarIsTransparent: function() {
			return !this.isLogged && this.route.name == "home";
		},

		currentUser: function() {
			return this.$store.state.currentUser
		},

		isLogged: function() {
			return Object.keys(this.currentUser).length > 0;
		},

		route: function() {
			return this.$route
		}
	},
	methods: {
		listenRoute: function() {
			this.closeNavigation();
		},

		search: function() {
			if (this.searched)
				this.$router.push({ name: 'search', params: { searched: this.searched } });
		},

		closeNavigation: function() {
			this.dropdownNavigation = false;
		}
	}
}
</script>
