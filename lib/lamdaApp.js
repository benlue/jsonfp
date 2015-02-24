/*!
* JSON-fp
* authors: Ben Lue
* license: GPL 2.0
* Copyright(c) 2015 Gocharm Inc.
*/
var  _ = require('lodash'),
     Promise = require('bluebird');

var  coreMethods = {
        '->': {op: doChain},
        chain: {op: doChain},
        convert: {op: doConvert, defOption: true},
        formula: {op: doFormula, defOption: true},
        eval: {op: doEval},
        if: {op: doIf},
        map: {op: doMap, defOption: true}
     },
     knownMethods;

exports.init = function(options)  {
    if (options && options.modules)  {
        // if options given, will force a reset
        knownMethods = _.clone(coreMethods);
        for (var i in options.modules)  {
            var  fpath = util.format('./modules/%s.js', options.modules[i]);
            require(fpath).install(this);
        }
    }
    else  if (!knownMethods)  {
        knownMethods = _.clone(coreMethods);
        require('./modules/arithmetic.js').install(this);
        require('./modules/arrays.js').install(this);
        require('./modules/collections.js').install(this);
        require('./modules/comparators.js').install(this);
    }
};


/*
* Install an external (customized) package to the JSON-FP runtime.
*/
exports.install = function(pkgName, nodeModule)  {
    nodeModule.install( this, pkgName );
};


exports.apply = function(ctx, list, prog, cb) {
    if (!knownMethods)
        exports.init();

    if (arguments.length < 3)  {
        prog = list;
        list = ctx;
        ctx = null;
    }
    else  if (arguments.length === 3)  {
        if (typeof prog === 'function')  {
            cb = prog;
            prog = list;
            list = ctx;
        }
    }

    var  result;
    try  {
        result = checkPromised( evalExpr( ctx || {}, list, prog ) );
        if (cb)  {
            if (result.then)
                result.then(function(data) {
                    cb(null, data);
                }).catch(function(err) {
                    cb(err);
                });
            else
                cb( null, result );
        }
    }
    catch (err)  {
        if (cb)
            cb( err);
        throw err;
    }

    return  result;
};


exports.evaluate = evalExpr;


function  checkPromised(v)  {
    if (_.isArray(v)) {
        for (var i = 0, len = v.length; i < len; i++)  {
            if (v[i].then)  {
                v = Promise.all( v );
                i = len;
            }
        }
    }
    else  if (_.isPlainObject(v))  {
        var  keys = _.keys(v);
        for (var i = 0, len = keys.length; i < len; i++)  {
            if (v[keys[i]].then)  {
                v = Promise.props( v );
                i = len;
            }
        }
    }

    return  v;
};


/**
 * Check to see if the input is a JSON-FP expression
 */
exports.isExpression = function(expr)  {
    if (_.isPlainObject(expr))  {
        var  keys = _.keys(expr);
        if (keys.length === 1)  {
            var  opName = keys[0];
            return  knownMethods[opName] || opName === 'def';
        }
    }
    return  false;
};


exports.addMethod = function(name, f)  {
    if (typeof f === 'function')
        f = {op: f};
    knownMethods[name] = f;
};


exports.removeMethod = function(name)  {
    delete  knownMethods[name];
};


function evalExpr(ctx, input, expr)  {
    if (input === null || input === undefined)
        input = {};
    
    if (input.then)  {
        return  input.then(function(data) {
            return  evalExpr(ctx, data, expr);
        });
    }

    if (_.isArray(expr))  {
        return  checkPromised(_.map(expr, function(elem) {
            //console.log('sub-expression is\n%s', JSON.stringify(elem, null, 4));
            return  evalExpr(ctx, input, elem);
        }));
    }

    else  if (_.isPlainObject(expr))  {
        //console.log('expresson is\n%s', JSON.stringify(expr, null, 4));
        if (expr._input && expr._expr)  {
            input = evalExpr(ctx, input, expr._input);
            expr = expr._expr;
        }

        var  keys = _.keys(expr);
        if (keys.length === 1)  {
            var  opName = keys[0];
            if (opName === 'def')
                // do not evaluate. simply return the option
                //return  bindVar(ctx, input, expr.def);
                return  expr.def;
            else  {
                var  f = knownMethods[opName];
                if (f)  {
                    //console.log('executing [%s]', opName);
                    var  option = expr[opName];
                    if (option === null || option === undefined)
                        option = {};

                    if (opName !== 'chain' && opName !== '->')  {
                        if (option._input && option._expr)  {
                            input = evalExpr(ctx, input, option._input);
                            option = option._expr;
                        }
                        else  {
                            if (f.defOption)  {
                                // skip 'def'
                                if (option.def)
                                    option = option.def;

                                // do variable binding
                                //option = bindVar(ctx, input, option);
                            }
                            else
                                option = evalExpr(ctx, input, option);
                        }
                    }

                    if (option.then)  {
                        return  option.then(function(data) {
                            return  f.op.call(ctx, input, data);
                        });
                    }
                    return  f.op.call(ctx, input, option);
                }
            }
        }

        var  obj = {};
        _.keys(expr).
        map(function(k) {
            if (k[0] === '$')
                ctx[k.substring(1)] = evalExpr(ctx, input, expr[k]);
            else
                obj[k] = evalExpr(ctx, input, expr[k]);
        });
        expr = obj;
    }
    else  if (_.isString(expr))
        expr = evalString(ctx, input, expr);

    return  expr;
};


