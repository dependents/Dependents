### dependents-editor-backend [![npm](http://img.shields.io/npm/v/dependents-editor-backend.svg)](https://npmjs.org/package/dependents-editor-backend) [![npm](http://img.shields.io/npm/dm/dependents-editor-backend.svg)](https://npmjs.org/package/dependents-editor-backend)

> The brain that powers all Dependents editor plugins

`npm install dependents-editor-backend`

### How to integrate with a text editor

*More docs coming soon*

* Shell out to the `bin/cli.js` file with the command and params for
the action that the user is requesting.

### What does a text editor need to implement?

* Jump to Dependency logic for grabbing the clicked line and the clicked character
* Editor error handling (ex: popups or modals)
* Editor file selection popup with the list of file results
* Editor menus (ex: right click menus)
* Editor keybindings

### Existing Integrations

* [Sublime Text 2/3](https://packagecontrol.io/packages/Dependents)
* [Atom](https://atom.io/packages/Dependents)

### License

You may not use this code outside of the supported editor clients for Dependents.

If you wish to use this code for your own projects, please email joel@mrjoelkemp.com
to discuss licensing options.
