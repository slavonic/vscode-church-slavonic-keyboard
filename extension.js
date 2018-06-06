const vscode = require('vscode');
const symbolMap = require('./symbol-map');
const keyMap = require('./key-map');

var active = false;
var dead = false;
var statusBarItem = null;

function insertSymbol(symbol) {
    vscode.commands.executeCommand('type', {
        text: symbol
    });
}

function activate(context) {

    for (var commandName in symbolMap) {
        const seat = symbolMap[commandName]

        const disposable = vscode.commands.registerCommand(
            commandName,
            function() {
                if (active) {
                    if (dead) {
                        if (seat.dead !== undefined) {
                            insertSymbol(seat.dead)
                        }
                    } else {
                        if (seat.normal !== undefined) {
                            insertSymbol(seat.normal)
                        }
                    }
                }
                if (dead) {
                    dead = false;
                    statusBarItem.text = active ? 'cu: ON' : 'cu: OFF'
                    statusBarItem.show()
                }

                return true
            }
        );
        context.subscriptions.push(disposable);
    }

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarItem.text = 'cu: OFF'
    statusBarItem.show()
    context.subscriptions.push(statusBarItem)

    var disposable = vscode.commands.registerCommand('church-slavonic-toggle', function () {
        active = !active;
        statusBarItem.text = active ? 'cu: ON' : 'cu: OFF'
        statusBarItem.show()
    });
    context.subscriptions.push(disposable);

    var disposable = vscode.commands.registerCommand('church-slavonic-activate-dead', function () {
        active = true;
        dead = true;
        statusBarItem.text = 'cu: ^^'
        statusBarItem.show()
    });
    context.subscriptions.push(disposable);
}

exports.activate = activate;

function deactivate() { }
exports.deactivate = deactivate;

