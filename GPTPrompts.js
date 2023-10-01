


const prompts = [
    { prompt_name:"topic_list", 
        prompt: "list top 2 <topic> sub topics important for graduate students to learn in a numbered list. Do not add any course description or any other sentences." },

    { prompt_name:"material_list", 
        prompt: "list all topics for <topic> under the subject <main_topic> in a numbered list. do not add any other descriptions or sentences. do not provide book names or research paper names. Add the complexity of each material in a scale of 1 to 5 in this format : Topic Name (Complexity: 3). Remove any other special characters or punctuation from the output." },
    
    { prompt_name:"material_complexity", 
        prompt: "provide complexities of these topics provided in the comma separated list below for <topic> under the subject <main_topic> in a numbered list. do not add any other descriptions or sentences. do not provide book names or research paper names. Add the complexity of each material in a scale of 1 to 5 in this format : Topic Name (Complexity: 3). Remove any other special characters or punctuation from the output. Here is the list in brackets and each topic is within double quotes: (<mat_list>)"  },


    { prompt_name: "material_generation", 
        prompt: "explain what is <topic>? Detail out everything that a graduate student in <main_topic> should know about <topic>. Provide the details in 3 main sections - 1. Introduction (What is this topic, why is it important), 2. Details(details on this topic, any past and present theories or experiments, detailed explanation and implications of each of these theories or experiments, pros and cons of them, how these theories are applicable in real life situations, details on any procedures or tools involved, public opinions etc) and  3. Way forward (future trends, ongoing research that can bring more light, how this topic will be helpful for human kind etc.)"},
    
    { prompt_name: "material_quiz_generation", 
        mat_type: "quiz questions",
        prompt: "generate a list of 5 quiz questions on <topic> along with one line answer that can help graduate students of <main_topic> learn the topic better. Provide one line gap after each question."},

    { prompt_name: "material_question_paper_generation", 
        mat_type: "exam questions",
        prompt: "generate a list of 3 examination questions on <topic> along with comprehensive 10 line answers that can help graduate students of <main_topic> prepare for their graduate level examination. Provide one line gap after each question."},

    { prompt_name: "material_summary_generation", 
        mat_type: "summary",
        prompt: "generate a 200 word summary on the <topic> so that a graduate student of <main_topic> can quickly recollect gist on the topic."},

    { prompt_name: "material_interview_question_generation", 
        mat_type: "interview questions",
        prompt: "generate a list of 5 interview questions on <topic> that can help graduate students of <main_topic> prepare for post graduation job interview. Provide one line gap after each question."},
]

module.exports= {prompts}

