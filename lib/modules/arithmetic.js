/*!
* JSON-fp
* authors: Ben Lue
* license: GPL 2.0
* Copyright(c) 2015 Gocharm Inc.
*/
var  arithmetic = {};
arithmetic.install = function(jsonfp)  {
	jsonfp.addMethod('add', doAdd);
	jsonfp.addMethod('subtract', doSubtract);
	jsonfp.addMethod('multiply', doMultiply);
	jsonfp.addMethod('divide', doDivide);
	jsonfp.addMethod('min', doMin);
	jsonfp.addMethod('max', doMax);
	jsonfp.addMethod('and', doAnd);
	jsonfp.addMethod('or', doOr);
	jsonfp.addMethod('&', doBitAnd);
	jsonfp.addMethod('|', doBitOr);
	jsonfp.addMethod('^', doBitXor);
};

module.exports = arithmetic;

function  doAdd(input, x)  {
	return  input + x;
};

function  doSubtract(input, x)  {
	return  input - x;
};

function  doMultiply(input, x)  {
	return  input * x;
};

function  doDivide(input, x)  {
	return  input / x;
};

function  doMin(input, x)  {
	return  Math.min(x, input);
};

function  doMax(input, x)  {
	return  Math.max(x, input);
};

function  doAnd(input, x)  {
	//console.log('AND: input:%s, x:%s', input, x);
	var  arrayClaz = Object.prototype.toString.call(x).slice(8, -1);
	if (arrayClaz === 'Array')  {
		var  objClaz = Object.prototype.toString.call(input).slice(8, -1);
		if (objClaz !== 'Object')
			throw  new Error('input to [AND] should be an object when the option is an array');

		// using elements in array 'x' as the key to the input object
		var  result = true;
		for (var i = 0, len = x.length; result && i < len; i++)  {
			result &= input[x[i]];
		}
		return  result;
	}

	return  input && x;
};

function  doOr(input, x)  {
	var  arrayClaz = Object.prototype.toString.call(x).slice(8, -1);
	if (arrayClaz === 'Array')  {
		var  objClaz = Object.prototype.toString.call(input).slice(8, -1);
		if (objClaz !== 'Object')
			throw  new Error('input to [OR] should be an object when the option is an array');
		
		// using elements in array 'x' as the key to the input object
		var  result = false;
		for (var i = 0, len = x.length; !result && i < len; i++)  {
			result |= input[x[i]];
		}
		return  result;
	}

	return  input || x;
};

function  doBitAnd(input, x)  {
	return input & x;
};

function  doBitOr(input, x)  {
	return  input | x;
};

function  doBitXor(input, x)  {
	return  input ^ x;
};