<template>
<div class="pop-up">
	<div class="messages-header">
		<h2>Messages privés</h2>
		<div class="extend"></div>
		<div class="text-notification">{{ userStatus.nbMessages }} messages to read</div>
	</div>

	<li class="message" v-for="conversation in conversations" @click="openMessage(conversation)">
		<image-div :url="conversation.userImage" class="user-image md"/>
		<div>
			<div class="conversation-name">{{ conversation.firstName }}</div>
			<div class="message-text">{{ conversation.message }}</div>
		</div>
	</li>
</div>
</template>

<script>
import ImageDiv from '../elements/ImageDiv';
import { EventBus } from '../../plugins/event-bus';

export default {
	name: "MessagesList",
	components: {
		ImageDiv
	},
	computed: {
		conversations: function() { return this.$store.state.userConversations },
		userStatus: function() { return this.$store.state.status; },
	},
	created: function() {
		this.getLastConversations();
	},
	methods : {
		getLastConversations: function() {
			this.$http.get('/conversations')
				.then(ret => {
					this.$store.commit('setUserConversation', ret.body);
				}, err => {

				})
		},

		openMessage: function(user) {
			EventBus.$emit('pop-up', 'message', user);
		}
	}
}
</script>

<style lang="less" scoped>
@import 'variables.less';

.messages-header {
	width: 100%;
	padding: 18px @s-sm;
	border-bottom: @border;
	display: flex;
	align-items: center;
}

.message {
	display: flex;
	border-bottom: @border;
	padding: @s-sm;
	cursor: pointer;
}
.message:last-of-type {
	border: 0;
}
.message:hover {
	background: @c-bg;
}

.user-image {
	margin-right: @s-sm;
}

.conversation-name {
	font-weight: bold;
	font-size: 15px;
	margin-top: 3px;
}

.message-text {

}
</style>
