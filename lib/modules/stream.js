/*!
* JSON-FP
* authors: Ben Lue
* license: GPL 2.0
* Copyright(c) 2015 Gocharm Inc.
*/
var  _ = require('lodash');

var  jsonfp;

exports.install = function(jfp, pkgName)  {
    jsonfp = jfp;
    pkgName = (pkgName || 'stream') + '/';

	jsonfp.addMethod(pkgName + 'iterator', doIterator);
};


function  doIterator(input, option)  {
    return  {
        _type: 'stream',
        _config:  {
            start: option.start,
            end: option.end,
            inc: option.inc || 1,
            cur: null
        },
        _isSource: function()  {
        	return  true;
        },
        _next: function(valueOnly)  {
            var  v;
            if (this._config.cur)  {
                this._config.cur += this._config.inc;
                v = this._config.cur <= this._config.end  ?  this._config.cur : null;
            }
            else
                v = this._config.cur = this._config.start;
            return  valueOnly  ?  v : (v  ?  toIteratorStream(v) : null);
        },
        _asStream: function(v)  {
            if (v && v.then)
                return  v.then(function(data) {
                    return  toIteratorStream(data);
                });

            return  (v && v._type)  ?  v : toIteratorStream(v);
        }
    };
};


function  toIteratorStream(v)  {
    return  {
        _type: 'stream',
        _isSource: function()  {
        	return  false;
        },
        _next: function(valueOnly)  {
        	if (valueOnly)
        		return  v;
        	
        	if (v)
        		return  v._type  ?  v : toIteratorStream(v);
            return  toIteratorStream(v);
        },
        _asStream: function(v)  {
            if (v && v.then)
                return  v.then(function(data) {
                    return  toIteratorStream(data);
                });

            return  (v && v._type)  ?  v : toIteratorStream(v);
        }
    };
};