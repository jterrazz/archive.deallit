<template>
<div id="main-view">
	<div class="box payment-box">
		<div class="header">
			<h1>Payments</h1>
		</div>

		<div class="header-white">
			<ul class="currency-cards">
				<li><img src="../assets/images/bitcoin.svg" alt="bitcoin">Bitcoin</li>
				<li><img src="../assets/images/ethereum.svg" alt="ethereum">Ethereum</li>
			</ul>
			<div class="">
				Your order is worth 52 BTC<br>
				You already have {{ selectedWalletValue }} {{ selectedCurrency }}
				You have to pay 42 BTC<br>
			</div>
			<ul class="sections">
				<li @click="showScan = true">Scan</li>
				<li @click="showScan = false">Manually</li>
			</ul>
		</div>

		<div class="payment-addresses">
			<div v-if="showScan">
				<img v-if="walletAddress" :src="`https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=bitcoin:${ walletAddress }?amount=0.005`" alt="">
			</div>
			<div v-if="!showScan">
				<div class="">
					Pay to the following address : {{ walletAddress }}
				</div>
			</div>
		</div>

		<div v-if="!status">
			Waiting for you to send {{ toPay.btc }} BTC
		</div>
		<div v-if="status == 'received'" v-for="transaction in transactions">
			Received {{ transaction.value }} {{ transaction.currency }} - {{ transaction.confirmations }} confirmations
		</div>
		<div v-if="connected" class="connected">
			Connected
		</div>
	</div>
	<div class="box">
		<h1>Orders</h1>
		<div v-for="order in orders" class="">
			<div>{{ order.name }}</div>
			<div>{{ order.price }}</div>
			<div>{{ order.currency }}</div>
			<div> The BTC amount has been locked for 30 minutes : {{ order.toPayBtc }}</div>
			<div class="payed" v-if="order.payed">
				This has been payed !!!!
			</div>

		</div>
	</div>
</div>
</template>

<script>
import ImageDiv from './elements/ImageDiv';
import io from 'socket.io-client';

// TODO CHECK ITS THE USER PAYMENT  !!!
export default {
	name: "Payment",
	components: {
		ImageDiv
	},
	data: function() {
		return {
			selectedCurrency: 'tBTC',
			socket: null,
			status: null,
			connected: false,
			walletAddress: null,
			orders: [],
			transactions: [],
			showScan: true
		}
	},
	computed: {
		currentUser: function() { return this.$store.state.currentUser },
		selectedWalletValue: function() {
			switch (this.selectedCurrency) {
				case 'BTC':
					return this.currentUser.btcAmount;
				case 'tBTC':
					return this.currentUser.tBtcAmount;
				default:
					return 0;
			}
		},
		toPay: function() {
			var totalBtc = 0;
			var totalEth = 0;
			this.orders.forEach(order => {
				totalBtc += order.toPayBtc;
				totalEth += order.toPayEth;
			})
			return {
				btc: totalBtc,
				eth: totalEth
			}
		}
	},
	created: function() {
		this.setWallet();
		this.setOrders(() => {
			this.setSockets();
		});
	},
	destroyed: function() {
		if (this.socket)
			this.socket.disconnect();
	},
	methods: {
		setWallet: function() {
			this.$http.get('/wallet/BTC')
			.then(data => {
				this.walletAddress = data.body.publicAddress;
			}, err => {

			})
		},
		setOrders: function(callback) {
			this.$http.get('/orders')
				.then(data => {
					this.orders = data.body;
					callback();
				}, err => {

				})
		},
		setSockets: function() {
			const self = this;
			this.socket = io(`http://localhost:${ process.env.NODE_ENV == 'development' ? 4242 : 442 }`);

			this.socket.on('connect', function() {
				self.connected = true;

				self.socket.emit('monitor-payments', self.currentUser.userId)

				self.socket.on('deposit', function(transaction) {
					self.status = 'received';
					var oldTransaction = self.transactions.find(el => el.hash === transaction.hash);

					if (oldTransaction)
						oldTransaction.confirmations = transaction.confirmations;
					else
						self.transactions.push(transaction); // TODO Check transaction ID and update if the same
				});

				self.socket.on('order-confirmation', function(orders) {
					orders.forEach(order => {
						self.orders.forEach(localOrder => {
							if (localOrder.orderId == order)
								localOrder.payed = true;
						})
					})
				})
			});

			this.socket.on('disconnect', function() {
				self.connected = false;
			});
		}
	}
}
</script>

<style lang="less" scoped>
@import 'variables.less';

#main-view {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.payed {
	color: green;
}

.sections {
	display: flex;
	border: @border;
	border-radius: @s-radius;
	li {
		flex: 1;
		text-align: center;
		padding: @s-xs;
	}
}

.payment-addresses {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.header-white {
	background: white;
	width: 100%;
	padding: @s-sm;
	box-shadow: @md-shadow;
}

.currency-cards {
	display: flex;
	width: 100%;
	padding-bottom: @s-sm;
	border-bottom: @border;
	margin-bottom: @s-sm;
	li {
		width: 120px;
		height: 80px;
		border-radius: @s-radius;
		border: @border;
		box-shadow: @shadow;
		margin-right: @s-sm;
		background: white;
		color: @c-text;
		font-weight: 600;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		img {
			width: 30px;
			margin-bottom: @s-xs;
		}
	}
}

.header {
	background: @c-blue;
	color: white;
	h1 {
		font-size: 16px;
		font-weight: 600;
		padding: @s-sm;
	}
}

.connected {
	color: rgb(36, 200, 52);
}

.payment-box {
	margin: 0 auto;
	width: 450px;
	margin-top: @s-md;
	overflow: hidden;
	background: @c-bg;
	box-shadow: @md-shadow;
}
</style>
