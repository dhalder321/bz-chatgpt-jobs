const readlineSync = require("readline-sync");
const { SaveMaterial, StoreData } = require("./FileAccess");
const gpt = require("./ChatGPT");
const str = require("./Strings");
const { prompts } = require("./GPTPrompts");
const { topics, topicData, languages, mat_prompts } = require("./SharedVariables");
const wordCount = require("word-count");
const path = require("path");
const {UploadFileToS3} = require("./S3Suite");


let MatGeneration = async (allSubTopics) => {

    var user_input, mat_list_prompt, mat_sample_generation_prompt;

    console.log("Material generation started...");

    for (let subTopic2 of allSubTopics) {

        for (let subTopic3 of subTopic2.topics_level_3) {
            
            console.log("Mat Gen - Topic in process:: " + subTopic2.topic_level_2 + " => " + subTopic3);
            if (readlineSync.question("\nMat Gen - You Want to continue with the sub topic? (Y/N)").toUpperCase() === "N") {
                //skip mat gen
                continue;
            }

            //receive or generate the name and complexities of the materials
            var materials = [];
            var complexities = [];
            var matCount = 1;
            if(readlineSync.question("\n\nDo you like to add materials (Y/N)::").toUpperCase() === "Y")
            {
                do{
                    materials.push( readlineSync.question("\n\nWhat is the material name " + matCount++ + " ::"));
                    //materials.push( readlineSync.question("\n\nWhat is the material name " + matCount++ + " ::"));
                    //materials.push( readlineSync.question("\n\nWhat is the material name " + matCount++ + " ::"));

                }while(readlineSync.question("\n\nDo you like to add more materials (Y/N)::").toUpperCase() === "Y");
                
                //get the complexities for each material
                var prompt = prompts.find(p => p.prompt_name === "material_complexity")
                    .prompt.replaceAll("<topic>", subTopic3)
                    .replaceAll("<main_topic>", topics[0])
                    .replaceAll("<mat_list>", materials.map( m => `"${m}"` ).join([separator = ',']));
                if (readlineSync.question("\nIs Material complexity prompt okay? (Y/N) - " + prompt + "::").toUpperCase() === "Y") {
                    user_input = prompt;
                }

                else {
                    user_input = readlineSync.question("\nMat Gen - Enter your input to generate complexity list: ");
                }
                //get material list with higher max tokens
                mat_list_prompt = user_input;
                output_text = await gpt.GetGPTResponse(user_input, 1000);
                //materials = str.GetMatches(output_text, "material_list_pattern");
                complexities = str.GetMatches(output_text, "material_complexity_pattern");
            }
            else
            {

                var prompt = prompts.find(p => p.prompt_name === "material_list")
                        .prompt.replaceAll("<topic>", subTopic3)
                        .replaceAll("<main_topic>", topics[0]);
                if (readlineSync.question("\nIs Material list prompt okay? (Y/N) - " + prompt + "::").toUpperCase() === "Y") {
                    user_input = prompt;
                }

                else {
                    user_input = readlineSync.question("\nMat Gen - Enter your input to generate material list: ");
                }
                //get material list with higher max tokens
                mat_list_prompt = user_input;
                output_text = await gpt.GetGPTResponse(user_input, 1000);
                materials = str.GetMatches(output_text, "material_list_pattern");
                complexities = str.GetMatches(output_text, "material_complexity_pattern");
            }
            console.log(materials);
            console.log(complexities);

            //generate each material
            var matIndex = 0;
            for (mat of materials) {
                
                //generate the materials
                // var prompt = prompts.find(p => p.prompt_name === "material_generation");
                // await GenerateMaterial(subTopic2.topic_level_2, subTopic3, mat, "material", complexities[matIndex], mat_list_prompt, prompt.prompt);

                //for each material, generate additional materials ::
                // quiz, questions papers, 1 para-summary, interview questions  
                for (mp of mat_prompts) {
                    
                    var prompt = prompts.find(p => p.prompt_name === mp);
                    if(prompt)
                    {
                        console.log("\n\nAdditional material generation starting.....");
                        await GenerateMaterial(subTopic2.topic_level_2, subTopic3, mat, 
                                            prompt.mat_type, complexities[matIndex], mat_list_prompt, prompt.prompt);
                    }
                }

                //upload to S3::commented s3 upload
                console.log("\n\n Please check all the generated files before they are uploaded into cloud.")
                if (readlineSync.question("\n<<<<Checked all the files?>>>> (Y/N)").toUpperCase() === "Y") {
                //skip mat gen
                ;
                }
                var location = "";
                //console.log("topic data: " + JSON.stringify(topicData));
                for(x of topicData)
                {
                    //console.log (x.material_name + "  :: matched to :: " + mat);
                    if(x.material_name === mat)
                    {
                        location = await UploadFileToS3(x.topic, x.subtopic2, x.subTopic3, x.material_name, 
                                                        x.mat_locale, x.mat_FileLocalPath, x.mat_sampleFileDocxName);
                        x.mat_FileS3Path = location;
                    }
                }
                console.log("S3 Upload is complete.");
                
                //store the mat details in file
                var arr = topicData.filter((t) =>{ 
                    return t.material_name === mat && t.mat_type === "summary";
                });
                //console.log("Material Arr: " + JSON.stringify(arr));
                if(arr.length > 0)
                {
                    await StoreData(arr, path.join( arr[0].mat_FileLocalPath, arr[0].material_name + ".json" ));
                }
                matIndex++;
            }
        }
    } //end of docx sample file creation


    //create the corresponding PDFs
    console.log(topicData);
    // console.log("PDF conversion started...")
    // for(t of topicData)
    // {
    //    await ConvertDocToPdf(path.join(t.mat_FileLocalPath, t.mat_sampleFileDocxName));
    // }
    // console.log(topicData);
    // console.log("PDF conversion complete")
};

