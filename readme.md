### Dependents

> Sublime Text 3 plugin for navigating JavaScript codebases

1. [Features](#features)
2. [Usage](#usage)
 - [Find dependents](#find-the-dependents-of-the-current-module)
 - [Jump to dependency](#jump-to-a-dependency)
3. [Installation](#installation)
4. [Configuring Settings](#configuring-settings)
 - [Default Key Bindings](#default-key-bindings)
 - [Custom Key Bindings](#custom-key-bindings)
5. [Troubleshooting](#troubleshooting)
6. [Old Issues](#old-issues)

### Features:

* Find JavaScript modules that depend on the current JavaScript module.
* Jump to a dependency

Currently supporting: AMD modules and Mac OSX

Not currently supported but planned: CommonJS modules, Windows OS, Linux OS. Pull requests welcome!

### Usage

#### Find the dependents of the current module

`CMD + Option + Up arrow`, to trigger finding the dependents.

* If dependents are found, you'll see them in a dropdown.
 * You can select any of the items in the panel to jump to that file
 * If there's only one dependent, you'll be taken to that dependent file directly.
* If no dependents are found a popup will be shown

#### Jump to a dependency

1. Within a JS file, place your cursor over the dependency path you want to go to
2. Press `CMD + Option + Right arrow` or `CMD + Option + Click` to jump to that file
 - If a dependency is aliased, you'll need to supply the path to your requirejs configuration

### Installation

Install `Dependents` via Package Control.

Don't see it? Try reinstalling Package Control. Altenatively, add the repository and install it:

1. Package Control -> Add Repository
2. Enter `https://github.com/mrjoelkemp/sublime-dependents`
3. Package Control -> Install Package
4. Choose sublime-dependents

If it doesn't work, please file an issue.

### Configuring settings

* `root`: the location where your JS files reside.
* `config`: (Optional) the path to your requirejs configuration file

These can be specified by going to

`Preferences -> Package Settings -> Dependents -> Settings - User`

and adding:

```js
{
  "root": "public/assets/js",
  "config": "public/assets/js/config.js"
}
```

#### Default key bindings

By default, the following key bindings have been supplied:

OSX:

* Find Dependents: `CMD + Option + Up arrow`
* Jump to dependency: `CMD + Option + Right arrow` or `CMD + Option + Click`

You can also trigger the commands via:

* `File -> Dependents`
* `Right click -> Dependents`

#### Custom key bindings

If you would like to specify custom keybindings, you can override them in `Preferences -> Key Bindings - User`

like so:

```
[
  {
    "keys": ["super+alt+up"],
    "command": "dependents"
  },
  {
    "keys": ["super+alt+right"],
    "command": "jumptodependency",
  }
]
```

* You won't need the opening and closing square brackets `[]` if you have pre-existing key bindings

### Troubleshooting

If you're having trouble using Dependents, please check your console for errors: `View -> Show Console`

* File an issue with an error message

### Old Issues

*Every file says that it has no dependents*: `node-dependents v1.0.4` fixed an issue where js files in `node_modules` was being parsed which caused esprima parse errors – returning no results.

*The console says that it's missing a parameter "root"*: If you had a really early version of this plugin (before v1.2.0), then you need to clear out existing key bindings for Dependents.
