<template lang="html">
<div class="market">
	<router-link :to="{ name: 'product', params: {productId: products[0].productId} }">
		<image-div :url="products[0].preview" class="market-first-product"/>
	</router-link>
	<div class="extend right-div">
		<router-link :to="{ name: 'user-market', params: { userId: products[0].creatorId } }">
			<h2>{{ products[0].firstName }} store</h2>
			<div class="">
				Ratings
			</div>
			<div class="">
				42222 produtcs
			</div>
			<div class="">
				#clothe #blabla # blaball
			</div>
		</router-link>
		<div class="market-other-products view--x">
			<router-link class="market-other-product-wrap" v-for="(product, i) in products" :key="product.productId" v-if="i < 7 && i > 0" :to="{ name: 'product', params: {productId: product.productId} }">
				<image-div :url="product.preview" class="market-other-product"/>
			</router-link>
		</div>
	</div>
</div>
</template>

<script>
import ImageDiv from './ImageDiv';

export default {
	name: "MarketList",
	components: {
		ImageDiv
	},
	props: {
		products: {type: Object}
	},
}
</script>

<style lang="less" scoped>
@import 'variables.less';

.right-div {
	margin-left: @s-md;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
h2 {
	font-weight: bold;
}

.market {
	display: flex;
	margin-bottom: @s-md;
	overflow: hidden;
}

.market-first-product {
	width: 300px;
	height: 300px;
	border-radius: @s-radius;
}

.market-other-product-wrap {
	width: 100/6%;
	padding-right: @s-xs;
}

.market-other-product {
	width: 100%;
	padding-bottom: 100%;
	border-radius: @s-radius;
	float: left;
}
</style>
