require('../libs/utils');
const Joi = require('joi');
const assert = require('assert');
const dbUser = require('../models/user');

describe('wallets', function() {
	beforeEach(function() {

	})

	describe('#getPublicAddress', function() {
		it('should check arguments')
		it('should return null when not found', async function() {
			var wallet = await dbUser.getPublicAddress(-1, 't_btc', false);
			assert.equal(wallet, null);
		});
	})

	describe('#saveWallet', function() {
		var args = [
			[null, 1, "test", "test", false],
			['btc', null, "test", "test", false],
			['btc', 1, null, "test", false],
			['btc', 1, "test", null, false],
			['btc', 1, "test", "test", null],
		];

		args.forEach(a => {
			it(`should check arguments (${ a })`, function(done) {
				dbUser.saveWallet.apply(null, a)
					.then(() => { throw Error("return not null") })
					.catch(() => { done() })
			});
		})

		it('should create one and query it', async function() {
			await dbUser.saveWallet('t_btc', 1, "test", "test", false);
			var add = await dbUser.getPublicAddress(1, 't_btc', false);
			const schema = Joi.string().required();
			await schema.validate(add);
		});
	})
})
