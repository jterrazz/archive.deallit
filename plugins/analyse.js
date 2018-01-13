module.exports = {
	images: (toAnalyse) => {
		toAnalyse.forEach((item) => {
			try {
				item.images = JSON.parse(item.images)
			} catch (e) {
				item.images = null
			}
		})
	}
}
