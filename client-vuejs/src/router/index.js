import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home'
import Product from '../components/Product'
import Categorie from '../components/Categorie'
import Market from '../components/Market'
import Auth from '../components/Auth'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import Search from '../components/Search'

import Payment from '../components/Payment'

import Sell from '../components/Sell'
import Dashboard from '../components/Dashboard'
import DashboardMarket from '../components/dashboard/Market'
import DashboardCategories from '../components/dashboard/Categories'
import DashboardProducts from '../components/dashboard/Products'
import DashboardTodo from '../components/dashboard/Todo'
import DashboardWallets from '../components/dashboard/Wallets'

import Settings from '../components/Settings'
import SettingsProfile from '../components/settings/Profile'
import SettingsSecurity from '../components/settings/Security'
import SettingsAccount from '../components/settings/Account'

import NotFound from '../components/NotFound'

Vue.use(Router);

export default new Router({
	scrollBehavior (to, from, savedPosition) {
		return { x: 0, y: 0 }
	},
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'home',
			meta: { title: 'My Market' },
			component: Home
		},
		{
			path: '/auth',
			component: Auth,
			children: [
				{
					path: 'login',
					name: 'login',
					meta: { requireNotMember: true },
					component: Login
				},
				{
					path: 'register',
					name: 'register',
					meta: { requireNotMember: true },
					component: Register
				},
			]
		},
		{
			path: '/c/:categorieName',
			name: 'categorie',
			component: Categorie
		},
		{
			path: '/product/:productId',
			name: 'product',
			component: Product
		},
		{
			path: '/s/:searched',
			name: 'search',
			component: Search
		},
		{
			path: '/user/:userId/market',
			name: 'user-market',
			component: Market
		},
		{
			path: '/market/:identifier',
			name: 'market',
			component: Market
		},
		{
			path: '/sell',
			name: 'sell',
			meta: { requireMember: true, noFooter: true },
			component: Sell
		},
		{
			path: '/payment',
			name: 'payment',
			meta: { requireMember: true, noFooter: true },
			component: Payment
		},
		{
			path: '/dashboard',
			component: Dashboard,
			meta: { requireMember: true, noFooter: true, isDashboard: true },
			children: [
				{
					path: 'market',
					name: 'dashboard-market',
					component: DashboardMarket
				},
				{
					path: 'categories',
					name: 'dashboard-categories',
					component: DashboardCategories
				},
				{
					path: 'products',
					name: 'dashboard-products',
					component: DashboardProducts
				},
				{
					path: 'todo',
					name: 'dashboard-todo',
					component: DashboardTodo
				},
				{
					path: 'wallets',
					name: 'wallets',
					component: DashboardWallets
				},
				{
					path: '/settings',
					component: Settings,
					meta: { requireMember: true, noFooter: true, isDashboard: true },
					children: [
						{
							path: '/settings/security',
							name: 'settings-security',
							component: SettingsSecurity
						},
						{
							path: '/settings/account',
							name: 'settings-account',
							component: SettingsAccount
						},
						{
							path: '',
							name: 'settings',
							component: SettingsProfile
						},
					]
				}
			]
		},
		{
			path: '*',
			component: NotFound
		}
	]
})
