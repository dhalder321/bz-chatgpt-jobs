const { OpenAI } = require("openai");


const openai =  new OpenAI ({
  apiKey: "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"//process.env.OPENAI_SECRET_KEY
});


async function TranslateLanguage(text, language)
{

  const prompt1 = `Translate the following English text into ${language}:\n\n${text}\n\n`;
  //const prompt = `Translate the following English text into French : How are you?`;
  //console.log(prompt1)
  
  try {
      // getting just raw Response:
      const response = await openai.completions
      .create({
        prompt: prompt1,
        model: 'gpt-3.5-turbo-instruct',
      });
      //console.log(`response headers: `, Object.fromEntries(response.headers.entries()));
      console.log(response.choices[0].text.substring(50));
      return response.choices[0].text;
    }
    catch(error) {
      console.log( error);
    }
}

//const x =  TranslateLanguage("Hello! how are you?", "Italian");
//console.log(JSON.stringify(x));

module.exports= {TranslateLanguage}