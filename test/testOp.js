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
});
