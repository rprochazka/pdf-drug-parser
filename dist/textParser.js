"use strict";
class TextParser {
    constructor(initialText) {
        this.text = initialText;
    }
    extractSection(section) {
        const startIndex = this.text.lastIndexOf(`${section}. `);
        const endIndex = this.text.lastIndexOf(`${section + 1}. `);
        let extract = this.text.substring(startIndex, endIndex);
        extract = extract.substring(extract.indexOf('\n'));
        this.text = extract;
        return this;
    }
    removePageBreaks() {
        this.text = this.text.replace(/^(-)+[^-]*(-)+\W?[\r\n]+/gm, '');
        this.text = this.text.replace(/\d+\/\d+\W?[\r\n]+/gm, '');
        return this;
    }
    markBoldTitles() {
        const match = this.text.match(/^[A-ZČŘŠŽ][^:.]{1,60}[ \\r\n]+$/gm);
        console.log(JSON.stringify(match));
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
    getText() {
        return this.text;
    }
}
module.exports = TextParser;
