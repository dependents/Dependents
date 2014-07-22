### Dependents

> Sublime Text 3 plugin for navigating JavaScript codebases

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#Installation)
4. [Configuring Settings](#configuring-settings)
 - [Default Key Bindings](#default-key-bindings)
 - [Custom Key Bindings](#custom-key-bindings)
5. [Usage](#usage)
 - [Find dependents](#find-the-dependents-of-the-current-module)
 - [Jump to dependency](#jump-to-a-dependency)

### Features:

* Find JavaScript modules that depend on the current JavaScript module.
* Jump to a dependency

Currently supporting: AMD modules

Not currently supported but planned: CommonJS modules, Windows OS. Pull requests welcome!

### Prerequisites

You need to have Node.js installed and the node tool [dependents](https://github.com/mrjoelkemp/node-dependents).

`npm install dependents`

### Installation

Install `Dependents` via Package Control.

Don't see it? Try reinstalling Package Control. Altenatively, add the repository and install it:

1. Package Control -> Add Repository
2. Enter `https://github.com/mrjoelkemp/sublime-dependents`
3. Package Control -> Install Package
4. Choose sublime-dependents

### Configuring settings

You need to supply the "root" of your JS codebase (i.e., the location where your JS files reside).

This can be specified by going to

`Preferences -> Package Settings -> Dependents -> Settings - User`

and adding:

```js
{
  "root": "public/assets/js"
}
```

#### Default key bindings

By default, the following key bindings have been supplied:

OSX:

* Find Dependents: `CMD + Option + Up arrow`
* Jump to dependency: `CMD + Option + Right arrow` or `CMD + Option + Click`

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

### Usage

#### Find the dependents of the current module

Use the `keys` value above, `CMD + Option + Up arrow`, to trigger finding the dependents.

* If dependents are found, you'll see them in a dropdown.
 * You can select any of the items in the panel to jump to that file
 * If there's only one dependent, you'll be taken to that dependent file directly.
* If no dependents are found a popup will be shown

#### Jump to a dependency

1. Within a JS file, place your cursor over the dependency path you want to go to
2. Press `CMD + Option + Right arrow` or `CMD + Option + Click` to jump to that file
