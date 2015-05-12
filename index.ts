/// <reference path='typescript-definitions/node.d.ts'/>

'use strict';

interface Options {
	extension?: string;
	hidden?: boolean;
}

interface Promise {
	q: number;
}

import fs = require('fs');
import path = require('path');

function deepReaddir (dir: string, cb: Function, options?: Options): void {

	if (!(cb && typeof cb == 'function')){
		throw new Error('Missing callback argument');
	}

	isDir(dir);

	var result: string[] = [];
	var promises: Promise = { q: 1 }
	async(dir, cb, options, result, promises);
	return;
}

function async(dir: string, cb: Function, options: Options, result: string[], promises: Promise){

	dir = dir.substr(dir.length - 1) !== path.sep ? dir + path.sep : dir;

	fs.readdir(dir, function (err: Error, files: string[]){
		promises.q--;
		if (err) { return; }
		promises.q += files.length;

		if (promises.q < 1) {
			cb(result);
		}

		files.forEach(function(file: string){
			var filepath = dir + file;
			fs.stat(filepath, function(err: Error, stats: fs.Stats){
				promises.q--;
				if (err) { return; }

				if (stats.isDirectory()){
					promises.q++;
					async(filepath, cb, options, result, promises);
				} else {
					// Filters...
					if (options) {
						if (applyFilters(file, options)) {
							result.push(filepath);
						}
					} else {
						result.push(filepath);
					}
				}
				if (promises.q < 1) {
					cb(result);
				}
			});
		});
	});
}

function deepReaddirSync (dir: string, options?: Options): string[] {

	var result: string[] = result || [];
	var contents: string[] = fs.readdirSync(dir);
	dir = dir.substr(dir.length - 1) !== path.sep ? dir + path.sep : dir;

	contents.forEach(function(item: string){
		item = dir + item;
		var stats: fs.Stats = fs.statSync(item);
		if (item !== dir && stats.isDirectory()){
			var recursiveContents: string[] = deepReaddirSync(item, options);
			result = result.concat(recursiveContents);
			return;
		}
		result.push( item );
	});

	return result;

}

function isDir(dir: string):boolean {
	var stats: fs.Stats;
	if ( dir && (typeof dir == 'string') ) {
		try {
			stats = fs.statSync(dir);
		} catch (e) {
			throw e;
		}
		if (!stats.isDirectory()) {
			throw new Error('Node '+dir+' exists but it\'s not a directory');
		}
	} else {
		throw new Error('Missing dir argument');
	}
	return true;
}

function applyFilters(file: string, options: Options): boolean {
	if (options.extension != null && options.extension !== '') {
		if (options.extension[0] != '.') { options.extension = '.' + options.extension; }
		if (options.extension != path.extname(file)) {
			return false;
		}
	}
	if (!options.hidden && file[0] == '.') {
		return false;
	}
	return true;
}

export = {
	deepReaddir: deepReaddir,
	deepReaddirSync: deepReaddirSync
}
