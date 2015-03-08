/**
 * Convert the given input string to camelcase. Example: my-class-name -> MyClassName.
 * @param str {String} The string to convert.
 * @param sep {String?} The separator to use for the non-camelcase version of the string ("-" by default).
 * @returns {String}
 */
cg.camelcase = function (str, sep) {
    sep = sep || "-";
    return str[0].toUpperCase() + str.replace(new RegExp("(" + sep + "[a-z])", "g"), function (m) {
            return m.toUpperCase().replace(sep,'');
    }).substr(1);
};

/**
 * Convert the given input string to camelcase. Example: my-class-name -> MyClassName.
 * @param str {String} The string to convert.
 * @param sep {String?} The separator to use for the non-camelcase version of the string ("-" by default).
 * @returns {String}
 */
cg.uncamelcase = function (str, sep) {
    return str.replace(/([A-Z])/g, function (m) {
        return sep + m.toLowerCase();
    }).substr(1);
};

/**
 * Merge the source object into the destination.
 * @param destination {Object}
 * @param source {Object}
 * @param recurse {Boolean?}
 */
cg.mergeObjects = function (destination, source, recurse) {
    for (var k in source) {
        if (source.hasOwnProperty(k)) {
            if (recurse && cg.functionName(source.constructor) === "Object") {
                cg.mergeObjects(destination[k], source[k], recurse);
            } else {
                console.log(k);
                destination[k] = source[k];
            }
        }
    }
    return destination;
};

/**
 * Return the function name.
 * @param fn {Function}
 * @returns {String}
 */
cg.functionName = function (fn) {
    return fn.name || fn.toString().match(/function ([^\(]+)/)[1];
};

/**
 * Simulation OOP like inheritance, `cls` will be inherited from `base.
 * @param cls {Function}
 * @param base {Function}
 */
cg.inherit = function (cls, base) {
    for (var property in base.prototype) {
        //noinspection JSUnfilteredForInLoop
        var safeProperty = property;
        var getter = base.prototype.__lookupGetter__(safeProperty);
        var setter = base.prototype.__lookupSetter__(safeProperty);
        if (getter !== undefined || setter !== undefined) {
            if (getter !== undefined) {
                cls.prototype.__defineGetter__(safeProperty, getter);
            }
            if (setter !== undefined) {
                cls.prototype.__defineSetter__(safeProperty, setter);
            }
        } else {
            cls.prototype[safeProperty] = base.prototype[safeProperty];
        }
    }
    cls.prototype.constructor = cls;
};

/**
 * Default function to prevent events.
 */
cg.preventCallback = function (x, y, e) {
    if (x.preventDefault !== undefined &&
        x.stopPropagation !== undefined &&
        x.stopImmediatePropagation !== undefined) {
        e = x;
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
};

/**
 * Empty callback for default event behavior.
 */
cg.defaultCallback = function () {

};

/**
 * Cross-platform mouse wheel event
 * @param {Element} el
 * @param {Function} callback
 */
// http://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
cg.mouseWheel = function (el, callback) {
    var handleScroll = function (e) {
        if (!e) {
            e = event;
        }
        var direction = (e.detail < 0 || e.wheelDelta > 0) ? 1 : -1;
        callback(direction);
    };
    el.addEventListener('DOMMouseScroll', handleScroll, false); // for Firefox
    el.addEventListener('mousewheel', handleScroll, false); // for everyone else
};

/**
 * Generate a polymorphic function for the given type.
 * @param type {Function} the constructor of the type on which the polymorphism will apply
 * @param typeFunctions {Object<Function>} the functions for each types that are supported
 * @returns {*} the result of the function called
 */
cg.polymorphic = function (type, typeFunctions) {
    var name = cg.functionName(type);
    if (typeFunctions[name] === undefined) {
        throw new cg.GraphError("Missing overload for " + name);
    }
    return typeFunctions[name]();
};

/**
 * Looks like cg.polymorphic. However, instead of giving the functions in parameters, to give an instance and a method
 * name and it will look for the methods within the class. For instance, if you create a polymorphic method "render"
 * like so:
 *      return cg.polymorphicMethod(node.constructor, this, "render", node, element);
 * it will look for all the method named _renderType (_renderVec2, _renderGraph for instance), and return it.
 * @param type {Function|String} the constructor of the type on which the polymorphism will apply
 * @param instance {Object} the instance of the object on which the method exists
 * @param name {Object} the name of the polymorphic method (used to find the private methods for each type)
 * @param {...} arguments to call the function.
 */
cg.polymorphicMethod = function (type, instance, name) {
    if (typeof type === "function") {
        type = cg.functionName(type);
    }
    var method = instance["_" + name + type];
    if (method === undefined) {
        throw new cg.GraphError("Missing method overload '_" + name + type + "'");
    }
    return method.apply(instance, Array.prototype.slice.call(arguments, 3));
};