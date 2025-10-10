# How to build

This extension uses generated sources.

To re-generage, run:

```node
node generate_keybindings.js
```

Following files are generated (no not edit directly):

* `symbol-map.js`
* `package.json`

Source files:

* `symbol-map.js.template` - template to generate `symbol-map.js`
* `package.json.template` - template to generate `package.json`
* `cudef.js` - Church Slavonic key definitions

