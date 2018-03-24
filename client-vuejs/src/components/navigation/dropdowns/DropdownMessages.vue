<template>
<ul class="dropdown">
	<li class="message" v-for="conversation in conversations" @click="openMessage(conversation)">
		<image-div class="user-image" :url="conversation.userImage" />
		<div class="message-text">
			<div class="message-user">{{ conversation.firstName }} {{ conversation.lastName }}</div>
			<div class="message-preview">{{ conversation.message }}</div>
		</div>
	</li>
</ul>
</template>

<style lang="less" scoped>
@import 'variables.less';

.user-image {
	width: 36px;
	height: 36px;
	margin-left: 6px;
}

.message-text {
	margin-left: @s-sm;
}

.message-user {
	color: @c-text;
	font-weight: 600;
	margin-bottom: 3px;
}

.message-preview {
	color: @c-text-clear;
	font-weight: 300;
}

.dropdown {
	margin-top: @s-sm;
}

.message {
	border-top: @border;
	padding: 24px 0;
	display: flex;
	align-items: flex-start;
	cursor: pointer;
}

</style>

<script>
import ImageDiv from '../../elements/ImageDiv'
import { EventBus } from '../../../plugins/event-bus'

export default
{
	name: "DropdownMessages",
	components: {
		ImageDiv
	},
	computed: {
		conversations: function() { return this.$store.state.userConversations }
	},
	created: function() {
		if (!this.conversations.length)
			this.getLastConversations();
	},
	methods: {
		getLastConversations: function() {
			this.$http.get('/conversations')
				.then(ret => {
					this.$store.commit('setUserConversation', ret.body);
				}, err => {

				})
		},

		openMessage: function(conversation) {
			EventBus.$emit('pop-up', 'message', conversation)
		}
	}
}
</script>
