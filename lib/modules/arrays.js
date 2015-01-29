/*!
* JSON-fp
* authors: Ben Lue
* license: GPL 2.0
* Copyright(c) 2015 Gocharm Inc.
*/
var  _ = require('lodash');

var  arrays = {},
     jsonfp;

arrays.install = function(jfp)  {
    jsonfp = jfp;
	jsonfp.addMethod('difference', doDifference);
    jsonfp.addMethod('flatten', doFlatten);
    jsonfp.addMethod('intersection', doIntersection);
	jsonfp.addMethod('take', doTake);
    jsonfp.addMethod('union', doUnion);
	jsonfp.addMethod('zipObject', doZipObject);
};

module.exports = arrays;

function doDifference(input, diff)  {
    return _.difference(input, diff);
};


function  doFlatten(input, pluck) {
    return  _.flatten(input, pluck);
};


function doIntersection(input, another)  {
    return _.intersection(input, another);
};


function doTake(input, count)  {
    return  _.first(input, count);
};


function doUnion(input, another)  {
    return _.union(input, another);
};


function doZipObject(input, params) {
    return  _.zipObject(input, params);
};