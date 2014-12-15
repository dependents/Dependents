### Dependents

> Sublime Text 3 plugin for navigating Front-End (JS/Sass) codebases

1. [Features](#features)
2. [Usage](#usage)
 - [Find dependents](#find-the-dependents-of-the-current-module)
 - [Jump to dependency](#jump-to-a-dependency)
 - [Open all dependents](#open-all-dependents)
3. [Installation](#installation)
4. [Configuring Settings](#configuring-settings)
 - [Per-project Settings](#per-project-settings)
 - [Default Key Bindings](#default-key-bindings)
 - [Custom Key Bindings](#custom-key-bindings)
5. [Troubleshooting](#troubleshooting)
6. [Old Issues](#old-issues)
7. [Reporting an Issue](#reporting-an-issue)

### Features:

* Find JavaScript/Sass files that depend on the current JavaScript/Sass file.
* Jump to a dependency
* Open all dependent files

Currently supporting: AMD, CommonJS, ES6, and Sass codebases.

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

#### Open all dependents

1. Within a JS file, right click to open up a menu
2. Click on Dependents -> Open all dependents to open all dependent files in the editor

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
* `sass_root`: (Optional) the path to your Sass files
* `exclude`: (Optional) a list of paths and/or folder names to exclude from the search for dependents
 * Omitting folders that contain 3rd party libraries can drastically speed up the search for a large codebase.
 * The following folders are excluded by default: `node_modules`, `bower_components`, `vendor`
 * Note: Subdirectories are not supported; you can't supply `some/sub/folder` as an exclusion

These can be specified by going to

`Preferences -> Package Settings -> Dependents -> Settings - User`

and adding:

```js
{
  "root": "public/assets/js",
  "config": "public/assets/js/config.js",  # Optional
  "sass_root": "public/assets/sass",       # Optional
  "exclude": ['jquery.js', 'require.js']   # Optional
}
```

##### Per-project settings

You can also define these settings on a per-project by creating a `.deprc` file in the main directory of your codebase.
Set the settings above within the `.deprc` file.

This is a great way of using this plugin across many projects with different directory structures.

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

### Reporting an issue

You can get console logs via `View -> Show Console`.

Paste those logs into the body of your issue.

Or ping me [@mrjoelkemp](https://twitter.com/mrjoelkemp)
