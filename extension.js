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

    function registerCommand(name, func) {
        const disposable = vscode.commands.registerCommand(name, func);
        context.subscriptions.push(disposable);
    }

    for (var commandName in symbolMap) {
        const seat = symbolMap[commandName]

        registerCommand(commandName, function() {
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
            }

            return false
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

    registerCommand('church-slavonic-activate-dead', function () {
        active = true;
        dead = true;
        statusBarItem.text = 'cu: ^^'
    });

    registerCommand('type', function(args, cb) {
        console.log(args);
        return vscode.commands.executeCommand('default:type', args, cb);
    });

    vscode.commands.executeCommand('setContext', 'cu.active', active);
}

exports.activate = activate;

function deactivate() { }
exports.deactivate = deactivate;

