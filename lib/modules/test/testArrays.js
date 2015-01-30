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

describe('Testing array operators...', function() {

	it('union', function() {
		var  data = [1, 2, 3],
			 expr = {union: [3, 4, 5]},
			 result = jsonfp.apply( data, expr );
		//console.log(JSON.stringify(result, null, 4));
		assert.equal(result.length, 5, '5 elements');

		data = ['a', 'b', 'c'];
		expr.union = ['b', 'd'];
		result = jsonfp.apply( data, expr );
		//console.log(JSON.stringify(result, null, 4));
		assert.equal(result.length, 4, '4 elements');
	});
});