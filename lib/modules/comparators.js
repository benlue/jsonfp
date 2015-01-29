/*!
* JSON-fp
* authors: Ben Lue
* license: GPL 2.0
* Copyright(c) 2015 Gocharm Inc.
*/
var  _ = require('lodash');

var  comparators = {};
comparators.install = function(jsonfp)  {
	jsonfp.addMethod('==', doEqual);
	jsonfp.addMethod('!=', doNotEqual);
	jsonfp.addMethod('>', doGreater);
	jsonfp.addMethod('>=', doGreaterEqual);
	jsonfp.addMethod('<', doLess);
	jsonfp.addMethod('<=', doLessEqual);
};

module.exports = comparators;

function doEqual(a, b)  {
	var  claz = Object.prototype.toString.call(b).slice(8, -1);
	if (claz === 'Object')  {
		return  _.isEqual(a, b);
	}
	else  if (claz === 'Date')  {
		if (Object.prototype.toString.call(a).slice(8, -1) !== 'Date')
			a = new Date(a);
		return  a.getTime() === b.getTime();
	}
	return a == b;
};

function doNotEqual(a, b)  {
	var  claz = Object.prototype.toString.call(b).slice(8, -1);
	if (claz === 'Object')  {
		return  !_.isEqual(a, b);
	}
	else  if (claz === 'Date')  {
		if (Object.prototype.toString.call(a).slice(8, -1) !== 'Date')
			a = new Date(a);
		return  a.getTime() !== b.getTime();
	}

	return a != b;
};

function doGreater(a, b)  {
	if (b instanceof Date)  {
		if (!(a instanceof Date))
			a = new Date(a);
		return  a.getTime() > b.getTime();
	}
	return a > b;
};

function doGreaterEqual(a, b)  {
	if (b instanceof Date)  {
		if (!(a instanceof Date))
			a = new Date(a);
		return  a.getTime() >=b.getTime();
	}
	return a >= b;
};

function doLess(a, b)  {
	if (b instanceof Date)  {
		if (!(a instanceof Date))
			a = new Date(a);
		return  a.getTime() < b.getTime();
	}
	return a < b;
};

function doLessEqual(a, b)  {
	if (b instanceof Date)  {
		if (!(a instanceof Date))
			a = new Date(a);
		return  a.getTime() <= b.getTime();
	}
	return a <= b;
};