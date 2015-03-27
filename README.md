JSON-FP
=======

In a decentralized computing environment, it's a better practice to pass programming codes to various machines to execute (and then gather the results) when the application is dealing with huge amount of data. However, how can machines of various configurations understand each other? Also, the "moving code, least moving data" policy may work better with functional programming than imperative programming.

Those questions/issues lead to the idea of doing functional programming in JSON. If programs can be coded in JSON, they can be easily shipped around and understood by machines of vaious settings. Combining JSON and functional programming also makes security issues easier to track or manage.

JSON-FP is part of an attempt to make data freely and easily accessed, distributed, annotated, meshed, even re-emerged with new values. To achieve that, it's important to be able to ship codes to where data reside, and that's what JSON-FP is trying to achieve.
    
## What's new

+ Adding customized operators to the JSON-FP runtime has been standardized (0.1.1). Please check [Developing and Installing Packages](https://github.com/benlue/jsonfp/blob/master/doc/extPackage.md) for details.

+ Added the **formula** operator for metaprogramming. Developers now can use the **formula** operator to define a JSON-FP formula and use the **convert** operator to apply a formula (0.1.0).

+ The **if** operator is added to the language even though you can achieve the same effect without it. Also temporary results can be saved to the context variable as side effects. Check [here](#setVar) for further explanations on variable settings (0.0.9).

+ The **chain** operator is so frequently used in a JSON-FP program. To make it more intuitive and readable, you can now use '->' in place of 'chain' (0.0.8).

+ Developers have an option to use either promise or callback to deal with asynchronous calls (0.0.7). 

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
If you really like to dive in, you can check out the [example project](https://github.com/benlue/jsonfp-examples). In addition to that, test files under the _test_ directory is also a good place to start:

+ **[testLamda.js](https://github.com/benlue/jsonfp/blob/master/test/testLamda.js)**: testing some of the real application test cases. Alpha-conversion and meta programming test cases can also be found here.

+ **[testOp.js](https://github.com/benlue/jsonfp/blob/master/test/testOp.js)**: unit tests for operators.

+ **[testRecursion.js](https://github.com/benlue/jsonfp/blob/master/test/testRecursion.js)**: showing how to do recursive calls.

+ **[testSyntax.js](https://github.com/benlue/jsonfp/blob/master/test/testSyntax.js)**: how variables, objects and arrays are evaluated.

+ **[testVariables.js](https://github.com/benlue/jsonfp/blob/master/test/testVariables.js)**: how to set and use variables.

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
Built-in operators of the current implementation all will do their jobs synchronously. However, if you add your own customized operators and they would do things asynchronously, those asynchronous operators should return a promise to JSON-FP. JSON-FP knows how to deal with promise.

JSON-FP supports both promise and callbacks to deal with those asynchronous situations. In other words, if you expect the computation of your JSON-FP expression will be done asynchroously, you can either use the promise style:

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


