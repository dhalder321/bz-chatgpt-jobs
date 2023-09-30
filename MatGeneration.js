const readlineSync = require("readline-sync");
const { SaveMaterial } = require("./FileAccess");
const gpt = require("./ChatGPT");
const str = require("./Strings");
const { prompts } = require("./GPTPrompts");
const { topics, topicData } = require("./SharedVariables");
const wordCount = require("word-count");

let MatGeneration = async (allSubTopics) => {

    var user_input, mat_list_prompt, mat_sample_generation_prompt;

    var mat_prompts = ["material_quiz_generation",
        "material_question_paper_generation",
        "material_summary_generation",
        "material_interview_question_generation"];

    console.log("Material generation started...");

    for (let subTopic2 of allSubTopics) {
        for (let subTopic3 of subTopic2.topics_level_3) {
            
            console.log("Mat Gen - Topic in process:: " + subTopic2.topic_level_2 + " => " + subTopic3);
            if (readlineSync.question("\nMat Gen - You Want to continue with the sub topic? (Y/N)").toUpperCase() === "N") {
                //skip mat gen
                continue;
            }

            //generate the name and complexities of the materials
            var prompt = prompts.find(p => p.prompt_name === "material_list")
                .prompt.replaceAll("<topic>", subTopic3)
                .replaceAll("<main_topic>", topics[0]);
            if (readlineSync.question("\nIs Material list prompt okay? (Y/N) - " + prompt + "::").toUpperCase() === "Y") {
                user_input = prompt;
            }

            else {
                user_input = readlineSync.question("\nMat Gen - Enter your input to generate material list: ");
            }
            //get GPT response
            mat_list_prompt = user_input;
            output_text = await gpt.GetGPTResponse(user_input);
            var materials = str.GetMatches(output_text, "material_list_pattern");
            var complexities = str.GetMatches(output_text, "material_complexity_pattern");
            console.log(materials);
            console.log(complexities);

            //generate each material
            var matIndex = 0;
            for (mat of materials) {
                
                //generate the materials
                var prompt = prompts.find(p => p.prompt_name === "material_generation");
                await GenerateMaterial(subTopic2.topic_level_2, subTopic3, mat, "material", complexities[matIndex], mat_list_prompt, prompt.prompt);

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

    var mat_sampleFileDocxName = mat + "_" + mat_type + "_sample.docx";
    var mat_sample_generation_prompt = "";
    var user_input = "";

    var matDetails = {
        topic: topics[0],
        subTopic2: subTopic2,
        subTopic3: subTopic3,
        material_name: mat,
        mat_type: mat_type,
        mat_sampleFileDocxName: mat_sampleFileDocxName,
        mat_sampleFilePDFName: mat  + "_" + mat_type + "_sample.pdf",
        mat_sampleDocxCreated: false,
        mat_samplePDFCreated: false,
        mat_originalFileDocxName: mat  + "_" + mat_type + "_orgn.docx",
        mat_originalFilePDFName: mat  + "_" + mat_type + "_orgn.pdf",
        mat_originalDocxCreated: false,
        mat_originalPDFCreated: false,
        mat_FileLocalPath: "",
        mat_FileS3Path: "",
        mat_complexity: complexity,
        mat_sampleFileWordCount: -1, //wordCount(output_text),
        mat_list_prompt: mat_list_prompt,
        mat_sample_generation_prompt: "",
        datetimeOfSampleGeneration: new Date().toUTCString(),
    };

    console.log("\n\n****Generating contect for ::" + subTopic2 + "=>" + subTopic3 + "=>" + mat + " - Mat type(" + mat_type + ")**********");

    var prompt = generation_prompt.replaceAll("<topic>", mat).replaceAll("<main_topic>", topics[0]);
    if (readlineSync.question("\nContinue " + mat_type + " generation for material " + mat + "? (Y/N) ::").toUpperCase() === "N") {
        //skip it
        topicData.push(matDetails);
        return;
    }
    if (readlineSync.question("\nIs " + mat_type + " generation prompt okay? (Y/N) - " + prompt + "::").toUpperCase() === "Y") {
        user_input = prompt;
    }
    else {
        user_input = readlineSync.question("\nMat Gen - Enter your input to generate material: ");
    }
    //get GPT response
    mat_sample_generation_prompt = user_input;
    output_text = await gpt.GetGPTResponse(user_input);
    console.log(output_text.substring(0, 50));

    if (readlineSync.question("\nYou Want to store the material? (Y/N)").toUpperCase() === "N") {
        //skip storage
        matDetails = {
            ...matDetails,
            mat_sample_generation_prompt: mat_sample_generation_prompt
        }
        topicData.push(matDetails);
        return;
    }
    //save the material file - sample file
    const outputFileData = { outputFilePath: "" };
    await SaveMaterial(topics[0], subTopic2, subTopic3, mat,
        mat_sampleFileDocxName, "sample", outputFileData, output_text);
    console.log("Material for topic " + mat + " saved successfully.");

    //set the global topic data
    matDetails = {
        ...matDetails,
        mat_sample_generation_prompt: mat_sample_generation_prompt,
        mat_sampleDocxCreated: true,
        mat_sampleFileWordCount: wordCount(output_text),
        mat_FileLocalPath: outputFileData.outputFilePath,
    }
    topicData.push();


}

module.exports= {MatGeneration}