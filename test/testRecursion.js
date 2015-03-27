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
});