<template>
<div class="">
	<div class="settings-view">
		<nav class="settings-nav text-menu">
			<ul class="settings-selectors">
				<router-link :to="{ name: 'settings' }">
					<li :class="{ on: router === 'settings' }">Profile</li>
				</router-link>
				<router-link :to="{ name: 'settings-security' }">
					<li :class="{ on: router === 'settings-security' }">Security</li>
				</router-link>
				<router-link :to="{ name: 'settings-account' }">
					<li :class="{ on: router === 'settings-account' }">Account</li>
				</router-link>

				REPLACE BY USERNAME
			</ul>
		</nav>

		<router-view/>
	</div>
</div>
</template>

<script>
	export default {
		name: "Settings",
		data: function() {
			return {
				route: ''
			}
		},
		created: function() {
			this.setRoute()
		},
		watch: {
			$route: 'setRoute'
		},
		methods: {
			setRoute: function() {
				this.router = this.$route.name
			}
		}
	}
</script>
