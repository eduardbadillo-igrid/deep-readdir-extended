/// <reference path='../typescript-definitions/mocha.d.ts' />
/// <reference path='../typescript-definitions/node.d.ts' />
/* jshint mocha:true */
'use strict';
var rdr = require('../index');
var assert = require('assert');
describe('deep-readdir', function () {
    it('should return an array', function () {
        assert(Array.isArray(rdr('test/mocks/onlyfiles/')));
        assert(Array.isArray(rdr('test/mocks/empty/')));
    });
    it('should throw an error if first argument is not a directory', function () {
        assert.throws(rdr);
        assert.throws(function () { rdr('foo'); });
    });
    it('should return a list of files in directory', function () {
        assert.equal(rdr('test/mocks/onlyfiles/').length, 5);
        assert.equal(rdr('test/mocks/onlyfiles').length, 5);
        assert.equal(rdr('test/mocks/subs').length, 6);
    });
    it('should call a callback (if provided) with results', function (done) {
        var promises = 4;
        rdr('test/mocks/onlyfiles/', function (result) {
            promises--;
            assert.equal(result.length, 5);
            if (promises === 0) {
                done();
            }
        });
        rdr('test/mocks/onlyfiles', function (result) {
            promises--;
            assert.equal(result.length, 5);
            if (promises === 0) {
                done();
            }
        });
        rdr('test/mocks/subs', function (result) {
            promises--;
            assert.equal(result.length, 6);
            if (promises === 0) {
                done();
            }
        });
        rdr('test/mocks/empty', function (result) {
            promises--;
            assert(Array.isArray(result));
            if (promises === 0) {
                done();
            }
        });
    });
    it('should accept an optional options object', function (done) {
        rdr('test/mocks/onlyfiles/', function (result) {
            assert(Array.isArray(result));
            done();
        }, {});
    });
    it('should allow filtering by extension', function (done) {
        var promises = 3;
        rdr('test/mocks/extensions/', function (result) {
            promises--;
            assert(Array.isArray(result));
            assert.equal(result.length, 2);
            if (promises === 0) {
                done();
            }
        }, { extension: 'html' });
        rdr('test/mocks/extensions/', function (result) {
            promises--;
            assert(Array.isArray(result));
            assert.equal(result.length, 3);
            if (promises === 0) {
                done();
            }
        }, { extension: '.txt' });
        rdr('test/mocks/extensions/', function (result) {
            promises--;
            assert(Array.isArray(result));
            assert.equal(result.length, 6);
            if (promises === 0) {
                done();
            }
        }, { extension: '' });
    });
    it('should allow filtering hidden files', function (done) {
        var promises = 3;
        rdr('test/mocks/hidden/', function (result) {
            promises--;
            assert(Array.isArray(result));
            assert.equal(result.length, 4);
            if (promises === 0) {
                done();
            }
        }, { hidden: true });
        rdr('test/mocks/hidden/', function (result) {
            promises--;
            assert(Array.isArray(result));
            assert.equal(result.length, 1);
            if (promises === 0) {
                done();
            }
        }, { hidden: false });
        rdr('test/mocks/hidden/', function (result) {
            promises--;
            assert(Array.isArray(result));
            assert.equal(result.length, 1);
            if (promises === 0) {
                done();
            }
        }, {});
    });
});
