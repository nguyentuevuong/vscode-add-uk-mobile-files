import * as Q from 'q';
import * as fs from 'fs';
import * as path from 'path';
import { FileContents } from './file-contents';
import { window, workspace, TextEditor } from 'vscode';

export interface IFiles {
  name: string;
  content: string;
}

export class FileManagers {
  // Show input prompt for folder name 
  public showFileNameDialog(args): Q.Promise<string> {
    const deferred: Q.Deferred<string> = Q.defer<string>();

    var clickedFolderPath: string;

    if (args) {
      clickedFolderPath = args.fsPath
    } else {
      if (!window.activeTextEditor) {
        deferred.reject('Please open a file first.. or just right-click on a file/folder and use the context menu!');
        return deferred.promise;
      } else {
        clickedFolderPath = path.dirname(window.activeTextEditor.document.fileName);
      }
    }

    var newFolderPath: string = fs.lstatSync(clickedFolderPath).isDirectory() ? clickedFolderPath : path.dirname(clickedFolderPath);

    if (workspace.rootPath === undefined) {
      deferred.reject('Please open a project first. Thanks! :-)');
    } else {
      window.showInputBox({
        value: 'a',
        prompt: 'UK Mobile: What\'s the name of the new folder?'
      }).then((fileName) => {
        if (fileName) {
          if (/[~`!#$%\^&*+=\[\]\\';,/{}|\\":<>\?\s]/g.test(fileName)) {
            deferred.reject('That\'s not a valid name! (no whitespaces or special characters)');
          } else {
            deferred.resolve(path.join(newFolderPath, fileName));
          }
        } else {
          deferred.reject("UK Mobile: Task was cancelled!")
        }
      }, (error) => console.error(error));
    }

    return deferred.promise;
  }

  // Create the new folder
  public createFolder(folderName): Q.Promise<string> {
    const deferred: Q.Deferred<string> = Q.defer<string>();

    fs.exists(folderName, (exists) => {
      if (!exists) {
        fs.mkdirSync(folderName);
        deferred.resolve(folderName);
      } else {
        deferred.reject('Folder already exists');
      }
    });

    return deferred.promise;
  }

  // create single component file
  public createSingleComponent(folderName: string): Q.Promise<string> {
    const af: FileManagers = new FileManagers(),
      fc: FileContents = new FileContents(),
      deferred: Q.Deferred<string> = Q.defer<string>();

    // write files
    af.writeFiles([{
      name: `${folderName}.ts`,
      content: fc.singleComponent(path.parse(folderName).name)
    }]).then((errors) => {
      if (errors.length > 0) {
        window.showErrorMessage(`${errors.length} file(s) could not be created. I'm sorry :-(`);
      }
      else {
        deferred.resolve(folderName);
      }
    });

    return deferred.promise;
  }

  // Get file contents and create the new files in the folder 
  public createFiles(folderName: string): Q.Promise<string> {
    const af: FileManagers = new FileManagers(),
      fc: FileContents = new FileContents(),
      deferred: Q.Deferred<string> = Q.defer<string>(),
      paths: string = (folderName.split(`${path.sep}views${path.sep}`)[1] || path.parse(folderName).name),
      files: IFiles[] = [{ // create an IFiles array including file names and contents
        name: path.join(folderName, `index.ts`),
        content: fc.componentContent(paths)
      }, {
        name: path.join(folderName, `index.html`),
        content: fc.templateContent(paths)
      }, {
        name: path.join(folderName, `style.scss`),
        content: fc.cssContent(paths)
      }, {
        name: path.join(folderName, 'resources.json'),
        content: fc.resourceContent(paths)
      }];

    // write files
    af.writeFiles(files).then((errors) => {
      if (errors.length > 0) {
        window.showErrorMessage(`${errors.length} file(s) could not be created. I'm sorry :-(`);
      }
      else {
        deferred.resolve(folderName);
      }
    });

    return deferred.promise;
  }

  public writeFiles(files: IFiles[]): Q.Promise<string[]> {
    const errors: string[] = [],
      deferred: Q.Deferred<string[]> = Q.defer<string[]>();

    files.forEach(file => {
      fs.writeFile(file.name, file.content, (err) => {
        if (err) {
          errors.push(err.message)
        }

        deferred.resolve(errors);
      });
    });

    return deferred.promise;
  }

  // Open the created component in the editor
  public openFileInEditor(folderName): Q.Promise<TextEditor> {
    const deferred: Q.Deferred<TextEditor> = Q.defer<TextEditor>(),
      fullFilePath: string = path.join(folderName, `index.ts`);

    workspace.openTextDocument(fullFilePath).then((textDocument) => {
      if (!textDocument) {
        return;
      }

      window.showTextDocument(textDocument).then((editor) => {
        if (!editor) {
          return;
        }

        deferred.resolve(editor);
      });
    });

    return deferred.promise;
  }

  // Open the created component in the editor
  public openSingleComponentInEditor(folderName): Q.Promise<TextEditor> {
    const deferred: Q.Deferred<TextEditor> = Q.defer<TextEditor>(),
      fullFilePath: string = `${folderName}.ts`;

    workspace.openTextDocument(fullFilePath).then((textDocument) => {
      if (!textDocument) {
        return;
      }

      window.showTextDocument(textDocument).then((editor) => {
        if (!editor) {
          return;
        }

        deferred.resolve(editor);
      });
    });

    return deferred.promise;
  }
}