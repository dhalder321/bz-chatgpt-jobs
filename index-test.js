const docxConverter = require('docx-pdf');
const {ConvertDocToPdf} = require("./FileAccess");

// docxConverter('./a.docx','./output.pdf', (err, result) => {
//   if (err) console.log(err);
//   else console.log(result); // writes to file for us
// });

ConvertDocToPdf('C:\\Fundu\\ChatGPT Jobs\\x.docx');