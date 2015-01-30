/*!
* JSON-fp
* authors: Ben Lue
* license: GPL 2.0
* Copyright(c) 2015 Gocharm Inc.
*/
var  assert = require('assert'),
     jsonfp = require('../../lamdaApp.js');

before(function()  {
	// arithmetic is a built-in module
	jsonfp.init();
});


describe('Testing arithmetic...', function() {
	it('Add', function() {
		var  p = {add: ' world'},
             result = jsonfp.apply('Hello', p);
        assert.equal( result, 'Hello world', 'Hello world');

        p.add = 4;
        assert.equal( jsonfp.apply(4, p), 8, 'result is 8');
	});

	it('Subtract', function() {
		var  p = {subtract: 2};
		assert.equal(jsonfp.apply(4, p), 2, 'result is 2');
	});

	it('Multiply', function() {
		var  p = {multiply: 2};
		assert.equal(jsonfp.apply(4, p), 8, 'result is 8');
	});

	it('Divide', function() {
		var  p = {divide: 2};
		assert.equal(jsonfp.apply(4, p), 2, 'result is 2');
	});

	it('Min', function() {
		var  p = {min: 2};
		assert.equal(jsonfp.apply(4, p), 2, 'result is 2');
	});

	it('Max', function() {
		var  p = {max: 2};
		assert.equal(jsonfp.apply(16, p), 16, 'result is 16');
	});

	it('Logical AND', function() {
		var  p = {and: 2},
			 result = jsonfp.apply(16, p);
		//console.log('result is %s', result);
		assert(result, 'should be true');
		assert(!jsonfp.apply(0, p), 'should be false');

		p.and = false;
		assert(!jsonfp.apply(true, p), 'should be false');
	});

	it('Logical OR', function() {
		var  p = {or: 2},
			 result = jsonfp.apply(16, p);
		//console.log('result is %s', result);
		assert(result, 'should be true');
		assert(jsonfp.apply(0, p), 'should be true');

		p.or = false;
		assert(jsonfp.apply(true, p), 'should be true');
	});
});