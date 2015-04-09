var  assert = require('assert'),
     jsonfp = require('../lib/lamdaApp.js');

before(function()  {
    // install built-in modules
    jsonfp.init();
});


describe('Test recursion examples...', function() {

    it('Factorial', function() {
    	var  facExpr = {
				'$expr': {
					def: {
						if: [{'<=': 1},
							1,
							{multiply:
								{'->': [
									{subtract: 1},
									'$expr'
								]}
							}
						]
					}
				},
				factorial: '$expr'
			 };

		var  fac = jsonfp.apply(4, facExpr);
		assert.equal(fac.factorial, 24, '4! = 24');
    });

    it('Fibonacci', function()  {
    	var  fibExpr = {
    			'$expr': {
    				def: {
    					if: [{'<': 2},
    						1,
    						{'->': [
    							[
	    							{'->':
	    								[{subtract: 2}, '$expr']
	    							},
	    							{'->':
	    								[{subtract: 1}, '$expr']
	    							}
    							],
    							{reduce: 'add'}
    						]}
    					]
    				}
    			},
    			fibonacci: '$expr'
    		 };

    	var  fib = jsonfp.apply(6, fibExpr);
		assert.equal(fib.fibonacci, 13, 'fib(6) = 13');
    });

    it('Quicksort', function()  {
    	var  seq = [5, 7, 3, 20, 88, 15, 6, 2, 50];

		var  qsortExpr = {
			'$expr': {
				def: {
					if: [{'->': [{size: null}, {'>': 1}]},
							{'->': [
								{
									'$pivot': {head: null},
									qsort: 
										{'->': [
											[
												{'->': [
													{filter: {'<': '$pivot'}},
													'$expr'
												]},
												{filter: {'==': '$pivot'}},
												{'->': [
													{filter: {'>': '$pivot'}},
													'$expr'
												]}
											],
											{reduce: "add"}
										]}
								},
								{getter: "qsort"}
							]},
							'$in'
						]
				}
			},
			qsort: '$expr'
		};

		var  qsort = jsonfp.apply(seq, qsortExpr).qsort;
		//console.log( JSON.stringify(qsort, null, 4) );
		assert.equal(qsort[0], 2, 'elem #1 is 2');
		assert.equal(qsort[1], 3, 'elem #2 is 3');
		assert.equal(qsort[8], 88, 'elem #9 is 88');
    });

    it("Word count", function()  {
    	var  words = ['json', 'node', 'jumbo', 'functional', 'json', 'node', 'json'];

		var  wcExpr = {
			"->": [
				{map:
					{
						key: '$in',
						count: 1
					}
				},
				{
					"$expr": {
						def: {
							"if": [{"->": [{size: null}, {">": 1}]},
								{
									"->": [
										{
											"$pivot": {head: null},
											mapred: {
												"->": [
													[
														[
															{
																key: "$pivot.key",
																count: {
																	"->": [
																		{filter: 
																			{"->": [
																				{getter: "key"},
																				{"==": "$pivot.key"}
																			]}
																		},
																		{map: {getter: "count"}},
																		{reduce: "add"}
																	]
																}
															}
														],
														{"->": [
															{filter:
																{"->": [
																	{getter: "key"},
																	{"!=": "$pivot.key"}
																]}
															},
															"$expr"
														]}
													],
													{reduce: "add"}
												]
											}
										},
										{"getter": "mapred"}
									]
								},
								"$in"
							]
						}
					},
					wcount: "$expr"
				}
			]
		};

		var  wcount = jsonfp.apply(words, wcExpr).wcount;
		assert.equal(wcount[0].key, 'json', "first word is json");
		assert.equal(wcount[0].count, 3, 'json appeared 3 times');
    });
});