### Dependents

> Sublime Text 3 plugin for navigating Front-End (JS/Sass) codebases

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
 - [Find dependents](#find-the-dependents-of-the-current-module)
 - [Jump to dependency](#jump-to-a-dependency)
 - [Open all dependents](#open-all-dependents)
 - [Find relevant app entry points](#find-relevant-app-entry-points)
4. [Configuring Settings](#configuring-settings)
 - [Default Key Bindings](#default-key-bindings)
 - [Custom Key Bindings](#custom-key-bindings)
5. [Troubleshooting](#troubleshooting)
6. [Old Issues](#old-issues)
7. [Reporting an Issue](#reporting-an-issue)

### Features:

* Find dependents: files that immediately depend/require/import the current JavaScript/Sass file.
* Open all dependents
* Jump to a dependency: quickly jump to a file that the current file imports/requires
* Find relevant app entry points that depend on the current file
* Open all relevant app entry points for the current file

Currently supporting: AMD, CommonJS, ES6, and Sass codebases.

### Installation

Install `Dependents` via Package Control.

Don't see it? Try reinstalling Package Control. Altenatively, add the repository and install it:

1. Package Control -> Add Repository
2. Enter `https://github.com/mrjoelkemp/sublime-dependents`
3. Package Control -> Install Package
4. Choose sublime-dependents

If it doesn't work, please file an issue.

### Usage

#### Find the dependents of the current module

`CMD + Option + Up arrow`, to trigger finding the dependents.

* If dependents are found, you'll see them in a dropdown.
 * You can select any of the items in the panel to jump to that file
 * If there's only one dependent, you'll be taken to that dependent file directly.
* If no dependents are found a popup will be shown

#### Jump to a dependency

1. Within a file, place your cursor over the dependency path you want to go to
2. Press `CMD + Option + Right arrow` or `CMD + Option + Click` to jump to that file
 - If a dependency is aliased, you'll need to supply the path to your requirejs configuration

#### Open all dependents

1. Within a file, right click to open up a menu
2. Click on `Dependents -> Open all dependents` to open all dependent files in the editor

#### Find relevant app entry points

1. Within a file, right click to open the context menu
2. Click on `Dependents -> Find relevant app entry points`

### Configuring settings

* `root`: the location where your JS files reside.
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

You can define these settings on a per-project basis by creating
a `.deprc` file in the main directory of your codebase.

Configure the settings above within the `.deprc` file by adding:

```js
{
  "root": "public/assets/js",
  "config": "public/assets/js/config.js",  # Optional
  "sass_root": "public/assets/sass",       # Optional
  "exclude": ['jquery.js', 'require.js'],  # Optional
  "build_config": "public/assets/js/build.json", # Optional
  "node_path": "/my/node/install/folder"   # Optional
}
```

Alternatively, you can specify the settings by going to

`Preferences -> Package Settings -> Dependents -> Settings - User`

and adding your configuration.

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
    "command": "jump_to_dependency",
  }
]
```

* You won't need the opening and closing square brackets `[]` if you have pre-existing key bindings
* For bindings for Finding relevant app entry points, the command is `find_driver`.

### Troubleshooting

If you're having trouble using Dependents, please check your console for errors: `View -> Show Console`

* File an issue with an error message

### Reporting an issue

You can get console logs via `View -> Show Console`.

Paste those logs into the body of your issue.

Or ping me [@mrjoelkemp](https://twitter.com/mrjoelkemp)
