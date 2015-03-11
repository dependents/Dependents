### Dependents

> Sublime Text 3 plugin for navigating front-end (JS/Sass) codebases

Currently supporting: AMD, CommonJS, ES6, and Sass codebases.

1. [Installation](#installation)
2. [Configuring Settings](#configuring-settings)
3. [Usage](#usage)
 - [Jump to dependency](#jump-to-a-dependency)
 - [Find dependents](#find-the-dependents-of-the-current-module)
 - [Find relevant app entry points](#find-relevant-app-entry-points)
 - [View dependency tree](#view-dependency-tree)
4. [Bindings](#bindings)
 - [Key Bindings](#key-bindings)
 - [Mouse Bindings](#mouse-bindings)
 - [Customizing Bindings](#customizing-bindings)
5. [Troubleshooting](#troubleshooting)
6. [Old Issues](#old-issues)
7. [Reporting an Issue](#reporting-an-issue)
8. [Contributing to Dependents](https://github.com/mrjoelkemp/sublime-dependents/blob/master/Contributing.md)

### Installation

Install `Dependents` via Package Control.

Don't see it? Try reinstalling Package Control. Alternatively, add the repository and install it:

1. Package Control -> Add Repository
2. Enter `https://github.com/mrjoelkemp/Dependents`
3. Package Control -> Install Package
4. Choose Dependents

If it doesn't work, please file an issue.

If you want contribute or use the latest commits simply git clone the repository `https://github.com/mrjoelkemp/Dependents` to your Packages directory with a directory name of `Dependents`. From sublime choose `Preferences>Browse Packages`  to easily determine the path to the Packages directory for your install.  Be sure to remove the package via package control first if you had already done so to avoid package control updating the package.

### Configuring settings

There a two ways in which to invoke the package settings.  

One is globally via entires in a user settings file `Preferences>Package Settings>Dependents>Settings-User`.  You can open the `Settings-Default` file and copy and paste the contents as a starter template.   Do not edit the default file as that will be overwritten with updates.

Alternatively you can define settings on a per-project basis by creating
a `.deprc` file in the root of the sublime project/folder.  The paths you will specify are then **relative** to the sublime project/folder root. This is the preferred way if you are working on more than one project using sublime (aren't we all!)

* `root`: (required) the ultimate/root path at which to limit dependent searching.  When using `.deprc` would be `""` if same as root of sublime project/folder.
* `config`: (Optional) the path to your requirejs configuration file
* `sass_root`: (Optional) the path to your Sass files
* `exclude`: (Optional) a list of paths and/or folder names to exclude from the search for dependents
 * Omitting folders that contain 3rd party libraries can drastically speed up the search for a large codebase.
 * The following folders are excluded by default: `node_modules`, `bower_components`, `vendor`
 * Note: Subdirectories are not supported; you can't supply `some/sub/folder` as an exclusion
* `build_config`: (Optional) path to your RequireJS Build configuration json file
 * This should have a "modules" section that lists your bundles (entry points)
 * Supplying this yields a significant performance speedup when finding relevant app entry points
* `node_path`: (Optional) path to your node installation. Defaults to `/usr/local/bin` on OSX

example:
```
{
  "root": "public/assets/js",
  "config": "public/assets/js/config.js",  # Optional
  "sass_root": "public/assets/sass",       # Optional
  "exclude": ['jquery.js', 'require.js'],  # Optional
  "build_config": "public/assets/js/build.json", # Optional
  "node_path": "/my/node/install/folder"   # Optional
}
```


### Usage

There are four ways to trigger the package's commands

* From Main Menu `File -> Dependents`
* From Context `Right click -> Dependents`
* Via keyboard [see the key bindings](#key-bindings)
* Via mouse click [see the mouse bindings](#mouse-bindings)

#### Jump to a dependency

Quickly jump to a file that the current file @imports (sass) or requires (js)

1. Within a file, place your cursor over the dependency path you want to go to
2. Then trigger the `Jump to dependency` command in one of the four ways noted above.
 
*For javascript* if a dependency is aliased, you'll need to supply the path to your requirejs configuration

#### Find the dependents of the current module

Dependents are files that immediately depend/require/import the current file.

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

1. Within a file, right click to open the context menu
2. Click on `Dependents -> View this file's dependency tree`

### Bindings

To more swiftly and conveniently trigger the package's commands both key and mouse bindings are provided.

#### Key bindings

By default, the following key bindings have been supplied:

OSX:

* Jump to dependency: `Option + Command + Down arrow` 
* Find Dependents: `Option + Command + Up arrow`

  
Windows and Linux:

* Jump to dependency: `Ctrl + Shift + Down arrow`
* Find Dependents: `Ctrl + Shift + Up arrow`



#### Mouse bindings

By default, the following key bindings have been supplied:

OSX:

* Jump to dependency: `Option + Command + Click` on the dependency item
* Find Dependents: `Shift + Command + Click` anywhere in document


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

You will need to add the appropriate file (below) to your OS to your `User` directory.  `Preferences -> Browse Packages`  will help you find that directory.  Alterntively you can add a menu item `Preferences -> Mouse Bindings - User` to create and edit this file.  See the end of this section for details 

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

**Setting up a user mouse bindings menu item**

In your `User` directory create a file Main.sublime-menu.  `Preferences -> Browse Packages` will help you find your `User` directory

Into that file put this code and you will then see `Preferences -> Browse Packages`.  Use this menu item to edit your user mouse bindings.  It will create the correct mouse binders file in your `User` directory.

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

Or ping me [@mrjoelkemp](https://twitter.com/mrjoelkemp)
