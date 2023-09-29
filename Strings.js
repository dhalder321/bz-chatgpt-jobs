const Str = require('string');
const {patterns} = require("./RegexPatterns");


function GetMatches(mainText, pattern){

    var arr = [];
    var array1 = [];
    let i = 0;
    
    
    var pat = patterns.find(p => p.name === pattern);
    //console.log(pat.pattern + "::" + mainText);
    const regex = RegExp(pat.pattern, 'g');
    while ((array1 = regex.exec(mainText + "\n")) !== null) {
        arr[i++] = RemovePunctuation(array1[0].trim());
      }
    return arr;
}

function RemovePunctuation(text){

  return Str(text).stripPunctuation().s;
}


module.exports = { GetMatches, RemovePunctuation };
