const officegen = require('officegen');
const libre = require("libreoffice-convert");
const path = require("path");
const fs = require('fs');
const { center } = require('underscore.string');
const {TranslateLanguage} = require("./Translate");
const { languages } = require('./SharedVariables');
const wordCount = require('word-count');
libre.convertAsync = require('util').promisify(libre.convert);



async function ConvertDocToPdf(filePath) {

    try {

      const inputPath = filePath;
      const fileExtension = path.extname(filePath)
      const outputFileName = path.basename(filePath, fileExtension) + ".pdf";
      const outputPath = path.join(path.dirname(filePath), outputFileName);

      if(fs.existsSync(inputPath)){
            console.log("Word document found...Converting to " + outputPath + "...");
            const docxBuf = await fs.readFile(inputPath, (err) => err && console.error(err));
            let pdfBuf = await libre.convertAsync(docxBuf, "pdf", undefined);
            await fs.writeFile(outputPath, pdfBuf, (err) => err && console.error(err));
        }
    }catch (err) {
      console.log("Error in PDF conversion:: ", err);
    }

}

let SaveMaterial = async (topic, subTopic2, subTopic3, matName, fileName, fileType, locale, outputFileData, content) => {

    const filePath = 'C:\\Fundu\\Generated materials\\'; 

    try{
        //USA english is default
        var language = languages.find(l => l.locale===locale).lan;
        var tranTopic = locale !== "en-us"? await TranslateLanguage(topic, language): topic;
        var tranSubTopic2 = locale !== "en-us"? await TranslateLanguage(subTopic2, language): subTopic2; 
        var tranSubTopic3 = locale !== "en-us"? await TranslateLanguage(subTopic3, language): subTopic3;
        var tranMatName = locale !== "en-us"?await TranslateLanguage(matName, language): matName;
        var tranFileName = locale !== "en-us"?await TranslateLanguage(fileName, language): fileName;
        var tranFileType = locale !== "en-us"?await TranslateLanguage(fileType, language): fileType;
        content = locale !== "en-us"? await TranslateLanguage(content, language): content;

        //check for the local file existance
        var folderPath = filePath + topic + "\\" +  subTopic2 + "\\" + subTopic3 + "\\" + locale + "\\";

        if(!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath, {recursive: true});
        }
        outputFileData.outputFilePath = folderPath;
        outputFileData.wordCount = wordCount(content);

        //create the docx document
        let docx = officegen('docx');

        docx.setDocTitle(tranFileName);
        docx.setDocSubject(tranMatName);
        docx.setDocKeywords(tranSubTopic3);
        docx.setDescription( );
        // docx.setDocCategory('...')
        // docx.setDocStatus('...')

        let firstPObj = docx.createP({ align : 'center'});
        firstPObj.addText('\n'.repeat(12) + tranMatName, {
            bold: true,
            font_face: 'Times New Roman',
            font_size: 40,
        })
        docx.putPageBreak();

        let pObj = docx.createP();

        //in sample file, add sample text
        if(fileType === "sample")
        {
            content += "...";
            content += "\n".repeat(5);
        }

        pObj.addText(content, {
            font_face: 'Arial',
            font_size: 12
        });

        //in sample file, add sample text
        if(fileType === "sample")
        {
            pObj = docx.createP({align: 'center'});
            pObj.addText(locale !== 'en-us'? await TranslateLanguage("!!SAMPLE DOCUMENT. MATERIAL HIDDEN!!", language): 
                                "!!SAMPLE DOCUMENT. MATERIAL HIDDEN!!"                         
            , {
                bold: true,
                font_face: 'Times New Roman',
                font_size: 15,
                color: 'ff0000'
            });
        }

        var header = docx.getHeader ().createP ({align : 'center'});
        header.addText ( matName , { 
            bold: true,
            font_face: 'Arial',
            font_size: 12
        });

        var footer = docx.getFooter ().createP ({align : 'center'});
        footer.addText (locale !== 'en-us'? await TranslateLanguage("© 2023 Blue Zebra Development Corporation. All rights reserved.", language):
                                "© 2023 Blue Zebra Development Corporation. All rights reserved."
        , { 
            bold: true,
            font_face: 'Arial',
            font_size: 12
        } );

        let out = fs.createWriteStream(folderPath + fileName);

        out.on('error', function(err) {
        console.log(err)
        })

        // Async call to generate the output file
        out.on('finish', function(written) {
            //convert to PDF
            //console.log("Bytes written:: " + written )
            //ConvertDocToPdf(folderPath + fileName);
        });
       

        docx.generate(out);

    }
    catch (e)
    {
        console.log(e);
    }
}


module.exports = {SaveMaterial, ConvertDocToPdf}