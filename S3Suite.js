const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const path  = require("path");
const fs = require('fs');


  

async function UploadFileToS3(topic, subtopic2, subtopic3, mat, language, filePath, fileName){ 

    var bucketName = 'fundu-document-repository';
    var s3prefixedFileName = "fundu/Materials/"
    //var s3prefixedFileName = "";

    s3prefixedFileName += topic? topic + "/" : "";  
    s3prefixedFileName += subtopic2? subtopic2 + "/" : "";  
    s3prefixedFileName += subtopic3? subtopic3 + "/" : "";  
    s3prefixedFileName += language? language + "/" : "";
    //s3prefixedFileName += fileName;  

    return s3prefixedFileName;
    
    // if(!fs.existsSync(filePath))
    // {
    //   console.log("Local file to upload to S3 not found.");
    //   return s3prefixedFileName;
    // }

    //const fileData =  fs.readFileSync(path.join( filePath, fileName));

    const client = new S3Client({
      region: 'us-east-2',
      credentials: {
        accessKeyId: 'AKIAWYGZC7TZGOEBCY6F',       // Put your IAM user accessKeyId
        secretAccessKey: 'Zbr0ovpgXOPigKRWagjkCqHMZd8MTTQV7xZBOs+y',   // Put your IAM User accessKeyId
      },
      endpoint: 'https://s3.us-east-2.amazonaws.com', //+ "fundu/Materials/",   // Put your region
      Bucket: bucketName,         // Put your bucket name
      signatureVersion: 'v4',
  });

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3prefixedFileName + fileName,
      Body: fileData,
    });

    //const response = await client.send(command);
    //console.log(response);
    return s3prefixedFileName;
}

// UploadFileToS3("Accounting", "Financial Accounting", "Consolidation and Business Combinations", "Gene Expressions", "en-us", 
//   "C:\\Fundu\\Generated materials\\Accounting\\Financial Accounting\\Consolidation and Business Combinations\\en-us\\",
// "Gene Expression and Regulation.docx");


module.exports = { UploadFileToS3  }