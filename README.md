# deep-readdir

[![Build Status](https://travis-ci.org/fedemp/deep-readdir.svg?branch=master)](https://travis-ci.org/fedemp/deep-readdir)

NodeJS module to list files in a directory and its subdirectories (i.e. recursively)

## Install

````bash
$ npm install --save deep-readdir
````

## How to use

`deep-readdir` provides two functions: one that works asynchronous and other that is synchronous (i.e. non-blocking and blocking respectively).

````js
var deepReaddir = require('deep-readdir').deepReaddir; // async
var deepReaddirSync = require('deep-readdir').deepReaddirSync; // sync
````

### async

````typescript
declare function deepReaddir(dir: string, cb: Function, options?: Options): void;
````

For the async version, the first parameter is a `string` reading the path of a directory. The second parameter is the callback that will be called when all operations are finished. The third parameters is an optional object with options. This functions does not return anything.

### sync

````typescript
declare function deepReaddirSync(dir: string, options?: Options): string[];
````

For the sync version, the first parameter is a `string` reading the path of a directory. The second parameter is an optional object with options. This function returns an array of strings, each one being the path of a file.

### options

````typescript
interface Options {
	extension?: string;
	hidden?: boolean;
}
````

The optional `options` parameter support the following properties:

* `extension`: Only list files that match the given extension, e.g. `.txt`.
* `hidden`: If `true`, hidden files will be added. This only works for files that start with `.`.

## License

MIT © [fedemp](https://github.com/fedemp/)
