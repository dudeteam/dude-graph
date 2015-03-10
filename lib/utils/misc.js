/**
 * Convert the given input string to camelcase. Example: my-class-name -> MyClassName.
 * @param str {String} The string to convert.
 * @param sep {String?} The separator to use for the non-camelcase version of the string ("-" by default).
 * @returns {String}
 */
cg.camelcase = function (str, sep) {
    sep = sep || "-";
    return str[0].toUpperCase() + str.replace(new RegExp("(" + sep + "[a-z])", "g"), function (m) {
            return m.toUpperCase().replace(sep, '');
        }).substr(1);
};

/**
 * Convert the given input string to camelcase. Example: my-class-name -> MyClassName.
 * @param str {String} The string to convert.
 * @param sep {String?} The separator to use for the non-camelcase version of the string ("-" by default).
 * @returns {String}
 */
cg.uncamelcase = function (str, sep) {
    sep = sep || "-";
    return str.replace(/([A-Z])/g, function (m) {
        return sep + m.toLowerCase();
    }).substr(1);
};

/**
 * Return the formatted string
 * eg. cg.formatString("I love {0} and {1}", "Chocolate", "Linux") will return "I love Chocolate and Linux"
 * @return {String}
 */
// http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
cg.formatString = function () {
    var args = Array.prototype.slice.call(arguments, 1);
    return arguments[0].replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

/**
 * Merge the source object into the destination.
 * @param destination {Object}
 * @param source {Object}
 * @param recurse {Boolean?}
 * @param override {Boolean?}
 */
cg.mergeObjects = function (destination, source, recurse, override) {
    for (var k in source) {
        if (source.hasOwnProperty(k)) {
            if (recurse && typeof source[k] === "object") {
                destination[k] = destination[k] || {};
                cg.mergeObjects(destination[k], source[k], recurse);
            } else if (override || destination[k] === undefined) {
                destination[k] = source[k];
            }
        }
    }
    return destination;
};

/**
 * Iterates on the given container.
 * @param container {Array|Object} the container
 * @param fn {Function} a predicate to apply on each element, the loop breaks if the predicate returns true
 */
cg.forEach = function (container, fn) {
    cg.polymorphic(container.constructor, {
        "Array": function () {
            for (var i = 0; i < container.length; ++i) {
                if (fn(container[i], i) === true) {
                    return;
                }
            }
        },
        "Object": function () {
            for (var key in container) {
                if (container.hasOwnProperty(key)) {
                    if (fn(container[key], key) === true) {
                        return;
                    }
                }
            }
        }
    });
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
    cls.prototype = Object.create(base.prototype);
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
        callback(e, direction);
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
        if (typeFunctions._ === undefined) {
            throw new cg.GraphError("Missing overload for " + name);
        }
        return typeFunctions._();
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