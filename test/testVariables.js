var  assert = require('assert'),
     jsonfp = require('../lib/lamdaApp.js');

var  pitchers = [
	{name: 'Ventura', era: 3.2, salary: 500500},
	{name: 'Price', era: 3.26, salary: 19750000},
	{name: 'Kershaw', era: 1.77, salary: 32517428},
	{name: 'Gray', era: 3.08, salary: 505000},
	{name: 'Liriano', era: 3.38, salary: 11666666},
	{name: 'Hammel', era: 3.47, salary: 23500000},
	{name: 'Lester', era: 2.46, salary: 20000000},
	{name: 'Bumgarner', era: 2.98, salary: 6950000},
	{name: 'Chen', era: 3.54, salary: 4750000},
	{name: 'Norris', era: 3.65, salary: 8800000}
];

before(function()  {
    // install built-in modules
    jsonfp.init();
});

describe('JSON-FP variables...', function() {
    it('Using the context variable as a storage', function() {
    	var  expr = {
				$stat: {
					era: {
						'->': [
							[
								{'->': [
									{map: {getter: 'era'}},
									{reduce: 'add'}
								]},
								{size: null}
							],
							{reduce: 'divide'}
						]
					},
					salary: {
						'->': [
							[
								{'->': [
									{map: {getter: 'salary'}},
									{reduce: 'add'}
								]},
								{size: null}
							],
							{reduce: 'divide'}
						]
					}
				},
				pitchers: {
					filter: {
						'->': [
							[
								{'->': [
									{getter: 'era'},
									{'<': '$stat.era'}
								]},
								{'->': [
									{getter: 'salary'},
									{'<': '$stat.salary'}
								]}
							],
							{reduce: 'and'}
						]
					}
				}
			};
		var  ctx = {},
	 		 result = jsonfp.apply(ctx, pitchers, expr);

	 	assert.equal(result.pitchers.length, 1, 'One pitcher matches');
	 	assert.equal(result.pitchers[0].name, 'Bumgarner', 'who is bumgarner');
	 	assert(ctx.stat.era, 'the average era');
    });

	it('variable reference', function() {
		var  input = {
			name: 'David',
			hobby: 'meditation'
		};

		var  expr = {
			eval: {
				$name: {getter: 'name'},
				$hobby: {getter: 'hobby'},
				response: {
					_input: ['$name', ' likes ', '$hobby'],
					_expr: {reduce: 'add'}
				}
			}
		};

		var  result = jsonfp.apply(input, expr);
		//console.log( JSON.stringify(result, null, 2) );
		assert.equal(result.response, 'David likes meditation', 'wrong sentence');
	});
});