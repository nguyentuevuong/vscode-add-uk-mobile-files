import * as Q from 'q';
import * as fs from 'fs';
import * as path from 'path';

import * as doc from './contents/doc';
import * as view from './contents/view';

import { window, workspace } from 'vscode';
import { IFile, writeFiles } from './utils';

// Show input prompt for folder name 
export const dialog = (args: any, cName?: string): Q.Promise<string> => {
  let cfPath: string = "";
  const deferred: Q.Deferred<string> = Q.defer<string>();

  if (args) {
    cfPath = args.fsPath
  } else {
    if (!window.activeTextEditor) {
      deferred.reject('Please open a file first.. or just right-click on a file/folder and use the context menu!');
      return deferred.promise;
    } else {
      cfPath = path.dirname(window.activeTextEditor.document.fileName);
    }
  }

  let newFolderPath: string = fs.lstatSync(cfPath).isDirectory() ? cfPath : path.dirname(cfPath);

  if (workspace.rootPath === undefined) {
    deferred.reject('Please open a project first.');
  } else {
    window.showInputBox({
      value: cName || 'a',
      prompt: 'HL: What\'s the name of the new folder?'
    }).then((folderName: string) => {
      if (folderName) {
        if (/[~`!#$%\^&*+=\[\]';,{}|":<>\?\s\.]/g.test(folderName)) {
          deferred.reject('That\'s not a valid folder name! (no whitespaces or special characters)');
        } else {
          deferred.resolve(path.join(newFolderPath, folderName));
        }
      } else {
        deferred.reject("HL: Task was cancelled!")
      }
    }, (error) => console.error(error));
  }

  return deferred.promise;
};


// Get file contents and create the new files in the folder 
export const createViewFiles = (folderName: string): Q.Promise<string> => {
  const paths: string = (folderName.split(`${path.sep}views${path.sep}`)[1] || path.parse(folderName).name);
  // create an IFiles array including file names and contents
  const files: IFile[] = [{
    name: path.join(folderName, `viewmodel.ts`),
    content: view.viewmodel(paths)
  }, {
    name: path.join(folderName, `index.vue`),
    content: view.template(paths)
  }, {
    name: path.join(folderName, 'resources.json'),
    content: view.resource(paths)
  }];

  // write files
  writeFiles(files);

  return Q.resolve(folderName);
}

export const createDocumentFiles = (folderName: string): Q.Promise<string> => {
  const paths: string = (folderName.split(`${path.sep}views${path.sep}`)[1] || path.parse(folderName).name);
  // create an IFiles array including file names and contents
  const files: IFile[] = [{
    name: path.join(folderName, 'contents', `vi.md`),
    content: doc.markdown
  }, {
    name: path.join(folderName, 'contents', `ja.md`),
    content: doc.markdown
  }, {
    name: path.join(folderName, `viewmodel.ts`),
    content: doc.viewmodel(paths)
  }, {
    name: path.join(folderName, `index.vue`),
    content: doc.template(paths)
  }, {
    name: path.join(folderName, 'resources.json'),
    content: doc.resource(paths)
  }];

  writeFiles(files);

  return Q.resolve(folderName);
};