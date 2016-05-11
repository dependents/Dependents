### Dependents [![Gitter](https://img.shields.io/badge/gitter-join%20chat-green.svg?style=flat)](https://gitter.im/mrjoelkemp/Dependents?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

> Navigate front-end codebases in Sublime Text

Currently supporting JavaScript (AMD, CommonJS, and ES6) and CSS Preprocessor (Sass and Stylus) codebases.

1. [Installation](#installation)
 - [Nodejs Dependency](#nodejs-dependency)
 - [OSX or Linux](#osx-or-linux-install)
 - [Windows](#windows-install)
2. [Configuring Settings](#configuring-settings)
3. [Usage](#usage)
 - [Jump to Dependency](#jump-to-a-dependency)
 - [Find Dependents](#find-the-dependents-of-the-current-module)
 - [Find Relevant App Entry Points](#find-relevant-app-entry-points)
 - [View Dependency Tree](#view-dependency-tree)
 - [Copy Path to Clipboard](#copy-path-to-clipboard)
4. [Bindings](#bindings)
 - [Key Bindings](#key-bindings)
 - [Mouse Bindings](#mouse-bindings)
 - [Customizing Bindings](#customizing-bindings)
5. [Troubleshooting](#troubleshooting)
6. [Old Issues](#old-issues)
7. [Reporting an Issue](#reporting-an-issue)
8. [Contributing to Dependents](https://github.com/mrjoelkemp/sublime-dependents/blob/master/Contributing.md)

### Installation

#### Nodejs Dependency

Unlike most sublime packages, the bulk of the plugin's logic is written in Javascipt; see [Contributing to Dependents](https://github.com/mrjoelkemp/sublime-dependents/blob/master/Contributing.md) for details.
As such, you **must** have a copy of [Node.js](https://nodejs.org/) installed on your system.

* It must be available via a directory included in your OS's `PATH` environment variable which is usually the case when the program
is installed normally.
* In OSX and Linux a link to node.js `node` usually goes in the `usr/local/bin` directory which is typically already in the `PATH`.
* The Node.js windows installer will add the install directory to the `PATH` variable but you must reboot to reload it.

If you have issues with running Node.js from within the package see the `node_path` setting under [configuring settings](#configuring-settings) below.

#### OSX or Linux Install

If you are using OSX or Linux you can install `Dependents` via Package Control.

Don't see it? Try reinstalling Package Control. Alternatively, add the repository and install it:

1. Package Control -> Add Repository
2. Enter `https://github.com/mrjoelkemp/Dependents`
3. Package Control -> Install Package
4. Choose Dependents

If it doesn't work, please file an issue.

If you want contribute or use the latest commits simply git clone the repository
`https://github.com/mrjoelkemp/Dependents` to your Packages directory with a directory name of `Dependents`.
From sublime choose `Preferences -> Browse Packages` to easily determine the path to the Packages directory for your install.
Be sure to remove the package via package control first to avoid package control updating the package.

#### Windows Install

In order to get Dependents to work on the Windows operating system, the 256 character filepath length restriction of the OS needs to
be bypassed. Dependents tries to achieve this using npm dedupe to flatten the list of node tool dependencies.

### Configuring settings

Rather than using a typical sublime settings file you define settings on a *per-project basis* by creating a `.deprc` file in a
project (open folder) root. The paths you will specify are then **relative** to the folder although absolute paths can be used.
Following are a few examples to help you get started.  Below are the current settings that the package recognizes.

Say you open a folder/project in sublime to `/path/to/projects/someproject`.  Put a `.deprc` file in the project root  `/someproject`.

For JavaScript, if you want dependents to search all the way to this root (`/someproject`) then put this in the `.deprc` file
```
{
  "root": "./",
}
```
Use `"./"` to signify the root and NOT just a `""`.

But if your JS code was all contained within a subdirectory of `/someproject` you could limit your dependents search there.
```
{
   "root": "assets/js"
}
```

Works the same for Sass and other CSS preprocessors but use `styles_root`
```
{
  "styles_root": "assets/sass",
}
```


Here is an example of using some other optional settings.  You can also combine js and styles roots in the same `.deprc`.
See below for all possible settings. At a minimum, you will need at last a `root` or `styles_root` in any `.deprc` file.

```
{
  "root": "assets/js",
  "config": "assets/js/config.js",
  "webpack_config": "assets/js/webpack.config.js",
  "exclude": ['jquery.js', 'require.js'],
  "build_config": "assets/js/build.json",
  "styles_root": "assets/sass",
}
```

Tip: If you like to open a separate windows in sublime for subdirectories of your project just put a `.deprc`
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
 * Note: Subdirectories are not supported; you can't supply `some/sub/folder` as an exclusion
* `build_config`: (Optional) path to your RequireJS Build configuration json file
 * This should have a "modules" section that lists your bundles (entry points)
 * Supplying this yields a significant performance speedup when finding relevant app entry points


**Sass settings**
* `styles_root`: the ultimate/root path for your sass file architecture at which to limit dependent searching.
 * This package works swell if you follow the architecture guidelines at [sass-guidelines](http://sass-guidelin.es/#architecture).

### Usage

There are four ways to trigger the package's commands

* From Main Menu `File -> Dependents`
* From Context `Right click -> Dependents`
* Via keyboard [see the key bindings](#key-bindings)
* Via mouse click [see the mouse bindings](#mouse-bindings)

#### Jump to a dependency

Quickly jump to a file that the current file @imports (sass) or requires (js)

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



### Customizing bindings

If you would like to specify custom key and mouse bindings or if the default ones conflict with your current setup, you can override them in with the OS specific key and mouse binding files located in your User directory

**Key bindings**

The easy way to access the user keybindings file is from the menu

`Preferences -> Key Bindings - User`

you can copy and paste the default settings for your OS below into your key bindings file, edit them to suit and save.

For Mac OSX
```
[
  // Find the dependents for the current module, super=command, alt=option
  {
    "keys": ["super+alt+up"],
    "command": "dependents"
  },

  // Jump to a dependency
  {
    "keys": ["super+alt+down"],
    "command": "jump_to_dependency"
  }
]
```

For Linux or Windows
```
[
  // Find the dependents for the current module
  {
    "keys": ["ctrl+shift+up"],
    "command": "dependents"
  },

  // Jump to a dependency
  {
    "keys": ["ctrl+shift+down"],
    "command": "jump_to_dependency"
  }
]
```

* You won't need the opening and closing square brackets `[]` if you have pre-existing key bindings.
* If you want to add a keybinding for Finding relevant app entry points, the command is `find_driver`.

**Mouse bindings**

Setting up custom mouse bindings is a bit more involved mostly because Sublime by default does not have a menu item for conveniently editing your user mouse bindings.

You will need to add the appropriate file (below) to your OS to your `User` directory.  `Preferences -> Browse Packages`  will help you find that directory.  Alterntively you can add a menu item `Preferences -> Mouse Bindings - User` to create and edit this file.  See the [end of this section for details](#mousemenu)

```
Default (Linux).sublime-mousemap
Default (OSX).sublime-mousemap
Default (Windows).sublime-mousemap
```

you can then copy and paste the default settings for your OS below into your mouse bindings file, edit them to suit and save.

For Mac OSX   super=command, alt=option
```
[
  {
    "button": "button1",
    "count": 1,
    "modifiers": ["super", "alt"],
    "press_command": "drag_select",
    "command": "jump_to_dependency"
  },
  {
    "button": "button1",
    "count": 1,
    "modifiers": ["super", "shift"],
    "press_command": "drag_select",
    "command": "dependents"
  }
]
```

For Linux or Windows
```
[
  {
    "button": "button1",
    "count": 1,
    "modifiers": ["ctrl", "alt"],
    "press_command": "drag_select",
    "command": "jump_to_dependency"
  },
  {
    "button": "button1",
    "count": 1,
    "modifiers": ["ctrl", "shift"],
    "press_command": "drag_select",
    "command": "dependents"
  }
]
```

<a name="mousemenu"><a>
**Setting up a user mouse bindings menu item**

In your `User` directory create a file Main.sublime-menu.  `Preferences -> Browse Packages` will help you find your `User` directory

Into that file put this code and you will then see `Preferences -> Mouse Bindings - User` in the menu.  Now use this menu item to edit your user mouse bindings.  It will create the correct mouse binding file in your `User` directory.  See above for mouse binding default code to copy, paste and edit.

```
[
    {
        "caption": "Preferences",
        "mnemonic": "n",
        "id": "preferences",
        "children":
        [
            { "caption": "-" },
            {
                "command": "open_file", "args":
                {
                    "file": "${packages}/User/Default ($platform).sublime-mousemap",
                    "contents": "[\n\t$0\n]\n"
                },
                "caption": "Mouse Bindings – User"
            },
     { "caption": "-" }
        ]
    }
]
```



### Troubleshooting

If you're having trouble using Dependents, please check your console for errors: `View -> Show Console`

* File an issue with an error message

### Reporting an issue

You can get console logs via `View -> Show Console`.

Paste those logs into the body of your issue.

Feel free to chat with me on [Gitter](https://gitter.im/mrjoelkemp/Dependents) if you need help or ping me [@mrjoelkemp](https://twitter.com/mrjoelkemp).
