# just-parse [![npm](http://img.shields.io/npm/v/just-parse.svg)](https://npmjs.org/package/just-parse) [![npm](http://img.shields.io/npm/dm/just-parse.svg)](https://npmjs.org/package/just-parse)

> Enough configuration, just parse the goddamn file

This is a pre-defined configuration of the Acorn parse for es6 with a potential two-pass parse:
an initial, strict parse, followed by a loose parse if the strict parse fails.

`npm install just-parse`

Making this a module allowed for reuse across many projects and isolating the parser upgrade path and configuration
to a single location.