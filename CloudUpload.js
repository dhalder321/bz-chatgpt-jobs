const { topicData } = require("./SharedVariables");
const {UploadFileToS3} = require("./S3Suite");
const {UpdateMaterials} = require("./DBAccess");


async function UploadtoCloud()
{

    //upload to S3
    var location = "";
    for(mat of topicData)
    {
        location = await UploadFileToS3(mat.topic, mat.subtopic2, mat.subTopic3, mat.material_name, 
                                        mat.mat_locale, mat.mat_FileLocalPath, mat.mat_sampleFileDocxName);
        mat.mat_FileS3Path = location;
    }
    console.log("S3 Upload is complete.")

    //update db
    UpdateMaterials(topicData);
    console.log("DB Upload is complete.")


}

module.exports = { UploadtoCloud}