function  evalString(ctx, input, expr)  {
    if (expr.indexOf('$') >= 0)  {
        //console.log('target expression: %s', expr);
        var  varState = false,
             phrase = '',
             sum = '';

        for (var i = 0, len = expr.length; i < len; i++)  {
            var  c = expr[i];
            if (varState)  {
                if (' /,?!@#%&*()-+<>'.indexOf(c) >= 0)  {
                    //console.log('phrase is: %s', phrase);
                    if (phrase === 'in')
                        sum += input + c;
                    else if (phrase.indexOf('in.') === 0)
                        sum += evalVar(input, phrase.substring(3)) + c;
                    else
                        sum += evalVar(ctx, phrase) + c;
                    phrase = '';
                    varState = false;
                }
                else
                    phrase += c;
            }
            else  {
                if (c === '$')
                    varState = true;
                else
                    sum += c;
            }
        }

        if (varState)  {
            //console.log('**phrase is: %s', phrase);
            var  value;
            if (phrase === 'in')
                value = input;
            else  if (phrase.indexOf('in.') === 0)
                value = evalVar(input, phrase.substring(3));
            else
                value = evalVar(ctx, phrase);

            expr = sum  ?  (sum + value) : value;
        }
        else
            expr = sum;
        //console.log('expr value is ' + expr);
    }
    return  expr;
};


function doChain(input, opArray)  {
    //console.log('chainning input is\n%s', JSON.stringify(input, null, 4));
    var  ctx = this;

    for (var i in opArray)  {
        //console.log('chain program......\n%s', JSON.stringify(opArray[i], null, 4));
        input =  evalExpr( ctx, input, opArray[i] );
        //console.log('chain result......\n%s', JSON.stringify(result, null, 4));
    }

    return  input;
};


function doConvert(input, option)  {
    //console.log('convert input\n%s', JSON.stringify(input, null, 4));
    var  v = option.var,
         vars = [],
         formula = {expr: option.formula.formula.expr, var: vars};

    _.keys(v).map(function(k) {
        vars.push(k);
    })

    var  expr = doFormula(v, formula);
    //console.log('converted expression is\n%s', JSON.stringify(expr, null, 4));
    return  evalExpr( this, input, expr );
};


function doFormula(input, func)  {
    //console.log('convert input\n%s', JSON.stringify(input, null, 4));
    var  v = func.var,
         expr = func.expr;

    if (_.isArray(v))  {
        _.map(v, function(k) {
            expr = substituteVar(k, expr, input[k]);
        });
        return  expr;
    }

    return  substituteVar(v, expr, input);
};


/**
 * Check if property values of 'param' is a JSON-fp program, and
 * resolve it if it's so.
 */
function doEval(input, expr)  {
    //console.log('eval input...\n%s', JSON.stringify(input, null, 4));
    //console.log('eval expr...\n%s', JSON.stringify(expr, null, 4));
    return  evalExpr(this, input, expr);
};


function doIf(input, expr)  {
    if (!_.isArray(expr))
        throw  new Error("The option to an 'if' operator should be an array.");

    if (expr.length < 2)
        throw  new Error("The option should be like [{condition_expr}, {true_expr}");

    var  cond = checkPromised( evalExpr(this, input, expr[0]) );
    if (cond)  {
        if (cond.then)  {
            var  ctx = this;
            return  cond.then(function(c) {
                if (c)
                    return  evalExpr(ctx, input, expr[1]);
                return  expr.length > 2  ?  evalExpr(ctx, input, expr[2]) : input;
            })
        }
        return  evalExpr(this, input, expr[1]);
    }

    return  expr.length > 2  ?  evalExpr(this, input, expr[2]) : input;
};


function doMap(input, p)  {
    var  ctx = this;

    return  checkPromised(_.map(input, function(item) {
        //console.log('map item is\n%s', JSON.stringify(item, null, 4));
        //console.log('program is\n%s', JSON.stringify(p, null, 4));
        return  evalExpr( ctx, item, p );
    }));
};


function evalVar(ctx, s)  {
    //console.log('context is \n%s', JSON.stringify(ctx, null, 4));
    var  parts = s.split('.'),
         v = ctx;
    for (var i in parts)
        v = v[parts[i]];

    //console.log('evaluating [%s] into %s', s, JSON.stringify(v, null, 4));
    return  v;
};


function substituteVar(v, expr, input)  {
    //console.log('converting [%s] to [%s]', v, JSON.stringify(input, null, 4));
    var  nextExpr = expr;
    if (_.isString(expr))
        nextExpr =  expr === v  ?  input : expr;
    else  if (_.isPlainObject(expr))  {
        nextExpr = {};
        _.keys(expr).map(function(k) {
            nextExpr[k] = substituteVar(v, expr[k], input);
        });
    }
    else  if (_.isArray(expr))
        nextExpr =  _.map(expr, function(e) {
            return  substituteVar(v, e, input);
        });

    return  nextExpr;
};
