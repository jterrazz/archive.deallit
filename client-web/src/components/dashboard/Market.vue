<template>
<div class="dashboard-informations">
	<h1 class="bold">My market</h1>
	<div class="box">
		<div class="box-header">
			<span class="box-title">Market informations</span>
		</div>
		<h2>Description</h2>
		<textarea class="description-area"></textarea>
		<input type="text" v-model="market.identifier"><button @click="setIdentifier()">Update</button>
	</div>
	<div class="box">
		<div class="box-header">
			<span class="box-title">Background</span>
		</div>
		<div v-if="activeModify == 'bg'">
			<div class="bgs-wrap">
				<div v-for="bg in availableBgs" :key="bg" @click="selectBg(bg)">
					<image-div :url="`http://the-crypto-market.s3-website.eu-west-3.amazonaws.com/200x100/assets/store-bg/${bg}.jpeg`" class="market-background" :class="{ active: (bg == selectedBg) }"/>
				</div>
			</div>
			<croppa class="croppa-market-background" :width="400" :height="120" :quality="3" initial-size="cover" ref="image" :prevent-white-space="true" initial-position="center"></croppa>
			<button name="button" @click="confirmBackground">Confirm</button>
		</div>
		<div v-if="activeModify !== 'bg'">
			<image-div class="current-bg" :url="currentUser.marketBackground"/>
			<button type="button" @click="activeModify = 'bg'">Change</button>
		</div>

	</div>
	<div class="box">
		<div class="box-header">
			<span class="box-title">Ma vitrine</span>
		</div>
	</div>
</div>
</template>

<style lang="less" scoped>
@import 'variables.less';

.description-area {
	width: 100%;
	padding: @s-sm @s-md;
}

.current-bg {
	width: 100%;
	height: 220px;
}

.bgs-wrap {
	overflow: hidden;
	padding: @s-sm @s-md;
}

.market-background {
	float: left;
	width: 180px;
	height: 100px;
	border-radius: @s-radius;
	margin-right: @s-sm;
	margin-bottom: @s-sm;
	border: 2px solid transparent;
}

.market-background.active {
	border-color: rgb(58, 164, 232);
}

.croppa-market-background {
	width: 100%;
	canvas {
		background: @c-grey;
	}
}

.box {
	margin-bottom: @s-md;
}
</style>

<script>
import ImageDiv from '../elements/ImageDiv';
import Croppa from 'vue-croppa';

export default {
	name: "DashboardInformations",
	components: {
		ImageDiv,
		Croppa: Croppa.component,
	},
	computed: {
		currentUser: function() {
			return this.$store.state.currentUser;
		}
	},
	data: function() {
		return {
			market: {
				identifier: null
			},
			activeModify: null,
			selectedBg: null,
			availableBgs: [1,2,3,4,5,6,7,8,9,10]
		}
	},
	methods: {
		selectBg: function(data) {
			console.log(data);
			this.selectedBg = data;
		},

		confirmBackground: function() {
			if (!this.$refs.image.hasImage())
				return;
			this.uploadImage()
				.then((filename) => {
					this.$http.patch('/market', { marketBackground: filename})
						.then(ret => {
							this.$notify({
								title: 'Done',
							});
						}, err => {

						})
				})
		},

		uploadImage: function() {
			return new Promise((resolve, reject) => {
				if (!this.$refs.image.hasImage())
					return resolve()

				this.$refs.image.generateBlob((blob) => {
					var fd = new FormData()
					fd.append('file', blob)

					this.$http.post('/upload/image', fd)
						.then(data => {
							resolve(data.body.filename)
						}, err => {
							reject()
						})
				})
			})
		},

		setIdentifier: function() {
			if (!this.market.identifier)
				return;
			this.$http.patch('/market', { identifier: this.market.identifier })
				.then(ret => {
					this.$notify({
						title: 'Saved',
						text: "Changed identifier",
					});
				}, err => {
					this.$notify({
						title: 'Error',
						text: "Couldn't set identifier",
						type: 'error',
					});
				})
		}
	}
}
</script>
