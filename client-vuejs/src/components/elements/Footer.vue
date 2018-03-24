<template>
<div>
	<div id="footer-first">
		<div class="view--max window-padding view--x">
			<div>
				<h1>Start selling now</h1>
				<p>Individuals and real stores</p>
			</div>
			<img src="../../assets/images/store.svg" alt="" class="store-img">
			<button class="button--xl button--blue">Sell your products</button>
		</div>
	</div>
	<div id="footer-second">
		<div class="view--max window-padding view--x">
			<div>
				<h1>Start selling now</h1>
				<p>Individuals and real stores</p>
			</div>
			<img src="../../assets/images/store.svg" alt="" class="store-img">
			<button class="button--xl button--blue">Sell your products</button>
		</div>
	</div>
	<div id="footer">
		<div class="view--max window-padding view--x">
			<ul class="section">
				<label for="">Langue</label>
				<select class="" name="">
					<option value="">English</option>
					<option value="">Francais</option>
				</select>
				<label for="">Currency</label>
				<select class="" name="">
					<option value="">EUR</option>
					<option value="">USD</option>
					<option value="">BTC</option>
				</select>
				<div class="made-by">Made by 42 students</div>
				<a href="http://42.fr/">
					<img class="made-in-img" :src="staticUrl + '42-logo.png'" alt="42">
				</a>
			</ul>
			<ul class="section">
				<h2>Navigation</h2>
				<router-link :to="{ name: 'home'}"><li>Home</li></router-link>
				<router-link :to="{ name: 'home'}"><li>Recent</li></router-link>
			</ul>
			<ul class="section">
				<h2>User</h2>
				<router-link :to="{ name: 'settings'}"><li>Settings</li></router-link>
				<li @click="logout">Logout</li>
			</ul>
			<ul class="section">
				<h2>Services</h2>
				<li>FAQ</li>
				<li>Services</li>
			</ul>
		</div>
		© 2018 Deallit. All Rights Reserved.
	</div>
</div>
</template>

<script>
import env from '../../../config';

export default {
	name: "Footer",
	methods: {
		logout: function() {
			this.$auth.destroyToken();
			this.$router.push('/auth/login');
		},
	},
	computed: {
		staticUrl: function() {
			return env.cdnUrl + 'assets/'
		}
	}
}
</script>

<style lang="less" scoped>
@import 'variables.less';

.made-by {
	font-size: 12px;
	color: @c-grey;
	margin-top: @s-sm;
}

.made-in-img {
	width: 42px;
}

h1 {
	margin-bottom: @s-sm;
}
.store-img {
	width: 128px;
}

.section {
	flex: 1;
	h2 {
		font-size: 13px;
		text-transform: uppercase;
		font-weight: bolder;
		margin-bottom: @s-sm;
	}
}

#footer-first {
	padding: 100px 0;
	width: 100%;
	background: rgb(205, 226, 244);
	color: white;
	margin-top: @s-lg;
	.view--x {
		justify-content: space-between;
	}
}

#footer-second {
	padding: 100px 0;
	width: 100%;
	background: @c-darker;
	color: white;
	.view--x {
		justify-content: space-between;
	}
}

#footer {
	width: 100%;
	padding-top: 60px;
	background: @c-bg;
	padding-bottom: 60px;
	display: flex;
	flex-direction: column;
	align-items: center;
	.view--x {
		justify-content: space-between;
	}
}

</style>
