<template>
	<ul class="categories-nav">
		<router-link class="cat" v-for="cat in categories" :key="cat.categorieId" :to="{ name: 'categorie', params: { categorieName: cat.id} }">
			<li>
				<img :src="cat.imageUrl" :alt="cat.nameEng">
				<span class="cat-name">{{ cat.nameEng }}</span>
			</li>
		</router-link>
	</ul>
</template>

<script>
import env from '../../../config';

export default {
	name: "CategoriesNav",
	data: function() {
		return {
			categories: []
		}
	},
	created: function() {
		this.categories = this.$store.state.categories;
		this.categories.forEach(cat => {
			cat.imageUrl = `${ env.cdnUrl }assets/${ cat.id }.svg`
		})
	},
}
</script>

<style lang="less" scoped>
@import 'variables.less';

.categories-nav {
	display: flex;
	align-items: stretch;
	width: 100%;
	.cat {
		width: 10%;
	}
	li {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: @s-sm;
		img {
			width: 48px;
			margin-bottom: @s-xs;
		}
	}
}

.cat-name {
	font-size: 11px;
	text-transform: uppercase;
	font-weight: bolder;
}
</style>
