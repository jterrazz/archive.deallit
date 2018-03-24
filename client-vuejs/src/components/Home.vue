<template>
<div id="main-view" class="home-view" :class="{'is-not-logged': !isLogged}">
	<div v-if="!isLogged">
		<div class="login" :style="`background-image: linear-gradient(0, rgba(4, 7, 22, 0.6), rgba(0,0,0,0.3), rgba(0,0,0,0.15)), url(${ env.cdnUrl }assets/home-bg.jpeg)`">
			<div class="">
				Be part of a decentralized economy
			</div>
			<h1>Search anything you want</h1>
			<div class="input-wrap">
				<input type="text" v-model="searched" placeholder="Start searching here" @keyup.enter="search">
				<button type="button" id="search-home-button" @click="search">Search</button>
			</div>

			<button type="button">I want to sell</button>
		</div>
	</div>

	<div v-if="isLogged">
		<div class="logged">
			<div class="view--max window-padding">
				<div class="home-dashboard-user">
					<image-div class="user-image dashboard-user-image" :url="currentUser.userImage"/>
					<div class="extend">
						<div class="user-main-informations view--x">
							<div>
								<h2 class="user-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</h2>
								<div>{{currentUser.mail }} - Member since 5 days</div>
							</div>
							<img src="../assets/images/recommended.svg" alt="" class="recommanded-img">
							<span>98%</span>
						</div>
						<div class="dashboard-numbers">
							<li @click="openMessages()">
								<div class="view--x">
									<img src="../assets/images/envelope.svg" alt="">
									<div>Messages</div>
								</div>
								<div class="number">{{ userStatus.nbMessages ? userStatus.nbMessages : 0 }}</div>
							</li>
							<li>
								<div class="view--x">
									<img src="../assets/images/package.svg" alt="">
									<div>Actions awaiting you</div>
								</div>
								<div class="number">{{ userStatus.nbOrders ? userStatus.nbOrders : 0 }}</div>
							</li>
							<li class="no-border">
								<div class="view--x">
									<img src="../assets/images/coin.svg" alt="">
									<div>sold</div>
								</div>
								<div class="number">{{ userStatus.nbSells ? userStatus.nbSells : 0 }}</div>
							</li>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="user-interactions-wrap">
			<ul class="user-interactions view--max window-padding">
				<router-link :to="{ name: 'dashboard-products' }">
					<li class="main">Manage my sells</li>
				</router-link>

				<router-link :to="{ name: 'sell' }">
					<li>Sell something</li>
				</router-link>
				<router-link :to="{ name: 'settings' }">
					<li>Settings</li>
				</router-link>

			</ul>
		</div>
	</div>

	<div class="view--max window-padding">

		<div class="view--max window-padding">
			<div class="home-categories">
				<categories-nav/>
			</div>
		</div>

		<div>
			<h1 class="bold">New products</h1>
			<div class="product-container">
				<product class="cell--5" v-for="product in lastProducts" :key="product.productId" v-bind="product"/>
			</div>
		</div>

		<div v-if="isLogged">
			<h1 class="bold">Your followed markets</h1>
			<div class="market-container">
				<market v-for="marketProducts in followedWall" :products="marketProducts" :key="marketProducts[0].userId"/>
			</div>
		</div>
	</div>
</div>
</template>

<style lang="less" scoped>
@import 'variables.less';

#main-view.is-not-logged {
	padding-top: 0;
}

.login {
	min-height: 700px;
	background-position: center, center;
	background-repeat: no-repeat, no-repeat;
	background-size: cover, cover;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	color: white;
	position: relative;
	padding: @s-md 0;

	#search-home-button {
		background: @c-text;
		padding: 0 @s-sm;
		font-weight: bold;
		margin-left: @s-xs;
	}

	h1 {
		font-weight: 600;
		font-size: 25px;
	}

	.input-wrap {
		background: rgba(0,0,0,0.1);
		padding: @s-xs;
		display: flex;
		border-radius: @s-radius;
	}

	input {
		background: white;
		color: @c-text;
		border-radius: @s-radius;
		width: 450px;
		padding: @s-sm;
	}

	.explore-categories {
		margin: @s-sm;
		font-weight: 600;
	}
}

