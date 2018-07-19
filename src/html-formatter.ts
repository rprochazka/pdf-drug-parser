
export default class HtmlFormatter {

    private text: string;
    private initialized: boolean = false;

    init(initialText: string) {
        this.text = initialText;
        this.initialized = true;
    }

    markBoldTitles(): void {
        this.guard();
        const match = this.text.match(/^[A-ZČŘŠŽ][^:.]{1,60}[ \\r\n]+$/gm);
        // console.log(JSON.stringify(match));
        this.text = this.text.replace(/(^[A-ZČŘŠŽ][^:.]{1,60})[ \\r\n]+$/gm, '<b>$1</b>');
    }

    markBoldSectionTitles(): void {
        this.guard();
        // skip outline
        const sectionsStartIndex = this.text.lastIndexOf(`1. `);
        const headerText = this.text.substring(0, sectionsStartIndex);
        const sectionText = this.text.substring(sectionsStartIndex);
        const boldSectionsText = sectionText.replace(/(^[\d]\.\W.*)$/gm, '<b>$1</b>');
        this.text = headerText + boldSectionsText;
    }

    replaceLineEnds(): void {
        this.guard();
        this.text = this.text.replace(/[\r\n]+/g, "<br/>")
    }

    getHtml(): string {
        return this.text;
    }

    private guard(): void {
        if (!this.initialized) {
            throw new Error('HtmlFormatter needs to be initialized first.');
        }
    }
}