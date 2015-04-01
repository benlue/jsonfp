var  jsonfp = require('./lib/lamdaApp.js');

jsonfp.init();
jsonfp.addMethod('data', doData);

var  sampleList = [
       {title: 'UX Guide', psnID: 24, page_id: 33, price: 23.90},
       {title: 'Bitcoin', psnID: 48, page_id: 88, price: 29.50}
     ];

var  p = {map:
			{merge:
			    {tagList:
			        {chain: [
			            {
			                data: {
			                    api: "pageTag/list",
			                    option: {page_id: '$in.page_id'}
			                }
			            },
			            {take: '$showTag'},
			            {map: {getter: 'tword'}}
			            ]
			        }
			    }
			}
		 };
/*
var  p = {
		chain: [
            {
                data: {
                    api: "pageTag/list",
                    option: {page_id: '$in.page_id'}
                }
            },
            {take: '$showTag'},
            {map: {getter: 'tword'}}
	    ]
	 };
*/
// the {take: } expression needs a number.
// we'll feed the number using the context ('ctx') as shown below.
var  ctx = {showTag: 2},
	 result = jsonfp.apply( ctx, sampleList, p );

console.log( JSON.stringify(result, null, 4) );

function  doData(input, p)  {
    // assuming we'll query the 'pageTag' table to find the tags of a page
    //console.log('data option is\n%s', JSON.stringify(p, null, 4));
    var  pageID = p.option.page_id,
         tagList;

    if (pageID === 33)
        tagList = [
            {tag_id: 1, tword: 'COIMOTION'},
            {tag_id: 2, tword: 'API'},
            {tag_id: 3, tword: 'reactive'}
            ];
    else
        tagList = [
            {tag_id: 4, tword: 'Open Data'},
            {tag_id: 5, tword: 'Cloud'},
            {tag_id: 1, tword: 'COIMOTION'}
            ];

    return  tagList;
};

/*
var  expr = {
		'->': [
	    	{'stream/iterator': {start: 1, end: 100}},
	    	{reduce: 'add'}
	    ]
	 };

console.log('1 adds to 100 is ' + jsonfp.apply(null, expr));

var  squareExpr = {
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
									[squareExpr, squareExpr],
									{reduce: 'add'},
									{'<=': 1}
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
var  pi = jsonfp.apply({}, 1000, jexpr);
console.log( pi * 4  );
*/