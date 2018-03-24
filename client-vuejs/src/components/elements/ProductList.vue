<template>
<router-link :to="{ name: 'product', params: {productId: product.productId} }">
	<div class="product view--x">
		<image-div :url="product.preview" class="preview"/>
		<div class="informations">
			<div class="categorie" :style="`color: ${ getColor() }`">Categorie Name (sql)</div>
			<div class="name">{{ product.name }}</div>
			<div class="price">{{ priceStr }}</div>
		</div>
		<div class="seller">
			Seller
			Ratings
		</div>
	</div>
</router-link>
</template>

<style lang="less" scoped>
@import 'variables.less';

.product {
	background: white;
	box-shadow: @shadow;
	max-width: 700px;
	margin-right: @s-md;
	margin-bottom: @s-md;
	border-radius: @s-radius;
	overflow: hidden;
}

.informations {
	padding: @s-sm;
}

.name {
	font-size: 18px;
}

.categorie {
	text-transform: uppercase;
	font-size: 12px;
	font-weight: bolder;
}

.preview {
	width: 180px;
	height: 180px;
}

.price {
	font-weight: bolder;
	font-size: 17px;
}

.seller {
	align-self: stretch;
	border-left: @border;
}
</style>

<script>
import ImageDiv from './ImageDiv';
import currencies from '../../plugins/currencies';

export default {
	name: "Product",
	components: {
		ImageDiv,
	},
	props: {
		product: { type: Object }
	},
	methods: {
		getColor: function() {
			return this.colors[Math.floor(Math.random() * this.colors.length)]
		}
	},
	computed: {
		currentUser: function() {
			return this.$store.state.currentUser
		},

		preview: function() {
			if (this.images && this.images.length)
				return this.product.images[0]
			else
				return null
		},

		colors: function() {
			return this.$store.state.colors
		},

		priceStr: function() {
			return currencies.getStrPrice(this.currentUser.currency, this.product.prices);
		}
	},
}
</script>
