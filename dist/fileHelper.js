"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let fs = require('mz/fs');
const outputDir = 'data/output';
class FileHelper {
    saveFile(content, targetPath) {
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
    readDir(directory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield fs.readdir(directory);
                return files;
            }
            catch (err) {
                console.error(err);
                return null;
            }
        });
    }
    ;
}
module.exports = FileHelper;
