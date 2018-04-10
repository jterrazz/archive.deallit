const	Boom =			require('boom'),
		analyzer =		require('../libs/analyzer'),
		pool =			require('./index').poolPromise;

module.exports = {
	getNotifications: async (userId) => {
		var [data] = await pool.query("SELECT * FROM user_notifications WHERE user_id=?", [userId]);
		analyzer.decodeNotifications(data);
		return data;
	},

	welcomeUser: async (userId) => {
		var insert = {
			type: 'welcome-1',
			user_id: userId
		};
		await pool.query("INSERT INTO user_notifications SET ?", [insert]);
	}
}
