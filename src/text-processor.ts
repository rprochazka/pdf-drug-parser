// import PDFParser from 'pdf2json';
let PDFParser = require("pdf2json");
import TextParser from './text-parser';
import * as fileHelper from './file-helper';
import HtmlFormatter from './html-formatter';

const inputDir = "./data/input";
const outputDir = "./data/output";

export default class TextProcessor {

    private textParser: TextParser = new TextParser();

    async processFile(pdfFilePath: string): Promise<void> {

        console.log(`started processing ${pdfFilePath}`);
        console.time(pdfFilePath);
        const fileName = pdfFilePath.split('/').slice(-1)[0];

        try {
            await fileHelper.readDirAsync(inputDir);
            const txtContent = await this.parsePdf(pdfFilePath);

            // text cleanup
            this.textParser.init(txtContent);
            this.textParser.cleanupTextContent();

            //process whole text
            await this.processWholeTxt(this.textParser.getText(), fileName);

            //process sections
            const sections: number[] = [1, 2, 3, 4];
            sections.forEach(async section => await this.processSection(this.textParser.getSection(section), fileName, section));

        } catch (error) {
            console.error(error);
        }

        console.log(`finished processing ${pdfFilePath}`);
        console.timeEnd(pdfFilePath);
    }

    async populateAllInOneWithLinks() {

        // read file names within output dir        
        const files = await fileHelper.readDirAsync(outputDir);

        // read all in one file
        const allInOnePath = './all-in-one.html';
        const allInOneHtml = await fileHelper.readFileAsync(allInOnePath);

        // regex replace <div id="links"></div> with file names links
        const updatedAllInOne = this.populateWithLinks(files, allInOneHtml);
        await fileHelper.saveFileAsync(updatedAllInOne, allInOnePath);
    }

    private populateWithLinks(fileNames: string[], initialHtml: string): string {
        const htmlLinks = fileNames.map((fileName) => `<a href="#${fileName}">${fileName}</a>`).join('&nbsp;');
        const linksDiv = initialHtml.match(/<div id=\"links\">(.*?)<\/div>/s);
        if (Array.isArray(linksDiv) && linksDiv.length > 1) {
            return initialHtml.replace(linksDiv[1], htmlLinks);
        }
        return initialHtml;
    }

    private async parsePdf(fileName): Promise<any> {
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

    private async processWholeTxt(txtContent: string, fileName: string): Promise<void> {
        const htmlFormatter = new HtmlFormatter();
        htmlFormatter.init(txtContent);
        htmlFormatter.markBoldTitles();
        htmlFormatter.markBoldSectionTitles();
        htmlFormatter.replaceLineEnds();
        const formattedHtml = htmlFormatter.getHtml();

        await fileHelper.saveFileAsync(formattedHtml, `${outputDir}/${fileName.replace('pdf', 'txt')}`);
    }

    private async processSection(sectionText: string, fileName: string, sectionIndex: number) {

        const htmlFormatter = new HtmlFormatter();
        htmlFormatter.init(sectionText);
        htmlFormatter.markBoldTitles();
        htmlFormatter.replaceLineEnds();
        const formattedHtml = htmlFormatter.getHtml();

        const fileNameOutput = `${fileName.replace('.pdf', '')}-extract${sectionIndex}.txt`;
        await fileHelper.saveFileAsync(formattedHtml, `${outputDir}/${fileNameOutput}`);
    }

}