/*!
* JSON-FP
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


describe('Testing control flow ...', function() {

	it('Infix', function() {
		var  expr = {
				infix: ['$in.x', {add: '$in.y'}]
			 },
			 input = {x: 2, y: 8};

		jsonfp.apply(input, expr).then(function(result) {
			//console.log( result );
			assert.equal(result, 10, '2 + 8 is 10');
		});
	});

	it('Infix error', function()  {
		var  expr = {
				infix: {add: '$in.y'}
			 },
			 input = {x: 2, y: 8};

		jsonfp.apply(input, expr).then(function(result) {
			assert(false, 'shoud not reach here');
		}).
		catch(function(err) {
			//console.log( JSON.stringify(err) );
			assert('We should reach here');
		});
	});
});