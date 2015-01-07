JSON-fp
=======

In a decentralized computing environment, it will be a common practice to pass programming codes to various machines to execute (and then gather the results). However, how can machines of various configurations understand each other? Also, the "moving code, least moving data" policy prefers functional programming to imperative programming.

Those questions/issues lead to the idea of doing functional programming in JSON. If programs can be coded in JSON, they will be easy to be shipped around and understood by machines of vaious settings. Combining JSON and functional programming also makes security issues easier to track or manage.

JSON-fp is part of an attempt to make data freely and easily accessed, distributed, annotated, meshed, even re-emerged with new values. To achieve that, it's important to be able to ship codes to where data reside, and that's what JSON-fp is trying to achieve.

**Note**: The current implementation is in the very early stage. In fact, it's nothing more than making the test cases work. The code was used to show case the idea. Any comments/feedback are welcome.

## Format
A JSON-fp program is a JSON object with a single property. The property key is the "operator" which works on the input data while the property value specifies options to that operator. So a JSON-fp program is as simple as:

    {op: options}

The interesting part is that _options_ can be yet another JSON-fp program. A typical example would be the case of applying the "map" operator. Assuming we have a list of documents and we want to remove all properties but the title property for each document. Below is what you can do with JSON-fp:

    "map": {
    	"pick": "title"
    }

In fact, an expression as simple as {op: options} can trun into a really sophisticated application.


### Operators
Below are operators currently supported:

+ **chain**: Chaining is specified with an array of operators with each operator taking its input from the output of its predecessor. Its syntax is as: _[{op1: option1}, {op2: option2}, ...{opN, optionN}]_. The output of a chain operator is the output of the last operator in the chain.

+ **difference**: Output an array by excluding all values specified in the option array. Syntax: _{difference: [...]}_

+ **flatten**: flats the input array to be an array of single level.

+ **intersection**: intersect the input array with the option array.

+ **map**: it's option should be an operator. Each element of the input array will be the input to the option operator.

+ **merge**: recursively merges the option object into the input object.

+ **pick**: creates a new object with properties specified in the option. Option can be a single string of an array of strings.

+ **size**: returns the size of the input collection (array).

+ **take**: returns the first n elements of the input array. _n_ is specified in the option.

+ **where**: (Deep) compares each element with the option object and returns those elements having the equivalent property value as the option object.

+ **zipObject**: creates an object with keys from the input array and values from the option array.

If the above description is too brief, you may want to refer [Lo-Dash](https://lodash.com/docs#pick) documentation. Most operators listed above are realized by Lo-Dash.

## TODO

+ what is the minimum set of operators to implement?

+ formalize operator options using json-schema?
