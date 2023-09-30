
const { OpenAI  } = require("openai");

// gets API Key from environment variable OPENAI_API_KEY
const client = new OpenAI( {apiKey: "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"});

async function main() {
  // getting just raw Response:
    const response = await client.completions
      .create({
        prompt: 'Translate the english text in spanish: Hello! How are you?',
        model: 'text-davinci-003',
      });
    //console.log(`response headers: `, Object.fromEntries(response.headers.entries()));
    console.log(`response json: `, response.choices[0].text);
}

main().catch(console.error);