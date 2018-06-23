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
				<div class="home-dashboard">
					<div class="user-dashboard">
						<div class="view--x">
							<image-div class="user-image dashboard-user-image" :url="currentUser.userImage"/>
							<div class="extend">
								<h2 class="user-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</h2>
								<div>{{currentUser.mail }} - Member since 5 days</div>
							</div>
							<img src="../assets/images/recommended.svg" alt="" class="recommanded-img">
							<span>98%</span>
						</div>
						<router-link :to="{ name: 'dashboard-market' }">
							<button type="button" class="open-dashboard">Open my dashboard</button>
						</router-link>
					</div>
					<div class="dashboard-numbers">
						<li @click="openMessages()" class="first">
							<div class="number">{{ userStatus.nbMessages ? userStatus.nbMessages : 0 }}</div>
							<div>Messages</div>
							<img src="../assets/images/messages.svg" alt="">
						</li>
						<li class="second">
							<div class="number">{{ userStatus.nbOrders ? userStatus.nbOrders : 0 }}</div>
							<div>Notifications</div>
							<img src="../assets/images/list.svg" alt="">
						</li>
						<li class="no-border third">
							<div class="number">{{ userStatus.nbSells ? userStatus.nbSells : 0 }}</div>
							<div>sold</div>
							<img src="../assets/images/sold.svg" alt="">
						</li>
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
		<div class="home-categories">
			<categories-nav/>
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

.open-dashboard {
	background: rgba(255,255,255,0.8);
	padding: @s-sm @s-md;
	color: @c-text;
	margin-top: @s-sm;
}

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
	height: 20px;
	margin-right: @s-xs;
}

.home-dashboard {
	color: white;
	max-width: 700px;
	margin: 0 auto;
}

.dashboard-numbers {
	display: flex;
	margin-top: @s-md;
	align-items: stretch;
	li {
		padding: @s-sm;
		cursor: pointer;
		flex: 1;
		margin-right: @s-md;
		position: relative;
		text-transform: uppercase;
		font-size: 12.5px;
		font-weight: normal;
	}
	img {
		width: 24px;
		position: absolute;
		top: @s-sm;
		right: @s-sm;
	}
	.number {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: @s-xs;
	}
	.first {
		background: linear-gradient(90deg, rgb(125, 119, 244), rgba(125, 119, 244, 0.5));
	}

	.second {
		background: linear-gradient(90deg, rgb(92, 188, 198), rgba(92, 188, 198, 0.5));
	}

	.third {
		background: linear-gradient(90deg, rgb(215, 126, 107), rgba(215, 126, 107, 0.5));
		margin-right: 0;
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
	width: 48px;
	height: 48px;
	margin-right: @s-sm;
}

.user-dashboard {
	border-bottom: 1px solid @c-darker;
	background: rgb(47, 56, 86);
	padding: @s-sm;
	align-items: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	.view--x {
		align-self: stretch;
	}
}

h1 {
	margin: @s-md 0 @s-sm 0;
}

.user-name {
	text-transform: uppercase;
	font-weight: bold;
	font-size: 15px;
	margin-bottom: @s-xs;
}

.logged {
	background-image: url(https://d2xp4t3rkyux13.cloudfront.net/bg-polygons.png), linear-gradient(90deg, rgb(30, 35, 54), rgb(30, 35, 54));
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
					.catch((err) => {
						console.log(err);
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
