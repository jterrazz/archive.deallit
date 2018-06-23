<template>
	<div id="main-view">
		<path-nav :paths="paths"/>
		<div class="view--max window-padding">
			<div class="sell-view box">
				<div class="view--x sell-dropzone-images">
					<croppa class="croppa" :width="100" :height="100" :quality="10" initial-size="cover" :ref="'image'" :prevent-white-space="true" initial-position="center"></croppa>
				</div>
				<div class="sell-view-form view--x">
					<div class="extend">
						<transition name="label">
							<label for="sell-product-name" v-if="product.name">Name</label>
						</transition>
						<input class="invisible-input" type="text" id="sell-product-name" value="" placeholder="Name" v-model="product.name">

						<transition name="label">
							<label v-if="product.description" for="sell-product-description">Description</label>
						</transition>
						<input class="invisible-input" type="text" id="sell-product-description" value="" placeholder="Description" v-model="product.description">

					</div>
					<div class="right">
						<transition name="label">
							<input type="number" placeholder="Price" min="0" v-model="product.price">
						</transition>

						<label>Price currency</label>
						<select v-model="product.currency">
							<option value="USD">USD</option>
							<option value="EUR">EUR</option>
						</select>
						<label>Categories</label>
						<select v-model="product.categorie">
							<option value="null">Choose one</option>
							<option v-for="cat in categories" :value="cat.id">{{ cat.nameEng }}</option>
						</select>

						<div class="">
							NEVER SOLD / RESELL
						</div>

						<label>Shipping</label>
						<label for="shipping-irl">IRL</label>
						<input id="shipping-irl" type="checkbox" v-model="product.shipping.irl">
						<label for="shipping-postal">Postal</label>
						<input id="shipping-postal" type="checkbox" v-model="product.shipping.postal">
						<button type="button" class="button--xl button--blue" @click="submitProduct">Submit</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// TODO SELECT DEFAULT CURRENCY OF USER
	import PathNav from './navigation/Path';
	import Croppa from 'vue-croppa';

	export default {
		name: 'Sell',
		components: {
			PathNav,
			Croppa: Croppa.component
		},
		computed: {
			categories: function() {
				return this.$store.state.categories;
			}
		},
		data: function() {
			return {
				paths: [{ name: 'Sell', path: '/sell' }],
				product: {
					currency: 'USD',
					shipping: {
						irl: false,
						postal: false
					},
					categorie: null,
					images: []
				},
			}
		},
		methods: {
			submitProduct: function() {
				this.uploadImages()
					.then(() => {
						this.$http.post("/product", this.product)
							.then(function(ret) {
								this.$router.push('/product/' + ret.body.productId)
							}, (err) => {
								console.log(err)
							})
					})
					.catch(err => {
						console.log(err);
					})
			},

			uploadImages: function() {
				return new Promise((resolve, reject) => {
					if (!this.$refs.image.hasImage())
						return resolve()

					this.$refs.image.generateBlob((blob) => {
						var fd = new FormData()
						fd.append('file', blob)

						this.$http.post('/upload/image', fd)
							.then(data => {
								this.product.images.push(data.body.filename)
								resolve()
							}, err => {
								reject()
							})
					})
				})
			}
		}
	}
</script>
