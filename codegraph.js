/**
 * @namespace pandora
 * @type {Object}
 */
var pandora = (function () {
    var namespace = typeof Module === "undefined" ? {} : Module;
    if (typeof exports !== "undefined") {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = namespace;
        }
        exports.pandora = namespace;
    }
    return namespace;
})();
/**
 * Try to determine the type of the given value or return Unknown otherwise. Note that it first try to use the
 * value.constructor.typename attribute, so if you created your value with a class generated using pandora.class_
 * it will return its name.
 * @param value {*}
 * @returns {String}
 */
pandora.typename = function (value) {
    if (value.constructor.typename !== undefined) {
        return value.constructor.typename;
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
 * Simulate class behavior in JS. It generate a function constructor, set the typename of the class and apply
 * inheritance.
 * Takes the typename in first parameter, followed by the classes from which inherit and finally the class'
 * constructor.
 * @param {...}
 * @returns {Function}
 */
pandora.class_ = function () {
    var typename = arguments[0];
    var constructor = arguments[arguments.length - 1];
    for (var i = 1; i < arguments.length - 1; ++i) {
        if (typeof arguments[i] !== "function") {
            throw new pandora.Exception("{0} is not a valid constructor type", pandora.typename(arguments[i]));
        }
        var proto = arguments[i].prototype;
        for (var method in proto) {
            if (proto.hasOwnProperty(method)) {
                constructor.prototype[method] = proto[method];
            }
        }
    }
    Object.defineProperty(constructor, "typename", {
        value: typename,
        writable: false
    });
    return constructor;
};

/**
 * Generate a polymorphic function for the given type.
 * @param type {Function} the constructor of the type on which the polymorphism will apply
 * @param typeFunctions {Object<Function>} the functions for each types that are supported
 * @returns {*} the result of the function called
 */
pandora.polymorphic = function (type, typeFunctions) {
    var name = pandora.typename(type);
    if (typeFunctions[name] === undefined) {
        if (typeFunctions._ === undefined) {
            throw new pandora.MissingOverloadError(name);
        }
        return typeFunctions._();
    }
    return typeFunctions[name]();
};

/**
 * Looks like cg.polymorphic. However, instead of giving the functions in parameters, to give an instance and a method
 * name and it will look for the methods within the class. For instance, if you create a polymorphic method "render"
 * like so:
 *      return cg.polymorphicMethod(this, "render", node, element);
 * it will look for all the method named _renderType (_renderVec2, _renderGraph for instance), and return it.
 * Note that the polymorphism will apply according to the first parameter.
 * @param instance {Object} the instance of the object on which the method exists
 * @param name {Object} the name of the polymorphic method (used to find the private methods for each type)
 * @param value {*} the value on which the polymorphism will apply
 * @param {...} arguments to call the function.
 */
pandora.polymorphicMethod = function (instance, name, value) {
    var suffix = pandora.typename(value);
    var method = instance["_" + name + suffix];
    if (method === undefined) {
        throw new pandora.MissingOverloadError(name + suffix, pandora.typename(instance));
    }
    return method.apply(instance, Array.prototype.slice.call(arguments, 2));
};
/**
 * Default function to prevent events.
 */
pandora.preventCallback = function (x, y, e) {
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
pandora.defaultCallback = function () {

};

/**
 * Cross-platform mouse wheel event
 * @param {Element} el
 * @param {Function} callback
 */
// http://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
pandora.mouseWheel = function (el, callback) {
    var handleScroll = function (e) {
        if (!e) {
            e = event;
        }
        var delta = 0;
        if (e.wheelDelta) {
            delta = e.wheelDelta / 360; // Chrome/Safari
        } else {
            delta = e.detail / -9; // Mozilla
        }
        callback(e, delta);
    };
    el.addEventListener('DOMMouseScroll', handleScroll, false); // for Firefox
    el.addEventListener('mousewheel', handleScroll, false); // for everyone else
};
pandora.EventEmitter = (function () {

    /**
     * Handle pub-sub events.
     * @constructor
     */
    var EventEmitter = pandora.class_("EventEmitter", function () {

        /**
         * Contain all listeners functions of the emitter.
         * @type {{}}
         * @private
         */
        this._listeners = {};

    });

    /**
     * Add a listener for the given name.
     * @param name
     * @param fn
     */
    EventEmitter.prototype.on = function (name, fn) {
        if (this._listeners[name] === undefined) {
            this._listeners[name] = [];
        }
        this._listeners[name].push(fn);
    };

    /**
     * Remove all listeners for the given name.
     */
    EventEmitter.prototype.off = function (name) {
        this._listeners[name] = [];
    };

    /**
     * Emit an event for the given name.
     * @param name
     */
    EventEmitter.prototype.emit = function (name) {
        if (this._listeners[name] === undefined) {
            return;
        }
        for (var i = 0; i < this._listeners[name].length; ++i) {
            this._listeners[name][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    };

    return EventEmitter;

})();
/**
 * Polymorphic format string.
 * @return {String}
 */
pandora.formatString = function () {
    var format = arguments[0];
    var firstOption = arguments[1];
    if (arguments.length === 1) {
        return format;
    } else if (firstOption && typeof firstOption === "object") {
        return pandora.formatDictionary.apply(this, arguments);
    } else {
        return pandora.formatArray.apply(this, arguments);
    }
};

/**
 * Return the formatted string
 * eg. pandora.formatArray("I <3 {0} and {1}", "Chocolate", "Linux") will return "I <3 Chocolate and Linux"
 * @return {String}
 */
// http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
pandora.formatArray = function () {
    var args = Array.prototype.slice.call(arguments, 1);
    return arguments[0].replace(/{(\d+)}/g, function (match, number) {
        return args[number];
    });
};

/**
 * Replaces construction of type `{<name>}` to the corresponding argument
 * eg. pandora.formatString("I <3 {loves.first} and {loves["second"]}", {"loves": {"first": "Chocolate", second: "Linux"}}) will return "I <3 Chocolate and Linux"
 * @return {String}
 */
// Borrowed from SnapSvg
pandora.formatDictionary = (function () {
    var tokenRegex = /\{([^\}]+)\}/g;
    var objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g;
    var replacer = function (all, key, obj) {
        var res = obj;
        key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
            name = name || quotedName;
            if (res !== undefined) {
                if (name in res) {
                    res = res[name];
                }
                if (typeof res === "function" && isFunc) {
                    res = res();
                }
            }
        });
        res = (res === null || res === obj ? all : res) + "";
        return res;
    };
    return function (str, obj) {
        return String(str).replace(tokenRegex, function (all, key) {
            return replacer(all, key, obj);
        });
    };
})();
/**
 * Convert the given input string to camelcase. Example: my-class-name -> MyClassName.
 * @param str {String} The string to convert.
 * @param sep {String?} The separator to use for the non-camelcase version of the string ("-" by default).
 * @returns {String}
 */
pandora.camelcase = function (str, sep) {
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
pandora.uncamelcase = function (str, sep) {
    return str.replace(/([A-Z])/g, function (m) {
        return sep + m.toLowerCase();
    }).substr(1);
};
/**
 * Iterates on the given container.
 * @param container {Array|Object} the container
 * @param fn {Function} a predicate to apply on each element, the loop breaks if the predicate returns true
 */
pandora.forEach = function (container, fn) {
    pandora.polymorphic(container, {
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
 * Merge the source object into the destination.
 * @param destination {Object}
 * @param source {Object}
 * @param recurse {Boolean?}
 * @param override {Boolean?}
 */
pandora.mergeObjects = function (destination, source, recurse, override) {
    for (var k in source) {
        if (source.hasOwnProperty(k)) {
            if (recurse && typeof source[k] === "object") {
                destination[k] = destination[k] || {};
                pandora.mergeObjects(destination[k], source[k], recurse);
            } else if (override || destination[k] === undefined) {
                destination[k] = source[k];
            }
        }
    }
    return destination;
};
pandora.Exception = (function () {

    /**
     * @returns {Error}
     * @constructor
     */
    return pandora.class_("Exception", function () {
        var error = new Error(pandora.formatString.apply(null, arguments));
        error.name = pandora.typename(this);
        return error;
    });

})();
pandora.MissingOverloadError = (function () {

    /**
     * Custom Error to handle missing overloads.
     * @param method {String} The name of the missing method.
     * @param cls {String} The class in which the method in missing.
     * @constructor
     */
    return pandora.class_("MissingOverloadError", pandora.Exception, function (method, cls) {
        var clsName = cls !== undefined ? cls + ".prototype._" : "_";
        return pandora.Exception.call(this, "{0}{1}() overload is missing", clsName, method);
    });

})();

/**
 * Clamp a value between a minimum number and maximum number value.
 * @param value {Number}
 * @param min {Number}
 * @param max {Number}
 * @return {Number}
 */
pandora.clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};
pandora.Box2 = (function () {

    /**
     * Represent a 2D box.
     * @param x {Number|pandora.Vec2|pandora.Box2|Array}
     * @param y {Number|pandora.Vec2}
     * @param width {Number}
     * @param height {Number}
     * @constructor
     */
    var Box2 = pandora.class_("Box2", function (x, y, width, height) {
        this.assign(x, y, width, height);
    });

    /**
     * Set the coordinates of this 2D box from the given one.
     * @param {...}
     */
    Box2.prototype.assign = function () {
        var x = arguments[0];
        var y = arguments[1];
        var width = arguments[2];
        var height = arguments[3];
        if (x === undefined) {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        } else if (pandora.typename(x) === "Number" && y === undefined) {
            this.x = x;
            //noinspection JSSuspiciousNameCombination
            this.y = x;
            //noinspection JSSuspiciousNameCombination
            this.width = x;
            //noinspection JSSuspiciousNameCombination
            this.height = x;
        } else if (pandora.typename(x) === "Vec2" && pandora.typename(y) === "Vec2") {
            this.x = x.x;
            this.y = x.y;
            this.width = y.x;
            this.height = y.y;
        } else if (pandora.typename(x) === "Array") {
            this.x = x[0];
            this.y = x[1];
            this.width = x[2];
            this.height = x[3];
        } else if (x.x !== undefined && x.y !== undefined && x.width !== undefined && x.height !== undefined) {
            this.x = x.x;
            this.y = x.y;
            this.width = x.width;
            this.height = x.height;
        } else if (x.left !== undefined && x.right !== undefined && x.top !== undefined && x.bottom !== undefined) {
            this.x = x.left;
            this.y = x.top;
            this.width = x.right - x.left;
            this.height = x.bottom - x.top;
        } else {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        return this;
    };

    /**
     * Return a copy of this box.
     * @returns {pandora.Box2}
     */
    Box2.prototype.clone = function () {
        return new Box2(this.x, this.y, this.width, this.height);
    };

    /**
     * Convert the box into a javascript array.
     * @returns {[Number, Number, Number, Number]}
     */
    Box2.prototype.toArray = function () {
        return [this.x, this.y, this.width, this.height];
    };

    /**
     * Check whether the given other collides with this one.
     * @param other {pandora.Box2}
     * @returns {boolean}
     */
    Box2.prototype.collide = function (other) {
        return pandora.polymorphic(other, {
            "Vec2": function () {
                return other.x >= this.x && other.x <= this.x + this.width &&
                    other.y >= this.y && other.y <= this.y + this.height;
            }.bind(this),
            "Box2": function () {
                return this.x < other.x + other.width && this.x + this.width > other.x &&
                    this.y < other.y + other.height && this.height + this.y > other.y;
            }.bind(this)
        });
    };

    /**
     * Check whether the given other fit within this one.
     * @param other {pandora.Box2}
     * @returns {boolean}
     */
    Box2.prototype.contain = function (other) {
        return pandora.polymorphic(other, {
            "Vec2": function () {
                return other.x >= this.x && other.x <= this.x + this.width &&
                    other.y >= this.y && other.y <= this.y + this.height;
            }.bind(this),
            "Box2": function () {
                return other.x > this.x && other.x + other.width < this.x + this.width &&
                    other.y > this.y && other.y + other.height < this.y + this.height;
            }.bind(this)
        });
    };

    return Box2;

})();

pandora.Vec2 = (function () {

    /**
     * Represent a two-dimensional vector.
     * @param x {Number|Array|pandora.Vec2}
     * @param y {Number}
     * @constructor
     */
    var Vec2 = pandora.class_("Vec2", function (x, y) {
        this.assign(x, y);
    });

    /**
     * Set the coordinates of this vector from the given one.
     * @param {...}
     */
    Vec2.prototype.assign = function () {
        var x = arguments[0];
        var y = arguments[1];
        if (x === undefined) {
            this.x = 0;
            this.y = 0;
        } else if (typeof x === "number" && y === undefined) {
            this.x = x;
            //noinspection JSSuspiciousNameCombination
            this.y = x;
        } else if (pandora.typename(x) === "Array") {
            this.x = x[0];
            this.y = x[1];
        } else if ((pandora.typename(x) === "Vec2") || typeof x.x === "number" && typeof x.y === "number") {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
        return this;
    };

    /**
     * Return a copy of this vector.
     * @returns {pandora.Box2}
     */
    Vec2.prototype.clone = function () {
        return new Vec2(this.x, this.y);
    };

    /**
     * Returns the Vec2 has 2D array
     * @returns {Number[]}
     */
    Vec2.prototype.toArray = function () {
        return [this.x, this.y];
    };

    /**
     * Check collision between this vec2 and the given circle.
     * @param center {pandora.Vec2|{x: Number, y: Number}}
     * @param radius {Number}
     * @returns {boolean}
     */
    Vec2.prototype.collideCircle = function (center, radius) {
        radius = radius || 5;
        var dx = this.x - center.x;
        var dy = this.y - center.y;
        return Math.sqrt(dx * dx + dy * dy) < radius * 2;
    };

    /**
     * Add the given object to this Vec2.
     * @param other {Number|pandora.Vec2}
     */
    Vec2.prototype.add = function (other) {
        pandora.polymorphic(other, {
            "Number": function () {
                this.x += other;
                this.y += other;
            }.bind(this),
            "Vec2": function () {
                this.x += other.x;
                this.y += other.y;
            }.bind(this)
        });
        return this;
    };

    /**
     * Subtract the given object to this Vec2.
     * @param other {Number|pandora.Vec2}
     */
    Vec2.prototype.subtract = function (other) {
        pandora.polymorphic(other, {
            "Number": function () {
                this.x -= other;
                this.y -= other;
            }.bind(this),
            "Vec2": function () {
                this.x -= other.x;
                this.y -= other.y;
            }.bind(this)
        });
        return this;
    };

    /**
     * Multiply the given object to this Vec2.
     * @param other {Number|pandora.Vec2}
     */
    Vec2.prototype.multiply = function (other) {
        pandora.polymorphic(other, {
            "Number": function () {
                this.x *= other;
                this.y *= other;
            }.bind(this),
            "Vec2": function () {
                this.x *= other.x;
                this.y *= other.y;
            }.bind(this)
        });
        return this;
    };

    /**
     * Divide the given object to this Vec2.
     * @param other {Number|pandora.Vec2}
     */
    Vec2.prototype.divide = function (other) {
        pandora.polymorphic(other, {
            "Number": function () {
                this.x /= other;
                this.y /= other;
            }.bind(this),
            "Vec2": function () {
                this.x /= other.x;
                this.y /= other.y;
            }.bind(this)
        });
        return this;
    };

    return Vec2;

})();

/**
 * @namespace pandora
 * @type {Object}
 */
var cg = (function() {
    var namespace = {};
    if (typeof exports !== "undefined") {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = namespace;
        }
        exports.cg = namespace;
    } else {
        window.cg = namespace;
    }
    return namespace;
})();
cg.GraphError = (function () {

    /**
     * Handle graph related errors.
     * @constructor
     */
    return pandora.class_("GraphError", function () {
        return pandora.Exception.apply(this, arguments);
    });

})();
cg.GraphSerializationError = (function () {

    /**
     * Handle graph serialization related errors.
     * @constructor
     */
    return pandora.class_("GraphSerializationError", function () {
        return pandora.Exception.apply(this, arguments);
    });

})();
/**
 * This file gathers some stub that could be moved to pandora
 */

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
cg.UUID = (function () {

    /**
     * Generate a random bit of a UUID
     * @returns {String}
     */
    var s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    /**
     * Random salted UUID generator
     * @type {Object}
     */
    var UUID = {
        "salt": s4()
    };

    /**
     * Generate a random salted UUID
     * @returns {String}
     */
    UUID.generate = function () {
        return UUID.salt + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    };

    return UUID;

})();
cg.Graph = (function () {

    /**
     * Represents the graph whom holds the entities
     * @extends {pandora.EventEmitter}
     * @constructor
     */
    var Graph = pandora.class_("Graph", pandora.EventEmitter, function () {
        pandora.EventEmitter.call(this);

        /**
         * All existing types for this graph instance, the key being the type name and the value being an array
         * of all possible conversions.
         * @type {Object<String, Array>}
         */
        this._cgTypes = {
            "Stream": ["Stream"],
            "Array": ["Array"],
            "String": ["String"],
            "Number": ["Number", "Boolean"],
            "Boolean": ["Boolean", "Number"]
        };

        /**
         * All validators attached to types.
         */
        this._validators = {
            "Array": function (value) {
                return pandora.typename(value) === "Array";
            },
            "String": function (value) {
                return pandora.typename(value) === "String";
            },
            "Number": function (value) {
                return pandora.typename(value) === "Number";
            },
            "Boolean": function (value) {
                return pandora.typename(value) === "Boolean";
            }
        };

        /**
         * Collection of blocks in the graph
         * @type {Array<cg.Block>}
         * @private
         */
        this._cgBlocks = [];
        Object.defineProperty(this, "cgBlocks", {
            get: function () {
                return this._cgBlocks;
            }.bind(this)
        });

        /**
         * Map to access a block by its id
         * @type {Object} {"42": {cg.Block}}
         * @private
         */
        this._cgBlocksIds = {};
        Object.defineProperty(this, "cgBlocksIds", {
            get: function () {
                return this._cgBlocksIds;
            }.bind(this)
        });

        /**
         * Connections between blocks points
         * @type {Array<cg.Connection>}
         * @private
         */
        this._cgConnections = [];
        Object.defineProperty(this, "cgConnections", {
            get: function () {
                return this._cgConnections;
            }.bind(this)
        });
    });

    /**
     * Add a validator predicate for the given `type`
     * @param type {String} The type on which this validator will be applied
     * @param fn {Function} A function which takes a value in parameter and returns true if it can be assigned
     */
    Graph.prototype.addValidator = function (type, fn) {
        this._validators[type] = fn;
    };

    /**
     * Checks whether the first type can be converted into the second one.
     * @param firstType {String}
     * @param secondType {String}
     * @returns {Boolean}
     */
    Graph.prototype.canConvert = function (firstType, secondType) {
        return this._cgTypes[firstType] && this._cgTypes[firstType].indexOf(secondType) !== -1;
    };

    /**
     * Checks whether the given `value` is assignable to the given `type`.
     * @param value {*} A value to check.
     * @param type {String} The type that the value should have
     */
    Graph.prototype.canAssign = function (value, type) {
        return value === null || (this._validators[type] && this._validators[type](value));
    };

    /**
     * Adds a block to the graph
     * @param {cg.Block} cgBlock to add to the graph
     * @emit "cg-block-create" {cg.Block}
     * @return {cg.Block}
     */
    Graph.prototype.addBlock = function (cgBlock) {
        var cgBlockId = cgBlock.cgId;
        if (cgBlock.cgGraph !== this) {
            throw new cg.GraphError("Graph::addBlock() This block does not belong to this graph");
        }
        if (cgBlockId === null || cgBlockId === undefined) {
            throw new cg.GraphError("Graph::addBlock() Block id is null");
        }
        if (this._cgBlocksIds[cgBlockId]) {
            throw new cg.GraphError("Graph::addBlock() Block with id `{0}` already exists", cgBlockId);
        }
        this._cgBlocks.push(cgBlock);
        this._cgBlocksIds[cgBlockId] = cgBlock;
        this.emit("cg-block-create", cgBlock);
        return cgBlock;
    };

    /**
     * Removes a block from the graph
     * @param cgBlock {cg.Block}
     */
    Graph.prototype.removeBlock = function (cgBlock) {
        var blockFoundIndex = this._cgBlocks.indexOf(cgBlock);
        if (blockFoundIndex === -1 || cgBlock.cgGraph !== this) {
            throw new cg.GraphError("Graph::removeBlock() This block does not belong to this graph");
        }
        var cgBlockPoints = cgBlock.cgOutputs.concat(cgBlock.cgInputs);
        pandora.forEach(cgBlockPoints, function (cgBlockPoint) {
            this.disconnectPoint(cgBlockPoint);
        }.bind(this));
        this._cgBlocks.splice(blockFoundIndex, 1);
        delete this._cgBlocksIds[cgBlock.cgId];
        this.emit("cg-block-remove", cgBlock);
    };

    /**
     * Returns a connection between two points
     * @param {cg.Point} cgOutputPoint
     * @param {cg.Point} cgInputPoint
     * @emit "cg-connection-create" {cg.Connection}
     * @returns {cg.Connection|null}
     */
    Graph.prototype.connectPoints = function (cgOutputPoint, cgInputPoint) {
        if (this.connectionByPoints(cgOutputPoint, cgInputPoint) !== null) {
            throw new cg.GraphError("Graph::connectPoints() Connection already exists between these two points: `{0}` and `{1}`", cgOutputPoint.cgName, cgInputPoint.cgName);
        }
        if (cgOutputPoint.isOutput === cgInputPoint.isOutput) {
            throw new cg.GraphError("Graph::connectPoints() Cannot connect either two inputs or two outputs: `{0}` and `{1}`", cgOutputPoint.cgName, cgInputPoint.cgName);
        }
        if (!this.canConvert(cgOutputPoint.cgValueType, cgInputPoint.cgValueType)) {
            throw new cg.GraphError("Graph::connectPoints() Cannot connect two points of different value types: `{0}` and `{1}`", cgOutputPoint.cgValueType, cgInputPoint.cgValueType);
        }
        var cgConnection = new cg.Connection(cgOutputPoint, cgInputPoint);
        this._cgConnections.push(cgConnection);
        cgOutputPoint._cgConnections.push(cgConnection);
        cgInputPoint._cgConnections.push(cgConnection);
        this.emit("cg-connection-create", cgConnection);
        return cgConnection;
    };

    /**
     * Removes a connection between two points
     * @param {cg.Point} cgOutputPoint
     * @param {cg.Point} cgInputPoint
     * @emit "cg-connection-create" {cg.Connection}
     * @returns {cg.Connection|null}
     */
    Graph.prototype.disconnectPoints = function (cgOutputPoint, cgInputPoint) {
        var cgConnection = this.connectionByPoints(cgOutputPoint, cgInputPoint);
        if (cgConnection === null) {
            throw new cg.GraphError("Graph::disconnectPoints() No connections between these two points: `{0}` and `{1}`", cgOutputPoint.cgName, cgInputPoint.cgName);
        }
        this._cgConnections.splice(this._cgConnections.indexOf(cgConnection), 1);
        cgOutputPoint._cgConnections.splice(this._cgConnections.indexOf(cgConnection), 1);
        cgInputPoint._cgConnections.splice(this._cgConnections.indexOf(cgConnection), 1);
        this.emit("cg-connection-remove", cgConnection);
    };

    /**
     * Disconnect all connections from this point
     * @param cgPoint {cg.Point}
     */
    Graph.prototype.disconnectPoint = function (cgPoint) {
        var cgPointConnections = cgPoint.cgConnections;
        pandora.forEach(cgPointConnections, function (cgConnection) {
            this.disconnectPoints(cgConnection.cgOutputPoint, cgConnection.cgInputPoint);
        }.bind(this));
    };

    /**
     * Returns a block by it's unique id
     * @param {String} cgBlockId
     * @return {cg.Block}
     */
    Graph.prototype.blockById = function (cgBlockId) {
        var cgBlock = this._cgBlocksIds[cgBlockId];
        if (!cgBlock) {
            throw new cg.GraphError("Graph::blockById() Block not found for id `{0}`", cgBlockId);
        }
        return cgBlock;
    };

    /**
     * Returns the next unique block id
     * @returns {String}
     */
    Graph.prototype.nextBlockId = function () {
        return cg.UUID.generate();
    };

    /**
     * Returns the list of connections for every points in the given block
     * @param cgBlock
     * @returns {Array<cg.Connection>}
     */
    Graph.prototype.connectionsByBlock = function (cgBlock) {
        var cgConnections = [];
        pandora.forEach(this._cgConnections, function (cgConnection) {
            if (cgConnection.cgOutputPoint.cgBlock === cgBlock || cgConnection.cgInputPoint.cgBlock === cgBlock) {
                cgConnections.push(cgConnection);
            }
        });
        return cgConnections;
    };

    /**
     * Returns a connection between two points
     * @param {cg.Point} cgOutputPoint
     * @param {cg.Point} cgInputPoint
     * @returns {cg.Connection|null}
     */
    Graph.prototype.connectionByPoints = function (cgOutputPoint, cgInputPoint) {
        return pandora.findIf(this._cgConnections, function (cgConnection) {
            return cgConnection.cgOutputPoint === cgOutputPoint && cgConnection.cgInputPoint === cgInputPoint;
        });
    };

    /**
     * Returns the list of connections for a given point
     * @param {cg.Point} cgPoint
     * @returns {Array<cg.Connection>}
     */
    Graph.prototype.connectionsByPoint = function (cgPoint) {
        var cgConnections = [];
        pandora.forEach(this._cgConnections, function (cgConnection) {
            if (cgConnection.cgOutputPoint === cgPoint || cgConnection.cgInputPoint === cgPoint) {
                cgConnections.push(cgConnection);
            }
        });
        return cgConnections;
    };

    /**
     * Clone all the given blocks
     * If connections exist between the cloned blocks, this method will try to recreate them
     * Connections from/to a cloned block to/from a non cloned block won't be duplicated
     * @param cgBlocks {Array<cg.Block>}
     * @returns {Array<cg.Block>} the cloned blocks
     */
    Graph.prototype.cloneBlocks = function (cgBlocks) {
        var cgCorrespondingBlocks = [];
        var cgClonedBlocks = [];
        var cgConnectionsToClone = [];
        pandora.forEach(cgBlocks, function (cgBlock) {
            var cgConnections = this.connectionsByBlock(cgBlock);
            var cgClonedBlock = cgBlock.clone(this);
            this.addBlock(cgClonedBlock);
            cgClonedBlocks.push(cgClonedBlock);
            cgCorrespondingBlocks[cgBlock.cgId] = cgClonedBlock;
            pandora.forEach(cgConnections, function (cgConnection) {
                if (cgConnectionsToClone.indexOf(cgConnection) === -1 &&
                    cgBlocks.indexOf(cgConnection.cgOutputPoint.cgBlock) !== -1 &&
                    cgBlocks.indexOf(cgConnection.cgInputPoint.cgBlock) !== -1) {
                    cgConnectionsToClone.push(cgConnection);
                }
            });
        }.bind(this));
        pandora.forEach(cgConnectionsToClone, function (cgConnectionToClone) {
            try {
                cgCorrespondingBlocks[cgConnectionToClone.cgOutputPoint.cgBlock.cgId]
                        .outputByName(cgConnectionToClone.cgOutputPoint.cgName)
                    .connect(cgCorrespondingBlocks[cgConnectionToClone.cgInputPoint.cgBlock.cgId]
                        .inputByName(cgConnectionToClone.cgInputPoint.cgName));
            } catch (exception) {
                throw new cg.GraphError("Graph::cloneBlocks() Connection duplication silenced exception: " + exception);
            }
        });
        return cgClonedBlocks;
    };

    return Graph;

})();
cg.Block = (function () {

    /**
     * Block is the base class for all codegraph nodes
     * A Block has a list of inputs and outputs points
     * @param cgGraph {cg.Graph}
     * @param cgBlockId {String}
     * @constructor
     */
    var Block = pandora.class_("Block", function (cgGraph, cgBlockId) {
        /**
         * Check the reference to the graph
         */
        (function Initialization() {
            if (!cgGraph) {
                throw new cg.GraphError("Block() Cannot create a Block without a graph");
            }
        })();

        /**
         * Reference to the graph
         * @type {cg.Graph}
         * @private
         */
        this._cgGraph = cgGraph;
        Object.defineProperty(this, "cgGraph", {
            get: function () {
                return this._cgGraph;
            }.bind(this)
        });

        /**
         * Unique id of this block
         * @type {String}
         * @private
         */
        this._cgId = cgBlockId || cgGraph.nextBlockId();
        Object.defineProperty(this, "cgId", {
            get: function () {
                return this._cgId;
            }.bind(this)
        });

        /**
         * Block fancy name
         * @type {String}
         * @emit "cg-block-name-changed" {cg.Block} {String} {String}
         * @private
         */
        this._cgName = pandora.typename(this);
        Object.defineProperty(this, "cgName", {
            get: function () {
                return this._cgName;
            }.bind(this),
            set: function (cgName) {
                var oldCgName = this._cgName;
                this._cgName = cgName;
                this._cgGraph.emit("cg-block-name-changed", this, oldCgName, cgName);
            }.bind(this)
        });

        /**
         * Template types that can be used on this block points. Each template type contains a list of possibly
         * applicable types.
         * @type {Array}
         * @private
         */
        this._cgTemplates = [];

        /**
         * Output points
         * @type {Array<cg.Point>}
         * @private
         */
        this._cgOutputs = [];
        Object.defineProperty(this, "cgOutputs", {
            get: function () {
                return this._cgOutputs;
            }.bind(this)
        });

        /**
         * Input points
         * @type {Array<cg.Point>}
         * @private
         */
        this._cgInputs = [];
        Object.defineProperty(this, "cgInputs", {
            get: function () {
                return this._cgInputs;
            }.bind(this)
        });

    });

    /**
     * Adds an input or an output point
     * @param cgPoint {cg.Point}
     * @emit "cg-point-create" {cg.Block} {cg.Point}
     * @return {cg.Point}
     */
    Block.prototype.addPoint = function (cgPoint) {
        if (cgPoint.cgBlock !== this) {
            throw new cg.GraphError("Block::addPoint() Point is not bound to this block: `{0}`", cgPoint.cgName);
        }
        if (cgPoint.isOutput && this.outputByName(cgPoint.cgName) || !cgPoint.isOutput && this.inputByName(cgPoint.cgName)) {
            throw new cg.GraphError("Block::addPoint() Block has already an {0}: `{1}`", (cgPoint.isOutput ? "output" : "input"), cgPoint.cgName);
        }
        if (cgPoint.isOutput) {
            this._cgOutputs.push(cgPoint);
        } else {
            this._cgInputs.push(cgPoint);
        }
        this._cgGraph.emit("cg-point-create", this, cgPoint);
        return cgPoint;
    };

    /**
     * Returns whether this block contains the specified output
     * @param {String} cgOutputName
     * @return {cg.Point|null}
     */
    Block.prototype.outputByName = function (cgOutputName) {
        return pandora.findIf(this._cgOutputs, function (cgOutput) {
            return cgOutput.cgName === cgOutputName;
        });
    };

    /**
     * Returns whether this block contains the specified input
     * @param {String} cgInputName
     * @return {cg.Point|null}
     */
    Block.prototype.inputByName = function (cgInputName) {
        return pandora.findIf(this._cgInputs, function (cgInput) {
            return cgInput.cgName === cgInputName;
        });
    };

    /**
     * Returns a copy of this block
     * @param cgGraph {cg.Graph} The graph on which the cloned block will be attached to
     * @return {cg.Block}
     */
    Block.prototype.clone = function (cgGraph) {
        if (pandora.typename(this) !== "Block") {
            throw new pandora.Exception("Block::clone() method must be overridden by `{0}`", pandora.typename(this));
        }
        var cgBlockClone = new cg.Block(cgGraph);
        cgBlockClone.cgName = this._cgName;
        pandora.forEach(this._cgOutputs, function (cgOutput) {
            var cgOutputClone = cgOutput.clone(cgBlockClone);
            cgBlockClone.addPoint(cgOutputClone);
        });
        pandora.forEach(this._cgInputs, function (cgInput) {
            var cgInputClone = cgInput.clone(cgBlockClone);
            cgBlockClone.addPoint(cgInputClone);
        });
        return cgBlockClone;
    };

    return Block;

})();
cg.Point = (function () {

    /**
     * A point represents either an input or an output in a block, it has a name and a value type
     * A point can also have one or many references to other points:
     *    - The outbound point must be an output
     *    - The outbound point value type must be accepted by the inbound point
     *    - The outbound point must have a back reference to this point
     * Example for an input point:
     * {
     *      "cgBlock": "1", // The unique identifier to the block, required
     *      "cgName": "sum a", // The block input name, required
     *      "cgValueType": "Number", // The point value type, required
     *      "cgValue": 32 // The point value for an input, not required
     * }
     * Example for an output point:
     * {
     *      "cgBlock": "1", // The unique identifier to the block, required
     *      "cgName": "result", // The block output name, required
     *      "cgValueType": "Number", // The point value type, required
     *      // For an output, "cgValue" should be generated by the block and read only
     * }
     * @param cgBlock {cg.Block} The block this point refers to
     * @param cgName {String} The block point name for the input or output
     * @param isOutput {Boolean} True if this point is an output, False for an input
     * @constructor
     */
    var Point = pandora.class_("Point", function (cgBlock, cgName, isOutput) {
        /**
         * The graph of the block
         * @type {cg.Graph}
         * @private
         */
        this._cgGraph = cgBlock.cgGraph;
        Object.defineProperty(this, "cgGraph", {
            get: function () {
                return this._cgGraph;
            }.bind(this)
        });

        /**
         * The block it belongs to
         * @type {cg.Block}
         * @private
         */
        this._cgBlock = cgBlock;
        Object.defineProperty(this, "cgBlock", {
            get: function () {
                return this._cgBlock;
            }.bind(this)
        });

        /**
         * The block input/output name
         * @private
         */
        this._cgName = cgName;
        Object.defineProperty(this, "cgName", {
            get: function () {
                return this._cgName;
            }.bind(this)
        });

        /**
         * Point type, True if this point is an output, False for an input
         * @type {Boolean}
         * @private
         */
        this._isOutput = isOutput;
        Object.defineProperty(this, "isOutput", {
            get: function () {
                return this._isOutput;
            }.bind(this)
        });

        /**
         * Connections from/to this point
         * @type {Array<cg.Connection>}
         * @private
         */
        this._cgConnections = [];
        Object.defineProperty(this, "cgConnections", {
            get: function () {
                return this._cgConnections;
            }.bind(this)
        });

        /**
         * The maximum number of connections this point can accept
         * [0; Infinity] number of connections
         * @type {Number}
         * @private
         */
        this._cgMaxConnections = 1;
        Object.defineProperty(this, "cgMaxConnections", {
            get: function () {
                return this._cgMaxConnections;
            }.bind(this),
            set: function (cgMaxConnections) {
                if (cgMaxConnections instanceof Number || cgMaxConnections < 0) {
                    throw new cg.GraphError("Point::cgMaxConnections must be a zero or positive number");
                }
                this._cgMaxConnections = cgMaxConnections;
            }.bind(this)
        });

        /**
         * The point current value type
         * Example: Number (Yellow color)
         * @type {String|null}
         * @emit "cg-point-value-type-change" {cg.Point} {Object} {Object}
         * @private
         */
        this._cgValueType = null;
        Object.defineProperty(this, "cgValueType", {
            get: function () {
                return this._cgValueType;
            }.bind(this),
            set: function (cgValueType) {
                var old = this._cgValueType;
                this._cgValueType = cgValueType;
                this._cgGraph.emit("cg-point-value-type-change", this, old, cgValueType);
            }.bind(this)
        });

        /**
         * The point current value
         * @type {Object|null}
         * @emit "cg-point-value-change" {cg.Point} {Object} {Object}
         * @private
         */
        this._cgValue = null;
        Object.defineProperty(this, "cgValue", {
            configurable: true,
            get: function () {
                return this._cgValue;
            }.bind(this),
            set: function (cgValue) {
                if (this._cgGraph.canAssign(cgValue, this._cgValueType)) {
                    var oldCgValue = this._cgValue;
                    this._cgValue = cgValue;
                    this._cgGraph.emit("cg-point-value-change", this, oldCgValue, cgValue);
                } else {
                    throw new cg.GraphError("Point::cgValue Invalid value `{0}` for `{1}` in `{2}`",
                        String(cgValue),
                        this._cgValueType, this._cgName);
                }
            }.bind(this)
        });

    });

    /**
     * Adds a connection from this inbound point to an outbound point
     * @param {cg.Point} cgPoint
     * @return {cg.Connection}
     */
    Point.prototype.connect = function (cgPoint) {
        if (this._cgConnections.length >= this._cgMaxConnections) {
            throw new cg.GraphError("Point::connect() Cannot accept more than `{0}` connection(s)", this._cgMaxConnections);
        }
        if (this._isOutput) {
            this._cgGraph.connectPoints(this, cgPoint);
        } else {
            this._cgGraph.connectPoints(cgPoint, this);
        }
    };

    /**
     * Returns a copy of this point
     * @param cgBlock {cg.Block} The block on which this cloned point will be attached to
     * @return {cg.Point}
     */
    Point.prototype.clone = function (cgBlock) {
        if (pandora.typename(this) !== "Point") {
            throw new pandora.Exception("Point::clone() method must be overridden by `{0}`", pandora.typename(this));
        }
        var cgPointClone = new cg.Point(cgBlock, this._cgName, this._isOutput);
        cgPointClone.cgValueType = this._cgValueType;
        cgPointClone.cgValue = this._cgValue;
        return cgPointClone;
    };

    return Point;

})();
cg.Connection = (function () {

    /**
     * Connection connects one output point to an input point
     * There can be only one connection for two given output/input points
     * @constructor
     */
    var Connection = pandora.class_("Connection", function (cgOutputPoint, cgInputPoint) {
        /**
         * Check if the points are correct
         */
        (function Initialization() {
            if (!cgOutputPoint.isOutput) {
                throw new cg.GraphError("Connection() cgOutputPoint is not an output");
            }
            if (cgInputPoint.isOutput) {
                throw new cg.GraphError("Connection() cgInputPoint is not an input");
            }
        })();

        /**
         * The output point where the connection begins
         * @type {cg.Point}
         * @private
         */
        this._cgOutputPoint = cgOutputPoint;
        Object.defineProperty(this, "cgOutputPoint", {
            get: function () {
                return this._cgOutputPoint;
            }.bind(this)
        });

        /**
         * The input point where the connection ends
         * @type {cg.Point}
         * @private
         */
        this._cgInputPoint = cgInputPoint;
        Object.defineProperty(this, "cgInputPoint", {
            get: function () {
                return this._cgInputPoint;
            }.bind(this)
        });

    });

    /***
     * Returns the other point
     * @param cgPoint {cg.Point}
     * returns {cg.Point}
     */
    Connection.prototype.otherPoint = function (cgPoint) {
        if (cgPoint === this._cgOutputPoint) {
            return this._cgInputPoint;
        } else if (cgPoint === this._cgInputPoint) {
            return this._cgOutputPoint;
        }
        throw new cg.GraphError("Connection::otherPoint() Point `{0}` is not in this connection", cgPoint.cgName);
    };

    return Connection;

})();
cg.Function = (function() {

    /**
     *
     * @extends {cg.Block}
     * @param cgGraph {cg.Graph}
     * @param cgId {String}
     * @constructor
     */
    var Function = pandora.class_("Function", cg.Block, function(cgGraph, cgId) {
        cg.Block.call(this, cgGraph, cgId);
    });

    return Function;

})();
cg.Instruction = (function() {

    /**
     *
     * @extends {cg.Block}
     * @param cgGraph {cg.Graph}
     * @param cgId {String}
     * @constructor
     */
    var Instruction = pandora.class_("Instruction", cg.Block, function(cgGraph, cgId) {
        cg.Block.call(this, cgGraph, cgId);
    });

    return Instruction;

})();
cg.Stream = (function () {

    /**
     * A stream
     * @type {Function}
     */
    var Stream = pandora.class_("Stream", cg.Point, function (cgBlock, cgName, isOutput) {
        cg.Point.call(this, cgBlock, cgName, isOutput);
        this._cgMaxConnections = 1;
        this._cgValueType = "Stream";
        Object.defineProperty(this, "cgValue", {
            get: function () {
                throw new cg.GraphError("Stream has no `cgValue`.");
            }.bind(this),
            set: function () {
                throw new cg.GraphError("Stream has no `cgValue`.");
            }.bind(this)
        });
    });

    /**
     * Returns a copy of this Stream
     * @param cgBlock {cg.Block} The block on which the cloned stream will be attached to
     * @returns {*}
     */
    Stream.prototype.clone = function (cgBlock) {
        return new cg.Stream(cgBlock, this._cgName, this._isOutput);
    };

    return Stream;

})();
cg.JSONLoader = (function () {

    /**
     *
     * @extends {pandora.EventEmitter}
     * @constructor
     */
    var JSONLoader = pandora.class_("JSONLoader", pandora.EventEmitter, function () {
        pandora.EventEmitter.call(this);
    });

    /**
     *
     * @param cgGraph {cg.Graph}
     * @param cgBlocksData {Array<{cgType: "Function", cgId: "32", cgInputs: *Object, cgOutputs: *Object}>}
     * @param cgConnectionsData {Array<{cgOutputBlockId: String, cgOutputName: String, cgInputBlockId: String, cgInputName: String,}>}
     */
    JSONLoader.prototype.load = function (cgGraph, cgBlocksData, cgConnectionsData) {
        this._loadBlocks(cgGraph, cgBlocksData);
        this._loadPoints(cgGraph, cgBlocksData);
        if (cgConnectionsData) {
            this._loadConnections(cgGraph, cgConnectionsData);
        }
    };

    /**
     *
     * @param cgGraph {cg.Graph}
     * @param cgBlocksData {Array<{cgType: "Function", cgId: "32"}>}
     * @private
     */
    JSONLoader.prototype._loadBlocks = function (cgGraph, cgBlocksData) {
        pandora.forEach(cgBlocksData, function (cgBlockData) {
            if (!cgBlockData.hasOwnProperty("cgId")) {
                throw new cg.GraphSerializationError("JSONLoader::_loadBlocks() Block property `cgId` is required");
            }
            var cgBlockType = cgBlockData.cgType || "Block";
            var cgBlockDeserializer = this[pandora.camelcase("_loadBlock" + cgBlockType)];
            if (!cgBlockDeserializer) {
                throw new cg.GraphSerializationError("JSONLoader::_loadBlocks() Block `{0}`: Cannot deserialize block of type `{1}`", cgBlockData.cgId, cgBlockType);
            }
            cgBlockDeserializer(cgGraph, cgBlockData);
        }.bind(this));
    };

    /**
     *
     * @param cgGraph {cg.Graph}
     * @param cgBlockData {{cgId: "32", cgType: "Block|undefined"}}
     * @returns {cg.Block}
     * @private
     */
    JSONLoader.prototype._loadBlockBlock = function(cgGraph, cgBlockData) {
        var cgBlock = new cg.Block(cgGraph, cgBlockData.cgId);
        cgGraph.addBlock(cgBlock);
        return cgBlock;
    };

    /**
     *
     * @param cgGraph {cg.Graph}
     * @param cgBlocksData {Array<{cgId: "32", cgInputs: *Object, cgOutputs: *Object}>}
     * @private
     */
    JSONLoader.prototype._loadPoints = function (cgGraph, cgBlocksData) {
        var self = this;
        var loadPoint = function(cgBlock, cgPointData, isOutput) {
            if (!cgPointData.cgName) {
                throw new cg.GraphSerializationError("JSONLoader::_loadPoints() Block `{0}`: Point property `cgName` is required", cgBlock.cgId);
            }
            var cgPointType = cgPointData.cgType || "Point";
            var cgPointDeserializer = self[pandora.camelcase("_loadPoint" + cgPointType)];
            if (!cgPointDeserializer) {
                throw new cg.GraphSerializationError("JSONLoader::_loadPoints() Block `{0}`: Cannot deserialize point `{1}` of type `{2}`", cgBlock.cgId, cgPointData.cgName, cgPointType);
            }
            cgPointDeserializer(cgBlock, cgPointData, isOutput);
        };
        pandora.forEach(cgBlocksData, function (cgBlockData) {
            var cgBlock = cgGraph.blockById(cgBlockData.cgId);
            if (cgBlockData.cgOutputs) {
                pandora.forEach(cgBlockData.cgOutputs, function (output) {
                    loadPoint(cgBlock, output, true);
                });
            }
            if (cgBlockData.cgInputs) {
                pandora.forEach(cgBlockData.cgInputs, function (input) {
                    loadPoint(cgBlock, input, false);
                });
            }
        });
    };

    /**
     *
     * @param cgBlock {cg.Block}
     * @param cgPointData {Object}
     * @param isOutput {Boolean}
     * @returns {cg.Point}
     * @private
     */
    JSONLoader.prototype._loadPointPoint = function(cgBlock, cgPointData, isOutput) {
        var cgName = cgPointData.cgName;
        var cgValue = cgPointData.cgValue;
        var cgValueType = cgPointData.cgValueType;
        var cgPoint = new cg.Point(cgBlock, cgName, isOutput);
        if (!cgValueType) {
            throw new cg.GraphSerializationError("JSONLoader::_loadPointPoint() Block `{0}` and {1} `{2}`: cgValueType is required", cgBlock.cgId, (isOutput ? "output" : "input"), cgName);
        }
        cgPoint.cgValueType = cgValueType;
        if (cgValue !== undefined) {
            if (isOutput) {
                throw new cg.GraphSerializationError("JSONLoader::_loadPointPoint() Block `{0}` and {1} `{2}`: Cannot set cgValue for an output point", cgBlock.cgId, (isOutput ? "output" : "input"), cgName);
            }
            cgPoint.cgValue = cgValue;
        }
        cgBlock.addPoint(cgPoint);
        return cgPoint;
    };

    /**
     *
     * @param cgBlock {cg.Block}
     * @param cgPointData {Object}
     * @param isOutput {Boolean}
     * @returns {cg.Point}
     * @private
     */
    JSONLoader.prototype._loadPointStream = function(cgBlock, cgPointData, isOutput) {
        var cgPointStream = new cg.Stream(cgBlock, cgPointData.cgName, isOutput);
        cgBlock.addPoint(cgPointStream);
        return cgPointStream;
    };

    /**
     *
     * @param cgGraph {cg.Graph}
     * @param cgConnectionsData {Array<{cgOutputBlockId: String, cgOutputName: String, cgInputBlockId: String, cgInputName: String,}>}
     * @private
     */
    JSONLoader.prototype._loadConnections = function(cgGraph, cgConnectionsData) {
        pandora.forEach(cgConnectionsData, function (cgConnectionData) {
            var cgOutputBlockId = cgConnectionData.cgOutputBlockId;
            var cgOutputName = cgConnectionData.cgOutputName;
            var cgInputBlockId = cgConnectionData.cgInputBlockId;
            var cgInputName = cgConnectionData.cgInputName;
            var cgOutputBlock = cgGraph.blockById(cgOutputBlockId);
            if (!cgOutputBlock) {
                throw new cg.GraphSerializationError("JSONLoader::_loadConnections() Output block not found for id `{0}`", cgOutputBlockId);
            }
            var cgInputBlock = cgGraph.blockById(cgInputBlockId);
            if (!cgInputBlock) {
                throw new cg.GraphSerializationError("JSONLoader::_loadConnections() Input block not found for id `{0}`", cgInputBlockId);
            }
            var cgOutputPoint = cgOutputBlock.outputByName(cgOutputName);
            if (!cgOutputPoint) {
                throw new cg.GraphSerializationError("JSONLoader::_loadConnections() Output point `{0}` not found in block `{1}`", cgOutputName, cgOutputBlockId);
            }
            var cgInputPoint = cgInputBlock.inputByName(cgInputName);
            if (!cgInputPoint) {
                throw new cg.GraphSerializationError("JSONLoader::_loadConnections() Input point `{0}` not found in block `{1}`", cgInputName, cgInputBlockId);
            }
            cgOutputPoint.connect(cgInputPoint);
        });
    };

    return JSONLoader;

})();
cg.Renderer = (function () {

    var RENDERER_CONFIG = {
        "zoom": {
            "min": 0.25,
            "max": 5
        }
    };

    /**
     * Creates a new cg.Renderer from a DOM node and some graph data.
     * @extends {pandora.EventEmitter}
     * @constructor
     * @param svg The svg DOM Element on which the svg will be append
     * @param data The serialized renderer elements
     * @param cgGraph The graph that will be rendered
     */
    var Renderer = pandora.class_("Renderer", pandora.EventEmitter, function (svg, data, cgGraph) {
        pandora.EventEmitter.call(this);
        this._svg = d3.select(svg);
        this._root = this._svg.append("svg:g").attr("id", "cgRoot");
        this._data = data;
        this._cgGraph = cgGraph;

        /**
         * Returns all groups and blocks currently selected.
         * @type {d3.Array}
         */
        Object.defineProperty(this, "selection", {
            get: function () {
                return this._root.selectAll(".selected");
            }.bind(this)
        });
    });

    /**
     * Creates the svg nodes and  listen the graph's events in order to update the rendered svg graph.
     */
    Renderer.prototype.create = function () {
        this._createZoomBehavior();
        this._createGroups();
        this._createBlocks();
    };

    Renderer.prototype._createZoomBehavior = function () {
        var renderer = this;
        this._zoom = d3.behavior.zoom()
            .scaleExtent([RENDERER_CONFIG.zoom.min, RENDERER_CONFIG.zoom.max])
            .on("zoom", function () {
                if (d3.event.sourceEvent) {
                    pandora.preventCallback(d3.event.sourceEvent);
                }
                renderer._root.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                renderer._data.zoom.translate = renderer._zoom.translate();
                renderer._data.zoom.scale = renderer._zoom.scale();
            }.bind(this));
        this._svg.call(this._zoom);
    };

    Renderer.prototype._createGroups = function () {
        var currentGroup = this._root.append("svg:g").attr("id", "cgGroups")
            .selectAll(".cg-group")
            .data(this._data.groups, function (group) {
                return group.id;
            })
            .enter()
            .append("svg:g")
                .attr("class", "cg-group")
                .attr("transform", function (group) { return "translate(" + group.position + ")"; })
                .call(this._createDragBehavior());
        currentGroup
            .append("svg:rect")
            .attr("rx", 5).attr("ry", 5)
            .attr("width", function (group) { return group.size[0]; })
            .attr("height", function (group) { return group.size[1]; });
        currentGroup
            .append("svg:text")
                .text(function (group) { return group.description; })
                .attr("class", "cg-title")
                .attr("text-anchor", "middle")
                .attr("transform", function (group) { return "translate(" + [group.size[0] / 2, 15] + ")"; });
    };

    Renderer.prototype._createBlocks = function () {
        var currentBlock = this._root.append("svg:g").attr("id", "cgBlocks")
            .selectAll(".cg-block")
            .data(this._data.blocks, function (block) {
                return block.id;
            })
            .enter()
            .append("svg:g")
                .attr("class", "cg-block")
                .call(this._createDragBehavior());
        currentBlock
            .append("svg:rect")
                .attr("transform", function (block) { return "translate(" + block.position + ")"; })
                .attr("rx", 5).attr("ry", 5)
                .attr("width", function () { return 100; })
                .attr("height", function () { return 100; });
    };

    Renderer.prototype._createDragBehavior = function () {
        var renderer = this;
        return d3.behavior.drag()
            .on("dragstart", function () {
                var d3Node = d3.select(this);
                renderer._addToSelection(d3Node, !d3.event.sourceEvent.shiftKey);
            })
            .on("drag", function () {
                renderer.selection.each(function (node) {
                    node.position[0] += d3.event.dx;
                    node.position[1] += d3.event.dy;
                });
                renderer.selection.attr("transform", function (node) { return "translate(" + node.position + ")"; });
            });
    };

    /**
     * Adds the given `node` to the current selection.
     * @param node The svg `node` to select
     * @param clear {Boolean?} If true, everything but this `node` will be unselected
     * @private
     */
    Renderer.prototype._addToSelection = function (node, clear) {
        if (clear) {
            this._clearSelection();
        }
        node.classed("selected", true);
    };

    /**
     * Unselect all the currently selected blocks and groups.
     * @private
     */
    Renderer.prototype._clearSelection = function () {
        this.selection.classed("selected", false);
    };

    return Renderer;

})();
