import * as Q from 'q';
import * as fs from 'fs';
import * as path from 'path';
import { window, workspace, TextEditor, TextDocument } from 'vscode';

export interface IFile {
    name: string;
    content: string;
}

export const toName = (path: string, spc: string = ''): string => {
    return path.replace(/(\\|\/)+/g, spc).toLowerCase();
};

export const camelCase = (path: string): string => {
    let name: string = toName(path, '-');

    return (`${name.charAt(0).toUpperCase()}${name.slice(1)}`).replace(/-([a-z0-9])/ig, (_, letter) => letter.toUpperCase());
};

// Create the new folder
export const mkdir = (folderName: string): Q.Promise<string> => {
    const mkdir = fs.mkdirSync;
    const exist = fs.existsSync;

    folderName
        .split(path.sep)
        .reduce((prev: string, next: string) => {
            const current: string = path.join(prev, next);

            if (!exist(current)) { mkdir(current); }

            return current;
        }, '');

    if (folderName.match(/src\/views\/documents/)) {
        const current = path.join(folderName, 'contents');

        if (!exist(current)) { mkdir(current); }
    }

    return Q.resolve(folderName);
};

// write files
export const writeFiles = (files: IFile[]) => {
    const errors = [];
    const deferred: Q.Deferred<string[]> = Q.defer<string[]>();

    files.forEach((file: IFile, index: number) => {
        if (!fs.existsSync(file.name)) {
            fs.writeFileSync(file.name, file.content);
        }

        if (!fs.existsSync(file.name)) {
            errors.push(file.name);
        }

        if (index + 1 === files.length) {
            deferred.resolve(errors);
        }
    });

    return deferred.promise;
};

// Open the created component in the editor
export const openEditor = (folderName: string): Q.Promise<TextEditor> => {
    const show = window.showTextDocument;
    const open = workspace.openTextDocument;
    const deferred: Q.Deferred<TextEditor> = Q.defer<TextEditor>();

    open(path.join(folderName, `index.vue`))
        .then((document: TextDocument) => show(document).then(deferred.resolve));

    return deferred.promise;
};