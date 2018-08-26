import url from 'url';
import uuid from 'uuid/v1';
import Storage from '@google-cloud/storage';

module.exports = (searchUrl, buffer) => {
  return new Promise((resolve, reject) => {
    const urlParts = url.parse(searchUrl);
    const urlHost = urlParts.host;

    const uploadBucketName = process.env.UPLOAD_STORAGE_BUCKET;
    const uploadFileName = uuid();

    const bucket = Storage().bucket(uploadBucketName);
    const uploadFile = bucket.file(`${urlHost}/${uploadFileName}`);

    const uploadStream = uploadFile.createWriteStream({
      predefinedAcl: 'publicRead',
      metadata: {
        contentType: 'image/png',
      },
    });

    uploadStream
      .on('error', reject)
      .on('finish', (result) => {
        resolve({
          imagePath: `https://${uploadBucketName}.googleapis.com/${uploadFile}`,
          result,
        })
      })
      .write(buffer)
      .end();
  });
};
