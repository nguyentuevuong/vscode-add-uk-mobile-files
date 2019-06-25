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
  public showFileNameDialog(args: any, cName?: string): Q.Promise<string> {
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
        prompt: 'UK Mobile: What\'s the name of the new folder?'
      }).then((fileName) => {
        if (fileName) {
          if (/[~`!#$%\^&*+=\[\]';,{}|":<>\?\s\.]/g.test(fileName)) { //[~`!#$%\^&*+=\[\]\\';,/{}|\\":<>\?\s\.]
            deferred.reject('That\'s not a valid folder name! (no whitespaces or special characters)');
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
        if (folderName.match(/views/)) {
          let $path = folderName.split(`${path.sep}views${path.sep}`);

          if ($path.length == 2 && $path[1].indexOf(path.sep) > -1) {
            let b = undefined,
              $paths = $path[1].split(path.sep),
              $roots = `${$path[0]}${path.sep}views`;

            while (!!(b = $paths.shift())) {
              $roots = path.join($roots, b);

              let $file = path.join($roots, 'index.ts');

              if (!fs.existsSync($roots)) {
                fs.mkdirSync($roots);

                if ($paths.length > 0) {
                  fs.writeFileSync($file, `import './${$paths[0]}';`);
                }
              } else {
                if (fs.existsSync($file)) {
                  let $content: string[] = fs.readFileSync($file).toString().split('\n');

                  if ($content.indexOf(`import './${$paths[0]}';`) > -1) {
                    fs.writeFileSync($file, $content.join('\n'));
                  } else {
                    $content.push(`import './${$paths[0]}';`);

                    fs.writeFileSync($file, $content.sort().join('\n'));
                  }
                } else {
                  fs.writeFileSync($file, `import './${$paths[0]}';`);
                }
              }

              if ($paths.length == 1) {
                let $file = path.join($path[0], 'views', 'index.ts');

                if (fs.existsSync($file)) {
                  let $content: string[] = fs.readFileSync($file).toString().split('\n');

                  if ($content.indexOf(`import '@views/${$path[1].split(path.sep)[0]}';`) > -1) {
                    fs.writeFileSync($file, $content.join('\n'));
                  } else {
                    $content.push(`import '@views/${$path[1].split(path.sep)[0]}';`);

                    fs.writeFileSync($file, $content.sort().join('\n'));
                  }
                }
              } else if ($paths.length == 0) {
                if (folderName.match(/ClientApp\/views\/documents\//)) {
                  fs.mkdirSync(path.join(folderName, 'content'));
                }

                deferred.resolve(folderName);
              }
            }
          } else {
            fs.mkdirSync(folderName);

            if (folderName.match(/ClientApp\/views\/documents\//)) {
              fs.mkdirSync(path.join(folderName, 'content'));
            }

            let $file = path.join($path[0], 'views', 'index.ts');

            if (fs.existsSync($file)) {
              let $content: string[] = fs.readFileSync($file).toString().split('\n');

              if ($content.indexOf(`import '@views/${$path[1]}';`) > -1) {
                fs.writeFileSync($file, $content.join('\n'));
              } else {
                $content.push(`import '@views/${$path[1]}';`);

                fs.writeFileSync($file, $content.sort().join('\n'));
              }
            }

            deferred.resolve(folderName);
          }
        } else {
          fs.mkdirSync(folderName);

          if (folderName.match(/ClientApp\/views\/documents\//)) {
            fs.mkdirSync(path.join(folderName, 'content'));
          }
          
          deferred.resolve(folderName);
        }
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
      content: fc.components.single(path.parse(folderName).name)
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
  public createViewFiles(folderName: string): Q.Promise<string> {
    const af: FileManagers = new FileManagers(),
      fc: FileContents = new FileContents(),
      deferred: Q.Deferred<string> = Q.defer<string>(),
      paths: string = (folderName.split(`${path.sep}views${path.sep}`)[1] || path.parse(folderName).name),
      files: IFiles[] = [{ // create an IFiles array including file names and contents
        name: path.join(folderName, `index.ts`),
        content: fc.views.viewmodel(paths)
      }, {
        name: path.join(folderName, `index.vue`),
        content: fc.views.template(paths)
      }, {
        name: path.join(folderName, `style.scss`),
        content: fc.views.style(paths)
      }, {
        name: path.join(folderName, 'resources.json'),
        content: fc.views.resource(paths)
      }];

    // write files
    af.writeFiles(files).then((errors) => {
      if (errors.length > 0) {
        window.showErrorMessage(`${errors.length} file(s) could not be created.`);
      }
      else {
        deferred.resolve(folderName);
      }
    });

    return deferred.promise;
  }

  public createDocumentFiles(folderName: string): Q.Promise<string> {
    const af: FileManagers = new FileManagers(),
      fc: FileContents = new FileContents(),
      deferred: Q.Deferred<string> = Q.defer<string>(),
      paths: string = (folderName.split(`${path.sep}views${path.sep}`)[1] || path.parse(folderName).name),
      files: IFiles[] = [{ // create an IFiles array including file names and contents
        name: path.join(folderName, `index.ts`),
        content: fc.documents.viewmodel(paths)
      }, {
        name: path.join(folderName, `index.vue`),
        content: fc.documents.template(paths)
      }, {
        name: path.join(folderName, 'content', `vi.md`),
        content: fc.documents.markdown()
      }, {
        name: path.join(folderName, 'content', `jp.md`),
        content: fc.documents.markdown()
      }, {
        name: path.join(folderName, 'resources.json'),
        content: fc.documents.resource(paths)
      }];
      
    // write files
    af.writeFiles(files).then((errors) => {
      if (errors.length > 0) {
        window.showErrorMessage(`${errors.length} file(s) could not be created.`);
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
  public openDocInEditor(folderName): Q.Promise<TextEditor> {
    const deferred: Q.Deferred<TextEditor> = Q.defer<TextEditor>(),
      fullFilePath: string = path.join(folderName, `index.vue`);

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
