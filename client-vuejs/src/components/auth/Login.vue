<template>
<form>
	<h1>User login</h1>
	<div>
		<label for="login-mail">Mail</label>
		<input id="login-mail" type="text" name="mail" class="input--grey" v-model="user.mail" placeholder="Mail">
		<label for="login-password">Password</label>
		<input id="login-password" type="password" name="password" class="input--grey" v-model="user.password" placeholder="Password" @keyup.enter="tryLogin">
	</div>
	<button type="button" class="button--blue button--xl" @click="tryLogin">Login</button>
	<router-link :to="{ name: 'register' }" class="auth-nav">Create an account</router-link>
</form>
</template>

<script>
export default {
	name: "Login",
	data: function() {
		return {
			user: {
				mail: '',
				password: ''
			},
		}
	},
	methods: {
		tryLogin: function() {
			this.$http.post('/auth/login', this.user)
				.then(data => {
					this.$auth.setToken(data.body.token, data.body.exp);
					if (!data.body.needTwoFA)
						this.$router.push('/');
					else
						this.$router.push('/need-two-fa');
				}, err => {
					console.log(err);
				})
		}
	}
}
</script>
