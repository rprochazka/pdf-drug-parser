import * as fileHelper from './file-helper';
import TextProcessor from './text-processor';

const runner: any = {
    run: async function (sourceDir) {
        console.log('App Started .....');
        console.time('App counter');
        const files = await fileHelper.readDirAsync(sourceDir);
        var tasks = [];
        const chunkSize = 20;
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const filePath = `${sourceDir}/${file}`;
            const textProcessor = new TextProcessor();
            tasks.push(textProcessor.processFile(filePath));
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
};

async function populateAllInOneWithLinks() {

    const textProcessor = new TextProcessor();
    await textProcessor.populateAllInOneWithLinks();
}

export = runner