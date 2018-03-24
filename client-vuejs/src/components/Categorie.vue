<template>
<div id="main-view" class="categorie-view">
	<div class="header-title">
		<div class="view--max window-padding">
			<h1>{{ route.nameEng }}</h1>
			<ul class="header-selectors">
				<li class="on">Home</li>
				<li>Last products</li>
				<li>Best stores</li>
			</ul>
		</div>
	</div>

	<div class="view--max window-padding">
		<ul class="sub-categories-list">
			<li v-for="tag in route.tags">
				<image-div class="sub-categories-list-image" :url="tag.image" />
				<span class="sub-categories-list-name">#{{ tag.name }}</span>
			</li>
		</ul>

		<div class="categorie-container">
			<h1>New products</h1>
			<div class="product-container">
				<product class="cell--5" v-for="product in lastProducts" :key="product.productId" v-bind="product" />
			</div>
		</div>
	</div>
</div>
</template>

<style lang="less" scoped>
@import 'variables.less';

.header-title {
	width: 100%;
	background: @c-darker;
	color: white;
	padding-top: @s-sm;
}

</style>

<script>
import ImageDiv from './elements/ImageDiv'
import Product from './elements/Product'

export default
{
	name: "CategorieView",
	components: {
		ImageDiv,
		Product
	},
	data: function() {
		return {
			lastProducts:
			{},
		}
	},
	watch: {
		$route: 'updateNav'
	},
	created() {
		this.updateNav();
		this.getLastProducts();
	},
	computed: {
		paths: function() {
			return [
			{
				name: this.route.name,
				path: this.$route.fullPath
			}];
		},
		route: function() {
			return searchPathInArray(this.$route.params.categorieName, this.$store.state.categories);
		},
	},
	methods: {
		getLastProducts: function() {
			var params = {
				categorie: this.route.id
			}
			this.$http.get('/products', {
					params: params
				})
				.then((ret) => {
					this.lastProducts = ret.body;
				})
		},
		updateNav: function() {
			if (this.route === null)
				this.$router.push('/')
			else {
				this.getLastProducts();
			}
		}
	}
}

function searchPathInArray(key, myArray) {
	for (var i = 0; i < myArray.length; i++)
	{
		if (myArray[i].id === key)
		{
			return myArray[i];
		}
	}
	return null
}
</script>
