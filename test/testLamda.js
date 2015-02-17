var  assert = require('assert'),
     lamda = require('../lib/lamdaApp.js'),
     Promise = require('bluebird');

var  sampleList = [
            {title: 'UX Guide', psnID: 24, page_id: 33, price: 23.90},
            {title: 'Bitcoin', psnID: 48, page_id: 88, price: 29.50}
            ],
     sampleCtx = {};

before(function()  {
    // install built-in modules
    lamda.init();

    // add customized methods (functions)
    lamda.addMethod('data', doData);
    lamda.addMethod('isBargin', doBarginPromised);
    lamda.addMethod('promise', doPromise);
});

describe('JSON-FP programming...', function() {
    it('map and pick', function() {
        // the following program is equivalent to:
        // list.map(function(page) {
        //    return  pick(page, 'title');
        // });
        var  p = {
            map: {pick: 'title'}
        };

        var  result = lamda.apply( sampleCtx, sampleList, p );
        //console.log( JSON.stringify(result, null, 4) );
        assert.equal( result.length, 2, 'still have 2 items');
        assert.equal( result[0].title, 'UX Guide', 'title not match');
        assert(!result[0].psnID, 'psnID should be removed');
    });

    it('test object query', function() {
        // this sample program will find out who is working on the 'jsonfp' project and 
        // is under age 30.
        var  data = [
            {name: 'John', project: 'jsonfp', age: 23},
            {name: 'David', project: 'newsql', age: 42},
            {name: 'Kate', project: 'jsonfp', age: 18}
        ],
        expr = {
            filter: 
                {chain: [
                    {project:
                        {chain: [
                            {'getter': 'project'},
                            {'==': 'jsonfp'}
                        ]},
                     age:
                        {chain: [
                            {'getter': 'age'},
                            {'<': 30}
                        ]}
                    },
                    {'and': ['project', 'age']}
                ]}
        },
        result = lamda.apply( data, expr );
        //console.log( JSON.stringify(result, null, 4) );
        assert.equal(result.length, 2, '2 elements');
        assert.equal(result[0].name, 'John', 'first match is John');
        assert.equal(result[1].name, 'Kate', 'second match is Kate');

        // or do it the other way
        expr = {
            filter: {
                '->': [
                    [
                        {chain: [
                            {'getter': 'project'},
                            {'==': 'jsonfp'}
                        ]},
                        {'->': [
                            {'getter': 'age'},
                            {'<': 30}
                        ]}
                    ],
                    {reduce: 'and'}
                ]
            }
        };
        result = lamda.apply( data, expr );
        //console.log( JSON.stringify(result, null, 4) );
        assert.equal(result.length, 2, '2 elements');
        assert.equal(result[0].name, 'John', 'first match is John');
        assert.equal(result[1].name, 'Kate', 'second match is Kate');
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
                {formula:
                    {
                        var: 'x',
                        expr: ['/Person/query/', 'x']
                    }
                },
                {reduce: {add: '$reduceValue'}}
             ]},
             result = lamda.apply(3, p);
        //console.log('result is: %s', result);
        assert.equal( result, '/Person/query/3', 'x not converted to 3');
    });

    it('if', function()  {
        // The following code will find out which books are selling more than $25
        var  expr = {
                '->': [
                    {map: 
                        {if:
                            [
                                {'->':
                                    [
                                        {getter: 'price'},
                                        {'>': 25}
                                    ]
                                },
                                {getter: 'title'},
                                ''
                            ]
                        }
                    },
                    {compact: null}
                ]
            };

        var  result = lamda.apply(sampleList, expr);
        //console.log('---- result ----\n%s', JSON.stringify(result, null, 4));
        assert.equal(result.length, 1, 'One match');
        assert.equal(result[0], 'Bitcoin', 'Title is Bitcoin');
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
                {formula:
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
        assert.equal( result[0].title, 'UX Guide', 'title not match');
        assert(!result[0].psnID, 'psnID should be removed');
    });
});


describe('Hanlding promise/callback...', function(done) {
    it('Simple promise', function(done) {
        var  p = {promise: 2},
             result = lamda.apply(1, p);

        result.then(function(v) {
            //console.log('result:\n%s', JSON.stringify(result, null, 4));
            assert.equal(v, 3, 'the result is 3');
            done();v
        });
        
    });

    it('Simple promise with array input', function(done) {
        var  p = {map: {promise: 2}},
             result = lamda.apply([1, 2, 3], p);
        result.then(function(v) {
            assert.equal(v[0], 3, 'elem #1 is 3');
            assert.equal(v[1], 4, 'elem #2 is 4');
            assert.equal(v[2], 5, 'elem #3 is 5');
            done();
        });
    });

    it('Simple callback', function(done) {
        var  p = {promise: 2};

        lamda.apply(1, p, function(err, v) {
            assert.equal(v, 3, 'the result is 3');
            done();
        });
    });

    it('Simple callback with array input', function(done) {
        var  p = {map: {promise: 2}};

        lamda.apply([1, 2, 3], p, function(err, v) {
            assert.equal(v[0], 3, 'elem #1 is 3');
            assert.equal(v[1], 4, 'elem #2 is 4');
            assert.equal(v[2], 5, 'elem #3 is 5');
            done();
        });
    });

    it('No blocked callback', function(done) {
        var  p = {max: 3};

        lamda.apply(8, p, function(err, result) {
            assert.equal(result, 8, 'max of 3 and 8 is 8');
            done();
        });
    });

    it('if condition is promised', function(done)  {
        // The following code will find out which books are selling more than $25
        var  expr = {
                '->': [
                    {map: 
                        {if:
                            [
                                {'->':
                                    [
                                        {getter: 'price'},
                                        {isBargin: 25}
                                    ]
                                },
                                {getter: 'title'},
                                ''
                            ]
                        }
                    },
                    {compact: null}
                ]
            };

        var  result = lamda.apply(sampleList, expr);
        result.then(function(books) {
            //console.log('---- result ----\n%s', JSON.stringify(books, null, 4));
            assert.equal(books.length, 1, 'One match');
            assert.equal(books[0], 'UX Guide', 'Title is UX Guide');
            done();
        });
        
        
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


function  doPromise(input, v)  {
    return  new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(input + v);
        }, 20);
    });
};


function  doBarginPromised(input, v)  {
    return  new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(input < v);
        }, 20);
    });
};