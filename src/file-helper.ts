// import fs from 'mz/fs';
let fs = require('mz/fs');

export async function saveFileAsync(content: string, targetPath: string): Promise<void> {
    try {
        await fs.writeFile(`${targetPath}`, content);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function readFileAsync(filePath): Promise<string> {
    try {
        const file = await fs.readFile(filePath);
        return file.toString('utf8');
    }
    catch (err) { console.error(err); throw err; }
};


export async function readDirAsync(directory: string): Promise<string[]> {
    try {
        const files = await fs.readdir(directory);
        return files;
    }
    catch (err) {
        console.error(err);
        return null;
    }
};
