# Built-In Operators
JSON-FP comes with built-in operators. These operators are categorized into 5 different groups.

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