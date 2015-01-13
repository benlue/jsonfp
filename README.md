JSON-fp
=======

In a decentralized computing environment, it will be a common practice to pass programming codes to various machines to execute (and then gather the results). However, how can machines of various configurations understand each other? Also, the "moving code, least moving data" policy prefers functional programming to imperative programming.

Those questions/issues lead to the idea of doing functional programming in JSON. If programs can be coded in JSON, they will be easy to be shipped around and understood by machines of vaious settings. Combining JSON and functional programming also makes security issues easier to track or manage.

JSON-fp is part of an attempt to make data freely and easily accessed, distributed, annotated, meshed, even re-emerged with new values. To achieve that, it's important to be able to ship codes to where data reside, and that's what JSON-fp is trying to achieve.

## Install

    npm install jsonfp
    

## Getting started
If you really like to dive in, test files under the _test_ directory is a good place to start. Those test cases are also good examples.

+ **[testLamda.js](https://github.com/benlue/jsonfp/blob/master/test/testLamda.js)**: test cases of real application scenarios. Alpha-conversion and meta programming test cases can also be found here.

+ **[testOp.js](https://github.com/benlue/jsonfp/blob/master/test/testOp.js)**: unit tests for operators.

+ **[testSyntax](https://github.com/benlue/jsonfp/blob/master/test/testSyntax.js).js**: how variables, objects and arrays are evaluated.

### Run programs
Below is how you can run or evaluate a JSON-fp program:

    var  jsonfp = require('jsonfp');
    
    // providing a context(ctx) to run 'program' with 'input'
    jsonfp.apply(ctx, input, program);
    
    // or simply
    jsonfp.apply(input, program);
    
_program_ should be a JSON-fp program and _input_ can be any value. _Context_ is a plain object to act as an additional data channel to a program.


## Format
A JSON-fp program is a JSON object with a single property. The property key is the "operator" which works on the input data while the property value specifies options to that operator. So a JSON-fp program is as simple as:

    {op: options}

The interesting part is that _options_ can be yet another JSON-fp program. A typical example would be the case of applying the "map" operator. Assuming we have a list of documents and we want to remove all properties but the title property for each document. Below is what you can do with JSON-fp:

    "map": {
    	def: {"pick": "title"}
    }

By substituting options with a JSON-fp program, an expression as simple as {op: options} can turn into a really sophisticated application.

### Applying input
When running a JSON-fp program, you have to provide the initial input data. After that, the input data flow will become implicit. For example, when operators are chained, input data will be fed to the beginning of the chain and every operator will get its input from the output of its predecesor. Another example is the 'map' operator which will iterate through its own input (should be an array or a collection) and feed each element as the input to its child expression. In other words, the parent expression will decide how to provide input to its child expressions without needing explicit specifications by programmers.

However, sometimes it may be convenient or even necessary to explicitly specify input to a JSON-fp expression. In that case, you can do the following:

    var  expr = {
        	_input: INPUT_TO_THE_EXPRESSION
        	_expr: THE_ACTUATION_JSON-FP_EXPRESSION
         };

In other words, you can wrap up a JSON-fp expression with another plain object and specify the input in that object.

### Evaluation
Anything that you send as an expression to JSON-fp will be evaluated recursively until a scalar is found. For example:

    var  expr = {name: 'David'},
    	 result = jsonfp.apply('Jones', expr);
    console.log( JSON.stringify(result) );
    		
The console will print out {name: 'David'}. However, if you do something like:

    var  expr = {name: {add: 'David '}},
    	 result = jsonfp.apply('Jones', expr);
    console.log( JSON.stringify(result) );

This time {name: 'David Jones'} will be printed.

### Variables
You can refer to variables in a JSON-fp expression. Since we do not want to break JSON parsing, JSON-fp variables are expressed as a string with leading a '$'. For example, '$title' or '$in.id'.

Input to an JSON-fp expression can be referred to with the '$in' variable. Assuming the input is a plain object with a 'title' property, then you can refe to that title property using '$in.title'.

Besides input, you can put all other variables in the context variable and refer them. Below is an exmaple showing how you can use context variables:

    var  expr = {name: {add: '$firstName'}},
    	 ctx = {firstName: 'David '},
    	 result = jsonfp.apply(ctx, 'Jones', expr);
    console.log( JSON.stringify(result) );

Note that this time we provide a context variable (ctx) to supply the first name to the expression. The result will be printed out on console as {name: 'David Jones'}.

### Operators
Below are operators currently supported:

+ **add** adding _option_ to _input_. The order may be important when adding strings. It's _option_ + _input_

+ **chain**: chaining is specified with an array of operators with each operator taking its input from the output of its predecessor. Its syntax is as: _[{op1: option1}, {op2: option2}, ...{opN, optionN}]_. The output of a chain operator is the output of the last operator in the chain.

+ **convert**: can be used to do variable substitution (this is actually JSON-fp's way of doing alpha-conversion of lamda calculus). _option_ should be like {var: ..., expr: ...} where _var_ is the variable name and _expr_ is the expression to be converted.

+ **def**: asks JSON-fp not to evaluate the expression _option_. This can be used when applying certain operators such as **map** or **reduce**.

+ **difference**: output an array by excluding all values specified in the option array. Syntax: _{difference: [...]}_

+ **eval**: this operator will iterate through every property of its _option_ and try to evaluate each property as a JSON-fp expression. Note that JSON-fp will automatically evaluate _option_ so **eval** is not needed in most cases. It will be used mostly in meta-programming. For example, evaluating a JSON-fp expression produced by alpha-conversion like: _{eval: {convert: {...}}_.

+ **flatten**: flats the input array to be an array of single level.

+ **intersection**: intersect the input array with the option array.

+ **map**: it's option should be a JSON-fp expression. Each element of the input array will be the input to the option expression. Because JSON-fp will automatically evaluate _option_ in an expression, if you do _{map: JSON-fp_expr}_ you'll not get the expected result. Instead, you should do _{map: {def: JSON-fp_expr}}_.

+ **merge**: recursively merges the option object into the input object.

+ **pick**: creates a new object with properties specified in the option. Option can be a single string of an array of strings.

+ **pluck**: retrieves a property from the input. The property name is specified in _option_.

+ **reduce**: the reduce funtion. _option_ should be a JSON-fp expression. Because JSON-fp will automatically evaluate _option_ in an expression, if you do _{reduce: JSON-fp_expr}_ you'll not get the expected result. Instead, you should do _{reduce: {def: JSON-fp_expr}}_. The option expression can access the accumulator through execution context by '$accumulator'.

+ **size**: returns the size of the input collection (array).

+ **take**: returns the first n elements of the input array. _n_ is specified in the option.

+ **where**: (Deep) compares each element with the option object and returns those elements having the equivalent property value as the option object.

+ **zipObject**: creates an object with keys from the input array and values from the option array.

If the above description is too brief, you may want to refer [Lo-Dash](https://lodash.com/docs#pick) documentation. Most operators listed above are realized by Lo-Dash.

## Metaprogramming
Since the format of JSON-fp is so simple, it would not be too difficult to make programs to produce JSON-fp programs. To make that even easier, the **convert** operator is added to support variable renaming or subsititution. The idea is based on alpha-conversion of lamda calculus.

There is a simple example in [testLamda.js](https://github.com/benlue/jsonfp/blob/master/test/testLamda.js) if you're interested.

## TODO

+ what is the minimum set of operators to implement?

+ capable of taking promise as input data
