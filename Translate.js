const { OpenAIApi } = require("openai");


const openai = new OpenAIApi({
    apiKey: "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",
});

async function TranslateLanguage(text, language)
{

    try {
        const answer = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Translate this into ${req.body.language}:\n\ ${req.body.word} \n\n1.`,
          temperature: 0.3,
          max_tokens: 100,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        });
        return answer.data.choices[0].text;
      }
      catch(error) {
        return next(error);
      }

}

module.exports= {TranslateLanguage}