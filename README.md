# deep-readdir

[![Build Status](https://travis-ci.org/fedemp/deep-readdir.svg?branch=master)](https://travis-ci.org/fedemp/deep-readdir)

NodeJS module to list files in a directory and its subdirectories (i.e. recursively)

## Install

````bash
$ npm install --save deep-readdir-extended
````

## How to use

`deep-readdir-extended` provides two functions: one that works asynchronous and other that is synchronous (i.e. non-blocking and blocking respectively).

````js
var deepReaddir = require('deep-readdir-extended').deepReaddir; // async
var deepReaddirSync = require('deep-readdir-extended').deepReaddirSync; // sync
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

For the sync version, the first parameter is a `string` reading the path of a directory. The second parameter is an optional object with options. This function returns an array of object, each one containing the path of a file, the size and ctime.

### options

````typescript
interface Options {
	extension?: string;
	hidden?: boolean;
	fullfilePath?: boolean;
}
````

The optional `options` parameter support the following properties:

* `extension`: Only list files that match the given extension, e.g. `.txt`.
* `hidden`: If `true`, hidden files will be added. This only works for files that start with `.`.
* `fullfilePath`: If `true`, this will return the full relative filePath, otherwise will only return the name of the file.

## License

MIT © [fedemp](https://github.com/fedemp/)
