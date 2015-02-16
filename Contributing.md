Contributing to Dependents
---

Thanks for being interested in contributing.

1. [Motivation for the tool](#motivation)
2. [Architecture](#architecture)
3. [The Sublime Text Plugin](#the-sublime-text-plugin)
  - [Commands](#command-files)
  - [Libs](#lib-files)
  - [Vendors](#vendor-files)
  - [Tests](#tests)
4. [The Backend](#the-backend-node-tools)
  - [node-dependents](#node-dependents)
  - [node-taxicab](#node-taxicab)
5. [Release Strategy](#release-strategy)
6. [PR Guidelines](#pr-guidelines)
7. [Non-code Contributions](#non-code-contributions)

### Motivation
I created Dependents out of frustration. I noticed major inefficiencies in my workflow when trying to navigate and learn a large codebase.

The goal for Dependents and its future features is to allow for fast and effective navigation about front-end codebases. This is achieved by letting you find and understand what you’re looking for with little to no downtime.

**Future goals:**

I believe that Dependents could bring IDE-like functionality to Sublime Text. My own frustrations with how long it takes to piece together complex inheritance trees, understand pub/sub connections, and holistically grasping dependency trees have spawned a few ideas that I plan on implementing.

If you have feature ideas along these lines, please file an issue.

If you enjoy using the plugin, hearing about it always makes the hard work worthwhile. [Feel free to reach out](https://twitter.com/mrjoelkemp).

### Architecture

Dependents is based on two primary layers: the Sublime Text client and the backend, nodejs-based modules.

This Sublime Text plugin is an intentionally dumb binding between the editor and the backend tools.

The bulk of the logic from the plugin resides in the node tools: [node-dependents](https://github.com/mrjoelkemp/node-dependents),
[node-taxicab](https://github.com/mrjoelkemp/node-taxicab), and others as more features are built. This means that the features
of the plugin could be ported to different editors fairly easily.

#### The Sublime Text Plugin

Sublime Text plugins are written in Python since the Sublime Text Api is python-based.

To bind to the node tools, there are several key files:

* node_bridge.py: A cross-platform way of shelling out to node commands and collecting/decoding the output
* node_dependents.py: A set of bindings specifically for node-dependents functionality
* node_taxicab.py: A set of bindings for node-taxicab functionality

##### Command files

* Dependents.py: The logic for the "Find Dependents" command
* JumpToDependents.py: The logic for the "Jump to Dependents" command
* FindDriver.py: The logic for the "Find relevant app entry points" command

##### Lib files

Common helpers shared across the commands are placed in the `lib/` directory.

All of the helpers have tests in `tests/lib`.

##### Vendor files

Any 3rd party libraries are included in `vendor`. The main vendor lib used
is Mixpanel for tracking errors and the frequency of command usage.

##### Tests

The test suite resides in `tests` and is still being backfilled. Testing
Sublime Text plugins is still the wild west, so it's a work in progress.

Nose and Mock are used.

You can run the test suite by installing the `requirements-dev` using pip
then running `nosetests` or `npm test`.

Any PR contributions must have tests.

### The backend node tools

As stated, the backend does the heavy lifting. Each backend tool does one thing well.

Each tool is integrated into sublime-dependents by creating a Python script
like node_dependents.py that shells out to the binary of the given tool.

The node-based tools are then added to the package.json file for tracking,
not so much for npm installation.

##### node-dependents

[node-dependents](https://github.com/mrjoelkemp/node-dependents) is used for finding the dependents of a given file across
all files in a directory. This supports JS, Sass, and any future languages.

New languages are supported by adding detectives to [node-precinct](https://github.com/mrjoelkemp/node-precinct).
Precinct is a detective factory that takes in the content of a file and
returns a list of dependencies for that file.

PRs or feature requests for new languages are welcome.

##### node-taxicab

[node-taxicab](https://github.com/mrjoelkemp/node-taxicab) is used for finding drivers
(i.e., relevant entry points for a given file).

### Release Strategy

After a PR has been made, a `changelog/` entry is drafted, the changelog
entry is added to `messages.json` and a release/tag is cut.

After a tag is made, the new code will make it to Package Control within the hour.

Package Control visits all plugins hourly and pulls new tags.

### PR Guidelines

Try to replicate the existing style, though I'd welcome changes to make
the code more idiomatic to the Python language.

A contribution must have tests.

### Non-code contributions

If you'd like to help but don't feel comfortable with Python or JavaScript,
you can contribute by doing any of the following:

* Spreading the word about the plugin to the JS and Sass communities
* Suggesting features
* Filing bug reports
* Writing about the tool
* Screencasts for getting started

Any and all contributions are appreciated.

