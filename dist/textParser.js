"use strict";
const util_1 = require("util");
class TextParser {
    constructor(initialText) {
        this.text = initialText;
    }
    getSectionTitle(section) {
        const pattern = `${section}\\..*[\\r\\n]+([^${section + 1}].*[\\r\\n])?`;
        const matches = this.text.match(new RegExp(pattern, 'g'));
        var sectionTitle = matches && util_1.isArray(matches) ? matches[0] : '';
        if (sectionTitle) {
            const contentPattern = sectionTitle.replace(/[\r\n\t ]+/g, '\\W+');
            const matches = this.text.match(new RegExp(contentPattern, 'g'));
            return matches && util_1.isArray(matches) && matches.length > 1 ? matches[1] : '';
        }
        return sectionTitle;
    }
    extractSection(section) {
        const sectionStart = this.getSectionTitle(section);
        const sectionEnd = this.getSectionTitle(section + 1);
        if (!sectionStart || !sectionEnd) {
            throw new Error('Unable to extract section ' + section);
        }
        const startIndex = this.text.lastIndexOf(`${sectionStart}`);
        const endIndex = this.text.lastIndexOf(`${sectionEnd}`);
        let extract = this.text.substring(startIndex, endIndex);
        extract = extract.substring(sectionStart.length);
        this.text = extract;
        return this;
    }
    removePageBreaks() {
        this.text = this.text.replace(/^(-)+[^-]*(-)+\W?[\r\n]+/gm, '');
        this.text = this.text.replace(/\d+\/\d+\W?[\r\n]+/gm, '');
        this.text = this.text.replace(/^\d\s+/gm, '');
        return this;
    }
    removeScrewedTableData() {
        const matchedText = this.text.match(/.*[䙲攀欀瘀敮挀攠ㄠⴀ㌠爀潫礀ⴀ⁫最ㄠ洀最㌠ⴀ㔠氀整ᆬⴀᄅ⁫最洀最㔠ⴀ㤠氀整ⴀ代⁫最水㔠洀最㤠ⴀᄄ⁬整㌰ⴀ㘰最㔠洀最ᆬⴀᄄ⁬整慤‵‵〠欀最⁭最].*/gm);
        if (matchedText) {
            const pattern = `[^\n]+([\r\n ]){2,}[^\n]+\n${matchedText.join('\r\n')}`;
            this.text = this.text.replace(new RegExp(pattern, 'gs'), '');
        }
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
        this.text = this.text.replace(/[\r\n]+/g, "<br/>");
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
    getText() {
        return this.text;
    }
}
module.exports = TextParser;
