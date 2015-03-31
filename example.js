var  jsonfp = require('./lib/lamdaApp.js');

jsonfp.init();

var  jsquare = {
		'->': [
			{random: null},
			{multiply:
				{clone: null}
			}
		]
	 };
var  jexpr = {
		reduce: {
			add: {
				'->': [
					[jsquare, jsquare],
					{reduce: 'add'},
					{subtract: 1},
					{'<=': 0}
				]
			}
		}
	 },
	 ctx = {};

console.log( jsonfp.apply(ctx, {'stream/iterator': {start: 1, end: 10}}, jexpr) );

jexpr = {
	'->': [
		{
			map: {multiply: {clone: null}}
		},
		{reduce: 'add'}
	]
};

//console.log( jsonfp.apply(ctx, [1, 2, 3], jexpr) );
console.log( jsonfp.apply(ctx, {'stream/iterator': {start: 1, end: 3}}, jexpr) );