async function GenerateMaterial(subTopic2, subTopic3, mat, mat_type, complexity, mat_list_prompt, generation_prompt){

    var mat_sampleFileDocxName = str.Abbreviate(mat) + "_" + mat_type + "_enus_sample.docx";
    var mat_sample_generation_prompt = "";
    var user_input = "";
    var contentGenerationNeeded = true;

    console.log("\n\n****Generating content for ::" + subTopic2 + "=>" + subTopic3 + "=>" + mat + " \n- Mat type(" + mat_type + ")**********");

    var prompt = generation_prompt.replaceAll("<topic>", mat).replaceAll("<main_topic>", topics[0]);
    if (readlineSync.question("\nContinue " + mat_type + " generation for material " + mat + "? (Y/N) ::").toUpperCase() === "N") {
        //skip it
        //topicData.push(matDetails);
        contentGenerationNeeded = false;
    }

    var matDetails = {
        topic: topics[0],
        subTopic2: subTopic2,
        subTopic3: subTopic3,
        material_name: mat,
        mat_type: mat_type,
        mat_locale: "en-us",
        mat_sampleFileDocxName: mat_sampleFileDocxName,
        mat_sampleFilePDFName: str.Abbreviate(mat)  + "_" + mat_type + "_enus_sample.pdf",
        mat_sampleDocxCreated: false,
        mat_samplePDFCreated: false,
        mat_originalFileDocxName: str.Abbreviate(mat)  + "_" + mat_type + "_enus_sample.docx",
        mat_originalFilePDFName: str.Abbreviate(mat)  + "_" + mat_type + "_enus_sample.pdf",
        mat_originalDocxCreated: false,
        mat_originalPDFCreated: false,
        mat_FileLocalPath: "",
        mat_FileS3Path: "",
        mat_complexity: complexity,
        mat_sampleFileWordCount: -1, //wordCount(output_text),
        mat_list_prompt: mat_list_prompt,
        mat_sample_generation_prompt: "",
        purpose: "",
        datetimeOfMatGeneration: new Date().toUTCString(),
        datetimeOfMatUpdation: new Date().toUTCString(),
    };

    let outputFileData = { outputFilePath: "", wordCount: -1};

    //save only summary - original file
    if (mat_type === "summary" && contentGenerationNeeded === true)
    {    
        if (readlineSync.question("\nIs " + mat_type + " generation prompt okay? (Y/N) - " + prompt + "::").toUpperCase() === "Y") {
            user_input = prompt;
        }
        else {
            user_input = readlineSync.question("\nMat Gen - Enter your input to generate material: ");
        }
        //get GPT response
        mat_sample_generation_prompt = user_input;
        output_text = await gpt.GetGPTResponse(user_input, 500);
        if (readlineSync.question("\nEnable second pass? (Y/N)").toUpperCase() === "Y") {
            output_text += "\n\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<Second PASS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n" 
                                + await gpt.GetGPTResponse("add any other important points.", 500);
        }
        if (readlineSync.question("\nEnable third pass? (Y/N)").toUpperCase() === "Y") {
        
            output_text += "\n\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<Third PASS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n" 
                            + await gpt.GetGPTResponse("add any other important mathematical formulas, theories, examples", 700);
        }
        console.log(output_text.substring(0, 50));

        // if (readlineSync.question("\nYou Want to store the material? (Y/N)").toUpperCase() === "N") {
        //     //skip storage
        //     // matDetails = {
        //     //     ...matDetails,
        //     //     mat_sample_generation_prompt: mat_sample_generation_prompt
        //     // }
        //     // topicData.push(matDetails);
        //     return;
        // }
    
        
        //save the material file - sample file
        await SaveMaterial(topics[0], subTopic2, subTopic3, mat, mat_type.toUpperCase(),
            mat_sampleFileDocxName, "original", "en-us", outputFileData, output_text);

        //save the data in the DB
        matDetails.mat_sampleDocxCreated= true;
        matDetails.mat_sample_generation_prompt= mat_sample_generation_prompt;

        console.log("Material for topic " + mat + " saved successfully.");
    }

    //set the global topic data
    //console.log(JSON.stringify(outputFileData));
    matDetails.mat_sampleFileWordCount= 700; ///avg word count 700
    matDetails.mat_FileLocalPath= outputFileData.outputFilePath;
    //price is the complexity - 1 cent/1000 words; default price $2
    // price: complexity === -1? 2 : 
    //                             outputFileData.wordCount === -1 ? complexity: 
    //                                                                 complexity + (700 / 1000),
    matDetails.price=  mat_type === "summary"? 0 : isNaN(complexity) ? 2: +complexity - 1;
    topicData.push(matDetails);

    //save materials in other languages 
    // for(lan of languages)
    // {
    //     if(lan.locale == 'en-us' || mat_type !== "summary") continue;

    //      //save the material file - sample file
    //     let outputFileData = { outputFilePath: "", wordCount: -1 };
    //     await SaveMaterial(topics[0], subTopic2, subTopic3, mat,
    //         mat_sampleFileDocxName, "sample", lan.locale, outputFileData, output_text);
    //     console.log("Material for topic " + mat + " in locale " + lan.locale + " saved successfully.");

    //     //set the global topic data
    //     matDetails = {
    //         ...matDetails,
    //         locale: lan.locale,
    //         mat_sample_generation_prompt: mat_sample_generation_prompt,
    //         mat_sampleDocxCreated: true,
    //         mat_sampleFileWordCount: outputFileData.wordCount,
    //         mat_FileLocalPath: outputFileData.outputFilePath,
    //     }
    //     topicData.push();
    // }

}

module.exports= {MatGeneration}