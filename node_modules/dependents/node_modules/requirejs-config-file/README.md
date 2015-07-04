# requirejs-config-file

A small api to read and write your requirejs config file

## installation

```
npm install requirejs-config-file
```

## usage

### require the constructor
```js
var ConfigFile = require('requirejs-config-file').ConfigFile;
```

### read
```js
// Read: reading the config
var configFile = new ConfigFile('path/to/some/requirejs-config.js'));

configFile.read(function(err, config) {
  if (err) throw 'Something went really wrong: '+err.toString();

  console.log(config); // is an object with the found config
});
```

### modify (read and write)
```js
// Modify: reading and writing the config
var configFile = new ConfigFile('path/to/some/requirejs-config.js'));

configFile.read(function(err, config) {
  if (err) throw 'Something went really wrong: '+err.toString();

  config.baseUrl = '/new';

  configFile.write(function(err, config) {
    if (err) throw 'Cannot write the config'+err;
  });
});
```

### create
```js
// CreateExample: creating a new config file
var configFile = new ConfigFile('path/to/new-config.js'));

configFile.createIfNotExists();

configFile.write(function(err, config) {
  if (err) throw 'Cannot write the config'+err;
});
```

### create or modify
```js
// CreateAndModifyExample: reading and writing a maybe not existing config file
var configFile = new ConfigFile('path/to/new-config.js'));

configFile.createIfNotExists();

configFile.read(function(err, config) {
  if (err) throw 'Something went really wrong: '+err.toString();

  config.baseUrl = '/new';

  configFile.write(function(err, config) {
    if (err) throw 'Cannot write the config'+err;
  });
});
```