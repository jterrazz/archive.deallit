<template>
<div class="setting-div">
	<h2>2ID</h2>
	<button type="button" class="button--blue button--xl" @click="showTwoFA">Activate 2 FA</button>
	<div v-if="twoFA.secret">
		<img :src="`https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${ twoFA.secret }`" alt="">
		<input class="input--grey" type="text" v-model="twoFA.confirmation">
		<button class="button--blue button--xl" type="button" @click="validateTwoFA">Confirm 2ID</button>
	</div>
	<input class="input--grey" type="text" v-model="twoFA.removeConfirmation">
	<button type="button" @click="removeTwoFA">Remove 2FA</button>
	<h2>Password</h2>
	<form class="" action="#" method="post">
		<label for="settings-input-password1">New password</label>
		<input id="settings-input-password1" type="text" name="first-name" value="" v-model="userSecurity.password1">
		<label for="settings-input-password2">Again</label>
		<input id="settings-input-password2" type="text" name="last-name" value="" v-model="userSecurity.password2">

		<button type="button" class="button--xl button--blue" @click="updatePassword">Save</button>
	</form>
</div>
</template>

<script>
export default {
	name: "Security",
	data: function() {
		return {
			userSecurity: {},
			twoFA: {
				secret: null,
				err: false,
				confirmation: null,
				removeConfirmation: null
			}
		}
	},
	methods: {
		updatePassword: function() {

		},

		showTwoFA: function() {
			this.twoFA.err = false;
			this.$http.get('/auth/manage-2fa')
				.then(ret => {
					this.twoFA.secret = ret.body.secret;
				}, err => {
					this.twoFA.err = true;
				})
		},

		validateTwoFA: function() {
			if (this.twoFA.confirmation) { // TODO Check is 6 digits
				this.twoFA.err = false;
				this.$http.post('/auth/manage-2fa', { code: this.twoFA.confirmation })
					.then(ret => {

					}, err => {
						this.twoFA.err = true;
					})
			}
		},

		removeTwoFA: function() {
			this.$http.delete('/auth/manage-2fa', { params: {code: this.twoFA.removeConfirmation} })
				.then(ret => {

				}, err => {

				})
		}
	}
}
</script>
