import * as Q from 'q';
import * as fs from 'fs';
import * as path from 'path';
import { view, document } from './file-contents';
import { window, workspace, TextEditor, TextDocument } from 'vscode';

export interface IFiles {
  name: string;
  content: string;
}

const writeFiles = (files: IFiles[]): Q.Promise<string[]> => {
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
};

// Create the new folder
export const createFolder = (folderName: string): Q.Promise<string> => {
  const d: Q.Deferred<string> = Q.defer<string>();

  fs.exists(folderName, (exist: boolean) => {
    if (!exist) {
      if (folderName.match(/views/)) {
        let $path = folderName.split(`${path.sep}views${path.sep}`);

        if ($path.length == 2 && $path[1].indexOf(path.sep) > -1) {
          let b = undefined,
            $paths = $path[1].split(path.sep),
            $roots = `${$path[0]}${path.sep}views`;

          while (!!(b = $paths.shift())) {
            $roots = path.join($roots, b);

            if (!fs.existsSync($roots)) {
              fs.mkdirSync($roots);
            }

            if ($paths.length == 0) {
              if (folderName.match(/src\/views\/documents\//)) {
                fs.mkdirSync(path.join(folderName, 'contents'));
              }

              d.resolve(folderName);
            }
          }
        } else {
          fs.mkdirSync(folderName);

          if (folderName.match(/src\/views\/documents\//)) {
            fs.mkdirSync(path.join(folderName, 'contents'));
          }

          d.resolve(folderName);
        }
      } else {
        fs.mkdirSync(folderName);

        if (folderName.match(/src\/views\/documents\//)) {
          fs.mkdirSync(path.join(folderName, 'contents'));
        }

        d.resolve(folderName);
      }
    } else {
      d.reject('Folder already exists');
    }
  });

  return d.promise;
};

// Show input prompt for folder name 
export const showFileNameDialog = (args: any, cName?: string): Q.Promise<string> => {
  let clickedFolderPath: string = "",
    deferred: Q.Deferred<string> = Q.defer<string>();

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

  let newFolderPath: string = fs.lstatSync(clickedFolderPath).isDirectory() ? clickedFolderPath : path.dirname(clickedFolderPath);

  if (workspace.rootPath === undefined) {
    deferred.reject('Please open a project first.');
  } else {
    window.showInputBox({
      value: cName || 'a',
      prompt: 'HL: What\'s the name of the new folder?'
    }).then((fileName) => {
      if (fileName) {
        if (/[~`!#$%\^&*+=\[\]';,{}|":<>\?\s\.]/g.test(fileName)) { //[~`!#$%\^&*+=\[\]\\';,/{}|\\":<>\?\s\.]
          deferred.reject('That\'s not a valid folder name! (no whitespaces or special characters)');
        } else {
          deferred.resolve(path.join(newFolderPath, fileName));
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
  const d: Q.Deferred<string> = Q.defer<string>(),
    paths: string = (folderName.split(`${path.sep}views${path.sep}`)[1] || path.parse(folderName).name),
    files: IFiles[] = [{ // create an IFiles array including file names and contents
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
  writeFiles(files)
    .then((errors) => {
      if (errors.length > 0) {
        window.showErrorMessage(`${errors.length} file(s) could not be created.`);
      }
      else {
        d.resolve(folderName);
      }
    });

  return d.promise;
}

export const createDocumentFiles = (folderName: string): Q.Promise<string> => {
  const d: Q.Deferred<string> = Q.defer<string>(),
    paths: string = (folderName.split(`${path.sep}views${path.sep}`)[1] || path.parse(folderName).name),
    files: IFiles[] = [{ // create an IFiles array including file names and contents
      name: path.join(folderName, `viewmodel.ts`),
      content: document.viewmodel(paths)
    }, {
      name: path.join(folderName, `index.vue`),
      content: document.template(paths)
    }, {
      name: path.join(folderName, 'contents', `vi.md`),
      content: document.markdown()
    }, {
      name: path.join(folderName, 'contents', `ja.md`),
      content: document.markdown()
    }, {
      name: path.join(folderName, 'resources.json'),
      content: document.resource(paths)
    }], $files = path.join(folderName, 'contents'),
    createFile = () => {
      // write files
      writeFiles(files)
        .then((errors) => {
          if (errors.length > 0) {
            window.showErrorMessage(`${errors.length} file(s) could not be created.`);
          }
          else {
            Q.resolve
            d.resolve(folderName);
          }
        });
    };

  if (!fs.existsSync($files)) {
    createFolder($files).then(createFile);
  } else {
    createFile();
  }

  return d.promise;
};

// Open the created component in the editor
export const openFileInEditor = (folderName: string): Q.Promise<TextEditor> => {
  const d: Q.Deferred<TextEditor> = Q.defer<TextEditor>(),
    fullFilePath: string = path.join(folderName, `index.vue`);

  workspace.openTextDocument(fullFilePath).then((textDocument: TextDocument) => {
    if (!textDocument) { return; }

    window.showTextDocument(textDocument).then((editor: TextEditor) => {
      if (!editor) { return; }

      d.resolve(editor);
    });
  });

  return d.promise;
};