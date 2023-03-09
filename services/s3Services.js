const AWS = require('aws-sdk');

const uploadToS3 = async (data, filename) => {
    try {
      const BUCKET_NAME = "skexpense";
      const IAM_USER_KEY = "AKIAQX4SE7U6ULGCIKWV";
      const IAM_USER_SECRET = "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";
      let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
      })
      let fileDetails = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
      }
      return new Promise((resolve, reject) => {
        s3bucket.upload(fileDetails, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.Location);
          }
        });
      })
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err, message: "Something went wrong" });
    }
  };

  module.exports={
    uploadToS3,
  }