const { topicData } = require("./SharedVariables");
const {UploadFileToS3} = require("./S3Suite");
const {UpdateMaterials} = require("./DBAccess");
const readlineSync = require("readline-sync");


async function UploadtoCloud()
{

    
    

    //update db
    await UpdateMaterials(topicData);
    console.log("DB Upload is complete.")


}

module.exports = { UploadtoCloud}