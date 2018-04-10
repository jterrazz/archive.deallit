<template>
<div class="">
	<h1>We need you to check your mails</h1>
	<p>Click on the link send to your mail address</p>
	<p>Logging as blabla</p>
	<input type="text" v-model="twoFA" placeholder="6 digits code">
	<button type="button" @click="logout">Disconnect</button>
	<button type="button" @click="tryLogin">Send</button>
</div>
</template>

<script>
import jwtDecode from 'jwt-decode'

export default {
	name: "Login",
	data: function() {
		return {
			twoFA: ""
		}
	},
	methods: {
		tryLogin: function() {
			this.$http.post('/auth/login-two-fa', { code: this.twoFA }, { headers: {'Authorization': 'Bearer ' + this.$auth.getToken() }})
				.then(data => {
					console.log(data.body);
					this.$auth.setToken(data.body.token, data.body.exp);
					this.$router.push('/');
				}, err => {
					console.log(err);
				})
		},
		logout: function() {
			this.$auth.destroyToken();
			this.$router.push('/auth/login');
		},
	}
}
</script>
