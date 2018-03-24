<template>
<div id="main-view" class="product-view">
	<div class="window-padding view--max">
		<div class="store-header">
			<image-div :url="product.userImage" class="store-header-image user-image"/>
			<h1>{{ product.name }}</h1>
		</div>
	</div>

	<path-nav :paths="paths"/>

	<div class="window-padding view--max">
		<div class="product-wrapper">
			<div class="view--x">
				<div class="product-div">
					<image-div class="product-preview-image" :url="product.preview"/>
					<div class="product-div-text">
						<span class="tag">1 shot</span><h1>{{ product.name }}</h1>
						<div class="product-description">{{ product.description ? product.description : "No description" }}</div>
					</div>
				</div>

				<div class="right-div">
					<div class="seller-div">
						<router-link v-if="product.creatorId" :to="{ name: 'user-market', params: { userId: product.creatorId } }">
								<image-div :url="product.userImage" class="user-image user-image--md"/>
								{{ product.firstName }} {{ product.lastName }}
						</router-link>
						<div>Sold by {{ product.firstName }} {{ product.lastName }} - {{ product.city }} ffffrance - 322222 fevrier</div>
						ratings
						5 last products small previews
					</div>
					<div class="product-price">{{ priceStr }}</div>
					<div class="product-interactions">
						<button class="button--xl button--red" @click="buyProduct" v-if="!isMine">Buy</button>
						<button class="button--xl" @click="contactSeller" v-if="!isMine">Contact seller</button>
						<button class="button--xl button--blue" @click="modifyProduct" v-if="isMine">Modify</button>
						<button class="button--xl" @click="deleteProduct" v-if="isMine">Remove</button>
					</div>
					Interessant - Partager
					<h2>Condition</h2>
					<h2>Shipping</h2>
				</div>
			</div>

			<div class="product-separator"></div>
			<h2>Avis des utilisateurs</h2>
			<p>This product will only be sold once, here are other ratings from the seller</p>

			<div class="ratings-header">
				<span class="rating">4,5</span> sur 5
			</div>

			<div class="ratings-container">
				<li v-for="rating in product.ratings">
					<div class="rating-el-box">
						<div class="view--x rating-header">
							<div>
								<h3>Super !</h3>
								<div>5/5</div>
							</div>
							<div>
								<div>10 septembre 2011</div>
								<div>Jean Baptiste T.</div>
							</div>
						</div>
					</div>
				</li>
			</div>

			<div class="product-separator"></div>
			<h2>Informations detaillees</h2>

			<div class="product-separator"></div>
		</div>
	</div>
</div>
</template>

<style lang="less" scoped>
@import 'variables.less';

h1 {
	font-weight: bold;
}

h2 {
	margin-bottom: @s-xs;
	font-weight: bold;
}

.product-wrapper {
	background: white;
	border-radius: @s-radius;
	border: @border;
	padding: @s-md;
}

.store-header {
	display: flex;
	margin: @s-md;
}

.store-header-image {
	margin-right: @s-md;
	width: 72px;
	height: 72px;
}

.product-description {
	color: @c-text-clear;
	margin-top: @s-sm;
}

.product-div {
	width: 60%;
	border-radius: @s-radius;
	margin-right: @s-md;
	background: white;
	overflow: hidden;
	box-shadow: @shadow;
}

.product-div-text {
	padding: @s-sm;
}

.product-preview-image {
	height: 360px;
	width: 100%;
}

.seller-div {
	background: white;
	border-radius: @s-radius;
	padding: @s-md;
	box-shadow: @shadow;
}

.right-div {
	flex: 1;
}

.product-price {
	color: @c-red;
	font-size: 24px;
	margin: @s-sm 0;
	font-weight: 400;
}

.product-interactions {
	button {
		width: 100%;
		margin-bottom: @s-sm;
	}
}

.ratings-header {
	.rating {
		font-size: 40px;
		color: @c-text;
		font-weight: bold;
	}
	color: @c-text-grey;
}

.ratings-container {
	display: flex;
	align-items: stretch;
	margin-top: @s-sm;
	li {
		width: 100/3%;
		padding-right: @s-md;
	}

	.rating-el-box {
		background: white;
		border-radius: @s-radius;
		width: 100%;
		padding: @s-sm;
	}
}

.rating-header {
	justify-content: space-between;
}

.product-separator {
	width: 100%;
	border-top: 1px solid @c-border;
	margin: @s-md 0;
}

</style>

<script>
	import PathNav from './navigation/Path'
	import ImageDiv from './elements/ImageDiv'
	import currencies from '../plugins/currencies';
	import { EventBus } from '../plugins/event-bus'

	export default {
		name: "ProductPage",
		components: {
			PathNav,
			ImageDiv
		},
		data: function() {
			return {
				product: {},
				productId: null
			}
		},
		computed: {
			paths: function() {
				return [
					{ name: this.product.nameEng, path: '/c/' + this.product.categorieId },
					{ name: this.product.name, path: '/product/' + this.productId }
				]
			},

			isMine: function() {
				return this.product.creatorId == this.$store.state.currentUser.userId;
			},

			currentUser: function() {
				return this.$store.state.currentUser
			},

			priceStr: function() {
				if (this.product.prices)
					return currencies.getStrPrice(this.currentUser.currency, this.product.prices);
				return "";
			}
		},
		created: function() {
			this.$Progress.start()
			this.productId = this.$route.params.productId;
			this.getProduct()
				.then(() => {
					this.$Progress.finish()
				})
		},
		methods: {
			getProduct: function() {
				return new Promise((resolve, reject) => {
					this.$http.get('/product/' + this.productId)
						.then((data) => {
							this.product = data.body
							this.product.ratings = [{}, {}, {}]
							resolve()
						}, (err) => {
							reject()
						})
				})
			},

			modifyProduct: function() {
				EventBus.$emit('pop-up', 'modify-product', this.product)
			},

			deleteProduct: function() {
				EventBus.$emit('pop-up', 'delete-product', this.product)
			},

			contactSeller: function() {
				var user = {
					userId: this.product.creatorId,
					userImage: this.product.userImage,
					firstName: this.product.firstName,
					lastName: this.product.lastName
				}
				EventBus.$emit('pop-up', 'message', user)
			},

			buyProduct: function() {
				EventBus.$emit('pop-up', 'buy', this.product)
			}
		}

	}
</script>
