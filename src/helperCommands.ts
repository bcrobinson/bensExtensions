import * as vscode from 'vscode';

var exportCommands: BensExtensions.ExportCommand[] = [];

async function listAllCommands() {
    var doc = await getNewDoc();

    if(!doc){
        vscode.window.showErrorMessage("Error creating new window");
        return;
    }

    var editor = await vscode.window.showTextDocument(doc);

    var commands = await vscode.commands.getCommands();

    var ending = (<any>editor.document)._eol
    var text = commands.sort((lhs, rhs) => lhs.localeCompare(rhs)).join(ending || "\r\n");

    editor.edit(b => {
        b.insert(new vscode.Position(0, 0), text);
    });

    async function getNewDoc() {
        var nd = await vscode.commands.executeCommand("workbench.action.files.newUntitledFile");

        var allDocs = vscode.workspace.textDocuments;

        if (allDocs.length == 0) {
            return null; //Promise.resolve(null);
        }

        var doc = allDocs[allDocs.length - 1];

        return doc.isUntitled ?
            doc :
            null;
    }
}

exportCommands.push({ id: "bens-extensions.listCommands", callback: listAllCommands });

async function closeOtherWorkingFiles() {
    var editor = vscode.window.activeTextEditor;

    if (!editor) {
        return;
    }

    var activeDocument = editor ?
        editor.document :
        null;

    // duplicate into local
    var allTextDocuments = vscode.workspace.textDocuments.map(_ => _);
    console.log("Found " + allTextDocuments.length + " documents to close");

    for (var i = 0; i < allTextDocuments.length; i += 1) {
        var td = allTextDocuments[i];

        if (!activeDocument || td.fileName !== activeDocument.fileName) {
            console.log("Close file:" + td.fileName);

            await vscode.window.showTextDocument(td);
            await vscode.commands.executeCommand("workbench.files.action.closeFile");
        }
    }
}

exportCommands.push({ id: "bens-extensions.closeOtherWorkingFiles", callback: closeOtherWorkingFiles });

export = exportCommands