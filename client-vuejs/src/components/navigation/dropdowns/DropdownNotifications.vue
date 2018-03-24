<template>
<ul class="dropdown">
	<div v-for="notification in notifications">
		<router-link :to="notification.link">
			<li class="notification view--x" :class="{ 'not-seen': !notification.seen }">
				<div class="preview">

				</div>
				<span>{{ notification.message }}</span>
			</li>
		</router-link>
	</div>
</ul>
</template>

<style lang="less" scoped>
@import 'variables.less';

.dropdown {
	margin-top: @s-sm;
}

.notification {
	padding: @s-sm 0;
	border-top: @border;
}
.notification.not-seen {
	background: rgb(235, 245, 249);
}

.preview {
	width: 42px;
	height: 42px;
	background: @c-dark;
	flex-shrink: 0;
	margin-right: @s-sm;
}

</style>

<script>
export default {
	name: "DropdownNotifications",
	computed: {
		notifications: function() {
			return this.$store.state.userNotifications;
		}
	},
	created: function() {
		this.getNotifications();
	},
	methods: {
		getNotifications: function() {
			this.$http.get('/notifications')
				.then(data => {
					this.$store.commit('setUserNotifications', data.body);
				}, err => {
					console.log(err);
				})
		}
	}
}
</script>
