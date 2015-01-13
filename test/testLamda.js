var  assert = require('assert'),
     lamda = require('../lib/lamdaApp.js');

var  sampleList = [
            {title: 'A book', psnID: 24, page_id: 33},
            {title: 'Bit Coin', psnID: 48, page_id: 88}
            ],
     sampleCtx = {};

before(function()  {
    // add customized methods (functions)
    lamda.addMethod('data', doData);
});

describe('JSON-fp programming...', function() {
    it('map and pick', function() {
        // the following program is equivalent to:
        // list.map(function(page) {
        //    return  pick(page, 'title');
        // });
        var  p = {
            map: {
                def: {pick: 'title'}
            }
        };

        var  result = lamda.apply( sampleCtx, sampleList, p );
        //console.log( JSON.stringify(result, null, 4) );
        assert.equal( result.length, 2, 'still have 2 items');
        assert.equal( result[0].title, 'A book', 'title not match');
        assert(!result[0].psnID, 'psnID should be removed');
    });

    it('add tags to each page in a list', function() {
        // the following program is equivalent to:
        // list.map(function(page) {
        //    page.tagList =
        //          api('/pageTag/list', {page_id: page.page_id}).
        //          take( $inData.showTag ).
        //          flatten('tword');
        //    return page;
        // });
        var  p = {map:
                {def:
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
                                {flatten: 'tword'}
                                ]
                            }
                        }
                    }
                }
            };

        // the {take: } expression needs a number.
        // we'll feed the number using the context ('ctx') as shown below.
        var  ctx = {showTag: 2},
             result = lamda.apply( ctx, sampleList, p );

        //console.log( JSON.stringify(result, null, 4) );
        assert.equal(result[0].tagList.length, 2, 'a page has two tags');
        assert.equal(result[0].tagList[0], 'COIMOTION', 'tag is not correct');
        assert.equal(result[1].tagList[0], 'Open Data', 'tag is not correct');
    });

    it('qualify page list with specified tags', function()  {
        // the following program is equivalent to:
        // list.map(function(page) {
        //    page.tagList =
        //          api('/pageTag/list', {page_id: page.page_id}).
        //          flatten('tword');
        //    return page;
        // }).
        // where({tagList: $inData.tags});
        var p = {chain:
            [
                {map:
                    {def:
                        {merge:
                            {tagList:
                                {chain:
                                    [
                                        {
                                            data: {
                                                api: 'pageTag/list',
                                                option: {page_id: '$in.page_id'}
                                            }
                                        },
                                        {
                                            flatten: 'tword'
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {where:
                    {tagList: '$tags'}
                }
            ]
        };

        var  ctx = {tags: ['API', 'reactive']},
             result = lamda.apply( ctx, sampleList, p );
        //console.log('---- result ----\n%s', JSON.stringify(result, null, 4));
        assert.equal(result.length, 1, 'only one match');
        assert.equal(result[0].page_id, 33, 'wrong page');

        ctx = {tags: ['COIMOTION']},
        result = lamda.apply( ctx, sampleList, p );
        //console.log('---- result ----\n%s', JSON.stringify(result, null, 4));
        assert.equal(result.length, 2, 'has two matches');
    });

    it('test reduction', function() {
        var  p = {chain: [
                {convert:
                    {
                        var: 'x',
                        expr: ['/Person/query/', 'x']
                    }
                },
                {reduce:
                    {def:
                        {add: '$accumulator'}
                    }
                }
             ]},
             result = lamda.apply(3, p);
        //console.log('result is: %s', result);
        assert.equal( result, '/Person/query/3', 'x not converted to 3');
    });
});


describe('JSON-fp meta programming...', function() {
    it('convert and evaluate', function() {
        // this example is equivalent to {map: {def: {pick: 'title'}}}
        // except that the actual program is obtained by alpha-conversion.
        // Once the program is derived, we use 'eval' to apply it.
        // The nice thing is that if we change 'expr' in the context variable,
        // we can generate a different program.
        var  p = {eval:
                {convert:
                    {
                        _input: '$expr',
                        _expr: {
                            var: 'e',
                            expr: {map: 'e'}
                        }
                    }
                },
             },
             expr = {def: {pick: 'title'}},
             ctx = {expr: expr},
             result = lamda.apply(ctx, sampleList, p);

        //console.log('result is: %s', JSON.stringify(result, null, 4));
        assert.equal( result.length, 2, 'still have 2 items');
        assert.equal( result[0].title, 'A book', 'title not match');
        assert(!result[0].psnID, 'psnID should be removed');
    });
});


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
