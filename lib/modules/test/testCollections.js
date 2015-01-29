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
	it.skip('filter', function() {
		var  data = [1, 2, 3, 4, 5],
			 p = {filter: {'==': 3}},
			 result = jsonfp.apply( data, p );
		//console.log( JSON.stringify(result, null, 4) );
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

	it.skip('Pluck', function() {
		var  data = [{name: 'John', project: 'coServ'}],
			 p = {pluck: 'name'},
        	 result = jsonfp.apply( data, p );
        //console.log( JSON.stringify(result, null, 4) );
        assert.equal( result.length, 1, 'have 1 item');
        assert.equal( result[0], 'John', 'name is John');
	});
});