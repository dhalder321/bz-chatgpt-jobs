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

function Abbreviate(text)
{
  const abbr = text => text.match(/\b([A-Za-z0-9])/g).join('').toUpperCase()
  const result = abbr(text)
  //console.log(result)
  return result;
}
// Abbreviate("Accounting for Divestitures and Discontinued 500 Operations in Consolidated Financial Statements");
// Abbreviate("Hi How are you");

module.exports = { GetMatches, RemovePunctuation, Abbreviate };
