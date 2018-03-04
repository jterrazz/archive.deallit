const	AWS =			require('aws-sdk'),
		path =			require('path'),
		fs =			require('fs'),
		env =			require('../config/env');

AWS.config.loadFromPath('config/aws.json');

const s3 = new AWS.S3({ region: 'eu-west-2' });

const createMainBucket = () => {
	return new Promise((resolve, reject) => {
		const bucketParams = {
			Bucket: env.AWS_BUCKET_NAME
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
			Bucket: env.AWS_BUCKET_NAME,
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
		file = fs.createReadStream(path);
		file.on('error', (err) => {
			return reject(err);
		})

		try {
			await createMainBucket();
			await createItemObject(file, fileName);

			return resolve(fileName);
		} catch (err) {
			return reject(err);
		}
	})
}

module.exports = {
	sendFiles: (filesArray) => {
		var ftArray = [];

		if (!filesArray || !filesArray.length) // TODO Also check names files are correct
			return Promise.resolve();

		filesArray.forEach((filename) => {
			if (filename) // TODO Check correspond to user upload and exist
				ftArray.push(uploadToAWS(filename, `uploads/${ filename }`))
		});

		return Promise.all(ftArray);
	}
}
