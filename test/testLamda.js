var  assert = require('assert'),
     lamda = require('../lib/lamdaApp.js');

var  sampleList = [
            {title: 'A book', psnID: 24, page_id: 33},
            {title: 'Bit Coin', psnID: 48, page_id: 88}
            ],
     sampleCtx = {};

describe('Try JSON programming...', function() {
    it('map and pick', function() {
        var  p1 = {
            map: {
                pick: 'title'
            }
        };

        var  result = lamda.apply( sampleCtx, sampleList, p1 );
        //console.log( JSON.stringify(result, null, 4) );
        assert.equal( result.length, 2, 'still have 2 items');
        assert.equal( result[0].title, 'A book', 'title not match');
        assert(!result[0].psnID, 'psnID should be removed');
    });

    it('add tag to page list', function() {
        var  p = {
            map: {
                merge: {
                    source: {
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

    it('qualify page list with tag', function()  {
        var p = {
            chain: [
                {
                    map: {
                        merge: {
                            source: {
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
