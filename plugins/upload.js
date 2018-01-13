const	AWS =			require('aws-sdk'),
		path =			require('path'),
		fs =			require('fs');

AWS.config.loadFromPath('config/aws.json');

const	s3 =			new AWS.S3({region: 'eu-west-2'}),
		bucketName =	'the-crypto-market';

/* AWS methods */

const createMainBucket = () => {
	return new Promise((resolve, reject) => {
		const bucketParams = {
			Bucket: bucketName
		};

		s3.headBucket(bucketParams, (err, data) => {
			if (err) {
				console.log("ErrorHeadBucket", err);
				s3.createBucket(bucketParams, (err, data) => {
					if (err)
						return reject(err);
					return resolve(data);
				});
			} else
				return resolve(data);
		})
	})
}

const createItemObject = (file, fileName) => {
	return new Promise((resolve, reject) => {
		const params = {
			Bucket: bucketName,
			Key: `public/images/${ fileName }`,
			ACL: 'public-read',
			Body: file
		};

		s3.putObject(params, (err, data) => {
			if (err)
				return reject(err);
			return resolve(data);
		})
	})
}

const uploadToAWS = (fileName, path) => {
	return new Promise (async (resolve, reject) => {
		file = fs.createReadStream(path)
		file.on('error', (err) => {
			return reject(err)
		})

		try {
			await createMainBucket()
			await createItemObject(file, fileName)

			return resolve()
		} catch (err) {
			return reject(err)
		}
	})
}

const upload = {}

upload.storeFiles = (filesArray) => {
	var ftArray = []

	filesArray.forEach((filename) => {
		ftArray.push(uploadToAWS(filename, `uploads/${ filename }`))
	})
	return Promise.all(ftArray)
}

module.exports = upload
