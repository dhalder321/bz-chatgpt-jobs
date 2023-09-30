const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-2", // replace with your region in AWS account
});

const DynamoDB = new AWS.DynamoDB.DocumentClient();

async function UpdateMaterials(materials)
{
    const putReqs = materials.map(item => ({
        PutRequest: {
          Item: item
        }
      }))
    
      const req = {
        RequestItems: {
          MaterialUpdates: putReqs
        }
      }
    
      await dynamodb.batchWrite(req).promise()
}

module.exports = { UpdateMaterials }
