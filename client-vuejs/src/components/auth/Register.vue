<template>
	<form>
		<h1>User register</h1>
		<div>
			<label for="login-mail">Mail</label>
			<input id="login-mail" type="text" name="mail" class="input--grey" v-model="user.mail">
			<label for="login-password">Password</label>
			<input id="login-password" type="password" name="password" class="input--grey" v-model="user.password" @keyup.enter="tryRegister">
		</div>
		<div v-if="err" class="error-text">
			{{ err.body.message }}
		</div>
		<button type="button" class="button--blue button--xl" @click="tryRegister">Register</button>
		<router-link :to="{ name: 'login' }" class="auth-nav">Already have an account ?</router-link>
	</form>
</template>

<script>
	export default {
		name: "Register",
		data: function() {
			return {
				user: {},
				err: null
			}
		},
		methods: {
			tryRegister: function() {
				this.$http.post('/auth/register', this.user)
					.then(ret => {
						this.$router.push({ name: 'need-mail-confirmation' });
					}, (err) => {
						this.err = err;
					})
			}
		}
	}
</script>

<style lang="less" scoped>
@import 'variables.less';

.error-text {
	margin-bottom: @s-sm;
}
</style>
