<template>
	<div id="main-view">
		<path-nav :paths="paths"/>
		<div class="view--max window-padding">
			<h1>Results for {{ searched }}</h1>

			<div class="product-container">
				<product-list class="cell--5" v-for="product in products" :key="product.productId" :product="product"/>
			</div>
		</div>
	</div>
</template>

<script>
import PathNav from './navigation/Path';
import ProductList from './elements/ProductList';

export default {
	name: "Search",
	components: {
		PathNav,
		ProductList
	},
	watch: {
		$route: function() {
			this.getSearch();
		}
	},
	data: function() {
		return {
			products: []
		}
	},
	computed: {
		paths: function() {
			return [{ name: 'Search', path: this.$route.fullPath}];
		},
		searched: function() {
			return this.$route.params.searched;
		}
	},
	created: function() {
		this.getSearch();
	},
	methods: {
		getSearch: function() {
			this.$http.get(`/s/${ this.searched }`)
				.then(ret => {
					this.products = ret.body;
				}, err => {

				})
		}
	}
}
</script>
