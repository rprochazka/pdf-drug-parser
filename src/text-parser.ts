import { isArray } from "util";

export default class TextParser {

    private text: string;
    private initialized: boolean = false;

    init(initialText: string) {
        this.text = initialText;
        this.initialized = true;
    }

    cleanupTextContent(): void {
        this.guard();
        this.removePageBreaks()
        this.removeScrewedTableData();
    }

    getSection(section: number): string {
        this.guard();
        const sectionStart = this.getSectionTitle(section);
        const sectionEnd = this.getSectionTitle(section + 1);

        if (!sectionStart || !sectionEnd) {

            throw new Error('Unable to extract section ' + section);
        }

        const startIndex = this.text.lastIndexOf(`${sectionStart}`);
        const endIndex = this.text.lastIndexOf(`${sectionEnd}`);
        let extract = this.text.substring(startIndex, endIndex);
        extract = extract.substring(sectionStart.length);
        return extract;
    }

    getText(): string {
        this.guard();
        return this.text;
    }

    private removePageBreaks(): void {
        this.guard();
        this.text = this.text.replace(/^(-)+[^-]*(-)+\W?[\r\n]+/gm, '');
        this.text = this.text.replace(/\d+\/\d+\W?[\r\n]+/gm, '');
        this.text = this.text.replace(/^\d\s+/gm, '');
    }

    private removeScrewedTableData(): void {
        const matchedText = this.text.match(/.*[䙲攀欀瘀敮挀攠ㄠⴀ㌠爀潫礀ⴀ⁫最ㄠ洀最㌠ⴀ㔠氀整ᆬⴀᄅ⁫最洀最㔠ⴀ㤠氀整ⴀ代⁫最水㔠洀最㤠ⴀᄄ⁬整㌰ⴀ㘰最㔠洀最ᆬⴀᄄ⁬整慤‵‵〠欀最⁭最].*/gm);
        if (matchedText) {
            const pattern = `[^\n]+([\r\n ]){2,}[^\n]+\n${matchedText.join('\r\n')}`;
            this.text = this.text.replace(new RegExp(pattern, 'gs'), '');
        }
    }

    private getSectionTitle(section): string {
        const pattern = `^${section}\\..*`;
        const matches = this.text.match(new RegExp(pattern, 'm'));
        var sectionTitle = matches && isArray(matches) ? matches[0] : '';
        if (sectionTitle) {
            const contentPattern = sectionTitle.replace('+', '\\+').replace(/[\r\n\t ]+/g, '\\W+')
            const matches = this.text.match(new RegExp(contentPattern, 'g'));
            return matches && isArray(matches) && matches.length > 1 ? matches[1] : '';
        }
        return sectionTitle;
    }

    private guard(): void {
        if (!this.initialized) {
            throw new Error('TextParser needs to be initialized first.');
        }
    }
}