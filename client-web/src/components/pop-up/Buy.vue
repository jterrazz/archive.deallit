<template>
<div class="pop-up">
	<div>You want more informations ?</div>
	<button>Contact the seller : phone / online message</button>
	<h2>Delivery</h2>
	<div class="view--x">
		<input id="delivery-in-person" type="radio" v-model="order.delivery" value="in_person">
		<label class="delivery-selector" for="delivery-in-person">
			<img class="delivery-icon" src="../../assets/images/box.svg" alt="">
			In person
		</label>
		<input id="delivery-postal" type="radio" v-model="order.delivery" value="postal">
		<label class="delivery-selector" for="delivery-postal">
			<img class="delivery-icon" src="../../assets/images/employees.svg" alt="">
			Postal package
		</label>
	</div>
	<h2>Payment</h2>
	<input type="radio" v-model="order.payment" value="cash">
	CASH
	<input type="radio" v-model="order.payment" value="credit_card_in_person">
	CC IN PERSON
	<input type="radio" v-model="order.payment" value="crypto">
	BITCOIN / ETHEREUM
	<button @click="sendOrder">Confirm</button>
</div>
</template>

<script>
export default {
	name: "PopupBuy",
	props: {
		product: { type: Object },
	},
	data: function() {
		return {
			order: {}
		}
	},
	created: function() {
		this.order.productId = this.product.productId;
	},
	methods: {
		sendOrder: function() {
			this.$http.post('/orders', this.order)
				.then(ret => {

				}, err => {

				})
		}
	}
}
</script>
