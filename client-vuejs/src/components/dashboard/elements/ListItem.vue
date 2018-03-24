<template>
	<li class="dashboard-product-el">
		<image-div class="product-list-image" :url="product.preview" />
		<div class="extend">{{ product.name }}</div>

		<input-tag :on-change="updateTags" :tags="product.tags"></input-tag>

		<div class="quantity">{{ product.quantity }}</div>
		<div class="price">{{ product.price }} $</div>
		<div class="list-dropdown">
			<span @click="dropdown">Actions</span>
			<ul v-if="isDropped" class="list-dropdown-content" v-on-clickaway="closeDropdown">
				<li @click="modifyProduct">Modify</li>
				<li @click="deleteProduct">Delete</li>
			</ul>
		</div>
	</li>
</template>

<style lang="less" scoped>
@import 'variables.less';

.dashboard-product-el {
	display: flex;
	align-items: center;
	padding: @s-xs @s-md;
	border-bottom: @border;

	.quantity, .price {
		text-align: right;
	}
	.quantity {
		min-width: 40px;
		margin: 0 @s-sm;
	}
	.price {
		min-width: 40px;
		margin: 0 @s-sm;
	}
}

.product-list-image {
	background-color: @c-grey;
	height: 42px;
	width: 42px;
	border-radius: @s-radius;
	margin-right: @s-sm;
}

</style>

<script>
import { EventBus } from '../../../plugins/event-bus'
import { mixin as clickaway } from 'vue-clickaway';
import InputTag from 'vue-input-tag'
import ImageDiv from '../../elements/ImageDiv'

export default {
	name: "ListElement",
	mixins: [ clickaway ],
	components: {
		ImageDiv,
		InputTag
	},
	props: {
		product: {type: Object},
	},
	computed: {
		image: function() {
			return ((this.images && this.images.length) ? this.images[0] : null)
		}
	},
	data: function() {
		return {
			isDropped: false
		};
	},
	methods: {
		dropdown: function() {
			this.isDropped = true;
		},

		closeDropdown: function() {
			this.isDropped = false;
		},

		updateTags: function() {
			var options = {
				tags: this.product.tags,
			}
			this.$http.patch(`/product/${ this.product.productId }/tags`, options)
				.then((ret) => {

				}, (err) => {

				})
		},

		deleteProduct: function() {
			this.$http.delete(`/product/${ this.product.productId }`)
				.then(() => {
					this.isDropped = false;
				}, err => {

				})
		},

		modifyProduct: function() {
			EventBus.$emit('pop-up', 'modify-product', this.product)
		}
	}
}
</script>
