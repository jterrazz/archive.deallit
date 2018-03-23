const multer = require('multer');

module.exports = {
	handleImage: multer({
		limits: {
			fileSize: 5242880
		},
		dest: 'uploads/',
		fileFilter: function (req, file, cb) {
			var filetypes = /jpeg|jpg|svg|png/;
			var mimetype = filetypes.test(file.mimetype);

			if (mimetype)
				return cb(null, true);
			cb("Error: File upload only supports the following filetypes - " + filetypes);
		}
	}).single('file')
}
