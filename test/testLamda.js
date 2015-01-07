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

describe('Try JSON programming...', function() {
    it('map and pick', function() {
        // the following program is equivalent to:
        // list.map(function(page) {
        //    return  pick(page, 'title');
        // });
        var  p = {
            map: {
                pick: 'title'
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
        var  p = {
            map: {
                merge: {
                    eval: {
                        tagList: {
                            chain: [
                                {
                                    data: {
                                        api: "pageTag/list",
                                        option: {page_id: '$item.page_id'}
                                    }
                                },
                                {take: '$inData.showTag'},
                                {flatten: 'tword'}
                                ]
                        }
                    }
                }
            }
        };

        var  ctx = {inData: {showTag: 2}},
             result = lamda.apply( ctx, sampleList, p );
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
        var p = {
            chain: [
                {
                    map: {
                        merge: {
                            eval: {
                                tagList: {
                                    chain: [
                                        {
                                            data: {
                                                api: 'pageTag/list',
                                                option: {page_id: '$item.page_id'}
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
                {
                    where: {
                        tagList: '$inData.tags'
                    }
                }
            ]
        };

        var  ctx = {inData: {tags: ['API', 'reactive']}},
             result = lamda.apply( ctx, sampleList, p );
        //console.log('---- result ----\n%s', JSON.stringify(result, null, 4));
        assert.equal(result.length, 1, 'only one match');
        assert.equal(result[0].page_id, 33, 'wrong page');

        ctx = {inData: {tags: ['COIMOTION']}},
        result = lamda.apply( ctx, sampleList, p );
        //console.log('---- result ----\n%s', JSON.stringify(result, null, 4));
        assert.equal(result.length, 2, 'has two matches');
    });
});


function  doData(p)  {
    // assuming we'll query the 'pageTag' table to find the tags of a page
    var  pageID = evalVar(this, p.option.page_id.substring(1)),
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


function evalVar(ctx, s)  {
    var  parts = s.split('.'),
         v = ctx;
    for (var i in parts)
        v = v[parts[i]];

    return  v;
};
