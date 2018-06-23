<template>
	<div class="dropdown top-bar-logo" v-bind:class="{ active: isActive }">
		<div class="image-hover top-bar-el-hover" v-on:click="isActive = true">
			<img src="../../../assets/images/more.svg" alt="" class="more">
		</div>
		<transition name="dropdown-transition">
			<ul v-if="isActive" class="dropdown-content more" v-on-clickaway="close">
				<div class="dropdown-currency">
					<div>Currency :</div>
					<select v-model="currency" @selected="changeCurrency">
						<option value="usd">USD</option>
						<option value="eur">EUR</option>
					</select>
				</div>

				<div class="list-separator"></div>
				<li>Orders</li>

				<div class="list-separator"></div>
				<router-link :to="{ name: 'sell' }"><li>New sell</li></router-link>
				<router-link :to="{ name: 'dashboard-products' }"><li>Sell dashboard</li></router-link>
				<router-link :to="{ name: 'user-market', params: { userId: currentUser.userId } }"><li>My store</li></router-link>
				<router-link :to="{ name: 'settings' }"><li>Settings</li></router-link>

				<div class="list-separator"></div>
				<li @click="logout">Disconnect</li>
			</ul>
		</transition>
	</div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway';

export default {
	name: "DropdownMore",
	mixins: [ clickaway ],
	data: function() {
		return {
			isActive: false,
			currency: "usd"
		}
	},
	computed: {
		currentUser: function() {
			return this.$store.state.currentUser;
		},
	},
	watch: {
		'currentUser': {
			deep: true,
			handler: function() {
				this.currency = this.currentUser.currency;
			}
		},
		currency: function() {
			if (this.currency != this.currentUser.currency)
				this.changeCurrency(this.currency);
		}
	},
	methods: {
		logout: function() {
			this.$auth.destroyToken();
			this.$router.push('/auth/login');
		},

		close: function() {
			this.isActive = false;
		},

		changeCurrency: function(currency) {
			this.$http.patch('/me', { currency: currency })
				.then(ret => {
					this.$store.commit('updateCurrentUser', { currency: currency });
				}, err => {

				})
		}
	}
}
</script>
