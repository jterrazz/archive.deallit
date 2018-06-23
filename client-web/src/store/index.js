import Vue from 'vue';
import Vuex from 'vuex';

import categories from './categories.json'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		currentUser: {},
		status: {
			nbMessages: 0,
			nbNotifications: 0
		},
		userConversations: [],
		userNotifications: [],
		categories: categories.categories,
		colors: [
			"#279AF1",
			"#9D8DF1",
			"#41463D",
			"#220C10",
			"#735D78",
			"#6B6D76",
			"#FF785A",
			"#FFAA5A",
			"#8783D1",
			"#C33149",
			"#1A8FE3",
			"#6610F2",
			"#F17105",
		]
	},
	mutations: {
		setCurrentUser: function(state, user) {
			state.currentUser = user;
		},
		updateCurrentUser: function(state, data) {
			Object.assign(state.currentUser, data);
		},
		clearCurrentUser: function(state) {
			state.currentUser = {};
		},
		setStatus: function(state, data) {
			state.status = data;
		},
		clearStatus: function(state) {
			state.status = {};
		},
		setUserConversation: function(state, conversations) {
			state.userConversations = conversations;
		},
		setUserNotifications: function(state, notifications) {
			state.userNotifications = notifications;
		},
	}
})
