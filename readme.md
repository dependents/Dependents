Sublime-Dependent
---

**Work In Progress**

Sublime Text 3 plugin for jumping to the file(s) that depend(s) on the current file.

Current scope: AMD and CommonJS applications

When you want to find out which files `require` the module you're looking at, it's annoying as hell to
find the filename of the current file, do a Find All, then sift through the find results to see which
file you want to jump to. **This should be automated.**

### Usage

Use `cmd + option + up` to trigger "Go to dependent"

### Possible implementations:

- Could trigger a Find all search behind the scenes
  - Pull up all files that include/use the current file.
  - use the filename?
- Could generate a dependency list for all JS files in the top-level directory
  - Maintain a hash of files to dependents (a file/key and a list of files that require/include the key)

If there are multiple files, show a dropdown list and let the user choose which dependent to jump to.

- Similar to "Go to Definition" functionality

Could this also be used for jumping to the call sites of a given function?

- would need to know what the cursor is pointing to when the jump command is issued. Might be confusing.
- could also be another key binding.
