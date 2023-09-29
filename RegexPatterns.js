
const patterns = [
    {name: "topic_list_pattern", pattern: '(?<=[\\)\\.] )(.*)(?=\\n)'},
    {name: "material_list_pattern", pattern: '(?<=[\\)\\.] )(.*)(?=[\\(\\-])'},
    {name: "material_complexity_pattern", pattern: '(?<=\\: )(.*)(?=[\\)\\n])'}
];

module.exports = {patterns}