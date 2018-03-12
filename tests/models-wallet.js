require('../libs/utils');
const Joi = require('joi');
const assert = require('assert');
const dbUser = require('../models/user');

describe('bitcoin', function() {

	describe('wallet', function() {

		it('should check arguments', async function() {
			var todo = [
				dbUser.saveWallet(null, 1, "test", "test", false),
				dbUser.saveWallet('btc', null, "test", "test", false),
				dbUser.saveWallet('btc', 1, null, "test", false),
				dbUser.saveWallet('btc', 1, "test", null, false),
				dbUser.saveWallet('btc', 1, "test", "test", null),
			]
			var res = await Promise.settle(todo);
			var i = 0;
			res.forEach(err => {
				if (err.e)
					i++;
			})
			if (i !== todo.length)
				throw Error("Did not trigger error");
		});

		it('should return null when not found', async function() {
			var wallet = await dbUser.getPublicAddress(-1, 't_btc', false);
			assert.equal(wallet, null);
		});

		it('should create one and query it', async function() {
			await dbUser.saveWallet('t_btc', 1, "test", "test", false);
			var add = await dbUser.getPublicAddress(1, 't_btc', false);
			const schema = Joi.string().required();
			await schema.validate(add);
		});

	})

})
