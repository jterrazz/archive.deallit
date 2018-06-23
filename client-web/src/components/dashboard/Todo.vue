<template>
	<div class="">
		<h1 class="bold">TO DO</h1>
		<div class="box">
			<div class="box-header">
				<span class="box-title">Buying orders</span>
			</div>
			<ul class="orders">
				<div class="no-orders" v-if="!buyerOrders.length">No orders</div>
				<li v-for="order in buyerOrders">
					<image-div :url="order.preview" class="order-preview"/>
					{{ order.name }}
					<span class="tag" v-if="order.payed">Payed</span>
					<router-link v-if="!order.payed" :to="{ name: 'payment' }">
						<span class="tag">Waiting for payment</span>
					</router-link>
				</li>
			</ul>
		</div>
		<div class="box">
			<div class="box-header">
				<span class="box-title">Selling orders</span>
			</div>
			<ul class="orders">
				<div class="no-orders" v-if="!sellerOrders.length">No orders</div>
			</ul>
		</div>
		<div class="box">
			<div class="box-header">
				<span class="box-title">Finished orders</span>
			</div>
			<ul class="orders">
				<div class="no-orders" v-if="1">No orders</div>
			</ul>
		</div>
	</div>
</template>

<style lang="less" scoped>
@import 'variables.less';

.order-preview {
	width: 42px;
	height: 42px;
	border-radius: @s-radius;
	margin-right: @s-sm;
}

.box {
	margin-bottom: @s-md;
}

.orders {
	background: @c-bg;

	li {
		display: flex;
		align-items: center;
		padding: @s-xs @s-md;
	}
}

.no-orders {
	padding: @s-sm @s-md;
}

</style>

<script>
import ImageDiv from '../elements/ImageDiv';

export default {
	name: "DashboardTodo",
	components: {
		ImageDiv
	},
	data: function() {
		return {
			buyerOrders: [],
			sellerOrders: []
		}
	},
	created: function() {
		this.$http.get('/orders')
			.then(ret => {
				this.buyerOrders = ret.body;
			}, err => {

			})
	}
}
</script>
