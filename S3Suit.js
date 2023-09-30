const AWS = require('aws-sdk');
const path  = require("path");
const fs = require('fs');

const s3 = new AWS.S3({
    accessKeyId: 'your-access-key-id',
    secretAccessKey: 'your-secret-access-key'
  });
  

function UploadFileToS3(topic, subtopic2, subtopic3, mat, language, filePath){ 


    var bucketName = 'fundu-document-repository/fundu/Materials/';
    const fileData = fs.readFileSync(filePath);
    
    bucketName += topic? topic + "/" : "";  
    bucketName += subtopic2? subtopic2 + "/" : "";  
    bucketName += subtopic3? subtopic3 + "/" : "";  
    bucketName += language? language + "/" : "";  

    s3.upload({
      Bucket: bucketName,
      Key: path.basename( fileName),
      Body: fileData
    }, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`File uploaded successfully. ${data.Location}`);
      }
    });

}


module.exports = { UploadFileToS3  }