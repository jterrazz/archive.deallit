<template>
	<div class="setting-div">
		<h2>My mail</h2>
		<div v-if="!modifyMail">Mail : {{ currentUser.mail }}</div><button type="button" @click="modifyMail = true">Modify</button>
		<div v-if="modifyMail">
			<input class="input--grey" type="text" v-model="newUser.mail">
			<button type="button" @click="changeMail">Validate</button>
		</div>

		<h2>Delete my account</h2>
		<button @click="confirmPopup" name="button">Confirm</button>
	</div>
</template>

<script>
	import { EventBus } from '../../plugins/event-bus'

	export default {
		name: "Account",
		data: function() {
			return {
				modifyMail: false,
				newUser: {
					mail: "",
				}
			}
		},
		computed: {
			currentUser: function() {
				return this.$store.state.currentUser;
			}
		},
		methods: {
			confirmPopup: function() {
				EventBus.$emit('pop-up')
			},

			changeMail: function() {
				this.$http.patch('/me', { mail: this.newUser.mail })
					.then(data => {

					}, err => {

					})
			}
		}
	}
</script>
