/// <reference path='../typescript-definitions/mocha.d.ts' />
/// <reference path='../typescript-definitions/node.d.ts' />
/* jshint mocha:true */

'use strict';

import rdr = require('../index');
import assert = require('assert');

describe('deep-readdir', function(){
	it('should return an array', function(){
		assert( Array.isArray( rdr('test/mocks/onlyfiles/') ) );
        assert(Array.isArray(rdr('test/mocks/empty/')));
        assert.equal(rdr('test/mocks/empty/').length, 0);

	});

	it('should throw an error if first argument is not a directory', function(){
		assert.throws ( rdr );
		assert.throws ( function(){ rdr('foo') } );
	});

	it('should return a list of files in directory', function(){
		assert.equal(rdr('test/mocks/onlyfiles/').length, 5);
		assert.equal(rdr('test/mocks/onlyfiles').length, 5);
		assert.equal(rdr('test/mocks/subs').length, 6);
	});

	it('should call a callback (if provided) with results', function(done){
		var promises = 4;

		rdr('test/mocks/onlyfiles/', function(result){
			promises--;
			assert.equal(result.length, 5);
			if (promises === 0) {
				done();
			}
		});

		rdr('test/mocks/onlyfiles', function(result){
			promises--;
			assert.equal(result.length, 5);
			if (promises === 0) {
				done();
			}
		});

		rdr('test/mocks/subs', function(result){
			promises--;
			assert.equal(result.length, 6);
			if (promises === 0) {
				done();
			}
		});

		rdr('test/mocks/empty', function(result){
			promises--;
			assert.equal(result.length, 0);
			if (promises === 0) {
				done();
			}
		});
	});
});
