import './assets/css/master.less'
import './assets/css/animations.less'

import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import Auth from './plugins/auth'
import ProgressBar from './plugins/progress-bar'
import jwtDecode from 'jwt-decode'
import camelcaseKeys from 'camelcase-keys'
import Notifications from 'vue-notification'

import store from './store'
import router from './router'

Vue.use(Auth)
Vue.use(ProgressBar)
Vue.use(VueResource)
Vue.use(Notifications)

//TODO better than first load (check data directly) ???

Vue.config.productionTip = false
Vue.http.interceptors.push(function(request, next) {
	var isJSON = function(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	if (Vue.auth.loggedIn())
		request.headers.set('Authorization', 'Bearer ' + Vue.auth.getToken())
	if (request.url[0] === '/')
		request.url = process.env.NODE_ENV == 'development' ?
			"http://localhost:8081/api" + request.url :
			"https://deallit.com/api" + request.url;

	next(function(response) {
		if (isJSON(response.bodyText)) {
			response.body = camelcaseKeys(response.body, {
				deep: true
			})
		}
	})
})
// Vue.auth.destroyToken();
router.beforeEach((to, from, next) => {
	var token = Vue.auth.getToken();
	var decodedJWT = token ? jwtDecode(token) : null;
	var isLogged = Vue.auth.loggedIn();
	var currentUserExist = !!Object.keys(store.state.currentUser).length;

	document.title = to.meta.title;

	/**
	 * Sync user state to the token status
	 */

	if (decodedJWT && decodedJWT.needMailConfirmation) {
		if (to.name !== 'need-mail-confirmation')
			return next({
				name: 'need-mail-confirmation'
			})
	} else if (decodedJWT && decodedJWT.stillNeedToTwoFA) {
		if (to.name !== 'need-two-fa')
			return next({
				name: 'need-two-fa'
			})
	} else if (currentUserExist && !isLogged) {
		store.commit('clearCurrentUser');
	} else if (!currentUserExist && isLogged) {
		var userId = decodedJWT.userId;
		store.commit('setCurrentUser', {
			userId: userId
		});

		Vue.http.get('/me')
			.then(ret => {
				store.commit('setCurrentUser', camelcaseKeys(ret.body));
			}, err => {
				store.commit('clearCurrentUser');
			})
		Vue.http.get('/status')
			.then(ret => {
				store.commit('setStatus', camelcaseKeys(ret.body));
			}, err => {
				store.commit('clearStatus');
			})
	}

	/**
	 * Verify path meta
	 */

	if (isLogged && from.query.redirect) {
		var path = from.query.redirect;

		from.query.redirect = null
		return next({
			path: path
		})
	} else if (!isLogged && to.matched.some(m => m.meta.requireMember)) {
		return next({
			path: '/auth/login',
			query: {
				redirect: to.fullPath
			}
		});
	} else if (isLogged && to.matched.some(m => m.meta.requireNotMember)) {
		return next({
			name: 'home'
		})
	}
	next();
})

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: {
		App
	},
})
