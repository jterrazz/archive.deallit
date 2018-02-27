const env = require('../config/env'),
	sgMail = require('@sendgrid/mail');

sgMail.setApiKey(env.SENDGRID_API_KEY);

module.exports = {
	sendRegistration: function() {
		const msg = {
			to: 'thekingarises@gmail.com',
			from: 'no-reply@mail.ohmynation.com',
			subject: 'MyMarket - confirm your mail',
			text: 'Confirm your mail',
			html: '<strong>When you put a link or an image into an email and have click or open tracking turned on, the click tracking links and the images will point to your domain. This shows the recipient email server that you are not trying to hide anything behind the links and that you control the content of your emails. Some bad actors will use 3rd party link shortening services to populate the domains they list in their email content and they do not include their own domain in those links. This practice is a red flag to spam filters.<a href="ohmynation.com/login">Open</a></strong>',
		};
		sgMail.send(msg);
		console.log('sent');
	}
}
