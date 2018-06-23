<template>
	<div class="setting-div">
		<div class="view--x">
			<div class="extend">
				<h2>My identity</h2>
				<label for="settings-input-name">First name</label>
				<input id="settings-input-name" type="text" name="first-name" value="" v-model="userInformations.firstName">
				<label for="settings-input-last-name">Last name</label>
				<input id="settings-input-last-name" type="text" name="last-name" value="" v-model="userInformations.lastName">

				<input type="radio" name="gender" value="man" id="gender-man" v-model="userInformations.gender">
				<label for="gender-man">Man</label>
				<input type="radio" name="gender" value="woman" id="gender-woman" v-model="userInformations.gender">
				<label for="gender-woman">Woman</label>

				<button type="button" class="button--xl button--blue" @click="updateIdentity">Save</button>
			</div>
			<croppa class="croppa-settings-profile" :width="200" :height="200" :quality="2" initial-size="cover" ref="userImage" :prevent-white-space="true" initial-position="center"></croppa>
		</div>

		<h2>My adresses</h2>
	</div>
</template>

<script>
	import Croppa from 'vue-croppa'

	export default {
		name: "Profile",
		components: {
			Croppa: Croppa.component
		},
		data: function() {
			return {
				userInformations: {},
			}
		},
		methods: {
			updateIdentity: function() {
				this.uploadImage()
					.then(() => {
						this.$http.patch('/me', this.userInformations).
							then((res) => {

							}, (err) => {

							})
					})
			},

			uploadImage: function() {
				return new Promise((resolve, reject) => {
					if (!this.$refs.userImage.hasImage())
						return resolve()

					this.$refs.userImage.generateBlob((blob) => {
						var fd = new FormData()
						fd.append('file', blob)

						this.$http.post('/upload/image', fd)
							.then(data => {
								this.userInformations.userImage = data.body.filename
								resolve()
							}, err => {
								reject()
							})
					})
				})
			}
		}

	}
</script>
