const topics = [];
const topicData = [];


var mat_prompts = ["material_quiz_generation",
"material_question_paper_generation",
"material_summary_generation",
"material_interview_question_generation"];

var languages = [{ lan: "USA English", locale: "en-us"},
{ lan: "France French", locale: "fr-fr"},
// { lan: "United Kingdom English", locale: "en-gb"},
// { lan: "Spain Spanish", locale: "es-es"},
// { lan: "China Chinese", locale: "zh_cn"},
// { lan: "Turkish", locale: "tr-tr"},
// { lan: "Swedish", locale: "sv-se"},
// { lan: "Brazil Portuguese", locale: "pt-br"},
// { lan: "Netherlands Dutch", locale: "nl-nl"},
// { lan: "Italy Italian", locale: "it-it"},
// { lan: "Germany German", locale: "de-de"},
// { lan: "Greek", locale: "el-gr"},
];    

module.exports = { topics, topicData, mat_prompts, languages }