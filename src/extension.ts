
import { FileManagers } from './file-managers';
import { ExtensionContext, commands, window } from 'vscode';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(commands.registerCommand('extension.addUKMobileFiles', (args) => {
    const addFiles: FileManagers = new FileManagers();

    addFiles
      .showFileNameDialog(args, 'a')
      .then(addFiles.createFolder)
      .then(addFiles.createFiles)
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
  }));


  context.subscriptions.push(commands.registerCommand('extension.addUKMobileSingleComponent', (args) => {
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
  }));
}
