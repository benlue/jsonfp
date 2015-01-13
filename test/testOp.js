var  assert = require('assert'),
     lamda = require('../lib/lamdaApp.js');

describe('Test build-in operators...', function() {
    it('convert', function() {
        // alpha-conversion
        // case 1: expression is just a variable
        var  p = {convert:
                {
                    var: 'e',
                    expr: 'e'
                }
             };

        var  result = lamda.apply( 'Hello', p );
        assert.equal( result, 'Hello', 'it should become "Hello"');

        // case 2: expression is an object
        p = {convert:
            {
                var: 'e',
                expr: {map: 'e'}
            }
        };
        result = lamda.apply( {def: {pick: 'name'}}, p );
        assert.equal(result[0].def.pick, 'name', 'pick names');

        // case 3: expression is an array
        p = {convert:
            {
                var: 'e',
                expr: [123, 'e', 'xyz', 'e']
            }
        };
        result = lamda.apply( 'Hello', p );
        assert.equal(result[1], 'Hello', 'elem #1 is hello');
        assert.equal(result[3], 'Hello', 'elem #3 is hello');
    });

    it('difference', function() {
        var  list = [1, 2, 3, 4, 5],
             p = {
                difference:  [2, 4]
             };

        var  result = lamda.apply( list, p );
        assert.equal(result.length, 3, 'should have 3 elements');
        //console.log( JSON.stringify(result, null, 4) );

        p.difference = '$diffAry';
        var  ctx = {diffAry: [2,4]};
        result = lamda.apply( ctx, list, p );
        assert.equal(result.length, 3, 'should have 3 elements');
        //console.log( JSON.stringify(result, null, 4) );
    });

    it('flatten', function() {
        var  list = [
                {name: 'John', project: 'coServ'},
                {name: 'David', project: 'react'}
             ],
             p = {
                 flatten: {project: 'coServ'}
             };

         var  result = lamda.apply( list, p );
         assert(result[0], 'should be true');
         assert(!result[1], 'should be false');
         //console.log( JSON.stringify(result, null, 4) );

         p.flatten = {project: '$project'};
         var  ctx = {project: 'coServ'};
         result = lamda.apply( ctx, list, p );
         assert(result[0], 'should be true');
         assert(!result[1], 'should be false');
    });

    it('intersection', function() {
        var  list = [1, 2, 3, 4, 5],
             p = {intersection: [1, 5]};

        var  result = lamda.apply( list, p );
        assert.equal(result.length, 2, 'should have 2 elements');
        //console.log( JSON.stringify(result, null, 4) );

        var  ctx = {target: [1, 5]};
        p.intersection = '$target';
        result = lamda.apply( ctx, list, p );
        assert.equal(result.length, 2, 'should have 2 elements');
    });

    it('merge', function() {
        var  list = [
                {name: 'John'},
                {name: 'Kate'}],
             p = {merge: [{project: 'coServ'}, {project: 'JSON-fp'}]};
        var  result = lamda.apply( list, p );
        assert.equal(result[0].project, 'coServ', 'contribute to the coServ proj');
        assert.equal(result[1].project, 'JSON-fp', 'contribute to the JSON-fp proj');
        //console.log( JSON.stringify(result, null, 4) );
    });

    it('pluck', function() {
        var  list = [
                {name: 'John', project: 'coServ'},
                {name: 'Kate', project: 'JSON-fp'}],
             p = {pluck: 'name'};
        var  result = lamda.apply( list, p );
        //console.log( JSON.stringify(result, null, 4) );
        assert.equal( result[0], 'John', 'first person is John');
        assert.equal( result[1], 'Kate', 'second person is Kate');

        var  ctx = {name: 'name'};
        p.pluck = '$name';

        result = lamda.apply( ctx, list, p );
        //console.log( JSON.stringify(result, null, 4) );
        assert.equal( result[0], 'John', 'first person is John');
        assert.equal( result[1], 'Kate', 'second person is Kate');
    });

    it('where', function() {
        var  list = [
                {name: 'John', project: 'coServ'},
                {name: 'Kate', project: 'JSON-fp'}],
             p = {where: {project: 'coServ'}};
         var  result = lamda.apply( list, p );
         assert.equal(result.length, 1, 'should have one element');
         //console.log( JSON.stringify(result, null, 4) );
    });

    it('zipObject', function() {
        var  list = ['name', 'project'],
             p = {zipObject: ['John', 'coServ']};

        var  result = lamda.apply( list, p );
        assert.equal(result.name, 'John');
        assert.equal(result.project, 'coServ');
        //console.log( JSON.stringify(result, null, 4) );

        list = ['intersection'];
        p.zipObject = [[1, 5]];
        var p2 = lamda.apply( list, p );

        var  nlist = [1, 3, 5];
        result = lamda.apply(nlist, p2);
        assert.equal(result.length, 2, 'has two elements: 1 & 5');
        //console.log( JSON.stringify(result, null, 4) );
    });
});
