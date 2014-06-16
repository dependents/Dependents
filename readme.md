### Sublime Dependents

Sublime Text 3 plugin for finding JavaScript modules that depend on the current JavaScript module.

Current scope: AMD and CommonJS applications

### Motivation

When you want to find out which files `require` the module you're looking at, it's annoying as hell to
find the filename of the current file, do a Find All, then sift through the find results to see which
file you want to jump to. **This should be automated.**

### Prerequisite

You need to have Node.js installed and [node-dependents](https://github.com/mrjoelkemp/node-dependents).

`npm install node-dependents`

### Usage

##### Key binding

You need to supply the plugin with a `root` which dictates where to look for dependents.
This value is then sent to [node-dependents](https://github.com/mrjoelkemp/node-dependents).

Add the following to your User defined keyboard bindings: `Preferences` -> `Key Bindings - User`

```javascript
[
  {
    "keys": ["super+alt+up"],
    "command": "dependents",
    "args": {"root": "public/assets/js"}
  }
]

```

Use `cmd + option + up` to trigger finding the dependents.

* If dependents are found, you'll see them in a quick panel (i.e., dropdown).
 * You can select any of the items in the panel to jump to that file
* If no dependents are found a popup will be shown

