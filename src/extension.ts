
import { FileManagers } from './file-managers';
import { ExtensionContext, commands, window } from 'vscode';

export function activate(context: ExtensionContext) {
  let disposeAddView = commands.registerCommand('extension.addUKMobileFiles', (args) => {
    const addFiles: FileManagers = new FileManagers();

    addFiles
      .showFileNameDialog(args, 'a')
      .then(addFiles.createFolder)
      .then(addFiles.createViewFiles)
      .then(addFiles.openFileInEditor)
      .then(() => {
        window.showInformationMessage('UK Mobile: Component was created!');
        commands.executeCommand("workbench.files.action.refreshFilesExplorer");
      })
      .catch((err) => {
        if (err) {
          window.showErrorMessage(err);
        }
      });
  }), disposeAddDocs = commands.registerCommand('extension.addUKMobileDocument', (args) => {
    const addFiles: FileManagers = new FileManagers();

    addFiles
      .showFileNameDialog(args, 'docs')
      .then(addFiles.createFolder)
      .then(addFiles.createDocumentFiles)
      .then(addFiles.openDocInEditor)
      .then(() => {
        window.showInformationMessage('UK Mobile: Document was created!');
        commands.executeCommand("workbench.files.action.refreshFilesExplorer");
      })
      .catch((err) => {
        if (err) {
          window.showErrorMessage(err);
        }
      });
  }), disposeAddControl = commands.registerCommand('extension.addUKMobileSingleComponent', (args) => {
    const addFiles: FileManagers = new FileManagers();

    addFiles
      .showFileNameDialog(args, 'mobile')
      .then(addFiles.createSingleComponent)
      .then(addFiles.openSingleComponentInEditor)
      .then(() => {
        window.showInformationMessage('UK Mobile: Component was created!');
        commands.executeCommand("workbench.files.action.refreshFilesExplorer");
      })
      .catch((err) => {
        if (err) {
          window.showErrorMessage(err);
        }
      });
  });

  context.subscriptions.push(disposeAddView);
  context.subscriptions.push(disposeAddDocs);
  context.subscriptions.push(disposeAddControl);
}
