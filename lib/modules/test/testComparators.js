/*!
* JSON-fp
* authors: Ben Lue
* license: GPL 2.0
* Copyright(c) 2015 Gocharm Inc.
*/
var  assert = require('assert'),
     jsonfp = require('../../lamdaApp.js');

before(function()  {
	// comparators is a built-in module
	jsonfp.init();
});


describe.skip('Testing comparators...', function() {
	it('Equal', function() {
    	var  p = {'==': 4};

        var  result = jsonfp.apply( 4, p );
        //console.log( JSON.stringify(result, null, 4) );
        assert(result, 'is equal');
        assert(!jsonfp.apply( 8, p ), 'is true');

        var  y = new Date('1/1/2015');
        p = {'==': y};
        assert(jsonfp.apply('1/1/2015', p), 'the same date');

        p = {'==': {name: 'John', project: 'jsonfp'}};
        result = jsonfp.apply({name: 'John', project: 'jsonfp'}, p);
        assert( result, 'the same object');
    });

    it('Not equal', function() {
    	var  p = {'!=': 4};

        var  result = jsonfp.apply( 4, p );
        //console.log( JSON.stringify(result, null, 4) );
        assert(!result, 'is equal');
        assert(jsonfp.apply( 8, p ), 'is true');

        var  y = new Date('1/1/2015');
        p = {'!=': y};
        assert(!jsonfp.apply('1/1/2015', p), 'the same date');
    });

    it('Greater', function() {
    	var  p = {'>': 4};

        var  result = jsonfp.apply( 4, p );
        //console.log( JSON.stringify(result, null, 4) );
        assert(!result, 'is false');
        assert(jsonfp.apply( 8, p ), 'is true');

        var  y = new Date('1/1/2015');
        p = {'>': y};
        assert(jsonfp.apply('2/1/2015', p), '2/1 is greater than 1/1');
    });

    it('Greater or equal', function() {
    	var  p = {
            '>=': 4
        };

        var  result = jsonfp.apply( 4, p );
        //console.log( JSON.stringify(result, null, 4) );
        assert(result, 'is true');
        assert(jsonfp.apply( 8, p ), 'is true');

        var  y = new Date('1/1/2015');
        p = {'>=': y};
        assert(jsonfp.apply('1/1/2015', p), '1/1 is greater than or equal to 1/1');
    });

    it('Less than', function() {
    	var  p = {
            '<': 4
        };

        var  result = jsonfp.apply( 4, p );
        //console.log( JSON.stringify(result, null, 4) );
        assert(!result, 'is false');
        assert(!jsonfp.apply( 8, p ), 'is false');

        var  y = new Date('1/1/2015');
        p = {'<': y};
        assert(!jsonfp.apply('2/1/2015', p), '2/1 is not less than 1/1');
    });

    it('Less than or equal', function() {
    	var  p = {
            '<=': 4
        };

        var  result = jsonfp.apply( 4, p );
        //console.log( JSON.stringify(result, null, 4) );
        assert(result, 'is true');
        assert(!jsonfp.apply( 8, p ), 'is false');

        var  y = new Date('1/1/2015');
        p = {'<=': y};
        assert(jsonfp.apply('2/1/2014', p), '2014 is less than or equal to 2015');
    });
});