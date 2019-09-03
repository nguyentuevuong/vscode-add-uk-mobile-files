import { ExtensionContext, commands, window } from 'vscode';
import { showFileNameDialog, createFolder, createViewFiles, createDocumentFiles, openFileInEditor } from './file-managers';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(commands.registerCommand('extension.addHLFiles', (args) => {
    showFileNameDialog(args, 'a')
      .then(createFolder)
      .then(createViewFiles)
      .then(openFileInEditor)
      .then(() => {
        window.showInformationMessage('HL: Component was created!');
        commands.executeCommand("workbench.files.action.refreshFilesExplorer");
      })
      .catch((err) => {
        if (err) {
          window.showErrorMessage(err);
        }
      });
  }));

  context.subscriptions.push(commands.registerCommand('extension.addHLDocument', (args) => {
    showFileNameDialog(args, 'docs')
      .then(createFolder)
      .then(createDocumentFiles)
      .then(openFileInEditor)
      .then(() => {
        window.showInformationMessage('HL: Document was created!');
        commands.executeCommand("workbench.files.action.refreshFilesExplorer");
      })
      .catch((err) => {
        if (err) {
          window.showErrorMessage(err);
        }
      });
  }));
}
