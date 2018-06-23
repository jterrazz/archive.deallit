module.exports = {
	getDiffArray: (before, after) => {
		var isHere = 0;
		var diff = []

		before.forEach((product1) => {
			product1.tags.forEach((tag1) => {
				after.forEach((product2) => {
					if (product1.productId == product2.productId) {
						product2.tags.forEach((tag2) => {
							if (tag2 == tag1)
								isHere += 1;
						})
					}
				})
				if (!isHere)
					diff.push(tag1);
				isHere = 0;
			})
		})

		return diff
	}
}
