<template>
<div class="dropdown top-bar-logo" v-bind:class="{ active: isActive }">
	<div class="image-hover top-bar-el-hover" v-on:click="isActive = true">
		<img src="../../../assets/images/bubble.svg" alt="" class="bubble">
	</div>
	<transition name="dropdown-transition">
		<div v-if="isActive" class="dropdown-content messages" v-on-clickaway="close">
			<ul class="dropdown-sections">
				<li @click="dropdownIsMessages = false" :class="{ activated: !dropdownIsMessages}" class="dropdown-section-first">Notifications</li>
				<li @click="dropdownIsMessages = true" :class="{ activated: dropdownIsMessages}" class="dropdown-section-last">Messages</li>
			</ul>

			<dropdown-messages v-if="dropdownIsMessages" />
			<dropdown-notifications v-if="!dropdownIsMessages" />
		</div>
	</transition>
</div>
</template>

<style lang="less" scoped>
@import 'variables.less';

.dropdown-content {
	padding: @s-sm;
}

.dropdown-sections {
	display: flex;
	border: @border;
	border-radius: @s-radius;
	li {
		width: 140px;
		text-align: center;
		cursor: pointer;
		padding: @s-xs;
	}
	li.activated, li:hover {
		background: @c-bg;
		color: @c-text;
	}
}
</style>

<script>
import { mixin as clickaway } from 'vue-clickaway';
import DropdownMessages from './DropdownMessages';
import DropdownNotifications from './DropdownNotifications'

export default {
	name: "DropdownStatus",
	mixins: [clickaway],
	components: {
		DropdownMessages,
		DropdownNotifications,
	},
	data: function() {
		return {
			isActive: false,
			dropdownIsMessages: false
		}
	},
	methods: {
		close: function() {
			this.isActive = false;
		}
	}
}
</script>
