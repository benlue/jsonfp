/*!
* JSON-FP
* authors: Ben Lue
* license: GPL 2.0
* Copyright(c) 2015 Gocharm Inc.
*/
var  _ = require('lodash'),
     Promise = require('bluebird');

var  collections = {},
     jsonfp;

collections.install = function(jfp)  {
    jsonfp = jfp;
	jsonfp.addMethod('bucket', {op: doBucket, defOption: true});
    jsonfp.addMethod('clone', {op: doClone, defOption: true});
    jsonfp.addMethod('filter', {op: doFilter, defOption: true});
    jsonfp.addMethod('find', {op: doFind, defOption: true});
    jsonfp.addMethod('getter', doGetter);
    jsonfp.addMethod('merge', doMerge);
    jsonfp.addMethod('omit', {op: doOmit, defOption: true});
	jsonfp.addMethod('pick', doPick);
	jsonfp.addMethod('pluck', doPluck);
    jsonfp.addMethod('reduce', {op: doReduce, defOption: true, streamOk: true});
	jsonfp.addMethod('size', doSize);
	jsonfp.addMethod('where', doWhere);
};

module.exports = collections;

function  doBucket(input, expr)  {
    if (_.isArray(expr))  {
        var  ctx = _.clone(this),
             idx = [];

        for (var k in input)  {
            var  v = input[k],
                 cond = [],
                 isResolved = false;

            for (var i in expr)  {
                if (isResolved)
                    cond.push( false );
                else  {
                    var  e = expr[i];
                    if (_.isArray(e))  e = e[0];

                    var  result = jsonfp.evaluate(ctx, v, e);
                    cond.push( result );
                    if (!result.then)
                        isResolved = result;
                }
            }

            idx.push(
                Promise.all(cond).then(function(cond)  {
                    for (var i in cond)
                        if (cond[i])
                            return  i;

                    return  -1;
                })
            );
        }

        return  Promise.all(idx).then(function(idx) {
            var  bucket = [],
                 bucketCount = expr.length;
            for (var i = 0; i < bucketCount; i++)
                bucket.push( [] );

            for (var k in input)
                bucket[idx[k]].push( input[k] );

            var  result = [];
            for (var i in bucket)  {
                var  e = expr[i];
                if (_.isArray(e) && e.length > 1)  {
                    e = e[1];
                    result.push( jsonfp.evaluate(ctx, bucket[i], e) );
                }
                else
                    result.push( bucket[i] );
            }
            return  Promise.all( result );
        });
    }
    else
        //throw  new Error('Bucket option should be an array');
        throw  {code: 40, name: 'bucket', message: 'Bucket option should be an array'};
};


function doClone(input, expr)  {
    return  input  ?  _.clone(input) : null;
};


function doFilter(input, expr) {
    var  ctx = _.clone(this);
    return  _.filter(input, function(elem) {
        return  jsonfp.evaluate( ctx, elem, expr );
    });
};


function doFind(input, p)  {
    var  ctx = _.clone(this);
    return  _.find(input, function(item) {
        return  jsonfp.evaluate(ctx, item, p);
    });
};


function doGetter(input, expr) {
    //console.log('getter: key is %s, input is\n%s', expr, JSON.stringify(input, null, 4));
    return  input[expr];
};


function doMerge(input, source) {
    //console.log(JSON.stringify(this.item, null, 4));
    return  _.merge( input, source );
};


function doOmit(input, p)  {
    if (jsonfp.isExpression(p))  {
        var  ctx = _.clone(this);
        return  _.omit(input, function(value, key) {
            return  jsonfp.evaluate(ctx, {key: key, value: value}, p);
        });
    }
    
    return  _.omit( input, p );
};


function  doPick(input, selectors)  {
    return  _.pick(input, selectors);
};


function doPluck(input, prop)  {
    return  _.pluck(input, prop);
};


function doReduce(input, p)  {
    //console.log('reduce input is\n%s', JSON.stringify(input, null, 4));
    var  ctx = _.clone(this);

    if (_.isString(p))  {
        var  expr = {};
        expr[p] = '$reduceValue';

        if (jsonfp.isExpression(expr))
            p = expr;
        else
            //throw  new Error(p + ' is not a known operator.');
            throw  {code: 40, name: 'reduce', message: p + ' is not a known operator.'};
    }

    if (input._type === 'stream')  {
        //console.log('reduce value...%d, accumulated: %d', input._next(), input._accu);

        if (input._accu)  {
            ctx.reduceValue = input._accu;
            var  res = jsonfp.evaluate(ctx, input._next(), p);
            if (res.then)
                return  res.then(function(accu) {
                	return accu;
                });
            else
                return  res;
        }
        else
        	return  input._next();
    }
    else
        return  _.reduce(input, function(accu, cur) {
            ctx.reduceValue = cur;
            return  jsonfp.evaluate(ctx, accu, p);
        });
};


function doSize(input, type)  {
    return  type === 'each'  ?  _.map(input, function(i) {return _.size(i)}) : _.size(input);
};


function doWhere(input, prop)  {
    //console.log('where prop is\n%s', JSON.stringify(prop, null, 4));
    return _.where(input, prop);
};