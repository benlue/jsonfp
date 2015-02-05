/*!
* JSON-fp
* authors: Ben Lue
* license: GPL 2.0
* Copyright(c) 2015 Gocharm Inc.
*/
var  _ = require('lodash');

var  collections = {},
     jsonfp;

collections.install = function(jfp)  {
    jsonfp = jfp;
	jsonfp.addMethod('filter', {op: doFilter, defOption: true});
    jsonfp.addMethod('find', {op: doFind, defOption: true});
    jsonfp.addMethod('getter', doGetter);
    jsonfp.addMethod('merge', doMerge);
    jsonfp.addMethod('omit', {op: doOmit, defOption: true});
	jsonfp.addMethod('pick', doPick);
	jsonfp.addMethod('pluck', doPluck);
    jsonfp.addMethod('reduce', {op: doReduce, defOption: true});
	jsonfp.addMethod('size', doSize);
	jsonfp.addMethod('where', doWhere);
};

module.exports = collections;

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
    var  ctx = _.clone(this);

    if (_.isString(p))  {
        var  expr = {};
        expr[p] = '$reduceValue';

        if (jsonfp.isExpression(expr))
            p = expr;
        else
            throw  new Error(p + ' is not a known operator.');
    }

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