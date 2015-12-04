import * as vscode from 'vscode';

var exportCommands: BensExtensions.ExportCommand[] = [];

function moveCursorAndScroll(count: number) {
    const SCROLL_WINDOW = 10;

    var editor = vscode.window.activeTextEditor;

    if (!editor) {
        return;
    }

    if(editor.selection.active.line + count < 0){
        count = -editor.selection.active.line;
    }

    console.log("Scroll down:" + count);

    var nextCursorPos = editor.selection.active.translate(count);

    console.log("Next Cursor pos, line: " + nextCursorPos.line);

    var nextSelection = new vscode.Selection(nextCursorPos, nextCursorPos)
    editor.selection = nextSelection;

    var minVal = Math.max(0, (nextCursorPos.line - SCROLL_WINDOW));
    var min = new vscode.Position(minVal, nextCursorPos.character);
    var max = nextCursorPos.translate(SCROLL_WINDOW);

    var next = new vscode.Range(min, max);

    console.log("Next range, from line: " + next.start.line + " to:" + next.end.line);
    editor.revealRange(next, vscode.TextEditorRevealType.InCenter);
}

exportCommands.push({ id: "bens-extensions.moveCursorAndScrollUp", callback: () => moveCursorAndScroll(-1) });
exportCommands.push({ id: "bens-extensions.moveCursorAndScrollDown", callback: () => moveCursorAndScroll(1) });

export = exportCommands;