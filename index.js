const readlineSync = require("readline-sync");
const { TopicCuration } =  require("./TopicCuration");
const {MatGeneration} = require("./MatGeneration");
const {topics} = require("./SharedVariables");

let main = async () => {

topics[0] = readlineSync.question("\nProvide the name of the main topic:: ");

const arr = await TopicCuration();

await MatGeneration(arr);

}

main();