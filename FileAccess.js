const officegen = require('officegen');
const libre = require("libreoffice-convert");
const path = require("path");
const fs = require('fs');
const { center } = require('underscore.string');
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

let SaveMaterial = async (topic, subTopic2, subTopic3, matName, fileName, fileType, outputFileData, content) => {

    const filePath = 'C:\\Fundu\\Generated materials\\'; 

    try{
        //check for the local file existance
        var folderPath = filePath + topic + "\\" +  subTopic2 + "\\" + subTopic3 + "\\en-us\\";

        if(!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath, {recursive: true});
        }
        outputFileData.outputFilePath = folderPath;

        //create the docx document
        let docx = officegen('docx');

        docx.setDocTitle(fileName);
        docx.setDocSubject(matName);
        docx.setDocKeywords(subTopic3);
        docx.setDescription( "A material on " + subTopic2 +". Detailing is on " + subTopic3 + ", specifically on " + matName);
        // docx.setDocCategory('...')
        // docx.setDocStatus('...')

        let firstPObj = docx.createP({ align : 'center'});
        firstPObj.addText('\n'.repeat(12) + matName, {
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
            pObj.addText("!!SAMPLE DOCUMENT. MATERIAL HIDDEN!!", {
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
        footer.addText ( "© 2023 Blue Zebra Development Corporation. All rights reserved.", { 
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