<template>
<form>
	<h1>User login</h1>
	<div>
		<label for="login-mail">Mail</label>
		<input id="login-mail" type="text" name="mail" class="input--grey" v-model="user.mail" placeholder="Mail">
		<label for="login-password">Password</label>
		<input id="login-password" type="password" name="password" class="input--grey" v-model="user.password" placeholder="Password" @keyup.enter="tryLogin">
		<input type="text" v-model="twoFA" placeholder="6 digits code">
	</div>
	<button type="button" class="button--blue button--xl" @click="tryLogin">Login</button>
	<router-link :to="{ name: 'register' }" class="auth-nav">Create an account</router-link>
</form>
</template>

<script>
import jwtDecode from 'jwt-decode'

export default {
	name: "Login",
	data: function() {
		return {
			user: {
				mail: '',
				password: ''
			},
			twoFA: ""
		}
	},
	methods: {
		tryLogin: function() {
			this.$http.post('/auth/login', this.user)
				.then(data => {
					try {
						var tokenDecoded = jwtDecode(data.body.token);
						this.$auth.setToken(data.body.token, tokenDecoded.exp);
						if (!tokenDecoded.stillNeedToTwoFA) {
							this.$router.push('/');
						} else {
							this.$http.post('/auth/login-two-fa', { code: this.twoFA }, { headers: {'Authorization': 'Bearer ' + this.$auth.getToken() }})
								.then(data => {
									this.$auth.setToken(data.body.token, tokenDecoded.exp);
									this.$router.push('/');
								}, err => {
									console.log(err);
								})
						}
					} catch (e) {

					}
				}, err => {
					console.log(err);
				})
		}
	}
}
</script>
