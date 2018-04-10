<template lang="html">
<div class="">

</div>
</template>

<script>
export default {
	name: "MailConfirmationSender",
	created: function() {
		this.$http.post(`/confirm-mail/${ this.$route.params.confirmationCode }`)
			.then(data => {
				this.$router.push('/auth/login');
			}, err => {

			})
	}
}
</script>

<style lang="css">
</style>
