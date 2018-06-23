<template>
<div class="">
	<h1>We need you to check your mails</h1>
	<p>Click on the link send to your mail address</p>
	<p>Logged as ...</p>
	<button type="button" @click="logout">Disconnect</button>
</div>
</template>

<style lang="less" scoped>
@import 'variables.less';

</style>

<script type="text/javascript">
export default {
	name: "NeedMailConfirmation",
	methods: {
		logout: function() {
			this.$auth.destroyToken();
			this.$router.push('/auth/login');
		},
	}
}
</script>
