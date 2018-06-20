let fs = require('mz/fs');

const outputDir = 'data/output';

class FileHelper {

    async saveFileAsync(content: string, targetPath: string): Promise<void> {
        try {
            await fs.writeFile(`${targetPath}`, content);
        } catch (error) {
            console.error(error);
            throw error;
        }

        // return new Promise((resolve, reject) => {
        //     const target = `${outputDir}/${targetPath}`;
        //     fs.writeFile(`${target}`, content, (error) => {
        //         if (error) {
        //             reject('error in data ready error handler');
        //         }
        //         resolve();
        //     });
        // });
    }

    async readFileAsync(filePath): Promise<string> {
        try {
            const file = await fs.readFile(filePath);
            return file.toString('utf8');
        }
        catch (err) { console.error(err); throw err; }
    };


    async readDirAsync(directory: string): Promise<string[]> {
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