.recommanded-img {
	height: 48px;
}

.home-dashboard-user {
	display: flex;
	align-items: flex-start;
	clear: both;
	background: rgba(255, 255, 255, 0.95);
	padding: @s-md;
	border-radius: @s-radius;
	max-width: 700px;
	margin: 0 auto;
}

.dashboard-numbers {
	display: flex;
	margin-top: @s-sm;
	align-items: stretch;
	li {
		border-right: 1px solid @c-darker;
		cursor: pointer;
		flex: 1;
		padding: 0 @s-md;
	}
	.view--x {
		align-items: center;
		height: 24px;
	}
	.no-border {
		border: 0;
	}
	img {
		width: 24px;
		margin-right: @s-xs;
	}
	.number {
		font-size: 48px;
		font-weight: lighter;
	}
}

.user-interactions-wrap {
	background: white;
	padding: @s-sm;
	border-bottom: @border;
}

.user-interactions {
	color: @c-text;
	display: flex;
	li {
		padding: @s-xs @s-sm;
	}
	li:hover {
		text-decoration: underline;
	}

	li.main {
		background: @c-dark;
		border-radius: 500px;
		color: white;
	}
}

.home-categories {
	margin-top: @s-md;
	background: white;
	border-radius: @s-radius;
	box-shadow: @shadow;
}

.dashboard-user-image {
	width: 72px;
	height: 72px;
	margin-right: @s-md;
}

.user-main-informations {
	border-bottom: 1px solid @c-darker;
	padding-bottom: @s-sm;
	flex: 1;
}

h1 {
	margin: @s-md 0 @s-sm 0;
}

.user-name {
	text-transform: uppercase;
	font-weight: bold;
}

.logged {
	background-image: url(https://d2xp4t3rkyux13.cloudfront.net/bg-polygons.png), linear-gradient(90deg, rgb(28, 32, 54), rgb(31, 38, 59), rgb(14, 27, 65));
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	width: 100%;
	.view--max {
		align-items: center;
	}
	padding: @s-topbar 0;
	.view--max {
		align-items: center;
	}
}

.login-form {
	h2 {
		margin-bottom: @s-md;
	}
	background: white;
	border-radius: @s-radius;
	padding: @s-md;
	box-shadow: @shadow;
	align-items: center;
	display: flex;
	flex-direction: column;

	input {
		margin-bottom: @s-sm;
		min-width: 220px;
	}
}
</style>

<script>
import { EventBus } from '../plugins/event-bus'
import ImageDiv from './elements/ImageDiv'
import Market from './elements/Market'
import CategoriesNav from './navigation/Categories'
import Product from './elements/Product'
import jwtDecode from 'jwt-decode'

import env from '../../config'

export default {
	name: "Home",
	components: {
		ImageDiv,
		Market,
		CategoriesNav,
		Product
	},
	data: function() {
		return {
			lastProducts: [],
			followedWall: [],
			loginCredentials: {},
			searched: '',
			env
		}
	},
	computed: {
		userStatus: function() {
			return this.$store.state.status;
		},
		currentUser: function() {
			return this.$store.state.currentUser
		},
		isLogged: function() {
			return !!this.currentUser.userId
		}
	},
	created: function() {
		this.$Progress.start()
		this.getLastProducts()
			.then(() => {
				return this.getWallProducts();
			})
			.then(() => {
				this.$Progress.finish()
			})
	},
	methods: {
		getLastProducts: function() {
			return new Promise((resolve, reject) => {
				this.$http.get('/products')
					.then((ret) => {
						this.lastProducts = ret.body;
						resolve()
					})
			})
		},

		getWallProducts: function() {
			return new Promise((resolve, reject) => {
				this.$http.get('/followed-wall')
					.then(ret => {
						this.followedWall = ret.body;
						resolve();
					})
			});
		},

		openMessages: function() {
			EventBus.$emit('pop-up', 'messages-list');
		},

		search: function() {
			if (this.searched)
				this.$router.push({ name: 'search', params: { searched: this.searched } });
		},
	}
}
</script>
