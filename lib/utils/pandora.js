/**
 * This file gathers some stub that could be moved to pandora
 */

// overrides pandora.typename to handle constructor.name
pandora.typename = function (value) {
    if (value.constructor.typename !== undefined) {
        return value.constructor.typename;
    } else if (value.constructor.name !== "") {
        return value.constructor.name;
    }
    switch (typeof value) {
        case "boolean": return "Boolean";
        case "number": return "Number";
        case "string": return "String";
        case "function": return "Function";
        case "object":
            if (value instanceof Array) {
                return "Array";
            } else if (value instanceof Object) {
                return "Object";
            }
    }
    if (value === null) {
        return "null";
    } else if (value === undefined) {
        return "undefined";
    }
    return "Unknown";
};

/**
 * Finds a specific item in a collection
 * @param container {Array<Object>}
 * @param fn {Function<Object>}
 */
pandora.findIf = function(container, fn) {
    var found = null;
    pandora.forEach(container, function (item) {
        if (fn(item) === true) {
            found = item;
            return true;
        }
    });
    return found;
};