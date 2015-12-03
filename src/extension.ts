// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    function add(id: string, callback: (...args: any[]) => any) {
        var d = vscode.commands.registerCommand(id, callback);

        context.subscriptions.push(d);
    }

    add("more-scroll.listCommands", listAllCommands);
    add("more-scroll.closeOtherWorkingFiles", closeOtherWorkingFiles);
    add("more-scroll.upLine", () => scroll(-10));
    add("more-scroll.downLine", () => scroll(10));
}

async function listAllCommands() {
    var doc = await getNewDoc();

    var editor = await vscode.window.showTextDocument(doc);

    var commands = await vscode.commands.getCommands();

    var ending = (<any>editor.document)._eol
    var text = commands.sort((lhs, rhs) => lhs.localeCompare(rhs)).join(ending || "\r\n");

    editor.edit(b => {
        b.insert(new vscode.Position(0, 0), text);
    });

    async function getNewDoc() {
        await vscode.commands.executeCommand("workbench.action.files.newUntitledFile");

        var allDocs = vscode.workspace.textDocuments;

        if (allDocs.length == 0) {
            return null;
        }

        var doc = allDocs[allDocs.length - 1];

        return doc.isUntitled && doc.lineCount === 0 ? doc : null;
    }
}

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

function scroll(count: number) {
    var editor = vscode.window.activeTextEditor;

    if (!editor) {
        return;
    }

    var current = editor.selection;
    var down = current.start.translate(count);
    var next = new vscode.Range(down, down);

    //editor.selections.forEach(s => {
    //    console.log("Pre:")
    //    console.log("Selection:" + s.start.line + ", " + s.end.line);
    //})

    // editor.edit(b =>
    // {
    //     b.insert(down, "|");
    // })

    editor.revealRange(next, vscode.TextEditorRevealType.InCenter);

    // editor.selections.forEach(s => {
    //     console.log("Post:")
    //     console.log("Selection:" + s.start.line + ", " + s.end.line);
    // })
}