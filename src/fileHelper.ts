let fs = require('fs');

const outputDir = 'data/output';

class FileHelper {

    saveFile(content: string, targetPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const target = `${outputDir}/${targetPath}`;
            fs.writeFile(`${target}`, content, (error) => {
                if (error) {
                    reject('error in data ready error handler');
                }
                resolve();
            });
        });
    }
}

export = FileHelper