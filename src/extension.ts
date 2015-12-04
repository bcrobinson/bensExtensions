import * as vscode from 'vscode';

import * as scrollCommands from './scrollCommands';
import * as helperCommands from './helperCommands';

export function activate(context: vscode.ExtensionContext) {
    function add(id: string, callback: (...args: any[]) => any) {
        var d = vscode.commands.registerCommand(id, callback);

        context.subscriptions.push(d);
    }

    function addAll(commands: BensExtensions.ExportCommand[]) {
        commands.forEach(c => add(c.id, c.callback));
    }

    addAll(scrollCommands);
    addAll(helperCommands);
}
