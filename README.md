# deep-readdir

NodeJS module to list files in a directory and its subdirectories (i.e. recursively)

## Install

````bash
$ npm install --save deep-readdir
````

## How to use

First you must require it

````js
var deepReaddir = require('deep-readdir');
````

When you invoke it, you have two options: synchronously and asynchronously. In both methods, the first parameter must be a string, reading the name of the directory. The second optional parameter is a callback which will receive an array listing the files. If you don't define the callback, `deepReaddir` will return the resulting array. In other words...

````typescript
declare function deepReaddir(dir: string, cb: Function): void;
declare function deepReaddir(dir: string): string[];

var files:string[] = deepReaddir('directory'); // Blocking

deepReaddir('directory', function(files: string[]) { ... }); // Non-blocking
````

## License

MIT © [fedemp](https://github.com/fedemp/)
