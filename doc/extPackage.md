Developing and Installing Packages
==================================

One of JSON-FP's many interesting features is the ability to extend the language by adding customized operators. Before release 0.1.1, this was done by the _addMethod()_ function. Even though the _addMethod()_ function can effectively make the job done, things may go wild if you have to add customized operators from various parties. Below we'll describe a recommended way to develop and install customized operators.

## Put Operators In A Package
Instead of freely adding customized operators one by one to a JSON-FP runtime, you may want to group operators in a package and install them all at once. A package is nothing more than a node module with an exported _install()_ function. The sample code below can be used as a boilerplate for writing your own customized package:

    exports.install = function(jsonfp, pkgName)  {
        pkgName = pkgName || 'default_pkg_name';

        var  pkgPath = pkgName + '/';
        // now one by one install each operator to the JSON-FP runtime
        jsonfp.addMethod( pkgPath + 'opName1', opFunction1);
        ...
    };

where **jsonfp** is a JSON-FP runtime and **pkgName** is the given package name. As you can see from the sample code, if the package name is not given, the package itself can offer the default name.

## Install A Package
If a JSON-FP package is implmented as described above, installation will be very easy. A package can be installed into a JSON-FP runtime as:

    var  jsonfp = require('jsonfp'),
         myPackage = require('./myPackage.js');

    jsonfp.install('myPack', myPackage);


## Invoke The Customized Operators
Once a package is installed, you can easily invoke those package operators in your JSON-FP expressions. Use the above example, the installed operators can be invoked like:

    var  expr = {'myPack/opName1': op_options}

That's it. Using packages to group operators not just makes customization more managable, but also creates name spaces for each group of operators. That allows us to safely incorporate additional functions from third parties.

Finally, if you wonder why are we using '/' instead of '.' as a name seperator for a full operator name, the answer is we're preserving '.' for future use. To be compatible with future releases, we recommend to use '/' as the name seperator for a full operator name.