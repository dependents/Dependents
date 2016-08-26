### Dependents [![Gitter](https://img.shields.io/badge/gitter-join%20chat-green.svg?style=flat)](https://gitter.im/mrjoelkemp/Dependents?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![Package Control](https://img.shields.io/packagecontrol/dt/Dependents.svg?maxAge=2592000)](https://packagecontrol.io/packages/Dependents)

> Navigate front-end codebases in Sublime Text 2/3

Currently supports JavaScript (AMD, CommonJS, and ES6) and CSS Preprocessor (Sass and Stylus) codebases.

1. [Installation](#installation)
2. [Configuring Settings](#configuring-settings)
3. [Usage](#usage)
 - [Jump to Dependency](#jump-to-a-dependency)
 - [Find Dependents](#find-the-dependents-of-the-current-module)
 - [Find Relevant App Entry Points](#find-relevant-app-entry-points)
 - [View Dependency Tree](#view-dependency-tree)
 - [Copy Path to Clipboard](#copy-path-to-clipboard)
4. [Bindings](#bindings)
6. [Reporting an Issue](#reporting-an-issue)
7. [Contributing to Dependents](https://github.com/mrjoelkemp/sublime-dependents/blob/master/Contributing.md)

### Installation

You can install `Dependents` via Package Control.

Don't see it? Try reinstalling Package Control. Alternatively, add the repository and install it:

1. Package Control -> Add Repository
2. Enter `https://github.com/mrjoelkemp/Dependents`
3. Package Control -> Install Package
4. Choose Dependents

#### Nodejs Dependency

You **must** have [Node.js](https://nodejs.org/) installed on your system. Anything v0.10 and above is fine.

* Note: The Node.js windows installer will add the install directory to the `PATH` variable but you must reboot to reload it.

If you have issues with running Node.js from within the package see the `node_path` setting under [configuring settings](#configuring-settings) below.

* nvm users will need to supply their `node_path`

* For a .deprc shared with a team, consider not commiting `node_path` changes (as it's only for your machine).
 * Run `git update-index --assume-unchanged .deprc` to ignore changes
 * Run `git update-index --no-assume-unchanged .deprc` to track changes again
 * This is currently a workaround.

### Configuring settings

Put a `.deprc` file in the root directory of your project. See below for all possible settings.

At a minimum, you must specify a `root` or `styles_root`.

```
{
  "root": "path/to/all/js/files",
  "styles_root": "path/to/my/stylesheets",
  "require_config": "path/to/my/requirejs/config.js",
  "build_config": "path/to/requirejs/build.json",
  "webpack_config": "path/to/my/webpack.config.js",
  "exclude": ['jquery.js', 'require.js', 'vendor']
}
```

* Note: If you want to specify the directory root as a value, please use `'./'`
* Tip: If you like to open a separate windows in sublime for subdirectories of your project just put a `.deprc`
file there too with the reduced/correct relative paths.

**General Settings**
* `node_path`: (Optional) path to your node installation.
 * A properly set `PATH` environment variable should preclude having to use this but for unusual cases we provide this setting.
 * `/usr/local/bin` is install path on OSX and Linux.
 * In windows the `PATH` is set during by the Node.js installer (be sure to reboot).

**JavaScript Settings**
* `root`: the ultimate/root path at which to limit js dependent searching.
* `config`: (Optional) the path to your requirejs configuration file
* `webpack_config`: (Optional) the path to your webpack configuration file
* `exclude`: (Optional) a list of paths and/or folder names to exclude from the search for dependents
 * Omitting folders that contain 3rd party libraries can drastically speed up the search for a large codebase.
 * The following folders are excluded by default: `node_modules`, `bower_components`, `vendor`
* `build_config`: (Optional) path to your RequireJS build configuration file
 * This can have a "modules" section that lists your bundles (entry points), otherwise we'll search for them automatically
  * Supplying this yields a significant performance speedup when finding relevant app entry points

**CSS Settings**
* `styles_root`: the ultimate/root path for your stylesheets.
 * Tip: For Sass, this package works great if you follow the architecture guidelines at [sass-guidelines](http://sass-guidelin.es/#architecture).

### Usage

There are four ways to trigger the package's commands

* From Main Menu `File -> Dependents`
* From Context `Right click -> Dependents`
* Via keyboard [see the key bindings](#key-bindings)
* Via mouse click [see the mouse bindings](#mouse-bindings)

#### Jump to a dependency

Quickly jump to a file that the current file @imports (sass/stylus) or requires (js)

![Jump to Dependency gif](http://i.imgur.com/GGlD8Uf.gif?1)

1. Within a file, place your cursor over the dependency path you want to go to
2. Then trigger the `Jump to dependency` command in one of the four ways noted above.

*For javascript* if a dependency is aliased, you'll need to supply the path to your requirejs or webpack configuration

#### Find the dependents of the current module

Dependents are files that immediately depend/require/import the current file.

![Find Dependents gif](http://i.imgur.com/Ol4i7a5.gif)

Trigger the `Find dependents` command in one of the four ways noted above.

* If dependents are found, you'll see them in a dropdown.
 * You can select any of the items in the panel to jump to that file
 * If there's only one dependent, you'll be taken to that dependent file directly.
* If no dependents are found a popup will be shown

You can also open all of the dependents at once:

1. Within a file, right click to open up a menu
2. Click on `Dependents -> Open all dependents` to open all dependent files in the editor

#### Find relevant app entry points

Find relevant application entry points that depend on the current file
somewhere within their dependency tree

1. Within a file, right click to open the context menu
2. Click on `Dependents -> Find relevant app entry points`

You can also open all relevant app entry points at once via:

1. Within a file, right click to open the context menu
2. Click on `Dependents -> Open all relevant app entry points`

#### View dependency tree

View a snapshot of the current file's dependency tree (as a JSON file)

![View Dependency Tree gif](http://i.imgur.com/DVwRHbp.gif)

1. Within a file, right click to open the context menu
2. Click on `Dependents -> View this file's dependency tree`

#### Copy path to clipboard

Copy the rootless path of the current module to the clipboard. (JS and Sass)

![Copy Path gif](http://i.imgur.com/iDNeMUP.gif)

For example, if the root is `assets/js` and the filename is `path/to/assets/js/myFeature/file.js`,
then the command will copy `myFeature/file` to the clipboard.

This is useful when you want to include the current module as a dependency of another module.

1. Within a file, right click to open the context menu
2. Click on `Dependents -> Copy path to the clipboard`

Or via its key binding.

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
