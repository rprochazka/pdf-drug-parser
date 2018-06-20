import { isArray } from "util";

class TextParser {

    text: string;

    constructor(initialText: string) {
        this.text = initialText;
    }

    getSectionTitle(section): string {
        const pattern = `^${section}\\..*`;
        const matches = this.text.match(new RegExp(pattern, 'gm'));
        const sectionTitle = matches && isArray(matches) && matches.length > 1 ? matches[1] : '';
        return sectionTitle;
    }

    extractSection(section: number): TextParser {
        const sectionStart = this.getSectionTitle(section);
        const sectionEnd = this.getSectionTitle(section + 1);

        const startIndex = this.text.lastIndexOf(`${sectionStart}`);
        const endIndex = this.text.lastIndexOf(`${sectionEnd}`);
        let extract = this.text.substring(startIndex, endIndex);
        extract = extract.substring(extract.indexOf('\n'))
        this.text = extract;
        return this;
    }

    removePageBreaks(): TextParser {
        this.text = this.text.replace(/^(-)+[^-]*(-)+\W?[\r\n]+/gm, '');
        this.text = this.text.replace(/\d+\/\d+\W?[\r\n]+/gm, '');
        return this;
    }

    markBoldTitles() {
        const match = this.text.match(/^[A-ZČŘŠŽ][^:.]{1,60}[ \\r\n]+$/gm);
        // console.log(JSON.stringify(match));
        this.text = this.text.replace(/(^[A-ZČŘŠŽ][^:.]{1,60})[ \\r\n]+$/gm, '<b>$1</b>');
        return this;
    }

    markBoldSectionTitles() {
        // skip outline
        const sectionsStartIndex = this.text.lastIndexOf(`1. `);
        const headerText = this.text.substring(0, sectionsStartIndex);
        const sectionText = this.text.substring(sectionsStartIndex);
        const boldSectionsText = sectionText.replace(/(^[\d]\.\W.*)$/gm, '<b>$1</b>');
        this.text = headerText + boldSectionsText;
        return this;
    }

    replaceLineEnds() {
        this.text = this.text.replace(/[\r\n]+/g, "<br/>")
        return this;
    }

    populateWithLinks(fileNames) {
        const htmlLinks = fileNames.map((fileName) => `<a href="#${fileName}">${fileName}</a>`).join('&nbsp;');
        const linksDiv = this.text.match(/<div id=\"links\">(.*?)<\/div>/s);
        if (Array.isArray(linksDiv) && linksDiv.length > 1) {
            this.text = this.text.replace(linksDiv[1], htmlLinks);
        }
        return this;
    }

    getText(): string {
        return this.text;
    }
}

export = TextParser