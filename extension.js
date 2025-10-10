import * as vscode from 'vscode';
import { symbolMap } from './symbol-map.js';
import { keyMap } from './key-map.js';

var active = false;
var statusBarItem = null;

function insertSymbol(symbol) {
    vscode.commands.executeCommand('type', {
        text: symbol
    });
}

export function activate(context) {

    function registerCommand(name, func) {
        const disposable = vscode.commands.registerCommand(name, func);
        context.subscriptions.push(disposable);
    }

    for (var commandName in symbolMap) {
        const symbol = symbolMap[commandName]

        registerCommand(commandName, function() {
            if (active) {
                insertSymbol(symbol)
            }
        });
    }

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarItem.text = 'cu: OFF'
    statusBarItem.show()
    context.subscriptions.push(statusBarItem)

    registerCommand('church-slavonic-toggle', function () {
        active = !active;
        statusBarItem.text = active ? 'cu: ON' : 'cu: OFF'
        vscode.commands.executeCommand('setContext', 'cu.active', active);
    });

    vscode.commands.executeCommand('setContext', 'cu.active', active);
}

export function deactivate() { }

