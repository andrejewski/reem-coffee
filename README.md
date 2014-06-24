reem-coffee
===

Compile CoffeeScript files to JavaScript files with Reem

## Installation

```bash
npm install reem-coffee # --save for projects
```

## Usage

```javascript
var coffee = require('reem-coffee');
reem.file(coffee([options]));
```

## About

`reem-coffee` is a plugin for [Reem](https://github.com/andrejewski/reem) that integrates CoffeeScript files into builds. The plugin is slightly based on [metalsmith-coffee](https://github.com/joaoafrmartins/metalsmith-coffee), but offers more functionality.

## Features

Not only does this plugin compile CoffeeScript files to JavaScript, it also has support for source maps and in place transformation. The source maps will just work if you set the option `sourceMap` to true. The in-place transformation will overwrite the CoffeeScript file's contents with the new JavaScript; this is by default, but to make seperate CoffeeScript files just set the option `preserveSources` to true.

It is important to note that this plugin does not write to any file directory. It merely adds to and manipulates the source tree, adding JavaScript and source map files and altering the source CoffeeScript if provisioned to do so. This allows later plugins to do minification and all the other file optimizations if you desire to include them. There are also porperties set on all invloved files that link to each other to allow for easier debugging and checks. The `coffeeCompiled` boolean is set to true on the orginal CoffeeScript file after compilation, for instance.

## Options

To configure this plugin, you may pass your `coffee-script` compile options object. And `reem-coffee` includes its own options as well.

`filter Function(file Reem.Item) Boolean`
The filter function takes a Reem Item (list, post, file, page) and returns a Boolean telling this plugin to compile the item if true.

`filter Array[String]`
Provide an array of extensions and the plugin will only compile items with the same extension. The default extensions are `[".coffee", ".litcoffee", ".coffee.md"]`.

`rename Function(file Reem.Item) String`
The rename function takes a Reem Item (list, post, file, page) and returns a String which will be used as the basename for the compiled JavaScript file and source map. The default function returns the basename of the given file.

`preserveSources Boolean`
If set to true, the plugin will make a seperate JavaScript file within the same list of the source CoffeeScript file. Otherwise, the CoffeeScript file is overridden with a new filename/filepath and compiled JavaScript content.

`sourceMap Boolean`
This option is a part of the `coffee-script` compile options. However, if set to true, this plugin will create the V3 source map in the same list as the orginal CoffeeScript file.

## Contributing

If you have an issue or find a bug open an issue and I will see what we can do. If you can fix the bug yourself, by all means send a pull request for consideration.

Until `reem` and `reem-coffee` hit v1, I would like to keep backwards compatibility with the v0.0.1, treating it like v1. When the conditions are met for v1, we can cut away the cruft of v0.
