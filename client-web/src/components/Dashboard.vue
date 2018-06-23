<template>
<div id="main-view">
	<div class="view--max">
		<router-view class="dashboard-view window-padding"/>
	</div>
</div>
</template>

<style lang="less" scoped>
@import 'variables.less';

#main-view {
	padding-left: @s-dashboard-bar;
}

.dashboard-view {

}

.view--max {
	max-width: 1000px;
}

</style>

<script>
export default {
	name: "DashboardView",
}
</script>
