JSON-FP Built-In Operators
==========================

JSON-FP comes with built-in operators. These operators are categorized into 5 different groups.

+ [Core](#core)
  + [chain](#chain)
  + [convert](#convert)
  + [eval](#eval)
  + [if](#if)
  + [map](#map)
+ [Arithmetic](#arithmetic)
  + [add](#add)
  + [subtract](#subtract)
  + [multiply](#multiply)
  + [divide](#divide)
  + [min](#min)
  + [max](#max)
  + [and](#and)
  + [or](#or)
+ [Arrays](#arrays)
  + [compact](#compact)
  + [difference](#difference)
  + [flatten](#flatten)
  + [intersection](#intersection)
  + [take](#take)
  + [union](#union)
  + [zipObject](#zipObject)
+ [Collections](#collections)
  + [filter](#filter)
  + [find](#find)
  + [getter](#getter)
  + [merge](#merge)
  + [omit](#omit)
  + [pick](#pick)
  + [pluck](#pluck)
  + [reduce](#reduce)
  + [size](#size)
  + [where](#where)
+ [Comparators](#comparators)
  + [==](#equal)
  + [!=](#notEqual)
  + [>](#gt)
  + [>=](#gte)
  + [<](#lt)
  + [<=](#lte)

<a name="core"></a>
## Core
The core group provides the minimum operators for a JSON-FP runtime.

<a name="chain"></a>
### chain
The chain operator can take an array of JSON-FP expressions and sequentially evaluate each expression with each operator taking its input from the output of its predecessor. Its syntax is as: _[{op1: option1}, {op2: option2}, ...{opN, optionN}]_. The output of a chain operator is the output of the last operator in the chain.

Release 0.0.8 makes '->' the alias of 'chain', so

    {chain: [
        {getter: 'salary'},
        {'>': 100000}
    ]}

is the same as

    {'->': [
        {getter: 'salary'},
        {'>': 100000}
    ]}

<a name="convert"></a>
### convert
The convert operator can be used to do variable substitution (this is actually JSON-FP's way of suppoting the alpha-conversion of lamda calculus). _option_ should be like {var: ..., expr: ...} where _var_ is the variable name and _expr_ is the expression to be converted.

<a name="eval"></a>
### eval
This operator will iterate through every property of its _option_ and try to evaluate each property as a JSON-FP expression. Note that JSON-FP will automatically evaluate _option_ so the **eval** operator is not needed in most cases. It will be used mostly in meta-programming. For example, evaluating a JSON-FP expression produced by alpha-conversion like: _{eval: {convert: {...}}_.

<a name="if"></a>
### if
indicates a conditional statement as described in the option expression. _option_ should be an array with at least two elements. The first element (JSON-FP expression) in the array is the conditional expression. The second element (JSON-FP expression) is the expression to be evaluated when the condition is true, and the third element (JSON-FP expression) will be evaluated when the condition is false. The third element can be missing if the **else** statement is not needed.

When the **else** expression is not needed, the input will be the return value of this **if** expression.

<a name="map"></a>
### map
This operator will take each element of the input array and apply it to the given JSON-FP expression.

<a name="arithmetic"></a>
## Arithmetic

<a name="add"></a>
### add
This operator will add _option_ to _input_. The order may be important when adding strings. It's _input_ + _option_.

<a name="subtract"></a>
### subtract
The subtract operator subtracts _option_ from _input_. It only support numeric values.

<a name="multiply"></a>
### multiply
Multiplying _input_ with _option_. Both operands should be numeric values.

<a name="divide"></a>
### divide
Dividing _input_ by _option_.

<a name="min"></a>
### min
Returning the minimum of _input_ and _option_.

<a name="max"></a>
### max
Returning the maximum of _input_ and _option_.

<a name="and"></a>
### and
This operator will return the logical "and" of _input_ and _option_. However, if _input_ is an object and _option_ is an array of strings, each element of the _option_ array will be used as the property key to the _input_ object and logical "and" is applied on property values. For example, consider the following sample code:

    var  input = {'name: 'David', 'age': 28, 'isMarried': false},
         expr = {and: ['age', 'isMarried'];
         
    var  result = jsonfp.apply(input, expr);
    
The result should be false because _(28 && false)_ should yield false.

<a name="or"></a>
### or
This operator will return the logical "or" of _input_ and _option_. Similar to the "and" operator, if _input_ is an object and _option_ is an array of strings, each element of the _option_ array will be used as the property key to the _input_ object and logical "or" is applied on property values.

<a name="arrays"></a>
## Arrays

<a name="compact"></a>
### compact
Returns an array with false values (false, null, 0 or '') removed.

<a name="difference"></a>
### difference
Output an array by excluding all values specified in the option array. Syntax: _{difference: [...]}_

<a name="flatten"></a>
### flatten
Flats the input array to be an array of single level.

<a name="intersection"></a>
### intersection
Intersects the input array with the option array.

<a name="take"></a>
### take
This operator returns the first _n_ elements of the input array. _n_ is specified in the option.

<a name="union"></a>
### union
Output an array of unique values from the _input_ and _option_ arrays.

<a name="zipObject"></a>
### zipObject
Creates an object with keys from the input array and values from the option array.

<a name="collections"></a>
## Collections

<a name="filter"></a>
### filter
Returns an array of elements filtered by _option_. If _option_ is a plain object, the saved element should contain the same property as _option_. If _option_ is a JSON-FP expression, the input elements will become the input to the JSON-FP expression and the evaluation result will decide if that element will be kept.

<a name="find"></a>
### find
Similar to filter except that the first matched element will be returned.

<a name="getter"></a>
### getter
Returns a property value of an input object. For example:

    var  input = {
    	project: 'JSON-FP',
    	language: 'Javascript'
    },
    expr = {getter: 'language'};
    
    var  result = jsonfp.apply(input, expr);

The result is 'Javascript'.

<a name="merge"></a>
### merge
This operator will recursively merge the option object into the input object.

<a name="omit"></a>
### omit
Creates an object by removing properties specified by _option_ from the _input_ object. Besides being a string value, _option_ can also be a JSON-FP  expression. If _option_ is a JSON-FP expression, the omit operator will iterate every key/value pair of the input object, and send the pair as input to the JSON-FP expression. Below is an example:

    var  data = {name: 'David', project: 'newsql', age: 42},
         expr = {omit:
                    {chain: [
                        {getter: 'key'},
                        {'==': 'project'}
                    ]}
                },
         result = jsonfp.apply( data, expr );
         
In the above example, the {chain: ...} expression will be invoked three times with each time receving input as {key: 'name', value: 'David'}, {key: 'project', value: 'newsql'} and {key: 'age', value: 42} respectively. The execution result will be {name: 'David', age: 42}.

<a name="pick"></a>
### pick
This operator creates a new object with properties specified in the option. Option can be a single string of an array of strings.

<a name="pluck"></a>
### pluck
retrieves a property from the input. The property name is specified in _option_.

<a name="reduce"></a>
### reduce
This operator performs the reduce funtion. _option_ is usually a JSON-FP expression. Starting from v0.0.8, you can simply use an operator name to replace the intended JSON-FP expression. That is:

    {reduce:
        add: '$reduceValue'
    }

is now the same as:

    {reduce: 'add'}


<a name="size"></a>
### size
This operator returns the size of the input collection (array).

<a name="where"></a>
### where
This operator will perform deep comparison on each element with the option object and returns those elements having the equivalent property value as the option object.

<a name="comparators"></a>
## Comparators

<a name="equal"></a>
### ==
This operator compares if _input_ and _option_ is equivalent (don't have to be identical).

<a name="notEqual"></a>
### !=
Checking if _input_ and _option_ are not equal.

<a name="gt"></a>
### >
if _input_ is greater than _option_.

<a name="gte"></a>
### >=
if _input_ is greater than or equal to _option_.

<a name="lt"></a>
### <
if _input_ is less than _option_.

<a name="lte"></a>
### <=
if _input_ is less than or equal to _option_.

If the above description is too brief, you may want to refer [Lo-Dash](https://lodash.com/docs#pick) documentation. Most array and collection operators listed above are realized by Lo-Dash.