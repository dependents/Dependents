### Dependents

[![Gitter](https://img.shields.io/badge/gitter-join%20chat-green)](https://gitter.im/mrjoelkemp/Dependents)
[![Package Control](https://img.shields.io/packagecontrol/dt/Dependents?maxAge=2592000)](https://packagecontrol.io/packages/Dependents)

> Navigate front-end codebases in Sublime Text 2/3

For updates, follow [@getDependents](https://twitter.com/getdependents).

Currently supports JavaScript (AMD, CommonJS, and ES6) and CSS Preprocessor (Sass and Stylus) codebases.

1. [Installation](#installation)
1. [Usage and Settings Details](http://getdependents.com)
1. [Bindings](#bindings)
1. [Reporting an Issue](#reporting-an-issue)
1. [Contributing to Dependents](https://github.com/mrjoelkemp/sublime-dependents/blob/master/Contributing.md)

### Installation

You can install `Dependents` via Package Control.

Don't see it? Try reinstalling Package Control. Alternatively, add the repository and install it:

1. Package Control -> Add Repository
2. Enter `https://github.com/dependents/Dependents`
3. Package Control -> Install Package
4. Choose Dependents

#### Nodejs Dependency

You **must** have [Node.js](https://nodejs.org/) installed on your system. Anything v0.10 and above is fine.

* Note: The Node.js windows installer will add the install directory to the `PATH` variable but you must reboot to reload it.

##### NVM Users

[NVM](https://github.com/creationix/nvm) will install Nodejs outside of the standard binary location. If you encounter an error where your Node executable cannot be found,
please override the `node_path` in User settings:

* Preferences -> Package Settings -> Dependents -> Settings - User

```
{
  "node_path": "path/to/the/node/install/directory"
}
```

* This will allow Dependents to find the Node binary for every codebase

### Bindings

To more swiftly and conveniently trigger the package's commands both key and mouse bindings are provided.

#### Key bindings

By default, the following key bindings have been supplied:

OSX:

* Jump to dependency: `Command + Option + Right arrow`
* Find Dependents: `Command + Option + Up arrow`
* Copy path to clipboard: `Command + Shift + C`

Windows and Linux:

* Jump to dependency: `Ctrl + Shift + Down arrow`
* Find Dependents: `Ctrl + Shift + Up arrow`

#### Mouse bindings

By default, the following key bindings have been supplied:

OSX:

* Jump to dependency: `Command + Option + Click` on the dependency item
* Find Dependents: `Command + Shift + Click` anywhere in document


Windows and Linux:

* Jump to dependency: `Ctrl + Alt + Click`  on the dependency item
* Find Dependents: `Ctrl + Shift + Click`   anywhere in document

### Reporting an issue

You can get console logs via `View -> Show Console`.

Paste those logs into the body of your issue.

Feel free to chat with me on [Gitter](https://gitter.im/mrjoelkemp/Dependents) if you need help or ping me [@mrjoelkemp](https://twitter.com/mrjoelkemp).

### License

(Creative Commons Attribution NoDerivs (CC-ND)](https://tldrlegal.com/license/creative-commons-attribution-noderivs-(cc-nd))

The no derivatives creative commons license is straightforward; you can take a work released under this license and re-distribute it but you can’t change it.
