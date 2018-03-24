<template>
<div class="pop-up">
	<div class="message-header">
		<div class="back-btn" @click="openMessages()">
			All messages
		</div>
		<image-div class="header-user-image user-image md" :url="user.userImage" />
		<div>
			<div class="header-username">{{ user.firstName }} - {{ user.lastName }}</div>
			<div>User since 42 years</div>
		</div>
	</div>
	<div class="messages-container">
		<div v-for="message in messages" class="message-wrap" :class="{ right: message.fromId == currentUser.userId }">
			<image-div v-if="message.fromId !== currentUser.userId" class="user-image sm" :url="user.userImage"/>
			<div class="message-bubble">
				{{ message.message }}
			</div>
			<image-div v-if="message.fromId == currentUser.userId" class="user-image sm" :url="currentUser.userImage"/>
		</div>
	</div>
	<div class="message-input-div">
		<input type="text" v-model="newMessage" placeholder="Write your message" @keyup.enter="sendMessage">
		<button @click="sendMessage">Send</button>
	</div>
</div>
</template>

<script>
import ImageDiv from '../elements/ImageDiv';
import { EventBus } from '../../plugins/event-bus';

export default {
	name: "PopupMessage",
	components: {
		ImageDiv
	},
	props: {
		user: { type: Object }
	},
	data: function() {
		return {
			newMessage: "",
			messages: []
		}
	},
	created: function() {
		this.getMessages();
	},
	computed: {
		currentUser: function() {
			return this.$store.state.currentUser;
		}
	},
	updated: function() {

		var container = this.$el.querySelector(".messages-container");
		container.scrollTop = 99999999;
	},
	methods: {
		getMessages: function() {
			this.$http.get(`/messages/${ this.user.userId }`)
				.then(ret => {
					this.messages = ret.body
				}, err => {

				})
		},

		sendMessage: function() {
			if (!this.newMessage)
				return
			this.$http.post(`/messages/${ this.user.userId }`, { message: this.newMessage })
				.then(ret => {
					this.messages.push( {
						message: this.newMessage,
						fromId: this.currentUser.userId
					});
					this.newMessage = "";
				}, err => {

				})
		},

		openMessages: function() { EventBus.$emit('pop-up', 'messages-list') }
	}
}
</script>

<style lang="less" scoped>
@import 'variables.less';

.message-header {
	display: flex;
	align-items: center;
	border-bottom: @border;
	padding: @s-sm;
	justify-content: center;
	position: relative;
	flex-shrink: 0;
}

.header-username {
	font-weight: bold;
	font-size: 17px;
}

.header-user-image {
	margin-right: @s-sm;
}

.back-btn {
	position: absolute;
	left: @s-sm;
	color: @c-text-grey;
	cursor: pointer;
}

.messages-container {
	display: flex;
	flex-direction: column;
	overflow: scroll;
	flex: 1;
}

.message-input-div {
	display: flex;
	border-top: @border;
	flex-shrink: 0;

	input {
		background: @c-bg;
		border: 0;
		padding: 15px;
		flex: 1;
	}
}

.message-wrap {
	padding: @s-xs @s-sm;
	display: flex;
	align-items: flex-end;
	flex-shrink: 0;
}

.message-wrap.right {
	align-self: flex-end;
	.message-bubble {
		color: white;
		background: @c-2;
		border-radius: 30px;
		border-bottom-right-radius: 0px;
		margin-right: @s-xs;
	}
}

.message-bubble {
	background: @c-bg;
	border-radius: 30px;
	border-bottom-left-radius: 0px;
	padding: 10px 16px;
	margin-left: @s-xs;
}
</style>
