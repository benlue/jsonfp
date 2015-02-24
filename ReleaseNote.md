## 0.1.1

+ Formalized how customized operators are implemented and installed to a JSON-FP runtime.

## 0.1.0

+ Added the **formula** operator for metaprogramming. Developers now can use the **formula** operator to define a JSON-FP formula and use the **convert** operator to apply a formula.

## 0.0.9

+ Added the [if](https://github.com/benlue/jsonfp/blob/master/doc/builtInOp.md#if) operator.
+ Allowed variable settings through the context variable.
+ Allowed expression option to be null.

## 0.0.8

+ '->' is an alias of the 'chain' operator, if that makes things more readable.
+ The _reduce_ operator now also has a shorter format. Check [builtinOp](https://github.com/benlue/jsonfp/blob/master/doc/builtInOp.md#reduce) for details.

## 0.0.7

+ Allowed expression input to be null.
+ Besides promise, developers can also use callback to handle asynchronous calls.

## 0.0.6

+ Built-in operators have been substantially expanded and those operators are grouped into 'arithmetic', 'arrays', 'collections' and 'comparators' modules.
+ An operator can specify if JSON-FP should evaluate its expression value or not. With such a feature, JSON-FP developers could omit the 'def' operator and make JSON-FP expressions more succint.

## 0.0.5

+ Added promise support. With the new feature, a JSON-FP program can intake promised input. Also, if you add customized JSON-FP operators (transformations) whose output is a promise, JSON-FP can handle them properly.

## 0.0.4

+ cleared up syntax (please check README for details)
+ supported alpha-conversion
+ more operators are supported (add, def, convert, eval, pluck, reduce).
+ much more detailed description in README

## 0.0.3

+ provided some basic documentation in README
+ built-in operators are tested
+ it's a working prototype now.

## 0.0.1

+ worked with test cases.
