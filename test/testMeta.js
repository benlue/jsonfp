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


describe('Expression formula and metaprogramming...', function() {
    it('Using eval to perform variable substitution', function() {
    	// this defines a expression formula to calculate the average of a certain property
    	var  avgTemplate = {
			formula: {
				var: '@prop',
				expr: {
					'->': [
						[
							{'->': [
								{map: {getter: '@prop'}},
								{reduce: 'add'}
							]},
							{size: null}
						],
						{reduce: 'divide'}
					]
				}
			}
		};

		// now we'll use eval to perform the variable substitution
		var  program = {
			$stat: {
				eval: {
					era: {
						eval: {
							'->': [
								'era',
								avgTemplate
							]
						}
					},
					salary: {
						eval: {
							'->': [
								'salary',
								avgTemplate
							]
						}
					}
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
	 		 result = jsonfp.apply(ctx, pitchers, program);
	 	assert.equal(result.pitchers.length, 1, 'one match');
	 	assert.equal(result.pitchers[0].name, 'Bumgarner', 'who is Bumgarner');
    });

	it('Using convert', function() {
    	// this defines a template expression to calculate the average of a property
    	var  avgTemplate = {
			formula: {
				var: '@prop',
				expr: {
					'->': [
						[
							{'->': [
								{map: {getter: '@prop'}},
								{reduce: 'add'}
							]},
							{size: null}
						],
						{reduce: 'divide'}
					]
				}
			}
		};

		// now we'll use eval to perform the variable substitution
		var  program = {
			$stat: {
				era: {
					convert: {
						var: {'@prop': 'era'},
						formula: avgTemplate
					}
				},
				salary: {
					convert: {
						var: {'@prop': 'salary'},
						formula: avgTemplate
					}
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
	 		 result = jsonfp.apply(ctx, pitchers, program);
	 	assert.equal(result.pitchers.length, 1, 'one match');
	 	assert.equal(result.pitchers[0].name, 'Bumgarner', 'who is Bumgarner');
    });
});