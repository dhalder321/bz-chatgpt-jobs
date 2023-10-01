const { OpenAI  } = require("openai");
const history =  require("./GPTHistory");

//const chatHistory = [];
var  openai;

function SetContext(context)
{

    openai = new OpenAI ({
        apiKey: "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"//process.env.OPENAI_SECRET_KEY
    });

    
    history.gptHistory.push(["system", context ]);

} 

async function GetGPTResponse(input, maxTokenCount = 250){

    var loop = true;
    var loopCount = 0;
    //console.log("in GetGPTResponse method - 1:: " + JSON.stringify(history.gptHistory));
    //set up the input
    const messageList = history.gptHistory.length > 0 && history.gptHistory.map(([input_text, completion_text]) => ({
        role: "user" === input_text ? "ChatGPT" : "user",
        content: completion_text
        }));
    
    messageList.push({ role: "user", content: input });

    //console.log("in GetGPTResponse method - 2:: " + JSON.stringify(messageList));
    var output_text = "";
    //retry loop
    while(loop === true)
    {
        if(loopCount > 3) break;
        try{

            const GPTOutput = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messageList,
                max_tokens: 100
            });
        
            output_text = GPTOutput.choices[0].message.content;
            //const output_text = "1) Application architecture \n 2) Distributed architecture \n";
            console.log(output_text);
            history.gptHistory.push([input, output_text]);
            console.log("In GPT module: Generation completed.")
            loop = false;
        }
        catch(e)
        {
            if (typeof e === "RateLimitError")
            {
                loop = true;
                loopCount++;
                console.log("In GPT module:error occuring.")

            }
        }
    }
    return output_text;
}

module.exports = { GetGPTResponse, SetContext }
