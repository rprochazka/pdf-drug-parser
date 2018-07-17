let PDFParser = require("pdf2json"),
    TextParser = require('./dist/textParser'),
    FileHelper = require('./dist/fileHelper');

const inputDir = "./data/input";
const outputDir = "./data/output";

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
        // console.log(`about to parse ${fileName}`)
        pdfParser.loadPDF(`${fileName}`);
    });
}

function formatWholeTxt(txtContent) {
    const textParser = new TextParser(txtContent);
    return textParser.removePageBreaks()
        .removeScrewedTableData()
        .markBoldSectionTitles()
        .markBoldTitles()
        .replaceLineEnds()
        .getText();

}

async function extractPart(text) {
    return new Promise((resolve, reject) => {
        const textParser = new TextParser(text);
        try {
            const extract = textParser
                .extractSection(2)
                .removePageBreaks()
                .removeScrewedTableData()
                .markBoldTitles()
                .replaceLineEnds()
                .getText();
            resolve(extract);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    })
}

async function populateAllInOneWithLinks() {

    // read file names within output dir    
    const fileHelper = new FileHelper();
    const files = await fileHelper.readDirAsync(outputDir);

    // read all in one file
    const allInOnePath = './all-in-one.html';
    const allInOneHtml = await fileHelper.readFileAsync(allInOnePath);

    // regex replace <div id="links"></div> with file names links
    var textParser = new TextParser(allInOneHtml);
    var updatedAllInOne = textParser
        .populateWithLinks(files)
        .getText();
    await fileHelper.saveFileAsync(updatedAllInOne, allInOnePath);
}

async function processFile(pdfFilePath) {
    console.log(`started processing ${pdfFilePath}`);
    console.time(pdfFilePath);
    const fileName = pdfFilePath.split('/').slice(-1)[0];
    const fileHelper = new FileHelper();

    try {
        await fileHelper.readDirAsync(inputDir);
        const txtContent = await parsePdf(pdfFilePath);
        const formattedTxt = formatWholeTxt(txtContent);
        await fileHelper.saveFileAsync(formattedTxt, `${outputDir}/${fileName.replace('pdf', 'txt')}`);

        const extract = await extractPart(txtContent);
        await fileHelper.saveFileAsync(extract, `${outputDir}/${fileName.replace('.pdf', '-extract.txt')}`);

    } catch (error) {
        console.error(error);
    }

    console.log(`finished processing ${pdfFilePath}`);
    console.timeEnd(pdfFilePath);
}

async function run(sourceDir) {
    console.log('App Started .....');
    console.time('App counter');
    const fileHelper = new FileHelper();
    const files = await fileHelper.readDirAsync(sourceDir);
    var tasks = [];
    const chunkSize = 50;
    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const filePath = `${sourceDir}/${file}`;
        tasks.push(processFile(filePath));
        if (index % chunkSize === 0) {
            await Promise.all(tasks);
            tasks = [];
        }

    }
    await Promise.all(tasks);
    tasks = [];

    console.log('App finished');
    console.timeEnd('App counter');

    await populateAllInOneWithLinks();
}

run(args[0])