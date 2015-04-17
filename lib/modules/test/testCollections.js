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

describe('Testing collections...', function() {
	it('filter', function() {
		var  data = [1, 2, 3, 4, 5],
			 p = {filter: {'==': 3}},
			 result = jsonfp.apply( data, p );
		console.log( JSON.stringify(result, null, 4) );
		assert.equal( result.length, 1, 'have 1 item');
        assert.equal( result[0], 3, 'one element with value 3');

        data = [
	        {name: 'John', project: 'jsonfp'},
	        {name: 'David', project: 'newsql'}
        ];

        p = {filter:
        	{chain: [
        		{pick: 'name'},
        		{'==': {name: 'John'}}
        	 ]}
        };

        result = jsonfp.apply( data, p );
        //console.log( JSON.stringify(result, null, 4) );
        assert.equal( result[0].name, 'John', 'name is John');
        assert.equal( result[0].project, 'jsonfp', 'project is jsonfp');
	});

    it('find', function() {
        var  data = [
            {name: 'John', project: 'jsonfp', age: 23},
            {name: 'David', project: 'newsql', age: 42},
            {name: 'Kate', project: 'jsonfp', age: 18}
        ],
        p = {find: {project: 'newsql'}},
        result = jsonfp.apply( data, p );
        //console.log( JSON.stringify(result, null, 4) );
        assert.equal(result.name, 'John', 'Matched person is John');

        p = {find: 
                {chain: [
                    {getter: 'age'},
                    {'>' : 30}
                ]}
            };
        result = jsonfp.apply( data, p );
        //console.log( JSON.stringify(result, null, 4) );
        assert.equal(result.name, 'David', 'David is matched.');
    });

    it('Getter', function() {
        var  data = [
            {name: 'John', project: 'jsonfp', age: 23},
            {name: 'David', project: 'newsql', age: 42},
            {name: 'Kate', project: 'jsonfp', age: 18}
        ],
        p = {filter: 
                {chain: [
                    {project:
                        {chain: [
                                {'getter': 'project'},
                                {'==': 'jsonfp'}
                        ]},
                     age:
                        {chain: [
                            {'getter': 'age'},
                            {'<': 30}
                        ]}
                    },
                    {'and': ['project', 'age']}
                ]}
        },
        result = jsonfp.apply( data, p );
        //console.log( JSON.stringify(result, null, 4) );
        assert.equal(result.length, 2, '2 elements');
        assert.equal(result[0].name, 'John', 'first match is John');
        assert.equal(result[1].name, 'Kate', 'second match is Kate');
    });

    it('omit', function() {
        var  data = {name: 'David', project: 'newsql', age: 42},
             expr = {omit: 'age'},
             result = jsonfp.apply( data, expr );
        //console.log( JSON.stringify(result, null, 4) );
        assert(!result.age, 'age property should be deleted');

        expr = {omit: 
            {chain: [
                {getter: 'key'},
                {'==': 'project'}
            ]}
        };
        result = jsonfp.apply( data, expr );
        //console.log( JSON.stringify(result, null, 4) );
        assert.equal(result.name, 'David', 'name is David');
        assert(!result.project, 'the project property should be deleted');
    });

	it('Pluck', function() {
		var  data = [{name: 'John', project: 'coServ'}],
			 p = {pluck: 'name'},
        	 result = jsonfp.apply( data, p );
        //console.log( JSON.stringify(result, null, 4) );
        assert.equal( result.length, 1, 'have 1 item');
        assert.equal( result[0], 'John', 'name is John');
	});
});