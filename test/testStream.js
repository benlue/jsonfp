var  assert = require('assert'),
     jsonfp = require('../lib/lamdaApp.js');

before(function()  {
    // install built-in modules
    jsonfp.init();
});

describe('Test various streams', function() {
	
    it('Using iterator streams to calculate PI', function() {
    	var  jsquare = {
    			'->': [
    				{random: null},
    				{multiply:
    					{clone: null}
    				}
    			]
    		 };
    	var  jexpr = {
    			'->': [
    				[
    					{'->': [// input to this chain is an iterator stream
    					       	{'stream/iterator': {start: 1, end: '$in'}},
    							{'->': [
    							    {
    							    	map: {
    							    		'->': [
    												[jsquare, jsquare],
    												{reduce: 'add'},
    												{subtract: 1},
    												{'<=': 0}
    											]
    							    	}
    							    },
    							    {reduce: 'add'}
    							]}
    					]},
    					'$in'
    				],
    				{reduce: 'divide'}
    			]
    		 },
    		 ctx = {};

    	// iterate 2000 times
    	var  pi = jsonfp.apply(ctx, 2000, jexpr) * 4,
    		 isOk = pi > 3 && pi < 3.3;
    	assert(isOk, 'not a reasonable PI estimate');
    });
});
