const vscode = require('vscode');

function insertSymbol(symbol) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    if (editor.selection.isEmpty) {
        editor.edit(function (editBuilder) {
            editor.selections.forEach(function (selection, idx) {
                editBuilder.insert(selection.active, symbol)
            })
        })
    } else {
        var newSelections;
        editor.edit(function (editBuilder) {
            newSelections = editor.selections.map(function (selection) {
                editBuilder.replace(selection, symbol)

                const position = selection.start;
                const newPosition = position.with(position.line, position.character + 1);
                return new vscode.Selection(newPosition, newPosition);
            })
        })
        editor.selections = newSelections;
    }
}

const symbolMap = [
    ['church-slavonic-keyboard.FE2E', '\ufe2e'],
    ['church-slavonic-keyboard.0447', '\u0447'],
]

function activate(context) {
    symbolMap.forEach(function(pair) {
        const [commandName, symbol] = pair;

        let disposable = vscode.commands.registerCommand(
            commandName,
            function() { insertSymbol(symbol); }
        );
        context.subscriptions.push(disposable);
    })
}
exports.activate = activate;

function deactivate() { }
exports.deactivate = deactivate;

