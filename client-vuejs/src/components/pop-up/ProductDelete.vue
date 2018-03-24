<template>
	<div class="pop-up">
		<div class="header">
			<div class="product">
				<image-div :url="product.preview" class="preview"/>
				<div class="name">{{ product.name }}</div>
			</div>
			<span>Are you sure to delete this product ?</span>
		</div>
		<button class="button--xl button--blue" @click="deleteProduct">Yes</button>
		<div class="close" @click="close">Close</div>
    </div>
</template>

<style lang="less" scoped>
@import 'variables.less';
.preview {
	width: 200px;
	height: 200px;
}

.name {
	padding: @s-sm;
}

.product {
	background: white;
	color: @c-text;
	border-radius: @s-radius;
	overflow: hidden;
	width: 200px;
}

span {
	font-weight: 600;
	padding-top: @s-md;
}

.header {
	background: @c-darker;
	padding: @s-lg;
	padding-bottom: @s-md;
	color: white;
	text-align: center;
	align-self: stretch;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.pop-up {
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: hidden;
}

.button--blue {
	margin-top: @s-md;
}

.close {
	margin: @s-sm;
	font-weight: 600;
	color: @c-text-grey;
	cursor: pointer;
}

</style>

<script>
import ImageDiv from '../elements/ImageDiv'

export default {
	name: "PopupModifyProduct",
	components: {
		ImageDiv,
	},
	props: {
		product: {type: Object}
	},
	methods: {
		deleteProduct: function() {
			this.$http.delete(`/product/${ this.product.productId }`)
				.then(ret => {
					this.$router.push('/');
					this.$emit('closePopup');
				}, err => {
					this.$emit('closePopup');
				})
		},
		close: function() {
			this.$emit('closePopup');
		}
	}
}
</script>
