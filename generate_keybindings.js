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

function makeIt(mod, defs) {
    defs.forEach(function([kb, val, valShift]) {
        if (val !== '') {
            const k1 = {
                key: mod.key + kb,
                win: mod.win + kb,
                linux: mod.linux + kb,
                mac: mod.mac + kb,
                command: 'church-slavonic-keyboard:' + mod.title + kb,
                when: 'editorTextFocus && cu.active'
            }

            if (seen[k1.command] === undefined) {
                keybindings.push(k1)
                commands.push({
                    command: k1.command,
                    title: 'CU Stroke: ' + mod.title + kb
                })
                seen[k1.command] = true
            }
            symbolMap[k1.command] = val;

        }

        if (valShift !== '') {
            const k2 = {
                key: mod.key + 'shift+' + kb,
                win: mod.win + 'shift+' + kb,
                linux: mod.linux + 'shift+' + kb,
                mac: mod.mac + 'shift+' + kb,
                command: 'church-slavonic-keyboard:' + mod.title + 'shift+' + kb,
                when: 'editorTextFocus && cu.active'
            }

            if (seen[k2.command] === undefined) {
                keybindings.push(k2)
                commands.push({
                    command: k2.command,
                    title: 'CU Stroke: ' + mod.title + 'shift+' + kb
                })
                seen[k2.command] = true
            }
            symbolMap[k2.command] = valShift
        }
    })
}

makeIt({
    title: '',
    key: '',
    win: '',
    linux: '',
    mac: '',
},
    cudef.plain
)
makeIt({
    title: 'meta+',
    key: 'meta+',
    win: 'ctrl+alt+',
    linux: 'ctrl+alt+',
    mac: 'ctrl+alt+',
},
    cudef.mod
)
makeIt({
    title: 'dead',
    key: '` ',
    win: '` ',
    linux: '` ',
    mac: '` ',
}, cudef.deadPlain)
makeIt({
    title: 'dead+meta+',
    key: '` meta+',
    win: '` ctrl+alt+',
    linux: '` ctrl+alt+',
    mac: '` ctrl+alt+',
}, cudef.deadMod
)

keybindings.push({
    key: 'meta+space',
    mac: 'ctrl+alt+space',
    win: 'ctrl+alt+space',
    linux: 'ctrl+alt+space',
    command: 'church-slavonic-toggle'
})

commands.push({
    command: 'church-slavonic-toggle',
    title: 'Church Slavonic Keyboard: Toggle'
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
