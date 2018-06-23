<template>
<div class="product-outer">
	<router-link :to="{ name: 'product', params: {productId: productId} }">
		<div class="product">
			<div class="product-preview">
				<image-div v-if="preview" class="product-preview-image" :url="preview"/>
			</div>
			<div class="cell-bottom">
				<div class="cell-categorie" :style="`color: ${ getColor() }`">Automobile</div>
				<div class="cell-name">{{ name }}</div>
				<div class="product-preview-price">{{ priceStr }}</div>
			</div>
		</div>
	</router-link>
</div>
</template>

<style lang="less" scoped>
@import 'variables.less';

.product-outer {
	padding-right: @s-sm;
	float: left;
	margin-bottom: @s-sm;
}

.product {
	background: white;
	border-radius: @s-radius;
	box-shadow: @shadow;
	// border: @border;
}

.cell-bottom {
	padding: @s-sm;
}

.cell-name {
	font-weight: 600;
}

.cell-categorie {
	text-transform: uppercase;
	font-size: 11px;
	font-weight: bold;
	margin-bottom: 2px;
}

.product-preview {
	width: 100%;
	padding-bottom: 100%;
	background: white;
	position: relative;
	border-top-right-radius: @s-radius;
	border-top-left-radius: @s-radius;
	box-shadow: @shadow;
	overflow: hidden;
}

.product-preview-price {
	font-weight: bolder;
	font-size: 14px;
	margin-top: @s-xs;
}

.product-preview-image {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
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
		name: { type: String, default: 'Product' },
		images: { type: Array, default: null },
		productId: { type: Number, default: 0 },
		prices: { type: Object },
	},
	data: function() {
		return {
			price: ""
		}
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
				return this.images[0]
			else
				return null
		},

		colors: function() {
			return this.$store.state.colors
		},

		priceStr: function() {
			return currencies.getStrPrice(this.currentUser.currency, this.prices);
		}
	},
}
</script>
