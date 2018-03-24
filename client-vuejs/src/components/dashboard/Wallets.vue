<template lang="html">
<div class="view--x">
	<div class="wallets">
		<h1 class="bold">Wallets</h1>
		<li class="wallet"	>
			<div class="wallet-header">
				<img src="../../assets/images/bitcoin.svg" alt="">
				<div class="extend">
					<span class="wallet-text-focus">BTC</span><br>
					<span class="wallet-text-description">Bitcoin</span>
				</div>
				<div>
					{{ devMode ? currentUser.tBtcAmount : currentUser.btcAmount }} BTC
				</div>
			</div>
			<div>5000 $</div>
			<div class="wallet-text-description">At current price</div>
			<img src="../../assets/images/down-arrow.svg" class="down-arrow" alt="">
			<div class="wallet-informations">
				<button class="button--sm button--blue">Deposit</button>
				<button class="button--sm button--blue">Withdrawal</button>
			</div>
		</li>
	</div>
	<div class="transactions">
		<h1 class="bold">Last transactions</h1>
		<div class="box">
			<li>
				<div class="date">3 days ago<br>sdgpjidfgdfkj;dgfj;sdjl</div>
				<div class="amount">
					<span class="plus">+</span> 3 BTC
				</div>
			</li>
		</div>
	</div>
</div>
</template>

<style lang="less" scoped>
@import 'variables.less';

.wallet {
	background: @c-dark;
	border-radius: @s-radius;
	color: white;
	font-weight: bold;
	position: relative;
	box-shadow: @shadow;
	overflow: hidden;
}

.wallet-informations {
	background: white;
	padding: @s-sm;
	color: @c-text;
}

.down-arrow {
	width: 18px;
	position: absolute;
	right: @s-sm + 5px;
	bottom: @s-sm + 2px;
}

.wallet-header {
	display: flex;
	align-items: center;
	padding-bottom: @s-sm;
	border-bottom: 1px solid rgb(70, 93, 129);
	margin-bottom: @s-sm;
	img {
		width: 38px;
		margin-right: @s-sm;
	}
}

.wallet-text-focus {
	font-size: 18px;
	line-height: 18px;
}

.wallet-text-description {
	font-size: 13px;
	color: rgb(145, 159, 187)
}

.transactions {
	flex: 1;
}

.wallets {
	margin-right: @s-md;
	flex: 1;
}

.amount {
	display: flex;
	align-items: center;
}

.box {
	width: 100%;
	padding: @s-md;
}

.plus {
	color: rgb(47, 224, 43);
	font-weight: bolder;
	font-size: 20px;
	margin-right: @s-xs;
}

</style>

<script>
export default {
	name: "MyWallets",
	data: function() {
		return {
			devMode: process.env.NODE_ENV === 'development',
		}
	},
	computed: {
		currentUser: function() { return this.$store.state.currentUser },
	},
}
</script>
