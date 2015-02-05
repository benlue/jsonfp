JSON-FP
=======

In a decentralized computing environment, it's a better practice to pass programming codes to various machines to execute (and then gather the results) when the application is dealing with huge amount of data. However, how can machines of various configurations understand each other? Also, the "moving code, least moving data" policy may work better with functional programming than imperative programming.

Those questions/issues lead to the idea of doing functional programming in JSON. If programs can be coded in JSON, they can be easily shipped around and understood by machines of vaious settings. Combining JSON and functional programming also makes security issues easier to track or manage.

JSON-FP is part of an attempt to make data freely and easily accessed, distributed, annotated, meshed, even re-emerged with new values. To achieve that, it's important to be able to ship codes to where data reside, and that's what JSON-FP is trying to achieve.
    
## What's new

+ The built-in operators have grown from 10+ to more than 30 operators in the recent release (0.0.6).

+ Developers have an option to use either promise or callback to deal with asynchronous calls (0.0.7). 

+ The **chain** operator is frequently used in a JSON-FP program. To make it more intuitive and readable, you can now use '->' in place of 'chain'.

For details about what's new in the current release, please check the [release note](https://github.com/benlue/jsonfp/blob/master/ReleaseNote.md).

## Install

    npm install jsonfp

## Contents

+ [Getting started](#started)
  + [Run programs](#run)
  + [Promise or callback](#proCb)
+ [JSON-FP expression](#format)
  + [Expression input](#input)
  + [Evaluation](#evaluation)
  + [Variables](#variables)
  + [Operators](#operators)
  + [API](#api)
    + [jsonfp.init()](#jfpInit)
    + [jsonfp.apply()](#jfpApply)
    + [jsonfp.isExpression()](#isExp)
    + [jsonfp.addMethod()](#jfpAddMethod)
    + [jsonfp.removeMethod()](#jfpRemoveMethod)
+ [Metaprogramming](#meta)

<a name="started"></a>
## Getting started
If you really like to dive in, you can check out the [example project](https://github.com/benlue/jsonfp-examples). In addition to that, test files under the _test_ directory is also a good place to start:

+ **[testLamda.js](https://github.com/benlue/jsonfp/blob/master/test/testLamda.js)**: test cases of real application scenarios. Alpha-conversion and meta programming test cases can also be found here.

+ **[testOp.js](https://github.com/benlue/jsonfp/blob/master/test/testOp.js)**: unit tests for operators.

+ **[testSyntax](https://github.com/benlue/jsonfp/blob/master/test/testSyntax.js).js**: how variables, objects and arrays are evaluated.

<a name="run"></a>
### Run programs
Below is how you can run or evaluate a JSON-FP program:

    var  jsonfp = require('jsonfp');
    
    // providing a context(ctx) to run 'program' with 'input'
    jsonfp.apply(ctx, input, program);
    
    // or simply
    jsonfp.apply(input, program);
    
_program_ should be a JSON-FP program and _input_ can be any value. _Context_ is a plain object to act as an additional data channel to a program.

<a name="proCb"></a>
### Promise or callback
To use promise or callback to handle asynchronous calls is more about preference than right or wrong. JSON-FP supports both styles. When you evaluate a JSON-FP expression, you can either use the promise style:

    jsonfp.apply(input, expr).then(function(value) {
        // value is the result
    });

or the callback style:

    jsonfp.apply(input, expr, function(err, value) {
        // value is the result
    });
    
    
<a name="format"></a>
## JSON-FP expression
A JSON-FP expression is a JSON object with a single property. The property key is the "operator" which works on the input data while the property value specifies options to that operator. So a JSON-FP expression is as simple as:

    {op: options}

The interesting part is that _options_ can be yet another JSON-FP expression. A typical example would be the case of applying the "map" operator. Assuming we have a list of documents and we want to remove all properties but the title property for each document. Below is what you can do with JSON-FP:

    {"map":
    	{"pick": "title"}
    }

By repeatedly substituting expression value with another JSON-FP expression, an expression as simple as {op: options} can turn into a really sophisticated application.

<a name="input"></a>
### Expression input
When running a JSON-FP program, you have to provide the initial input data. After that, the input data flow will become implicit. For example, when operators are chained, input data will be fed to the beginning of the chain and every operator will get its input from the output of its predecesor. Another example is the 'map' operator which will iterate through its input (should be an array or a collection) and feed each element as the input to its child expression. In other words, the parent expression will decide how to provide input to its child expressions without needing explicit specifications by application developers.

However, sometimes it may be convenient or even necessary to explicitly specify input to a JSON-FP expression. In that case, you can do the following:

    var  expr = {
        	_input: INPUT_TO_THE_EXPRESSION
        	_expr: THE_ACTUATION_JSON-FP_EXPRESSION
         };

In other words, you can wrap up a JSON-FP expression within a plain object and specify the input in that object.

<a name="evaluation"></a>
### Evaluation
Anything that you send as an expression to JSON-FP will be evaluated recursively until a scalar is found. For example:

    var  expr = {name: 'David'},
    	 result = jsonfp.apply('Jones', expr);
    console.log( JSON.stringify(result) );
    		
JSON-FP will try to evalute {name: 'David'} and find out there is nothing it should do, so the result printed out on console is exactly the same as the input. However, if you do something like:

    var  expr = {name: {add: ' Cooper'}},
    	 result = jsonfp.apply('David', expr);
    console.log( JSON.stringify(result) );

This time JSON-FP will find something to work on and {name: 'David Cooper'} will be printed.

<a name="variables"></a>
### Variables
You can refer to variables in a JSON-FP expression. Since we do not want to break JSON parsing, JSON-FP variables are expressed as a string with leading a '$'. For example, '$title' or '$in.id'.

Input to an JSON-FP expression can be referred to with the '$in' variable. Assuming the input is a plain object with a 'title' property, then you can refe to that title property using '$in.title'.

Besides input, you can put all other variables in the context variable and refer to them. Below is an exmaple showing how you can use context variables:

    var  expr = {name: {add: '$firstName'}},
    	 ctx = {firstName: 'David '},
    	 result = jsonfp.apply(ctx, 'Jones', expr);
    console.log( JSON.stringify(result) );

Note that this time we provide a context variable (ctx) to supply the first name to the expression. The result will be printed out on console as {name: 'David Jones'}.

<a name="operators"></a>
### Operators
What operators are available in a JSON-FP runtime will decide its capabilities, and that can be fully customized. Customizing the set of supported operators is a very important feature because it allows a server (or any JSON-FP runtime) to gauge what capacity it's willing to offer.

The current implementation comes with more than 30 operators. To view the list and usage of these built-in operators, please refre to this [page](https://github.com/benlue/jsonfp/blob/master/doc/builtInOp.md) for details.

So if you need some functions not supported by the built-in operators, you can simply add your own! Below is an example:

    var  jsonfp = require('jsonfp');
    
    jsonfp.addMethod('average', function(input, x) {
        return  (input + x) / 2;
    });

JSON-FP by default will evaluate the expression option before feeding the option to an operator. If you do not want JSON-FP to evaluate the expression option, you could do the following:

    jsonfp.addMethod('getter', {op: doGetter, defOption: true});
    
    function doGetter(input, expr) {
        return  input[expr];
    };
    
If you specify the _defOption_ property as true when adding methods to the JSON-FP runtime, that will stop JSON-FP from evaluating the option to the operator.

<a name="api"></a>
### API

<a name="jfpInit"></a>
#### jsonfp.init(options)
Before you evaluate any JSON-FP expressions, you should call jsonfp.init() to  preload the built-in operators. You can also preload just part of the built-in operators by specifying the needed operators in the _options_ parameter. For example:

    jsonfp.init(['arithmetic', 'arrays', 'collections']);
    
The above example does not load "comparators".

<a name="jfpApply"></a>
#### jsonfp.apply(ctx, input, expr, cb)
Evaluates a JSON-FP expression and returns the result. If any JSON-FP expression is performed asynchronously, the return value will be a promise. If you prefer the callback style, you can put the callback function as the 4th parameter to the function call. _cb(err, value)_ is an optional callback function which will take an error object (if any) and the result as the second parameter. Note that if invoked with a callback function, _jsonfp.apply()_ will no longer return a value.

Parameter _ctx_ is a context variable, _input_ will be fed to the expression, and _expr_ is the JSON-FP expression to be evaluated. The _ctx_ parameter is optional.

<a name="jfpIsExp"></a>
#### jsonfp.isExpression(expr)
Checks to see if _expr_ is a evaluable JSON-FP expression.

<a name="jfpAddMethod"></a>
#### jsonfp.addMethod(name, func)
Adds an customized operator to the JSON-FP runtime. _name_ is the operator name, and _func_ can be a Javascript function or a plain object with the following properties:

+ op: a Javascript function to carry out the operator functions.
+ defOption: if true, the expression option will not be evaluated before the expression is evaluated. For operators such as "map" or "filter" which will treat the option as a JSON-FP expression, this property should be set to true.

<a name="jfpRemoveMethod"></a>
#### jsonfp.removeMethod(name)
Removes an operator from a JSON-FP runtime.

<a name="meta"></a>
## Metaprogramming
Since the format of JSON-FP is so simple, it would not be too difficult to make programs to produce JSON-FP programs. To make that even easier, the **convert** operator is added to support variable renaming or subsititution. The idea is based on alpha-conversion of lamda calculus.

There is a simple example in [testLamda.js](https://github.com/benlue/jsonfp/blob/master/test/testLamda.js) if you're interested.


