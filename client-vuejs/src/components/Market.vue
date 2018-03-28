<template>
<div id="main-view">
	<div class="market-header relative">
		<image-div class="market-header-image" :url="market.marketBackground"/>
		<div class="view--max window-padding">
			<div class="market-header-informations view--y">
				<h1>{{ market.firstName }}</h1>
				<div class="extend market-header-description">Descripionte klrngei feoif ejf erf</div>
				<button type="button" class="button--blue" @click="followStore">Follow</button>
				<div class="market-header-informations-bottom">
					Aix en provence
				</div>
			</div>
		</div>
	</div>

	<ul class="market-section-selectors">
		<div class="view--max window-padding">
			<li class="filters-trigger">Filters off</li>
			<li :class="{ activated: !filters.tag }" v-on:click="filters.tag = null">Home</li>
			<li v-for="tag in market.tags" :class="{ activated: filters.tag == tag.tag }" v-on:click="filters.tag = tag.tag">#{{ tag.tag }}</li>
		</div>
	</ul>

	<div class="view--max window-padding">
		<ul class="product-container">
			<product class="cell--4" v-for="product in products" :key="product.productId" v-bind="product"/>
		</ul>
	</div>
</div>
</template>


<style lang="less" scoped>
@import 'variables.less';

.product-container {
	padding-top: @s-md;
}

.market-header {
	width: 100%;
	height: 270px;
	background: white;
	overflow: hidden;

	.view--max {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
}

.market-header-informations {
	width: 300px;
	height: 144px;
	background: white;
	border-top: 0;
	border-bottom-left-radius: @s-radius;
	border-bottom-right-radius: @s-radius;
	overflow: hidden;
	box-shadow: @shadow;

	h1 {
		margin: @s-sm;
	}
}

.market-header-informations-bottom {
	background: @c-dark;
	width: 100%;
	color: white;
	padding: @s-xs @s-sm;
}

.market-header-description {
	margin: @s-sm;
}

.market-header-image {
	width: 100%;
	height: 100%;
	float: left;
}

.market-section-selectors {
	background: white;
	border-top: @border;
	border-bottom: @border;
	.view--max {
		display: flex;
	}
	li {
		padding: @s-sm @s-md;
		color: @c-text-grey;
		border-bottom: 3px solid transparent;
		cursor: pointer;
	}
	li.activated, li:hover:not(.filters-trigger) {
		color: @c-text;
		border-color: @c-1;
	}
	.filters-trigger {
		border-left: @border;
		border-right: @border;
	}
}

</style>

<script>
import ImageDiv from './elements/ImageDiv'
import Filters from './elements/Filters'
import Product from './elements/Product'

export default {
	name: "Market",
	components: {
		ImageDiv,
		Filters,
		Product,
	},
	data: function() {
		return {
			products: [],
			market: {
				tags: [],
			},
			filters: {
				tag: null
			}
		}
	},
	watch: {
		'filters': {
			deep: true,
			handler: function() {
				this.getProducts(this.filters);
			}
		}
	},
	created: function() {
		this.loadMarket()
		this.getProducts({})
	},
	methods: {
		followStore: function() {
			this.$http.post(`/follows/${this.market.userId}`)
				.then(() => {
					// TODO Set followed to true
				})
		},
		getProducts: function(filters) {
			if (this.$route.name == 'market')
				filters.identifier = this.$route.params.identifier;
			else
				filters.userId = this.$route.params.userId;

			this.$http.get('/products/', { params: filters })
				.then((ret) => {
					this.products = ret.body
				}, (err) => {

				})
		},
		loadMarket: function() {
			if (this.$route.name == 'market')
				var query = `/market/${ this.$route.params.identifier}`;
			else
				var query = `/user/${ this.$route.params.userId }/market`;

			this.$http.get(query + '?tags=true')
				.then(ret => {
					this.market = ret.body
				}, err => {

				})
		},
	}
}
</script>
