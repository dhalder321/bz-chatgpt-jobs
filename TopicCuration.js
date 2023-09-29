const readlineSync = require("readline-sync");
require("dotenv").config();
const str = require("./Strings");
const gpt = require("./ChatGPT");


var allSubTopics = [];

let TopicCuration = async () => {

    //get the context
    const context = readlineSync.question("Enter the context: ");
    //set the context for GPT
    gpt.SetContext(context);

    var subTopics = [];

do {
        //get the ask
        var user_input = readlineSync.question("Enter your input: ");
        try {
            //get GPT response
            var output_text = await gpt.GetGPTResponse(user_input);

            //parse the topics
            subTopics = str.GetMatches(output_text, "topic_list_pattern");
            console.log(subTopics);

            //get the level 3 sub topics
            if(readlineSync.question("\nYou Want to go for next level of Topics? (Y/N)").toUpperCase() === "N")
            {
                allSubTopics = subTopics;
            }
            else{ //go for next level of topics
                var tempSubtopics3 = [];
                for(let subTopic2 of subTopics)
                {
                    tempSubtopics3 = [];
                    console.log("Topic in process: " + subTopic2 + "\n");
                    if(readlineSync.question("\nYou Want to continue with the sub topic? (Y/N)").toUpperCase() === "N")
                    {
                        //skip the sub topic 2
                        continue;
                    }
                    user_input = readlineSync.question("Enter your input: ");
                    //get GPT response
                    output_text = await gpt.GetGPTResponse(user_input);
                    tempSubtopics3 = str.GetMatches(output_text, "topic_list_pattern");
                    console.log(tempSubtopics3);
                    if(tempSubtopics3 && tempSubtopics3.length > 0 &&
                        readlineSync.question("\nYou Want to add the sub topics? (Y/N)").toUpperCase() === "Y")
                    {
                        allSubTopics.push({
                            topic_level_2: subTopic2,
                            topics_level_3: tempSubtopics3
                        });

                        // //add material
                        // allSubTopics.find(t => t.topic_level_2 === subTopic2).forEach(element =>  {
                        //     MatGeneration(subTopic2, element);
                        // }); 
                    }
                    else
                    {
                        //skip the subtopic
                    }
                }
            }
        } 
        catch (err) {
            if (err.response) {
                console.log(err.response.status);
                console.log(err.response.data);
            } else {
                console.log(err.message);
            }
        }
    } 
    while (readlineSync.question("\nYou Want more Topics? (Y/N)").toUpperCase() === "Y");
    console.log(allSubTopics);

    return allSubTopics;
};

module.exports = { TopicCuration }
