const env = require('../config/env'),
	sgMail = require('@sendgrid/mail');

sgMail.setApiKey(env.SENDGRID_API_KEY);

module.exports = {
	sendRegistration: function(mail, code) {
		/*
		const msg = {
			to: mail,
			from: 'registration@mail.deallit.com',
			subject: 'Deallit - Confirm your mail address',
			text: 'Confirm your mail',
			html: `You just registred on Deallit.com <a href="https://deallit.com/confirm-mail/${ code }">Confirm your mail</a>`,
		};
		sgMail.send(msg);
		*/
	}
}
