const { DescribeTableCommand, ScanCommand, DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { BatchWriteCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");


const client = new DynamoDBClient({
  region: "us-east-2",
  credentials: {
    accessKeyId: 'AKIAWYGZC7TZGOEBCY6F',       // Put your IAM user accessKeyId
    secretAccessKey: 'Zbr0ovpgXOPigKRWagjkCqHMZd8MTTQV7xZBOs+y',   // Put your IAM User accessKeyId
  },
});
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
      removeUndefinedValues: true,
  }});

async function UpdateMaterials(materials)
{

  //find the largest topic id
  const cmd = new ScanCommand({
    ProjectionExpression: "topic_Id",
    TableName: "MaterialUpdates_Staged",
  });

  const response = await client.send(cmd);
  //console.log(JSON.stringify(response));
  var startIndex = 1;
  startIndex = Number(response && response.Items && response.ScannedCount > 0 &&
                      response.Items.sort((m1, m2) => {
                                        if (Number(m1.topic_Id.N) < Number(m2.topic_Id.N)) 
                                        {
                                            return 1;
                                        }
                                        else if (Number(m1.topic_Id.N) > Number(m2.topic_Id.N))
                                        {
                                            return -1;
                                        }
                                        else {
                                            return 0;
                                        }
                                  })[0].topic_Id.N);
  console.log("startIndex::" + JSON.stringify( startIndex));

  //add topic_id index before DB insertion
   const mats = materials.map( x => {
                            x.topic_Id = ++startIndex;
                            return x;
                            });
    const putReqs = mats.map(item => ({
        PutRequest: {
          Item: item
        }
      }))
    //console.log("putReqs::" + JSON.stringify( putReqs));
    const command = new BatchWriteCommand({
      RequestItems: {
        // An existing table is required. A composite key of 'title' and 'year' is recommended
        // to account for duplicate titles.
        ["MaterialUpdates_Staged"]: putReqs
      }
    });
    await docClient.send(command);
}

// var arr = [
//   {col1: "col1"},
//   {col1: "col2"},
// ];

// UpdateMaterials(arr);

module.exports = { UpdateMaterials }
