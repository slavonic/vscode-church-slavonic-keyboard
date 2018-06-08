const fs = require('fs');
const cudef = require('./cudef')

const keybindings = []
const commands = []
const symbolMap = {}

function asString(val) {
    const data = []
    for (var i = 0; i < val.length; i++) {
        var code = val.charCodeAt(i).toString(16);
        if (code.length === 1) {
            code = '000' + code
        } else if(code.length === 2) {
            code = '00' + code
        } else if (code.length == 3) {
            code = '0' + code
        }
        data.push(code)
    }
    return data.join('.')
}

const seen = {}

function setSymbolMap(key, subkey, val) {
    if (symbolMap[key] === undefined) {
        symbolMap[key] = {}
    }
    symbolMap[key][subkey] = val;
}

function makeIt(mod, defs, subkey) {
    defs.forEach(function([kb, val, valShift]) {
        const k1 = {
            key: mod + kb,
            command: 'church-slavonic-keyboard.' + mod + kb,
            when: 'editorTextFocus && cu.active'
        }

        if (seen[k1.command] === undefined) {
            keybindings.push(k1)
            commands.push({
                command: k1.command,
                title: 'CU Stroke: ' + mod + kb
            })
            seen[k1.command] = true
        }
        setSymbolMap(k1.command, subkey, val)

        if (valShift !== '') {
            const k2 = {
                key: mod + 'shift+' + kb,
                command: 'church-slavonic-keyboard.' + mod + 'shift+' + kb,
                when: 'editorTextFocus && cu.active'
            }

            if (seen[k2.command] === undefined) {
                keybindings.push(k2)
                commands.push({
                    command: k2.command,
                    title: 'CU Stroke: ' + mod + 'shift+' + kb
                })
                seen[k2.command] = true
            }
            setSymbolMap(k2.command, subkey, valShift)
        }
    })
}

makeIt('', cudef.plain, 'normal')
makeIt('meta+', cudef.mod, 'normal')
makeIt('', cudef.deadPlain, 'dead')
makeIt('meta+', cudef.deadMod, 'dead')

commands.push({
    command: 'church-slavonic-toggle',
    title: 'Church Slavonic Keyboard: Toggle'
})
commands.push({
    command: 'church-slavonic-activate-dead',
    title: 'Church Slavonic Keyboard: Activate Dead Key'
})


var text = {
    keybindings: JSON.stringify(keybindings, null, 4),
    commands: JSON.stringify(commands, null, 4),
    symbolMap: JSON.stringify(symbolMap, null, 4)
}

var template = fs.readFileSync('package.json.template').toString();
var expanded = template.
    replace('{{keybindings}}', text.keybindings).
    replace('{{commands}}', text.commands);

fs.writeFileSync('package.json', expanded)

var template = fs.readFileSync('symbol-map.js.template').toString();
var expanded = template.
    replace('{{symbolMap}}', text.symbolMap)
fs.writeFileSync('symbol-map.js', expanded)
