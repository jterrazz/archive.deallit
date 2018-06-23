<template>
<div id="app">
	<vue-progress-bar></vue-progress-bar>
	<top-bar :class="{ isDashboard: isDashboard }"/>

	<div id="site-wraper">
		<transition name="slide">
			<dashboard-bar v-if="isDashboard"/>
		</transition>
		<router-view/>
		<footer-div v-if="!noFooter"/>
	</div>

	<notifications position="bottom right" :duration="4000"/>
	<transition name="popup">
		<div v-if="popup" id="pop-up-container" class="window-padding">
			<modify-product v-on:closePopup="closePopup" v-on-clickaway="closePopup" v-if="popup == 'modify-product'" :product="popupData"/>
			<delete-product v-on:closePopup="closePopup" v-on-clickaway="closePopup" v-if="popup == 'delete-product'" :product="popupData"/>
			<message v-on:closePopup="closePopup" v-on-clickaway="closePopup" v-if="popup == 'message'" :user="popupData"/>
			<messages-list v-on:closePopup="closePopup" v-on-clickaway="closePopup" v-if="popup == 'messages-list'"/>
			<buy v-on:closePopup="closePopup" v-on-clickaway="closePopup" v-if="popup == 'buy'" :product="popupData"/>
		</div>
	</transition>
</div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway';
import { EventBus } from '@/plugins/event-bus'
import TopBar from '@/components/navigation/TopBar'
import DashboardBar from '@/components/navigation/DashboardBar'
import FooterDiv from '@/components/elements/Footer'
import ModifyProduct from '@/components/pop-up/ProductModify'
import DeleteProduct from '@/components/pop-up/ProductDelete'
import Message from '@/components/pop-up/Message'
import Buy from '@/components/pop-up/Buy'
import MessagesList from '@/components/pop-up/MessagesList'

export default {
	name: 'app',
	mixins: [ clickaway ],
	components: {
		TopBar,
		DashboardBar,
		FooterDiv,
		ModifyProduct,
		DeleteProduct,
		Message,
		MessagesList,
		Buy
	},
	data: function() {
		return {
			popup: false,
			popupData: null
		}
	},
	watch: {
		$route: function() {
			this.closePopup();
		}
	},
	created: function() {
		EventBus.$on('pop-up', (name, data) => {
			this.popup = name;
			this.popupData = data;
			document.body.classList.add("no-overflow");
		})
	},
	methods: {
		closePopup: function() {
			this.popup = false;
			document.body.classList.remove("no-overflow");
		},
	},
	computed: {
		noFooter: function() {
			return this.$route.matched.some(m => m.meta.noFooter);
		},
		isDashboard: function() {
			return this.$route.matched.some(m => m.meta.isDashboard);
		},
	}
}
</script>
