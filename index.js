let PDFParser = require("pdf2json"),
    TextParser = require('./dist/textParser'),
    FileHelper = require('./dist/fileHelper');

console.log(process.argv);
var args = process.argv.slice(2);

async function parsePdf(fileName) {
    return new Promise((resolve, reject) => {
        let pdfParser = new PDFParser(this, 1);
        pdfParser.on("pdfParser_dataError", errData => {
            console.error(errData.parserError);
            reject('error in pdfParser_dataError')
        });
        pdfParser.on("pdfParser_dataReady", pdfData => {
            const content = pdfParser.getRawTextContent();
            resolve(content);
        });
        console.log(`about to parse ${fileName}`)
        pdfParser.loadPDF(`${fileName}`);
    });
}

function formatWholeTxt(txtContent) {
    const textParser = new TextParser(txtContent);
    return textParser.removePageBreaks()
        .markBoldSectionTitles()
        .markBoldTitles()
        .getText();

}

async function extractPart(text) {
    return new Promise((resolve, reject) => {
        const textParser = new TextParser(text);
        const extract = textParser
            .extractSection(2)
            .removePageBreaks()
            .markBoldTitles()
            .getText();
        resolve(extract);
    })
}

async function run(pdfFilePath) {
    console.log(`started parsing ${pdfFilePath}`);
    const fileName = pdfFilePath.split('/').slice(-1)[0];
    const fileHelper = new FileHelper();
    try {
        const txtContent = await parsePdf(pdfFilePath);
        const formattedTxt = formatWholeTxt(txtContent);
        await fileHelper.saveFile(formattedTxt, fileName.replace('pdf', 'txt'));

        const extract = await extractPart(txtContent);
        await fileHelper.saveFile(extract, fileName.replace('.pdf', '-extract.txt'));

        // console.log(extract);
    } catch (error) {
        console.error(error);
    }

    console.log('parsing finished');
}

run(args[0])