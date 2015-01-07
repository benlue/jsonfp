var  assert = require('assert'),
lamda = require('../lib/lamdaApp.js');

describe('Test build-in operators...', function() {
    it('difference', function() {
        var  list = [1, 2, 3, 4, 5],
             p = {
                difference:  [2, 4]
             };

        var  result = lamda.apply( list, p );
        assert.equal(result.length, 3, 'should have 3 elements');
        //console.log( JSON.stringify(result, null, 4) );

        p.difference = '$inData';
        var  ctx = {inData: [2,4]};
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

         p.flatten = {project: '$inData.project'};
         var  ctx = {inData: {project: 'coServ'}};
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

        var  ctx = {inData: {target: [1, 5]}};
        p.intersection = '$inData.target';
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
