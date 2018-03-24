<template>
	<div class="pop-up">
		<div class="header view--x">
			<span class="extend">Modify product</span>
			<button v-on:click="updateProduct">Send</button>
		</div>
		<div class="container">
			<label for="">Product name</label>
			<input type="text" v-model="newProduct.name">
			<label for="">Product description</label>
			<input type="text" v-model="newProduct.description">
			<label for="">Product price</label>
			<input type="number" v-model="newProduct.price">
			<label for="">Product quantity</label>
			<input type="number" v-model="newProduct.quantity">
			<select v-model="newProduct.priceType">
				<option value="usd">USD</option>
				<option value="eur">EUR</option>
				<option value="btc">BTC</option>
			</select>
		</div>
    </div>
</template>

<style lang="less" scoped>
@import 'variables.less';

.pop-up {
	max-width: 400px;
	overflow: hidden;
}

.header {
	background: @c-darker;
	width: 100%;
	color: rgb(214, 211, 231);
	padding: @s-sm;
}

.container {
	padding: @s-sm;
}

</style>

<script>
import cloneDeep from 'lodash.clonedeep'

export default {
	name: "PopupModifyProduct",
	computed: {
		newProduct: function() {
			return cloneDeep(this.product);
		}
	},
	props: {
		product: {type: Object}
	},
	methods: {
		updateProduct: function() {
			this.$http.patch('/product', this.newProduct)
				.then(ret => {
					this.product = this.newProduct;
					this.$emit('closePopup');
				}, err => {
					this.$emit('closePopup');
				})
		}
	}
}
</script>
