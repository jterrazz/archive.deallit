<template>
<div>
	<h1 class="bold">My listing</h1>
	<div class="box">
		<div class="box-header">
			<span class="box-title">Products</span>
		</div>
		<div class="dashboard-input">
			<label for="dashboard-products-input">Filter products</label>
			<input id="dashboard-products-input" type="text" placeholder="Search product" v-model="filters.search">
		</div>
		<div class="dashboard-header">
			<ul class="header-selectors">
				<li class="blue" :class="{on: filters.tag == null}" @click="filters.tag = null">All</li>
				<li v-for="tag in tagsSorted" v-if="tag.nb" class="blue" :class="{on: filters.tag == tag.tag}" @click="filters.tag = tag.tag">#{{ tag.tag }}</li>
			</ul>
		</div>
		<ul class="dashboard-product-list">
			<list-item v-for="product in products" :key="product.productId" :product="product"/>
		</ul>
	</div>
</div>
</template>

<style lang="less" scoped>
@import 'variables.less';

.dashboard-product-list {
	background: rgb(249, 249, 250);
	flex: 1;
	border-top: @border;
}

.dashboard-input {
	margin: @s-sm;
}

.dashboard-header {
	padding: 0 @s-md;
}
</style>

<script>
import arrays from '../../plugins/arrays'
import ListItem from './elements/ListItem'

export default {
	name: "DashboardProducts",
	components: {
		ListItem
	},
	data: function() {
		return {
			products: [],
			tags: [],
			filters: {
				tag: null,
			}
		}
	},
	computed: {
		tagsSorted: function() {
			return this.tags.sort(compare)

			function compare(a, b) {
				if (a.tag < b.tag)
					return -1;
				if (a.tag > b.tag)
					return 1;
				return 0;
			}
		},

		currentUser: function() {
			return this.$store.state.currentUser;
		}
	},
	created: function() {
		this.filters.userId = this.currentUser.userId;
		this.filters.limit = 20;
		this.filters.tags = true;
		this.getProducts();
		this.getTags();
	},
	watch: {
		filters: {
			deep: true,
			handler: function() {
				this.getProducts();
			}
		}
	},
	methods: {
		getProducts: function() {

			this.$http.get('/products', { params: this.filters })
				.then((ret) => {
					this.products = ret.body
				}, (err) => {

				});
		},

		getTags: function() {
			this.$http.get(`/user/${ this.currentUser.userId }/market?tags=1`)
				.then((ret) => {
					this.tags = ret.body.tags
				}, (err) => {

				})
		},
	}
}
</script>
