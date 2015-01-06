/*!
* JSON-fp
* authors: Ben Lue
* license: GPL 2.0
* Copyright(c) 2015 Gocharm Inc.
*/
var  _ = require('lodash');

var  knownMethods = {
    chain: doChain,
    //data: doData,
    difference: doDifference,
    flatten: doFlatten,
    intersection: doIntersection,
    map: doMap,
    merge: doMerge,
    pick: doPick,
    size: doSize,
    take: doTake,
    where: doWhere,
    zipObject: doZipObject
};

exports.apply = function(ctx, list, prog) {
    ctx = ctx || {};
    ctx.list = list;

    return  exeProg( ctx, prog );
};


exports.addMethod = function(name, f)  {
    knownMethods[name] = f;
};


exports.removeMethod = function(name)  {
    delete  knownMethods[name];
};


function exeProg(ctx, p)  {
    var  opName = _.first(_.keys(p), 1).reduce(function(sum, value)  {
        return value;
    });

    //console.log('will be doing [%s] with context:\n%s', opName, JSON.stringify(ctx, null, 4));
    var  f = knownMethods[opName],
         rtn = null;
    if (f)
        rtn = f.call(ctx, p[opName]);
    else
        console.log('Unknown method');

    return  rtn;
};


function doChain(opArray)  {
    //console.log('chainning context is\n%s', JSON.stringify(this, null, 4));
    var  ctx = this,
         result;

    for (var i in opArray)  {
        result = exeProg( ctx, opArray[i] );

        ctx = _.clone(ctx);
        if (_.isArray(result))
            ctx.list = result;
        else
            ctx.item = result;
        //console.log('result......\n%s', JSON.stringify(list, null, 4));
    }

    return  result;
};


function doDifference(diff)  {
    if (_.isString(diff))
        diff = evalObj(this, diff);

    return _.difference(this.list, diff);
};


function  doFlatten(pluck) {
    //console.log('pluck = %s', pluck);
    //console.log('flatten:\n%s', JSON.stringify(this, null, 4));
    return  _.flatten(this.list, pluck);
};


function doIntersection(diff)  {
    if (_.isString(diff))
        diff = evalObj(this, diff);

    return _.intersection(this.list, diff);
};


function doMap(p)  {
    var  ctx = _.clone(this);
    delete  ctx.list;

    return  _.map(this.list, function(item) {
        //console.log('map item is\n%s', JSON.stringify(item, null, 4));
        var  myCtx = _.clone(ctx);
        myCtx.item = item;

        //console.log('program is\n%s', JSON.stringify(p, null, 4));
        return  exeProg( myCtx, p );
    });
};


function doMerge(p) {
    //console.log(JSON.stringify(this.item, null, 4));
    var  d = this.item,
         source = p.source;

    if (_.isPlainObject(source))  {
        var  ctx = this;
        source = _.clone(source);

        _.keys(source).
        map(function(k) {
            var  v = source[k];
            if (_.isPlainObject(v))
                v = exeProg( ctx, v);
            source[k] = v;
        });
    }
    //console.log(JSON.stringify(source, null, 4));
    return  _.merge( d, source );
};


function  doPick(selectors)  {
    return  _.pick(this.item, selectors);
};


function doSize(type)  {
    if (this.list)
        return  type === 'each'  ?  _.map(this.list, function(i) {return _.size(i)}) : _.size(this.list);

    return  _.size(this.item);
}


function doTake(count)  {
    if (_.isString(count))
        count = evalObj(this, count);

    return _.first(this.list, count);
};


function doWhere(prop)  {
    prop = evalObj(this, _.clone(prop));
    //console.log('where prop is\n%s', JSON.stringify(prop, null, 4));

    return _.where(this.list, prop);
};


function doZipObject(params) {
    var  keys = params.keys,
         values = params.values;

    // resolve values if necessary
    if (_.isPlainObject(values))
        values = exeProg( this, values );
    return  _.zipObject( keys, values );
};


function evalObj(ctx, obj)  {
    if (_.isArray(obj))
        _.map(obj, function(i) {
            evalObj(ctx, i);
        });
    else  if (_.isPlainObject(obj))
        _.keys(obj).
        map(function(k) {
            var  v = obj[k];
            if (_.isString(v))  {
                v = v.trim();
                if (v[0] === '$')
                    obj[k] = evalVar(ctx, v.substring(1));
            }
        });
    else  if (_.isString(obj))  {
        obj = obj.trim();
        if (obj[0] === '$')
            obj = evalVar(ctx, obj.substring(1));
    }
    return  obj;
};

function evalVar(ctx, s)  {
    //console.log('context is \n%s', JSON.stringify(ctx, null, 4));
    var  parts = s.split('.'),
         v = ctx;
    for (var i in parts)
        v = v[parts[i]];

    return  v;
}
