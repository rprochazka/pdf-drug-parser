let fs = require('mz/fs');

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

    async readDir(directory: string): Promise<string[]> {
        try {
            const files = await fs.readdir(directory);
            return files;
        }
        catch (err) {
            console.error(err);
            return null;
        }
    };
}

export = FileHelper