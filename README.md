JSON-FP
=======

In a decentralized computing environment, when applications are dealing with huge amount of data it's a better practice to pass programming codes to various machines than moving data. However, how can machines of various configurations understand each other? Also, the "moving code, least moving data" policy would work better in functional programming than imperative programming.

Those questions/issues lead to the idea of doing functional programming in JSON. If programs can be coded in JSON, they can be easily shipped around and understood by machines of vaious settings. Combining JSON and functional programming also makes security issues easier to track or manage.

JSON-FP is part of an attempt to make data freely and easily accessed, distributed, annotated, meshed, even re-emerged with new values. To achieve that, it's important to be able to ship codes to where data reside, and that's what JSON-FP is trying to achieve.
    
## JSON-FP playground
Want to play with JSON-FP to see how it works? You can test your JSON-FP code online and find examples at [JSON-FP playground](http://playground.jsonfp.org).

## What's new

+ Four new operators (head, tail, bucket and infix) are introduced to the runtime core. The _bucket_ operator can be used to distribute input list into sub-list (buckets) based on conditions specified (v-0.2.2).

+ The _infix_ operator is introduced to solve the problem that JSON-FP always work on input as a whole. Consider adding two numbers x and y. This could be tricky if you don't want to introduce any side effect to your JSON-FP expression. With the _infix_ operator, the problem can be easily solved by doing: _infix: ['$in.x', {add: '$in.y'}]_.

+ The concept of streaming data is introduced in v-0.2.1. For descriptions and examples, please check [Using "Streams" As Data Generators](https://github.com/benlue/jsonfp-examples/tree/master/examples/stream).

+ Adding customized operators to the JSON-FP runtime has been standardized (v-0.1.1). Please check [Developing and Installing Packages](https://github.com/benlue/jsonfp/blob/master/doc/extPackage.md) for details.

+ Added the **formula** operator for metaprogramming. Developers now can use the **formula** operator to define a JSON-FP formula and use the **convert** operator to apply a formula (v-0.1.0).

For details about what's new in the current release, please check the [release note](https://github.com/benlue/jsonfp/blob/master/ReleaseNote.md).

## Install

    npm install -g jsonfp

## Contents

+ [Getting started](#started)
  + [Run programs](#run)
  + [Promise or callback](#proCb)
+ [JSON-FP expression](#format)
  + [Expression input](#input)
  + [Evaluation](#evaluation)
  + [Variables](#variables)
    + [Setting variables](#setVar)
  + [Operators](#operators)
  + [API](#api)
    + [jsonfp.init()](#jfpInit)
    + [jsonfp.apply()](#jfpApply)
    + [jsonfp.isExpression()](#isExp)
    + [jsonfp.addMethod()](#jfpAddMethod)
    + [jsonfp.removeMethod()](#jfpRemoveMethod)
+ [Customizing JSON-FP](#customization)
+ [Metaprogramming](#meta)

<a name="started"></a>
## Getting started
An [example project](https://github.com/benlue/jsonfp-examples) has been created to demonstrate how to write JSON-FP expressions. In addition to that, test files under the _test_ directory is also a good place to start. Below are some examples you may want to check:

+ **[simple](https://github.com/benlue/jsonfp-examples/blob/master/examples/simple/simple.js)**: very simple examples to help you getting familiar with JSON-FP.

+ **[stream](https://github.com/benlue/jsonfp-examples/tree/master/examples/stream)**: showing how to use streams as input to JSON-FP expressions. In particular, the example shows how to use the iterator stream to replace the for-loop statement.

+ **[quick sort](https://github.com/benlue/jsonfp-examples/blob/master/examples/quickSort/quickSort.js)**: the classic quick sort algorithm is implemented in JSON-FP.

+ **[object query](https://github.com/benlue/jsonfp-examples/blob/master/examples/ObjectQuery/ObjectQuery.js)**: showing how to query a list of JSON objects with various conditions.

+ **[metaprogramming](https://github.com/benlue/jsonfp-examples/tree/master/examples/metapro)**: showing how to do alpha-conversion in JSON-FP.

<a name="run"></a>
### Run programs
Below is how you can run or evaluate a JSON-FP program:

    var  jsonfp = require('jsonfp');
    jsonfp.init();
    
    // providing a context(ctx) to run 'program' with 'input'
    jsonfp.apply(ctx, input, program);
    
    // or simply
    jsonfp.apply(input, program);
    
_program_ should be a JSON-FP program and _input_ can be any value. _Context_ is a plain object to act as an additional data channel to a program.

<a name="proCb"></a>
### Promise or callback
Built-in operators of the current implementation will do their jobs synchronously. However, if you add your own customized operators and they would do things asynchronously, those asynchronous operators should return a promise to JSON-FP. JSON-FP knows how to deal with promise.

Other than operators, JSON-FP supports both promise and callbacks to deal with those asynchronous situations. In other words, if you expect the computation of your JSON-FP expression will be done asynchroously, you can either use the promise style:

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
When running a JSON-FP program, you have to provide the initial input data. After that, the data flow will become implicit. For example, when operators are chained, input data will be fed to the beginning of the chain and every operator will get its input from the output of its predecesor. Another example is the 'map' operator which will iterate through its input (should be an array or a collection) and feed each element as the input to its child expression. In other words, the parent expression will decide how to provide input to its child expressions without needing explicit specifications by application developers.

However, if you want to change the implicit data flow, you can use the 'chain' operator to achieve that. Below is an example:

    {
        '->': [
            {name: 'David', age: 28},
            {getter: 'age'}
        ]
    }

If you evaluate the above expression, the result will be 28. The first one of the chained expressions is becoming the input to the second expression. With that technique, you can change expression input as you wish.

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
It's possible to refer to variables in a JSON-FP expression. They are expressed as a string with a leading '$' sign. For example, '$title' and '$in.id' are all valid variables. The syntax of JSON-FP variables is defined as such because we do not want to break the JSON syntax.

Input to an JSON-FP expression can be referred as '$in'. If input is a plain object with a 'title' property, you can refe to that title property as '$in.title'.

Besides input, you can put all other variables in the context variable. Below is an exmaple showing you how to use context variables:

    var  expr = {name: {add: '$firstName'}},
    	 ctx = {firstName: 'David '},
    	 result = jsonfp.apply(ctx, 'Jones', expr);
    	 
    // Below should print out 'David Jones'
    console.log( JSON.stringify(result) );

Note that in the above example we provide a context variable (ctx) to supply the first name to the expression. The result will be printed out on console as {name: 'David Jones'}.

<a name="setVar"></a>
#### Setting variables
A JSON-FP expression can unfold itself as a series (or a tree of series) of expressions. Input to the expression will water fall through or be transformed by those series of expressions. Sometimes we need to keep the intermediate results coming off expressions and recall them when necessary. To do so, the intermediate results should be able to be saved.

You ca save the intermediate results in the context variable like the following:

    {
        $name: {getter: 'name'}
    }

That will pick up the _name_ property of input and store it into the context variable. The saved value will be visible to successive expressions. For example:

    var expr = 
    {eval:
        {
            $name: {getter: 'name'},
            $hobby: {getter: 'hobby'},
            response: {
                _input: ['$name', ' likes ', '$hobby'],
				_expr: {reduce: 'add'}
            }
        }
    };
    
will save the name and hobby of a person to the _'$name'_ and _'$hobby'_ variables respectively. However, if you do:

    var expr = 
    {eval:
        {
            response: {
                _input: ['$name', ' likes ', '$hobby'],
				_expr: {reduce: 'add'}
            },
            $name: {getter: 'name'},
            $hobby: {getter: 'hobby'}
        }
    };

You'll **not** get the expected result because of the execution sequence.

Also note that, variables will not show up in results. The above example if done correctly will generate the result as (assuming input is {name: 'David', hobby: 'meditation'})

    {
        response: 'David likes meditation'
    }
    
rather than

    {
        $name: 'David',
        $hobby: 'meditation',
        response: 'David likes meditation'
    }
    
You won't have _'$name'_ and _'$hobby'_ as part of the return value.
    
<a name="operators"></a>
### Operators
What operators are available in a JSON-FP runtime will decide its capabilities, and that can be fully customized. Customizing the set of supported operators is a very important feature because it allows a server (or any JSON-FP runtime) to gauge what capacity it's willing to offer.

The current implementation comes with more than 30 operators. To view the list and usage of these built-in operators, please refre to this [page](https://github.com/benlue/jsonfp/blob/master/doc/builtInOp.md) for details.

If you need some functions not supported by the built-in operators, you can simply add your own! Below is an example:

    var  jsonfp = require('jsonfp');
    
    jsonfp.addMethod('average', function(input, x) {
        return  (input + x) / 2;
    });

JSON-FP by default will evaluate the expression option before feeding the option to an operator. If you do not want JSON-FP to evaluate the expression option, you could do the following:

    jsonfp.addMethod('getter', {op: doGetter, defOption: true});
    
    function doGetter(input, expr) {
        return  input[expr];
    };
    
If you specify the _defOption_ property as true when adding methods to the JSON-FP runtime, that will stop JSON-FP from automaticaly evaluating the option.

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

<a name="customization"></a>
## Customizing JSON-FP
One of JSON-FP's great features is the ability to extend the language by adding customized operators. Since v0.1.1, a recommended way to develop and install customized operators have been introduced. With that, third party functions can be grouped and installed as packages, and you can freely customize the JSONF-FP runtime as you need. For details, you can check "[Developing and Installing Packages](https://github.com/benlue/jsonfp/blob/master/doc/extPackage.md)" for details.

<a name="meta"></a>
## Metaprogramming
JSON-FP is homoiconic. That is you can manipulate JSON-FP programs the exact same way as you manipulate JSON objects. Becuase of that, using JSON-FP to do metaprogramming could be very easy.

The latest release (0.1.0) supports two metaprogramming related operators: **convert** and **formula**. The **formula** operator helps developers to define expression formula which can be reused and served as building blocks for more complicated JSON-FP programs. The **convert** operator can be used to apply those formula defined by the **formula** operator. To know more about how to use these two operators, you may want to check this [example](https://github.com/benlue/jsonfp-examples/blob/master/examples/metapro/metaProgram.js).

There are some simple examples in [testLamda.js](https://github.com/benlue/jsonfp/blob/master/test/testLamda.js) if you're interested.


