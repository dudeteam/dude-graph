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
 * Looks like dudeGraph.polymorphic. However, instead of giving the functions in parameters, to give an instance and a method
 * name and it will look for the methods within the class. For instance, if you create a polymorphic method "render"
 * like so:
 *      return dudeGraph.polymorphicMethod(this, "render", node, element);
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
 * @namespace dudeGraph
 * @type {Object}
 */
var dudeGraph = (function() {
    var namespace = {};
    if (typeof exports !== "undefined") {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = namespace;
        }
        exports.dudeGraph = namespace;
    } else {
        window.dudeGraph = namespace;
    }
    return namespace;
})();
dudeGraph.ArrayMerger = (function () {

    /**
     * Merges arrays by combining them instead of replacing
     * @param {Object|Array} a
     * @param {Object|Array} b
     * @returns {Array|undefined}
     */
    return function (a, b) {
        if (_.isArray(a)) {
            return (b || []).concat(a);
        }
    };

})();
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
dudeGraph.UUID = (function () {

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
dudeGraph.Graph = (function () {

    /**
     * Represents the graph whom holds the entities
     * @extends {pandora.EventEmitter}
     * @constructor
     */
    var Graph = pandora.class_("Graph", pandora.EventEmitter, function (data, models) {
        pandora.EventEmitter.call(this);

        /**
         * Loader
         * @type {dudeGraph.JSONLoader}
         */
        this.loader = new dudeGraph.JSONLoader(this, data, models);

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
            "Boolean": ["Boolean", "Number"],
            "Vec2": ["Vec2"],
            "Vec3": ["Vec3"],
            "Vec4": ["Vec4"],
            "Color": ["Color", "Vec4"],
            "Texture2D": ["Texture2D"],
            "Entity": ["Entity"]
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
                return pandora.typename(value) === "Number" || /^[0-9]+(\.[0-9]+)?$/.test(value);
            },
            "Boolean": function (value) {
                return pandora.typename(value) === "Boolean" || /^(true|false)/.test(value);
            }
        };

        /**
         * Collection of blocks in the graph
         * @type {Array<dudeGraph.Block>}
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
         * @type {Object} {"42": {dudeGraph.Block}}
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
         * @type {Array<dudeGraph.Connection>}
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
     * @param {String} type - The type on which this validator will be applied
     * @param {Function} fn - A function which takes a value in parameter and returns true if it can be assigned
     */
    Graph.prototype.addValidator = function (type, fn) {
        this._validators[type] = fn;
    };

    /**
     * Checks whether the first type can be converted into the second one.
     * @param {String} firstType
     * @param {String} secondType
     * @returns {Boolean}
     */
    Graph.prototype.canConvert = function (firstType, secondType) {
        return firstType === secondType || (this._cgTypes[firstType] &&
            this._cgTypes[firstType].indexOf(secondType) !== -1);
    };

    /**
     * Checks whether the given `value` is assignable to the given `type`.
     * @param {*} value - A value to check.
     * @param {String} type - The type that the value should have
     */
    Graph.prototype.canAssign = function (value, type) {
        return value === null || (this._validators[type] && this._validators[type](value));
    };

    /**
     * Tries to update the blocks types from templates parameters to match the `point` type with the given `type`.
     * @param point - The point on which the connection will be created
     * @param type - The type of the connection that we try to attach
     * @returns {boolean}
     */
    Graph.prototype.updateTemplate = function (point, type) {
        return point.cgBlock.updateTemplate(point, type);
    };

    /**
     * Adds a block to the graph
     * @param {dudeGraph.Block} cgBlock - cgBlock to add to the graph
     * @param {Boolean} quiet - Whether the event should be emitted
     * @emit "cg-block-create" {dudeGraph.Block}
     * @return {dudeGraph.Block}
     */
    Graph.prototype.addBlock = function (cgBlock, quiet) {
        var cgBlockId = cgBlock.cgId;
        if (cgBlock.cgGraph !== this) {
            throw new Error("This block does not belong to this graph");
        }
        if (cgBlockId === null || cgBlockId === undefined) {
            throw new Error("Block id is null");
        }
        if (this._cgBlocksIds[cgBlockId]) {
            throw new Error("Block with id `" + cgBlockId + "` already exists");
        }
        this._cgBlocks.push(cgBlock);
        this._cgBlocksIds[cgBlockId] = cgBlock;
        if (!quiet) {
            this.emit("cg-block-create", cgBlock);
        }
        return cgBlock;
    };

    /**
     * Removes a block from the graph
     * @param {dudeGraph.Block} cgBlock
     */
    Graph.prototype.removeBlock = function (cgBlock) {
        var blockFoundIndex = this._cgBlocks.indexOf(cgBlock);
        if (blockFoundIndex === -1 || cgBlock.cgGraph !== this) {
            throw new Error("This block does not belong to this graph");
        }
        var cgBlockPoints = cgBlock.cgOutputs.concat(cgBlock.cgInputs);
        _.forEach(cgBlockPoints, function (cgBlockPoint) {
            this.disconnectPoint(cgBlockPoint);
        }.bind(this));
        this._cgBlocks.splice(blockFoundIndex, 1);
        delete this._cgBlocksIds[cgBlock.cgId];
        this.emit("cg-block-remove", cgBlock);
    };

    /**
     * Creates a connection between two cgPoints
     * @param {dudeGraph.Point} cgOutputPoint
     * @param {dudeGraph.Point} cgInputPoint
     * @emit "cg-connection-create" {dudeGraph.Connection}
     * @returns {dudeGraph.Connection|null}
     */
    Graph.prototype._connectPoints = function (cgOutputPoint, cgInputPoint) {
        if (this.connectionByPoints(cgOutputPoint, cgInputPoint) !== null) {
            throw new Error("Connection already exists between these two points: `" +
                    cgOutputPoint.cgName + "` and `" + cgInputPoint.cgName + "`");
        }
        if (cgOutputPoint.isOutput === cgInputPoint.isOutput) {
            throw new Error("Cannot connect either two inputs or two outputs: `" +
                    cgOutputPoint.cgName + "` and `" + cgInputPoint.cgName + "`");
        }
        if (!(cgOutputPoint.acceptConnect(cgInputPoint) && cgInputPoint.acceptConnect(cgOutputPoint))) {
            throw new Error("Cannot connect `" +
                    cgOutputPoint.cgName + "` and `" + cgInputPoint.cgName + "`");
        }
        if (!this.canConvert(cgOutputPoint.cgValueType, cgInputPoint.cgValueType) &&
            !this.updateTemplate(cgInputPoint, cgOutputPoint.cgValueType)) {
            throw new Error("Cannot connect two points of different value types: `" +
                    cgOutputPoint.cgValueType + "` and `" + cgInputPoint.cgValueType + "`");
        }
        var cgConnection = new dudeGraph.Connection(cgOutputPoint, cgInputPoint);
        this._cgConnections.push(cgConnection);
        cgOutputPoint._cgConnections.push(cgConnection);
        cgInputPoint._cgConnections.push(cgConnection);
        this.emit("cg-connection-create", cgConnection);
        return cgConnection;
    };

    /**
     * Removes a connection between two connected cgPoints
     * @param {dudeGraph.Point} cgOutputPoint
     * @param {dudeGraph.Point} cgInputPoint
     * @emit "cg-connection-create" {dudeGraph.Connection}
     * @returns {dudeGraph.Connection}
     */
    Graph.prototype._disconnectPoints = function (cgOutputPoint, cgInputPoint) {
        var cgConnection = this.connectionByPoints(cgOutputPoint, cgInputPoint);
        if (cgConnection === null) {
            throw new Error("No connections between these two points: `" +
                    cgOutputPoint.cgName + "` and `" + cgInputPoint.cgName + "`");
        }
        this._cgConnections.splice(this._cgConnections.indexOf(cgConnection), 1);
        cgOutputPoint._cgConnections.splice(cgOutputPoint._cgConnections.indexOf(cgConnection), 1);
        cgInputPoint._cgConnections.splice(cgInputPoint._cgConnections.indexOf(cgConnection), 1);
        this.emit("cg-connection-remove", cgConnection);
        return cgConnection;
    };

    /**
     * Disconnect all connections from this point
     * @param {dudeGraph.Point} cgPoint
     */
    Graph.prototype.disconnectPoint = function (cgPoint) {
        var cgPointConnections = cgPoint.cgConnections;
        _.forEach(cgPointConnections, function (cgConnection) {
            this.disconnectPoints(cgConnection.cgOutputPoint, cgConnection.cgInputPoint);
        }.bind(this));
    };

    /**
     * Returns a block by it's unique id
     * @param {String} cgBlockId
     * @return {dudeGraph.Block}
     */
    Graph.prototype.blockById = function (cgBlockId) {
        var cgBlock = this._cgBlocksIds[cgBlockId];
        if (!cgBlock) {
            throw new Error("Block not found for id `" + cgBlockId + "`");
        }
        return cgBlock;
    };

    /**
     * Returns the first block with the given name.
     * @param {String} cgBlockName
     * @returns {dudeGraph.Block}
     */
    Graph.prototype.blockByName = function (cgBlockName) {
        var block = null;
        _.forEach(this.cgBlocks, function (cgBlock) {
            if (cgBlock.cgName === cgBlockName) {
                block = cgBlock;
            }
        });
        return block;
    };

    /**
     * Returns an array of blocks which have the given type.
     * @param {String} cgBlockType
     * @returns {Array<dudeGraph.Block>}
     */
    Graph.prototype.blocksByType = function (cgBlockType) {
        var blocks = [];
        _.forEach(this.cgBlocks, function (cgBlock) {
            if (pandora.typename(cgBlock) === cgBlockType) {
                blocks.push(cgBlock);
            }
        });
        return blocks;
    };

    /**
     * Returns the next unique block id
     * @returns {String}
     */
    Graph.prototype.nextBlockId = function () {
        return dudeGraph.UUID.generate();
    };

    /**
     * Returns the list of connections for every points in the given block
     * @param {dudeGraph.Block} cgBlock
     * @returns {Array<dudeGraph.Connection>}
     */
    Graph.prototype.connectionsByBlock = function (cgBlock) {
        var cgConnections = [];
        _.forEach(this._cgConnections, function (cgConnection) {
            if (cgConnection.cgOutputPoint.cgBlock === cgBlock || cgConnection.cgInputPoint.cgBlock === cgBlock) {
                cgConnections.push(cgConnection);
            }
        });
        return cgConnections;
    };

    /**
     * Returns a connection between two points
     * @param {dudeGraph.Point} cgOutputPoint
     * @param {dudeGraph.Point} cgInputPoint
     * @returns {dudeGraph.Connection|null}
     */
    Graph.prototype.connectionByPoints = function (cgOutputPoint, cgInputPoint) {
        return pandora.findIf(this._cgConnections, function (cgConnection) {
            return cgConnection.cgOutputPoint === cgOutputPoint && cgConnection.cgInputPoint === cgInputPoint;
        });
    };

    /**
     * Returns the list of connections for a given point
     * @param {dudeGraph.Point} cgPoint
     * @returns {Array<dudeGraph.Connection>}
     */
    Graph.prototype.connectionsByPoint = function (cgPoint) {
        var cgConnections = [];
        _.forEach(this._cgConnections, function (cgConnection) {
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
     * @param {Array<dudeGraph.Block>} cgBlocks
     * @returns {Array<dudeGraph.Block>} the cloned blocks
     */
    Graph.prototype.cloneBlocks = function (cgBlocks) {
        var cgCorrespondingBlocks = [];
        var cgClonedBlocks = [];
        var cgConnectionsToClone = [];
        _.forEach(cgBlocks, function (cgBlock) {
            var cgConnections = this.connectionsByBlock(cgBlock);
            var cgClonedBlock = cgBlock.clone(this);
            this.addBlock(cgClonedBlock);
            cgClonedBlocks.push(cgClonedBlock);
            cgCorrespondingBlocks[cgBlock.cgId] = cgClonedBlock;
            _.forEach(cgConnections, function (cgConnection) {
                if (cgConnectionsToClone.indexOf(cgConnection) === -1 &&
                    cgBlocks.indexOf(cgConnection.cgOutputPoint.cgBlock) !== -1 &&
                    cgBlocks.indexOf(cgConnection.cgInputPoint.cgBlock) !== -1) {
                    cgConnectionsToClone.push(cgConnection);
                }
            });
        }.bind(this));
        _.forEach(cgConnectionsToClone, function (cgConnectionToClone) {
            try {
                cgCorrespondingBlocks[cgConnectionToClone.cgOutputPoint.cgBlock.cgId]
                        .outputByName(cgConnectionToClone.cgOutputPoint.cgName)
                    .connect(cgCorrespondingBlocks[cgConnectionToClone.cgInputPoint.cgBlock.cgId]
                        .inputByName(cgConnectionToClone.cgInputPoint.cgName));
            } catch (exception) {
                throw new Error("Connection duplication silenced exception: " + exception);
            }
        });
        return cgClonedBlocks;
    };

    return Graph;

})();
dudeGraph.Block = (function () {

    /**
     * Block is the base class for all codegraph nodes
     * A Block has a list of inputs and outputs points
     * @param {dudeGraph.Graph} cgGraph See Getter definition
     * @param {{cgId: Number, cgTemplates: Object}} data See getter definition
     * @param {String} blockType See getter definition
     * @constructor
     */
    var Block = pandora.class_("Block", function (cgGraph, data, blockType) {
        data = data || {};

        /**
         * Check the reference to the graph
         */
        (function Initialization() {
            if (!cgGraph) {
                throw new Error("Block() Cannot create a Block without a graph");
            }
        })();

        /**
         * Reference to the graph
         * @type {dudeGraph.Graph}
         * @private
         */
        this._cgGraph = cgGraph;
        Object.defineProperty(this, "cgGraph", {
            get: function () {
                return this._cgGraph;
            }.bind(this)
        });

        /**
         * The type of this block defined as a string, "Block" by default.
         * @type {String}
         * @private
         */
        this._blockType = blockType || "Block";
        Object.defineProperty(this, "blockType", {
            get: function () {
                return this._blockType;
            }.bind(this)
        });

        /**
         * Unique id of this block
         * @type {String}
         * @private
         */
        this._cgId = data.cgId || cgGraph.nextBlockId();
        Object.defineProperty(this, "cgId", {
            get: function () {
                return this._cgId;
            }.bind(this)
        });

        /**
         * Block fancy name
         * @type {String}
         * @emit "cg-block-name-changed" {dudeGraph.Block} {String} {String}
         * @private
         */
        this._cgName = data.cgName || data.cgModel || pandora.typename(this);
        Object.defineProperty(this, "cgName", {
            get: function () {
                return this._cgName;
            }.bind(this),
            set: function (cgName) {
                var oldCgName = this._cgName;
                this._cgName = cgName;
                this._cgGraph.emit("cg-block-name-change", this, oldCgName, cgName);
            }.bind(this)
        });

        /**
         * Template types that can be used on this block points. Each template type contains a list of possibly
         * applicable types.
         * @type {Object<String, Array>}
         * @private
         */
        this._cgTemplates = data.cgTemplates || {};
        Object.defineProperty(this, "cgTemplates", {
            get: function () {
                return this._cgTemplates;
            }.bind(this)
        });

        /**
         * Input points
         * @type {Array<dudeGraph.Point>}
         * @private
         */
        this._cgInputs = [];
        Object.defineProperty(this, "cgInputs", {
            get: function () {
                return this._cgInputs;
            }.bind(this)
        });

        /**
         * Output points
         * @type {Array<dudeGraph.Point>}
         * @private
         */
        this._cgOutputs = [];
        Object.defineProperty(this, "cgOutputs", {
            get: function () {
                return this._cgOutputs;
            }.bind(this)
        });

        cgGraph.loader.loadPoints(this, data);
    });

    /**
     * Block factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    Block.buildBlock = function (cgGraph, data) {
        return new Block(cgGraph, data);
    };

    /**
     * Adds an input or an output point
     * @param {dudeGraph.Point} cgPoint
     * @emit "cg-point-create" {dudeGraph.Block} {dudeGraph.Point}
     * @return {dudeGraph.Point}
     */
    Block.prototype.addPoint = function (cgPoint) {
        if (cgPoint.cgBlock !== this) {
            throw new Error("Point `" + cgPoint.cgName + "` is not bound to this block `" + this._cgId + "`");
        }
        if (cgPoint.isOutput && this.outputByName(cgPoint.cgName) || !cgPoint.isOutput && this.inputByName(cgPoint.cgName)) {
            throw new Error("Block `" + this._cgId + "` has already an " +
                    (cgPoint.isOutput ? "output" : "input") + ": `" + cgPoint.cgName + "`");
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
     * @return {dudeGraph.Point|null}
     */
    Block.prototype.outputByName = function (cgOutputName) {
        return _.find(this._cgOutputs, function (cgOutput) {
            return cgOutput.cgName === cgOutputName;
        });
    };

    /**
     * Returns whether this block contains the specified input
     * @param {String} cgInputName
     * @return {dudeGraph.Point|null}
     */
    Block.prototype.inputByName = function (cgInputName) {
        return _.find(this._cgInputs, function (cgInput) {
            return cgInput.cgName === cgInputName;
        });
    };

    /**
     * Tries to update the blocks types from templates parameters to match the `point` type with the given `type`.
     * @param {dudeGraph.Point} cgPoint - The point on which the connection will be created
     * @param {String} type - The type of the connection that we try to attach
     * @returns {boolean}
     */
    Block.prototype.updateTemplate = function (cgPoint, type) {
        if (cgPoint.cgTemplate === null || !this.cgTemplates[cgPoint.cgTemplate] ||
            this.cgTemplates[cgPoint.cgTemplate].indexOf(type) === -1) {
            return false;
        }
        cgPoint.cgValueType = type;
        var failToInfer = false;
        var updateValueType = function (currentPoint) {
            if (failToInfer) {
                return true;
            }
            if (currentPoint.cgTemplate === cgPoint.cgTemplate) {
                if (cgPoint.cgConnections.length === 0) {
                    currentPoint.cgValueType = type;
                } else {
                    failToInfer = true;
                    return true;
                }
            }
        };
        _.forEach(this._cgInputs, updateValueType.bind(this));
        _.forEach(this._cgOutputs, updateValueType.bind(this));
        return !failToInfer;
    };

    /**
     * Returns a copy of this block
     * @param {dudeGraph.Graph} cgGraph - The graph on which the cloned block will be attached to
     * @return {dudeGraph.Block}
     */
    Block.prototype.clone = function (cgGraph) {
        if (pandora.typename(this) !== "Block") {
            throw new pandora.Exception("Method `clone` must be overridden by `" + pandora.typename(this) + "`");
        }
        var cgBlockClone = new dudeGraph.Block(cgGraph);
        cgBlockClone.cgName = this._cgName;
        _.forEach(this._cgOutputs, function (cgOutput) {
            var cgOutputClone = cgOutput.clone(cgBlockClone);
            cgBlockClone.addPoint(cgOutputClone);
        });
        _.forEach(this._cgInputs, function (cgInput) {
            var cgInputClone = cgInput.clone(cgBlockClone);
            cgBlockClone.addPoint(cgInputClone);
        });
        return cgBlockClone;
    };

    return Block;

})();
dudeGraph.Point = (function () {

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
     * @param {dudeGraph.Block} cgBlock - The block this point refers to
     * @param {Object} data
     * @param {Boolean} isOutput True if this point is an output, False for an input
     * @param {String} pointType The type of this point represented as a string
     * @constructor
     */
    var Point = pandora.class_("Point", function (cgBlock, data, isOutput, pointType) {
        /**
         * The graph of the block
         * @type {dudeGraph.Graph}
         * @private
         */
        this._cgGraph = cgBlock.cgGraph;
        Object.defineProperty(this, "cgGraph", {
            get: function () {
                return this._cgGraph;
            }.bind(this)
        });

        /**
         * The type of this point represented as a string, default to "Point".
         */
        Object.defineProperty(this, "pointType", {
            get: function () {
                return this._pointType;
            }.bind(this)
        });
        this._pointType = pointType || "Point";

        /**
         * The block it belongs to
         * @type {dudeGraph.Block}
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
        this._cgName = data.cgName || pandora.typename(this);
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
         * @type {Array<dudeGraph.Connection>}
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
        this._cgMaxConnections = data.cgMaxConnections || 1;
        Object.defineProperty(this, "cgMaxConnections", {
            get: function () {
                return this._cgMaxConnections;
            }.bind(this),
            set: function (cgMaxConnections) {
                if (!(cgMaxConnections instanceof Number) || cgMaxConnections < 0) {
                    throw new Error("cgMaxConnections must be a zero or positive number");
                }
                this._cgMaxConnections = cgMaxConnections;
            }.bind(this)
        });

        /**
         * The name of the template type used (from parent block).
         * @type {String|null}
         * @private
         */
        this._cgTemplate = data.cgTemplate || null;
        Object.defineProperty(this, "cgTemplate", {
            get: function () {
                return this._cgTemplate;
            }.bind(this)
        });

        /**
         * The point current value type
         * Example: Number (Yellow color)
         * @type {String}
         * @emit "cg-point-value-type-change" {dudeGraph.Point} {Object} {Object}
         * @private
         */
        this._cgValueType = data.cgValueType;
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
        if (data.cgValueType === undefined) {
            throw new Error("Cannot create the point `" + this._cgName + "` in block `" + this._cgBlock.cgId +
                "` without specifying a value type");
        }

        /**
         * The point current value
         * @type {Object|null}
         * @emit "cg-point-value-change" {dudeGraph.Point} {Object} {Object}
         * @private
         */
        this._cgValue = data.cgValue || null;
        Object.defineProperty(this, "cgValue", {
            configurable: true,
            get: function () {
                return this._cgValue;
            }.bind(this),
            set: function (cgValue) {
                if (cgValue !== null && this._cgConnections.length >= this._cgMaxConnections) {
                    throw new Error("Cannot set `cgValue`: Point `" + this._cgName + "` cannot accept more than `" +
                        this._cgMaxConnections + "` connection(s)");
                }
                if (this._cgGraph.canAssign(cgValue, this._cgValueType)) {
                    var oldCgValue = this._cgValue;
                    this._cgValue = cgValue;
                    this._cgGraph.emit("cg-point-value-change", this, oldCgValue, cgValue);
                } else {
                    throw new Error("Invalid value `" + String(cgValue) +
                        "` for `" + this._cgValueType + "` in `" + this._cgName + "`");
                }
            }.bind(this)
        });
        if (data.cgValue !== undefined && isOutput) {
            throw new Error("Shouldn't create output point `" + this._cgName + "` in block `" +
                this._cgBlock.cgId + "` with a value.");
        }
    });

    /**
     * Returns whether this cgPoint is empty (no connections and no cgValue)
     * @returns {Boolean}
     */
    Point.prototype.empty = function () {
        return this._cgConnections.length === 0 && this._cgValue === null;
    };

    /**
     * Checks if this cgPoint accepts a connection to the given cgPoint
     * @param {dudeGraph.Point} cgPoint
     * @returns {Boolean}
     */
    Point.prototype.acceptConnect = function (cgPoint) {
        if (this._cgConnections.length + (this._cgValue === null ? 0 : 1) >= this._cgMaxConnections) {
            throw new Error("Point `" + this._cgName + "` cannot accept more than `" +
                    this._cgMaxConnections + "` connection(s)");
        }
        return true;
    };

    /**
     * Adds a connection from this cgPoint to the given cgPoint
     * @param {dudeGraph.Point} cgPoint
     * @return {dudeGraph.Connection}
     */
    Point.prototype.connect = function (cgPoint) {
        if (this._isOutput) {
            return this._cgGraph._connectPoints(this, cgPoint);
        } else {
            return this._cgGraph._connectPoints(cgPoint, this);
        }
    };

    /**
     * Removes the connections between this cgPoint and the given cgPoint
     * @param {dudeGraph.Point} cgPoint
     */
    Point.prototype.disconnect = function (cgPoint) {
        if (this._isOutput) {
            return this._cgGraph._disconnectPoints(this, cgPoint);
        } else {
            return this._cgGraph._disconnectPoints(cgPoint, this);
        }
    };

    /**
     * Returns a copy of this point
     * @param {dudeGraph.Block} cgBlock - The block on which this cloned point will be attached to
     * @return {dudeGraph.Point}
     */
    Point.prototype.clone = function (cgBlock) {
        if (pandora.typename(this) !== "Point") {
            throw new Error("Method `clone` must be overridden by `" + pandora.typename(this) + "`");
        }
        return new dudeGraph.Point(cgBlock, {
            cgName: this._cgName,
            cgValueType: this._cgValueType,
            cgValue: this._cgValue
        }, this._isOutput);
    };

    return Point;

})();
dudeGraph.Connection = (function () {

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
                throw new Error("cgOutputPoint is not an output");
            }
            if (cgInputPoint.isOutput) {
                throw new Error("cgInputPoint is not an input");
            }
        })();

        /**
         * The output point where the connection begins
         * @type {dudeGraph.Point}
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
         * @type {dudeGraph.Point}
         * @private
         */
        this._cgInputPoint = cgInputPoint;
        Object.defineProperty(this, "cgInputPoint", {
            get: function () {
                return this._cgInputPoint;
            }.bind(this)
        });

    });

    /**
     * Returns the other point
     * @param {dudeGraph.Point} cgPoint
     * returns {dudeGraph.Point}
     */
    Connection.prototype.otherPoint = function (cgPoint) {
        if (cgPoint === this._cgOutputPoint) {
            return this._cgInputPoint;
        } else if (cgPoint === this._cgInputPoint) {
            return this._cgOutputPoint;
        }
        throw new Error("Point `" + cgPoint.cgName + "` is not in this connection");
    };

    /**
     * Remove self from the connections
     */
    Connection.prototype.remove = function () {
        // TODO
    };

    return Connection;

})();
dudeGraph.Stream = (function () {

    /**
     * A stream
     * @type {Function}
     */
    var Stream = pandora.class_("Stream", dudeGraph.Point, function (cgBlock, data, isOutput) {
        dudeGraph.Point.call(this, cgBlock, {
            cgName: data.cgName,
            cgValueType: "Stream"
        }, isOutput, "Stream");
        this._cgMaxConnections = 1;
        Object.defineProperty(this, "cgValue", {
            get: function () {
                throw new Error("Stream has no `cgValue`.");
            }.bind(this),
            set: function () {
                throw new Error("Stream has no `cgValue`.");
            }.bind(this)
        });
    });

    /**
     * Returns a copy of this Stream
     * @param {dudeGraph.Block} cgBlock - The block on which the cloned stream will be attached to
     * @returns {*}
     */
    Stream.prototype.clone = function (cgBlock) {
        return new dudeGraph.Stream(cgBlock, this._cgName, this._isOutput);
    };

    return Stream;

})();
dudeGraph.Assignation = (function () {

    /**
     * This is like function however, it takes a stream in input and output. In code it would represent function
     * separated by semicolons.
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Assignation = pandora.class_("Assignation", dudeGraph.Block, function (cgGraph, data) {
        dudeGraph.Block.call(this, cgGraph, data, "Assignation");
    });

    /**
     * Assignation factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    Assignation.buildBlock = function (cgGraph, data) {
        return new Assignation(cgGraph, _.merge(data, {
            "cgInputs": [
                {
                    "cgName": "in",
                    "cgType": "Stream"
                },
                {
                    "cgName": "this",
                    "cgType": "Point",
                    "cgValueType": data.cgValueType
                },
                {
                    "cgName": "other",
                    "cgType": "Point",
                    "cgValueType": data.cgValueType
                }
            ],
            "cgOutputs": [
                {
                    "cgName": "out",
                    "cgType": "Stream"
                }
            ]
        }, dudeGraph.ArrayMerger));
    };

    return Assignation;

})();
dudeGraph.Condition = (function () {

    /**
     *
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Condition = pandora.class_("Condition", dudeGraph.Block, function (cgGraph, data) {
        dudeGraph.Block.call(this, cgGraph, data, "Condition");
        if (!(this.inputByName("in") instanceof dudeGraph.Stream)) {
            throw new Error("Condition must have an input `in` of type `Stream`");
        }
        if (!(this.inputByName("test") instanceof dudeGraph.Point) || this.inputByName("test").cgValueType !== "Boolean") {
            throw new Error("Condition must have an input `test` of type `Point` of cgValueType `Boolean`");
        }
        if (!(this.outputByName("true") instanceof dudeGraph.Stream)) {
            throw new Error("Condition must have an output `true` of type `Stream`");
        }
        if (!(this.outputByName("false") instanceof dudeGraph.Stream)) {
            throw new Error("Condition must have an output `false` of type `Stream`");
        }
    });

    /**
     * Condition factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    Condition.buildBlock = function (cgGraph, data) {
        return new Condition(cgGraph, _.merge(data, {
            "cgInputs": [
                {
                    "cgName": "in",
                    "cgType": "Stream"
                },
                {
                    "cgType": "Point",
                    "cgName": "test",
                    "cgValueType": "Boolean"
                }
            ],
            "cgOutputs": [
                {
                    "cgName": "true",
                    "cgType": "Stream"
                },
                {
                    "cgName": "false",
                    "cgType": "Stream"
                }
            ]
        }, dudeGraph.ArrayMerger));
    };

    return Condition;

})();
dudeGraph.Delegate = (function () {

    /**
     * This is like function however, it takes a stream in input and output. In code it would represent function
     * separated by semicolons.
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Delegate = pandora.class_("Delegate", dudeGraph.Block, function (cgGraph, data) {
        dudeGraph.Block.call(this, cgGraph, data, "Delegate");
    });

    /**
     * Delegate factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    Delegate.buildBlock = function (cgGraph, data) {
        return new Delegate(cgGraph, _.merge(data, {
            "cgOutputs": [
                {
                    "cgName": "out",
                    "cgType": "Stream"
                }
            ]
        }, dudeGraph.ArrayMerger));
    };

    return Delegate;

})();
dudeGraph.Each = (function () {

    /**
     *
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Each = pandora.class_("Each", dudeGraph.Block, function (cgGraph, data) {
        dudeGraph.Block.call(this, cgGraph, data, "Each");
    });

    /**
     * Each factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    Each.buildBlock = function (cgGraph, data) {
        return new Each(cgGraph, _.merge(data, {
            "cgInputs": [
                {
                    "cgName": "in",
                    "cgType": "Stream"
                },
                {
                    "cgType": "Point",
                    "cgName": "list",
                    "cgValueType": "List"
                }
            ],
            "cgOutputs": [
                {
                    "cgName": "current",
                    "cgType": "Stream"
                },
                {
                    "cgType": "Point",
                    "cgName": "index",
                    "cgValueType": "Number"
                },
                {
                    "cgName": "completed",
                    "cgType": "Stream"
                }
            ]
        }, dudeGraph.ArrayMerger));
    };

    return Each;

})();
dudeGraph.Function = (function () {

    /**
     * This block represents a simple function that takes some inputs and returns one or zero output.
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var FunctionImpl = pandora.class_("Function", dudeGraph.Block, function (cgGraph, data) {
        dudeGraph.Block.call(this, cgGraph, data, "Function");
    });

    /**
     * Function factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    FunctionImpl.buildBlock = function (cgGraph, data) {
        return new FunctionImpl(cgGraph, _.merge(data, {
            "cgOutputs": data.cgReturn ? [{
                cgType: "Point",
                cgName: "value",
                cgValueType: data.cgReturn.cgValueType,
                cgTemplate: data.cgReturn.cgTemplate
            }] : null
        }, dudeGraph.ArrayMerger));
    };

    return FunctionImpl;

})();
dudeGraph.Getter = (function () {

    /**
     * This block represents a simple Getter that takes some inputs and returns one or zero output.
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Getter = pandora.class_("Getter", dudeGraph.Block, function (cgGraph, data) {
        if (data.cgClassType === undefined) {
            throw new Error("Getter `" + data.cgId + "` should specify a class type");
        }
        if (data.cgValueType === undefined) {
            throw new Error("Getter `" + data.cgId + "` should specify a value type");
        }
        dudeGraph.Block.call(this, cgGraph, data, "Getter");
    });

    /**
     * Getter factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    Getter.buildBlock = function (cgGraph, data) {
        return new Getter(cgGraph, _.merge(data, {
            "cgInputs": [{
                "cgType": "Point",
                "cgName": "this",
                "cgValueType": data.cgClassType
            }],
            "cgOutputs": [{
                "cgType": "Point",
                "cgName": "value",
                "cgValueType": data.cgValueType
            }]
        }, dudeGraph.ArrayMerger));
    };

    return Getter;

})();
dudeGraph.Instruction = (function () {

    /**
     * This is like function however, it takes a stream in input and output. In code it would represent function
     * separated by semicolons.
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Instruction = pandora.class_("Instruction", dudeGraph.Block, function (cgGraph, data) {
        dudeGraph.Block.call(this, cgGraph, data, "Instruction");
    });

    /**
     * Instruction factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    Instruction.buildBlock = function (cgGraph, data) {
        return new Instruction(cgGraph, _.merge(data, {
            "cgInputs": [{
                "cgName": "in",
                "cgType": "Stream"
            }],
            "cgOutputs": data.cgReturn ? [
                {
                    "cgName": "out",
                    "cgType": "Stream"
                },
                {
                    "cgType": "Point",
                    "cgName": "value",
                    "cgValueType": data.cgReturn.cgValueType,
                    "cgTemplate": data.cgReturn.cgTemplate
                }] : [
                {
                    "cgName": "out",
                    "cgType": "Stream"
                }
            ]
        }, dudeGraph.ArrayMerger));
    };

    return Instruction;

})();
dudeGraph.Operator = (function () {

    /**
     * This block represents a simple Operator that takes some inputs and returns one or zero output.
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Operator = pandora.class_("Operator", dudeGraph.Block, function (cgGraph, data) {
        dudeGraph.Block.call(this, cgGraph, data, "Operator");
        if (this.cgInputs.length !== 2) {
            throw new Error("Operator `" + this.cgId + "` must only take 2 inputs");
        }
        if (this.cgOutputs.length !== 1) {
            throw new Error("Operator `" + this.cgId + "` must return one value");
        }
    });

    /**
     * Operator factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    Operator.buildBlock = function (cgGraph, data) {
        return new Operator(cgGraph, _.merge(data, {
            "cgOutputs": data.cgReturn ? [{
                cgType: "Point",
                cgName: "value",
                cgValueType: data.cgReturn.cgValueType,
                cgTemplate: data.cgReturn.cgTemplate
            }] : null
        }, dudeGraph.ArrayMerger));
    };

    return Operator;

})();
dudeGraph.Range = (function () {

    /**
     *
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Range = pandora.class_("Range", dudeGraph.Block, function (cgGraph, data) {
        dudeGraph.Block.call(this, cgGraph, data, "Range");
    });

    /**
     * Range factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    Range.buildBlock = function (cgGraph, data) {
        return new Range(cgGraph, _.merge(data, {
            "cgInputs": [
                {
                    "cgName": "in",
                    "cgType": "Stream"
                },
                {
                    "cgType": "Point",
                    "cgName": "start",
                    "cgValueType": "Number"
                },
                {
                    "cgType": "Point",
                    "cgName": "end",
                    "cgValueType": "Number"
                },
                {
                    "cgType": "Point",
                    "cgName": "delta",
                    "cgValueType": "Number"
                }
            ],
            "cgOutputs": [
                {
                    "cgName": "current",
                    "cgType": "Stream"
                },
                {
                    "cgType": "Point",
                    "cgName": "index",
                    "cgValueType": "Number"
                },
                {
                    "cgName": "completed",
                    "cgType": "Stream"
                }
            ]
        }, dudeGraph.ArrayMerger));
    };

    return Range;

})();
dudeGraph.Value = (function () {

    /**
     *
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Value = pandora.class_("Value", dudeGraph.Block, function (cgGraph, data) {
        dudeGraph.Block.call(this, cgGraph, data, "Value");

        /**
         * The type of this Value, the block will return a point of this type.
         * @type {String}
         * @private
         */
        this._cgValueType = data.cgValueType;
        Object.defineProperty(this, "cgValueType", {
            get: function () {
                return this._cgValueType;
            }.bind(this)
        });

        /**
         * The current value of the Value.
         * @type {*}
         * @private
         */
        this._cgValue = data.cgValue;
        Object.defineProperty(this, "cgValue", {
            get: function () {
                return this._cgValue;
            }.bind(this),
            set: function (value) {
                this._cgValue = value;
                this.cgOutputs[0].cgValue = value;
            }.bind(this)
        });

    });

    Value.rendererBlockCreator = function (renderer) {
        var d3Block = d3.select(this);
        d3Block
            .append("svg:rect")
            .attr("rx", function () {
                return renderer._config.block.header / 2;
            })
            .attr("ry", function () {
                return renderer._config.block.header / 2;
            });
        d3Block
            .append("svg:text")
            .classed("cg-title", true)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "text-before-edge");
        d3Block
            .append("svg:g")
            .classed("cg-points", true);
        Value.rendererPointCreator.call(renderer, d3Block);
    };

    Value.rendererPointCreator = function (d3Block) {
        var renderer = this;
        var createdD3Points = d3Block
            .selectAll(".cg-output, .cg-input")
            .data(function (rendererBlock) {
                return rendererBlock.rendererPoints;
            }, function (rendererPoint) {
                return rendererPoint.cgPoint.cgName;
            })
            .enter()
            .append("svg:g")
            .attr("class", function (rendererPoint) {
                return "cg-" + (rendererPoint.isOutput ? "output" : "input");
            })
            .each(function () {
                renderer._createD3PointShapes(d3.select(this));
            });
        Value.rendererPointUpdater.call(renderer, createdD3Points);
    };

    Value.rendererBlockUpdater = function (renderer) {
        var d3Block = d3.select(this);
        d3Block
            .select("text")
            .text(function (rendererBlock) {
                return rendererBlock.cgBlock.cgName;
            });
        d3Block
            .each(function (rendererBlock) {
                return renderer._computeRendererBlockSize(rendererBlock);
            });
        d3Block
            .attr("transform", function (rendererBlock) {
                return "translate(" + rendererBlock.position + ")";
            });
        d3Block
            .select("rect")
            .attr("width", function (rendererBlock) {
                return rendererBlock.size[0];
            })
            .attr("height", function (rendererBlock) {
                return renderer._config.block.header;
            });
        d3Block
            .select("text")
            .attr("transform", function (block) {
                return "translate(" + [block.size[0] / 2, renderer._config.block.padding] + ")";
            });
        Value.rendererPointUpdater.call(renderer, d3Block.select(".cg-points").selectAll(".cg-output, .cg-input"));
    };

    Value.rendererPointUpdater = function (updatedD3Points) {
        var renderer = this;
        updatedD3Points
            .classed("cg-empty", function (rendererPoint) {
                return rendererPoint.cgPoint.empty();
            })
            .classed("cg-stream", function (rendererPoint) {
                return pandora.typename(rendererPoint.cgPoint) === "Stream";
            })
            .attr("transform", function (rendererPoint) {
                return "translate(" + renderer._getRendererPointPosition(rendererPoint, true) + ")";
            });
    };

    Value.pointPositionGetter = function (rendererPoint, offsetX, offsetY) {
        return [
            offsetX + rendererPoint.rendererBlock.size[0] - this._config.block.padding,
            offsetY + this._config.block.header / 2
        ];
    };

    /**
     * Value factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    Value.buildBlock = function (cgGraph, data) {
        return new Value(cgGraph, _.merge(data, {
            "cgName": data.cgValue + "",
            "cgOutputs": [
                {
                    "cgType": "Point",
                    "cgName": "value",
                    "cgValueType": data.cgValueType,
                    "cgMaxConnections": Infinity
                }
            ]
        }, dudeGraph.ArrayMerger));
    };

    return Value;

})();
dudeGraph.Variable = (function () {

    /**
     *
     * @extends {dudeGraph.Block}
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    var Variable = pandora.class_("Variable", dudeGraph.Block, function (cgGraph, data) {
        dudeGraph.Block.call(this, cgGraph, data, "Variable");

        /**
         * The type of this variable, the block will return a point of this type.
         * @type {String}
         * @private
         */
        this._cgValueType = data.cgValueType;
        Object.defineProperty(this, "cgValueType", {
            get: function () {
                return this._cgValueType;
            }.bind(this)
        });

        /**
         * The current value of the Variable.
         * @type {*}
         * @private
         */
        this._cgValue = data.cgValue;
        Object.defineProperty(this, "cgValue", {
            get: function () {
                return this._cgValue;
            }.bind(this),
            set: function (value) {
                this._cgValue = value;
                this.cgOutputs[0].cgValue = value;
            }.bind(this)
        });

    });

    Variable.rendererBlockCreator = function (renderer) {
        var d3Block = d3.select(this);
        d3Block
            .append("svg:rect")
            .attr("rx", function () {
                return renderer._config.block.header / 2;
            })
            .attr("ry", function () {
                return renderer._config.block.header / 2;
            });
        d3Block
            .append("svg:text")
            .classed("cg-title", true)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "text-before-edge");
        d3Block
            .append("svg:g")
            .classed("cg-points", true);
        Variable.rendererPointCreator.call(renderer, d3Block);
    };

    Variable.rendererPointCreator = function (d3Block) {
        var renderer = this;
        var createdD3Points = d3Block
            .selectAll(".cg-output, .cg-input")
            .data(function (rendererBlock) {
                return rendererBlock.rendererPoints;
            }, function (rendererPoint) {
                return rendererPoint.cgPoint.cgName;
            })
            .enter()
            .append("svg:g")
            .attr("class", function (rendererPoint) {
                return "cg-" + (rendererPoint.isOutput ? "output" : "input");
            })
            .each(function () {
                renderer._createD3PointShapes(d3.select(this));
            });
        Variable.rendererPointUpdater.call(renderer, createdD3Points);
    };

    Variable.rendererBlockUpdater = function (renderer) {
        var d3Block = d3.select(this);
        d3Block
            .select("text")
            .text(function (rendererBlock) {
                return rendererBlock.cgBlock.cgName;
            });
        d3Block
            .each(function (rendererBlock) {
                return renderer._computeRendererBlockSize(rendererBlock);
            });
        d3Block
            .attr("transform", function (rendererBlock) {
                return "translate(" + rendererBlock.position + ")";
            });
        d3Block
            .select("rect")
            .attr("width", function (rendererBlock) {
                return rendererBlock.size[0];
            })
            .attr("height", function (rendererBlock) {
                return renderer._config.block.header;
            });
        d3Block
            .select("text")
            .attr("transform", function (block) {
                return "translate(" + [block.size[0] / 2, renderer._config.block.padding] + ")";
            });
        Variable.rendererPointUpdater.call(renderer, d3Block.select(".cg-points").selectAll(".cg-output, .cg-input"));
    };

    Variable.rendererPointUpdater = function (updatedD3Points) {
        var renderer = this;
        updatedD3Points
            .classed("cg-empty", function (rendererPoint) {
                return rendererPoint.cgPoint.empty();
            })
            .classed("cg-stream", function (rendererPoint) {
                return pandora.typename(rendererPoint.cgPoint) === "Stream";
            })
            .attr("transform", function (rendererPoint) {
                return "translate(" + renderer._getRendererPointPosition(rendererPoint, true) + ")";
            });
    };

    Variable.pointPositionGetter = function (rendererPoint, offsetX, offsetY) {
        return [
            offsetX + rendererPoint.rendererBlock.size[0] - this._config.block.padding,
            offsetY + this._config.block.header / 2
        ];
    };

    /**
     * Variable factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    Variable.buildBlock = function (cgGraph, data) {
        return new Variable(cgGraph, _.merge(data, {
            "cgOutputs": [
                {
                    "cgType": "Point",
                    "cgName": "value",
                    "cgValueType": data.cgValueType,
                    "cgMaxConnections": Infinity
                }
            ]
        }, dudeGraph.ArrayMerger));
    };

    return Variable;

})();

dudeGraph.GraphSaver = (function() {

    /**
     * Save a graph into JSON
     * @constructor
     */
    var GraphSaver = pandora.class_("GraphSaver", pandora.EventEmitter, function (config) {
        pandora.EventEmitter.call(this);
        this.config = config;
    });

    GraphSaver.prototype.save = function (graph) {
        var result = {
            "blocks": [],
            "connections": []
        };
        _.forEach(graph.cgBlocks, function (block) {
            result.blocks.push(this.saveBlock(block));
        }.bind(this));
        _.forEach(graph.cgConnections, function (connection) {
            result.connections.push(this._saveConnection(connection));
        }.bind(this));
        return result;
    };

    GraphSaver.prototype.saveBlock = function (block) {
        return {
            "cgType": block.blockType,
            "cgId": block.cgId,
            "cgName": block.cgName,
            "cgFolder": block.cgFolder,
            "cgInputs": this._savePoints(block.cgInputs),
            "cgOutputs": this._savePoints(block.cgOutputs)
        };
    };

    GraphSaver.prototype._savePoints = function (points) {
        var result = [];
        _.forEach(points, function (point) {
            result.push(this._savePoint(point));
        }.bind(this));
        return result;
    };

    GraphSaver.prototype._savePoint = function (point) {
        return {
            "cgType": point.pointType,
            "cgName": point.cgName,
            "cgValueType": point.cgValueType,
            "cgMaxConnections": point.cgMaxConnections
        };
    };

    GraphSaver.prototype._saveConnection = function (connection) {
        return {
            "cgOutputName": connection.cgOutputPoint.cgName,
            "cgOutputBlockId": connection.cgOutputPoint.cgBlock.cgId,
            "cgInputName": connection.cgInputPoint.cgName,
            "cgInputBlockId": connection.cgInputPoint.cgBlock.cgId
        };
    };

    return GraphSaver;

})();
dudeGraph.RendererSaver = (function() {

    /**
     * Save a graph into JSON
     * @constructor
     */
    var RendererSaver = pandora.class_("RendererSaver", pandora.EventEmitter, function (config) {
        pandora.EventEmitter.call(this);
        this.config = config;
    });

    RendererSaver.prototype.save = function (renderer) {
        var result = {
            "blocks": [],
            "groups": [],
            "connections": []
        };
        _.forEach(renderer._rendererBlocks, function (rendererBlock) {
            result.blocks.push({
                "id": rendererBlock.id,
                "cgBlock": rendererBlock.cgBlock.cgId,
                "position": rendererBlock.position,
                "parent": rendererBlock.parent ? rendererBlock.parent.id : null
            });
        });
        _.forEach(renderer._rendererGroups, function (rendererGroup) {
            result.groups.push({
                "id": rendererGroup.id,
                "description": rendererGroup.description,
                "parent": rendererGroup.parent ? rendererGroup.parent.id : null
            });
        });
        _.forEach(renderer._rendererConnections, function (rendererConnection) {
            result.connections.push({
                "outputName": rendererConnection.outputRendererPoint.cgPoint.cgName,
                "outputBlockId": rendererConnection.outputRendererPoint.rendererBlock.id,
                "inputName": rendererConnection.inputRendererPoint.cgPoint.cgName,
                "inputBlockId": rendererConnection.inputRendererPoint.rendererBlock.id
            });
        });
        return result;
    };

    return RendererSaver;

})();
dudeGraph.JSONSaver = (function() {

    /**
     * This saves the data of the renderer and the graph.
     * @constructor
     */
    var JSONSaver = pandora.class_("JSONSaver", pandora.EventEmitter, function () {
        pandora.EventEmitter.call(this);
    });

    JSONSaver.prototype.save = function (cgRenderer, cgGraph) {
        return {
            "rendererData": new dudeGraph.RendererSaver().save(cgRenderer),
            "graphData": new dudeGraph.GraphSaver().save(cgGraph)
        };
    };

    return JSONSaver;

})();
dudeGraph.JSONLoader = (function () {

    /**
     * Creates the loader.
     * @extends {pandora.EventEmitter}
     * @constructor
     * @param cgGraph {Object} The graph to load
     * @param {Object} data The graph data
     * @param models {Object} The models used to load the graph
     */
    var JSONLoader = pandora.class_("JSONLoader", pandora.EventEmitter, function (cgGraph, data, models) {
        pandora.EventEmitter.call(this);
        this._cgGraph = cgGraph;
        this._data = data;
        this._blocksTree = models;
        this._pointTypes = {};
        this._blockTypes = {};
        this.addPointType("Stream", dudeGraph.Stream);
        this.addPointType("Point", dudeGraph.Point);
    });

    /**
     * Registers the given point type as a possible point that can be found into the graph. All points should inherit
     * from dudeGraph.Point.
     * @param pointType {String}
     * @param pointClass {dudeGraph.Point}
     */
    JSONLoader.prototype.addPointType = function (pointType, pointClass) {
        if (this._pointTypes[pointType] !== undefined) {
            throw new Error("Point type `" + pointType + "` already added to the loader");
        }
        this._pointTypes[pointType] = function (cgBlock, cgPointData, isOutput) {
            var point = new pointClass(cgBlock, cgPointData, isOutput);
            cgBlock.addPoint(point);
            return point;
        };
    };

    /**
     * Registers the given block type as a possible block that can be found into the graph. All blocks should inherit
     * from dudeGraph.Block.
     * @param blockType {String}
     * @param blockClass {dudeGraph.Block}
     */
    JSONLoader.prototype.addBlockType = function (blockType, blockClass) {
        if (this._blockTypes[blockType] !== undefined) {
            throw new Error("Block type `" + blockType + "` already added to the loader");
        }
        this._blockTypes[blockType] = function (cgGraph, cgBlockData) {
            var block = new blockClass(cgGraph, cgBlockData);
            cgGraph.addBlock(block);
            return block;
        };
    };

    /**
     * Loads the graph from the given json data.
     */
    JSONLoader.prototype.load = function () {
        this._loadBlocks(this._cgGraph, this._data.blocks);
        if (this._data.connections) {
            this._loadConnections(this._cgGraph, this._data.connections);
        }
    };

    /**
     * Loads the points of a given block, this method is called automatically be the dudeGraph.Block instances to load
     * their points.
     * @param {dudeGraph.Block} cgBlock
     * @param cgBlockData {Object}
     * @private
     */
    JSONLoader.prototype.loadPoints = function (cgBlock, cgBlockData) {
        var self = this;
        var loadPoint = function (cgBlock, cgPointData, isOutput) {
            if (!cgPointData.cgName) {
                throw new Error("Block `" + cgBlock.cgId + "`: Point property `cgName` is required");
            }
            var cgPointType = cgPointData.cgType || "Point";
            var cgPointDeserializer = self._pointTypes[cgPointType];
            if (!cgPointDeserializer) {
                throw new Error("Block `" + cgBlock.cgId + "`: Cannot deserialize point `" + cgPointData.cgName +
                    "` of type `" + cgPointType + "`");
            }
            cgPointDeserializer.call(self, cgBlock, cgPointData, isOutput);
        };
        if (cgBlockData.cgOutputs) {
            _.forEach(cgBlockData.cgOutputs, function (output) {
                loadPoint(cgBlock, output, true);
            });
        }
        if (cgBlockData.cgInputs) {
            _.forEach(cgBlockData.cgInputs, function (input) {
                loadPoint(cgBlock, input, false);
            });
        }
    };

    /**
     *
     * @param cgBlockData
     */
    JSONLoader.prototype.loadBlock = function (cgBlockData) {
        if (!cgBlockData.hasOwnProperty("cgId")) {
            throw new Error("Block property `cgId` is required");
        }
        var blockConstructor = this._blockTypes[cgBlockData.cgType || "Block"];
        if (!blockConstructor) {
            throw new cg.GraphSerializationError("JSONLoader::_loadBlocks() Type `{0}` not added to the loader", cgBlockType);
        }
        blockConstructor.call(this, this._cgGraph, cgBlockData);
    };

    /**
     *
     * @param cgGraph
     * @param cgBlocksData {Array<Object>}
     * @private
     */
    JSONLoader.prototype._loadBlocks = function (cgGraph, cgBlocksData) {
        _.forEach(cgBlocksData, this.loadBlock.bind(this));
    };

    /**
     *
     * @param {dudeGraph.Graph} cgGraph
     * @param cgConnectionsData {Array<{cgOutputBlockId: String, cgOutputName: String, cgInputBlockId: String, cgInputName: String,}>}
     * @private
     */
    JSONLoader.prototype._loadConnections = function (cgGraph, cgConnectionsData) {
        _.forEach(cgConnectionsData, function (cgConnectionData) {
            var cgOutputBlockId = cgConnectionData.cgOutputBlockId;
            var cgOutputName = cgConnectionData.cgOutputName;
            var cgInputBlockId = cgConnectionData.cgInputBlockId;
            var cgInputName = cgConnectionData.cgInputName;
            var cgOutputBlock = cgGraph.blockById(cgOutputBlockId);
            if (!cgOutputBlock) {
                throw new Error("Output block not found for id `" + cgOutputBlockId + "`");
            }
            var cgInputBlock = cgGraph.blockById(cgInputBlockId);
            if (!cgInputBlock) {
                throw new Error("Input block not found for id `" + cgInputBlockId + "`");
            }
            var cgOutputPoint = cgOutputBlock.outputByName(cgOutputName);
            if (!cgOutputPoint) {
                throw new Error("Output point `" + cgOutputName + "` not found in block `" + cgOutputBlockId + "`");
            }
            var cgInputPoint = cgInputBlock.inputByName(cgInputName);
            if (!cgInputPoint) {
                throw new Error("Input point `" + cgInputName + "` not found in block `" + cgInputBlockId + "`");
            }
            cgOutputPoint.connect(cgInputPoint);
        });
    };

    return JSONLoader;

})();
dudeGraph.Renderer = (function () {

    /**
     * Default renderer configuration
     * @type {{zoom: {min: number, max: number}}}
     */
    var DEFAULT_RENDERER_CONFIG = {
        "zoom": {
            "min": 0.25,
            "max": 5
        },
        "block": {
            "padding": 10,
            "header": 40,
            "size": [150, 100]
        },
        "group": {
            "padding": 10,
            "header": 30,
            "size": [200, 150]
        },
        "point": {
            "height": 20,
            "radius": 3,
            "offset": 20
        }
    };

    /**
     * Creates a new dudeGraph.Renderer from a DOM node and some graph data.
     * @extends {pandora.EventEmitter}
     * @constructor
     * @param svg The svg DOM Element on which the svg will be attached
     * @param data The serialized renderer elements
     * @param cgGraph The graph that will be rendered
     */
    var Renderer = pandora.class_("Renderer", pandora.EventEmitter, function (svg, cgGraph, data) {
        pandora.EventEmitter.call(this);

        /**
         * Renderer initial data
         * @type {{config: Object, blocks: Array<Object>, groups: Array<Object>}}
         */
        this._data = data;

        /**
         * Renderer configuration
         * @type {{zoom: {min: Number, max: Number}}}
         * @private
         */
        this._config = pandora.mergeObjects(data.config, DEFAULT_RENDERER_CONFIG, true, true);

        /**
         * Stores all the functions used to create svg for specific blocks.
         * @type {{}}
         * @private
         */
        this._rendererBlockCreators = {};

        /**
         * Stores all the functions used to update the rendering for specific blocks.
         * @type {{}}
         * @private
         */
        this._rendererBlockUpdaters = {};

        /**
         * Returns the position of each point of the renderer block for a specific block.
         * @type {{}}
         * @private
         */
        this._pointPositionGetters = {};

        /**
         * The root SVG node of the renderer
         * @type {d3.selection}
         */
        this._d3Svg = d3.select(svg);

        /**
         * The SVG point used for matrix transformations
         * @type {SVGPoint}
         */
        this._svgPoint = this._d3Svg.node().createSVGPoint();

        /**
         * The root group node of the renderer
         * @type {d3.selection}
         */
        this._d3Root = this._d3Svg.append("svg:g").attr("id", "cg-root");

        /**
         * The SVG group for the d3Groups
         * @type {d3.selection}
         */
        this._d3Groups = this._d3Root.append("svg:g").attr("id", "cg-groups");

        /**
         * The SVG connection for the d3Connections
         * @type {d3.selection}
         */
        this._d3Connections = this._d3Root.append("svg:g").attr("id", "cg-connections");

        /**
         * The SVG group for the d3Blocks
         * @type {d3.selection}
         */
        this._d3Block = this._d3Root.append("svg:g").attr("id", "cg-blocks");

        /**
         * The cgGraph to render
         * @type {dudeGraph.Graph}
         */
        this._cgGraph = cgGraph;

        /**
         * The renderer blocks
         * @type {Array<dudeGraph.RendererBlock>}
         * @private
         */
        this._rendererBlocks = [];

        /**
         * The renderer groups
         * @type {Array<dudeGraph.RendererGroup>}
         * @private
         */
        this._rendererGroups = [];

        /**
         * The renderer connections
         * @type {Array<dudeGraph.RendererConnection>}
         * @private
         */
        this._rendererConnections = [];

        /**
         * Association map from id to renderer block
         * @type {d3.map<String, dudeGraph.RendererBlock>}
         */
        this._rendererBlockIds = d3.map();

        /**
         * Association map from id to renderer group
         * @type {d3.map<String, dudeGraph.RendererGroup>}
         */
        this._rendererGroupIds = d3.map();

        /**
         * The rendererBlocks quadtree
         * @type {d3.geom.quadtree}
         * @private
         */
        this._rendererBlocksQuadtree = null;

        /**
         * The rendererGroups quadtree
         * @type {d3.geom.quadtree}
         * @private
         */
        this._rendererGroupsQuadtree = null;

        /**
         * The rendererPoints quadtree
         * @type {d3.geom.quadtree}
         * @private
         */
        this._rendererPointsQuadtree = null;

        /**
         * Returns all d3Nodes (d3Blocks and d3Groups)
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Nodes", {
            get: function () {
                return this._d3Root.selectAll(".cg-block, .cg-group");
            }.bind(this)
        });

        /**
         * Returns all d3Blocks
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Blocks", {
            get: function () {
                return this._d3Block.selectAll(".cg-block");
            }.bind(this)
        });

        /**
         * Returns all d3Groups
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Groups", {
            get: function () {
                return this._d3Groups.selectAll(".cg-group");
            }.bind(this)
        });

        /**
         * Returns all d3Connections (d3Blocks and d3Groups)
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Connections", {
            get: function () {
                return this._d3Connections.selectAll(".cg-connection");
            }.bind(this)
        });

        /**
         * Returns all d3Blocks and d3Groups selected
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Selection", {
            get: function () {
                return this._d3Root.selectAll(".cg-selected");
            }.bind(this)
        });

        /**
         * Returns all d3Blocks and d3Groups selected
         * Children are also added to selection even if they are not selected directly
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3GroupedSelection", {
            get: function () {
                var selectedRendererNodes = [];
                this.d3Selection.each(function (rendererNode) {
                    (function recurseGroupSelection(rendererNode) {
                        selectedRendererNodes.push(rendererNode);
                        if (rendererNode.type === "group") {
                            _.forEach(rendererNode.children, function (childRendererNode) {
                                recurseGroupSelection(childRendererNode);
                            });
                        }
                    })(rendererNode);
                });
                return this._getD3NodesFromRendererNodes(selectedRendererNodes);
            }.bind(this)
        });
    });

    /**
     * Registers a dudeGraph.Block with a custom creator/updater/position getter
     * @param {String} blockType
     * @param {dudeGraph.Block} blockClass
     */
    Renderer.prototype.addBlockType = function (blockType, blockClass) {
        if (blockClass.rendererBlockCreator !== undefined) {
            this._rendererBlockCreators[blockType] = blockClass.rendererBlockCreator;
        }
        if (blockClass.rendererBlockUpdater !== undefined) {
            this._rendererBlockUpdaters[blockType] = blockClass.rendererBlockUpdater;
        }
        if (blockClass.pointPositionGetter !== undefined) {
            this._pointPositionGetters[blockType] = blockClass.pointPositionGetter;
        }
        this._cgGraph.loader.addBlockType(blockType, blockClass);
    };

    /**
     * Creates the cgGraph renderer
     */
    Renderer.prototype.initialize = function () {
        this._initialize();
        this._createSelectionBehavior();
        this._createZoomBehavior();
        this._createD3Blocks();
        this._createD3Connections();
        this._createD3Groups();
    };

    /**
     * Creates a rendererGroup from the current selection.
     * @returns {dudeGraph.RendererGroup}
     */
    Renderer.prototype.createGroupFromSelection = function (name) {
        var renderer = this;
        var rendererNodes = this.d3Selection.data();
        var rendererGroup = this._createRendererGroup({
            "id": dudeGraph.UUID.generate(),
            "description": name
        });
        _.forEach(rendererNodes, function (rendererNode) {
            renderer._removeRendererNodeParent(rendererNode);
            renderer._addRendererNodeParent(rendererNode, rendererGroup);
        });
        this._createD3Groups();
        this._updateD3Groups();
        return rendererGroup;
    };

    /**
     * Creates a rendererBlock from the given cgBlock.
     * @param {dudeGraph.Block} cgBlock
     * @returns {dudeGraph.RendererBlock}
     */
    Renderer.prototype.createRendererBlock = function (cgBlock) {
        var renderer = this;
        var rendererBlock = renderer._createRendererBlock({
            "id": dudeGraph.UUID.generate(),
            "cgBlock": cgBlock.cgId,
            "position": [100, 100],
            "size": [100, 100]
        });
        renderer._createD3Blocks();
        var d3Block = renderer._getD3NodesFromRendererNodes([rendererBlock]);
        renderer._positionRendererBlockBehavior(d3Block);
        return rendererBlock;
    };

    /**
     * Remove the current selection.
     */
    Renderer.prototype.removeSelection = function () {
        var renderer = this;
        _.forEach(this.d3Selection.data(), function (rendererNode) {
            renderer._removeRendererNode(rendererNode);
        });
        this._removeD3Blocks();
        this._removeD3Groups();
        this._removeD3Connections();
        this._updateD3Blocks();
        this._updateD3Groups();
    };

    return Renderer;

})();
/**
 * Drags the d3Node around
 * @returns {d3.behavior.drag}
 * @private
 */
dudeGraph.Renderer.prototype._dragRendererNodeBehavior = function () {
    var renderer = this;
    return d3.behavior.drag()
        .on("dragstart", function () {
            d3.event.sourceEvent.preventDefault();
            d3.event.sourceEvent.stopPropagation();
            renderer._addToSelection(d3.select(this), !d3.event.sourceEvent.shiftKey);
            renderer._d3MoveToFront(renderer.d3GroupedSelection);
        })
        .on("drag", function () {
            var selection = renderer.d3GroupedSelection;
            selection.each(function (rendererNode) {
                rendererNode.position[0] += d3.event.dx;
                rendererNode.position[1] += d3.event.dy;
            });
            renderer._updateSelectedD3Nodes(selection);
            renderer.d3Nodes.classed("cg-active", false);
            var rendererGroup = renderer._getNearestRendererGroup(d3.select(this).datum());
            if (rendererGroup) {
                renderer._getD3NodesFromRendererNodes([rendererGroup]).classed("cg-active", true);
            }
        })
        .on("dragend", function () {
            renderer.d3Nodes.classed("cg-active", false);
            var selection = renderer.d3Selection;
            var rendererGroup = renderer._getNearestRendererGroup(d3.select(this).datum());
            if (rendererGroup) {
                selection.each(function (rendererNode) {
                    renderer._addRendererNodeParent(rendererNode, rendererGroup);
                });
            }
            renderer._updateSelectedD3Nodes(selection);
        });
};

/**
 * Removes the rendererNode from his parent on double click
 * @returns {d3.behavior.doubleClick}
 * @private
 */
dudeGraph.Renderer.prototype._removeRendererNodeFromParentBehavior = function () {
    var renderer = this;
    return d3.behavior.doubleClick()
        .on("dblclick", function () {
            var d3Node = d3.select(this);
            var rendererNode = d3Node.datum();
            var rendererGroupParent = rendererNode.parent;
            if (rendererGroupParent) {
                d3.event.sourceEvent.preventDefault();
                d3.event.sourceEvent.stopPropagation();
                renderer._removeRendererNodeParent(rendererNode);
                // TODO: Optimize
                // renderer._updateSelectedD3Nodes(renderer._getD3NodesFromRendererNodes([rendererNode, rendererGroupParent]));
                renderer._updateSelectedD3Nodes(renderer.d3Nodes);
            }
        });
};

/**
 * Positions the rendererBlock at the mouse, and releases on mousedown
 * @param {d3.selection} d3Block
 * @private
 */
dudeGraph.Renderer.prototype._positionRendererBlockBehavior = function (d3Block) {
    var renderer = this;
    var namespace = ".placement-behavior";
    var disablePlacement = function () {
        renderer._d3Svg.on("mousemove" + namespace, null);
        renderer._d3Svg.on("mousedown" + namespace, null);
        renderer.d3Blocks.classed("cg-non-clickable", false);
        renderer.d3Groups.classed("cg-non-clickable", false);
    };
    disablePlacement();
    this.d3Blocks.classed("cg-non-clickable", true);
    this.d3Groups.classed("cg-non-clickable", true);
    this._d3Svg.on("mousemove" + namespace, function () {
        d3Block.datum().position = renderer._getRelativePosition(d3.mouse(this));
        renderer._updateSelectedD3Nodes(d3Block);
    });
    this._d3Svg.on("mousedown" + namespace, function () {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        d3Block.datum().position = renderer._getRelativePosition(d3.mouse(this));
        renderer._updateSelectedD3Nodes(d3Block);
        disablePlacement();
    });
};

/**
 * Removes a connection when clicking and pressing alt on a d3Point
 * @returns {d3.behavior.click}
 * @private
 */
dudeGraph.Renderer.prototype._removeRendererConnectionBehavior = function () {
    var renderer = this;
    return d3.behavior.mousedown()
        .on("mousedown", function (rendererPoint) {
            if (d3.event.sourceEvent.altKey) {
                d3.event.sourceEvent.preventDefault();
                d3.event.sourceEvent.stopImmediatePropagation();
                renderer._removeRendererPointRendererConnections(rendererPoint);
                renderer._removeD3Connections();
                // TODO: Optimize
                renderer._updateD3Blocks();
            }
        });
};

/**
 * Drags a connection from a d3Point
 * @returns {d3.behavior.drag}
 * @private
 */
dudeGraph.Renderer.prototype._dragRendererConnectionBehavior = function () {
    var renderer = this;
    var draggingConnection = null;
    var computeConnectionPath = function (rendererPoint) {
        var rendererPointPosition = renderer._getRendererPointPosition(rendererPoint);
        if (rendererPoint.isOutput) {
            return renderer._computeConnectionPath(rendererPointPosition, renderer._getRelativePosition([d3.event.sourceEvent.clientX, d3.event.sourceEvent.clientY]));
        }
        return renderer._computeConnectionPath(renderer._getRelativePosition([d3.event.sourceEvent.clientX, d3.event.sourceEvent.clientY]), rendererPointPosition);
    };
    return d3.behavior.drag()
        .on("dragstart", function (rendererPoint) {
            d3.event.sourceEvent.preventDefault();
            d3.event.sourceEvent.stopPropagation();
            draggingConnection = renderer._d3Connections
                .append("svg:path")
                .classed("cg-connection", true)
                .classed("cg-stream", function () {
                    return rendererPoint.cgPoint.pointType === "Stream";
                })
                .attr("d", function () {
                    return computeConnectionPath(rendererPoint);
                });
        })
        .on("drag", function (rendererPoint) {
            draggingConnection
                .attr("d", function () {
                    return computeConnectionPath(rendererPoint);
                });
        })
        .on("dragend", function (rendererPoint) {
            var position = renderer._getRelativePosition([d3.event.sourceEvent.clientX, d3.event.sourceEvent.clientY]);
            var nearestRendererPoint = renderer._getNearestRendererPoint(position);
            if (nearestRendererPoint && rendererPoint !== nearestRendererPoint) {
                try {
                    if (rendererPoint.isOutput) {
                        renderer._createRendererConnection({
                            "outputRendererPoint": rendererPoint,
                            "inputRendererPoint": nearestRendererPoint
                        });
                    } else {
                        renderer._createRendererConnection({
                            "outputRendererPoint": nearestRendererPoint,
                            "inputRendererPoint": rendererPoint
                        });
                    }
                    renderer._createD3Connections();
                    // TODO: Optimize
                    renderer._updateD3Blocks();
                } catch (connectionException) {
                    //console.error(connectionException);
                    renderer.emit("error", connectionException);
                }
            } else {
                renderer.emit("warning", "Renderer::_createD3PointShapes() No point found for creating connection");
                //console.warn("Renderer::_createD3PointShapes() No point found for creating connection");
            }
            draggingConnection.remove();
        });
};
/**
 * Creates the selection brush
 * @private
 */
dudeGraph.Renderer.prototype._createSelectionBehavior = function () {
    var renderer = this;
    var selectionBrush = null;
    this._d3Svg.call(d3.behavior.drag()
            .on("dragstart", function () {
                if (d3.event.sourceEvent.shiftKey) {
                    d3.event.sourceEvent.stopImmediatePropagation();
                    selectionBrush = renderer._d3Svg
                        .append("svg:rect")
                        .classed("cg-selection", true)
                        .datum(d3.mouse(this));
                } else {
                    renderer._clearSelection();
                }
            })
            .on("drag", function () {
                if (selectionBrush) {
                    var position = d3.mouse(this);
                    selectionBrush.attr({
                        "x": function (origin) {
                            return Math.min(origin[0], position[0]);
                        },
                        "y": function (origin) {
                            return Math.min(origin[1], position[1]);
                        },
                        "width": function (origin) {
                            return Math.max(position[0] - origin[0], origin[0] - position[0]);
                        },
                        "height": function (origin) {
                            return Math.max(position[1] - origin[1], origin[1] - position[1]);
                        }
                    });
                }
            })
            .on("dragend", function () {
                if (selectionBrush) {
                    var selectionBrushTopLeft = renderer._getRelativePosition([parseInt(selectionBrush.attr("x")), parseInt(selectionBrush.attr("y"))]);
                    var selectionBrushBottomRight = renderer._getRelativePosition([parseInt(selectionBrush.attr("x")) + parseInt(selectionBrush.attr("width")), parseInt(selectionBrush.attr("y")) + parseInt(selectionBrush.attr("height"))]);
                    var selectedRendererNodes = renderer._getNearestRendererBlocks(selectionBrushTopLeft[0], selectionBrushTopLeft[1], selectionBrushBottomRight[0], selectionBrushBottomRight[1]);
                    if (selectedRendererNodes.length > 0) {
                        renderer._addToSelection(renderer._getD3NodesFromRendererNodes(selectedRendererNodes), true);
                    } else {
                        renderer._clearSelection();
                    }
                    selectionBrush.remove();
                    selectionBrush = null;
                }
            })
    );
};

/**
 * Adds the given d3Nodes to the current selection
 * @param {d3.selection} d3Nodes - The d3Nodes to select
 * @param {Boolean?} clearSelection - If true, everything but the d3Nodes will be unselected
 * @private
 */
dudeGraph.Renderer.prototype._addToSelection = function (d3Nodes, clearSelection) {
    if (clearSelection) {
        this._clearSelection(true);
    }
    d3Nodes.classed("cg-selected", true);
    this.emit("cg-select", d3Nodes.data()[d3Nodes.data().length - 1]);
};

/**
 * Clears the selection
 * @param {Boolean?} ignoreEmit - If true, the unselect event will not be emitted
 * @private
 */
dudeGraph.Renderer.prototype._clearSelection = function (ignoreEmit) {
    this.d3Selection.classed("cg-selected", false);
    if (!ignoreEmit) {
        this.emit("cg-unselect");
    }
};
/**
 * Creates zoom and pan
 * @private
 */
dudeGraph.Renderer.prototype._createZoomBehavior = function () {
    var renderer = this;
    this._zoom = d3.behavior.zoom()
        .scaleExtent([this._config.zoom.min, this._config.zoom.max])
        .on("zoom", function () {
            if (d3.event.sourceEvent) {
                pandora.preventCallback(d3.event.sourceEvent);
            }
            renderer._d3Root.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            renderer._config.zoom.translate = renderer._zoom.translate();
            renderer._config.zoom.scale = renderer._zoom.scale();
        }.bind(this));
    this._d3Svg.call(this._zoom);
};
/**
 * Initializes rendererGroups and rendererBlocks
 * Add parent and children references, and also cgBlocks references to renderer blocks
 * @private
 */
dudeGraph.Renderer.prototype._initialize = function () {
    this._initializeRendererBlocks();
    this._initializeRendererConnections();
    this._initializeRendererGroups();
    this._initializeRendererGroupParents();
    this._initializeListeners();
};

/**
 * Creates the rendererBlocks (linked to their respective cgBlocks) and their rendererPoints
 * @private
 */
dudeGraph.Renderer.prototype._initializeRendererBlocks = function () {
    var renderer = this;
    _.forEach(this._data.blocks, function (blockData) {
        renderer._createRendererBlock(blockData);
    });
};

/**
 * Creates the rendererConnection between the rendererBlocks/rendererPoints
 * @private
 */
dudeGraph.Renderer.prototype._initializeRendererConnections = function () {
    var renderer = this;
    _.forEach(this._data.connections, function (connectionData) {
        var cgConnection = renderer._cgGraph.cgConnections[connectionData.cgConnectionIndex];
        if (!cgConnection) {
            throw new Error("Connection at index `" + connectionData.cgConnectionIndex + "` does not exists");
        }
        var outputRendererBlock = renderer._getRendererBlockById(connectionData.outputRendererBlockId);
        var inputRendererBlock = renderer._getRendererBlockById(connectionData.inputRendererBlockId);

        if (!outputRendererBlock) {
            throw new Error("Connection at index `" + connectionData.cgConnectionIndex +
                    "`: Cannot find outputRendererBlock `" + connectionData.outputRendererBlockId + "`");
        }
        if (!inputRendererBlock) {
            throw new Error("Connection at index `" + connectionData.cgConnectionIndex +
                    "`: Cannot find inputRendererBlock `" + connectionData.inputRendererBlockId + "`");
        }
        if (outputRendererBlock.cgBlock !== cgConnection.cgOutputPoint.cgBlock) {
            throw new Error("Connection at index `" + connectionData.cgConnectionIndex +
                "`: OutputRendererBlock `" + outputRendererBlock.id +
                "` is not holding a reference to the outputCgBlock `" + cgConnection.cgOutputPoint.cgBlock.cgId + "`");
        }
        if (inputRendererBlock.cgBlock !== cgConnection.cgInputPoint.cgBlock) {
            throw new Error("Connection at index `" + connectionData.cgConnectionIndex +
                "`: InputRendererBlock `" + inputRendererBlock.id +
                "` is not holding a reference to the inputCgBlock `" + cgConnection.cgInputPoint.cgBlock.cgId + "`");
        }
        var outputRendererPoint = renderer._getRendererPointByName(outputRendererBlock, cgConnection.cgOutputPoint.cgName);
        var inputRendererPoint = renderer._getRendererPointByName(inputRendererBlock, cgConnection.cgInputPoint.cgName);
        if (!outputRendererPoint) {
            throw new Error("Connection at index `" + connectionData.cgConnectionIndex +
                "`: Cannot find outputRendererPoint `" + cgConnection.cgOutputPoint.cgName + "`");
        }
        if (!inputRendererPoint) {
            throw new Error("Connection at index `" + connectionData.cgConnectionIndex +
                "`: Cannot find inputRendererPoint `" + cgConnection.cgInputPoint.cgName + "`");
        }
        renderer._createRendererConnection({
            "cgConnection": cgConnection,
            "outputRendererPoint": outputRendererPoint,
            "inputRendererPoint": inputRendererPoint
        }, true);
    });
    // TODO: Check non linked cgConnections <=> rendererConnections
};

/**
 * Creates the rendererGroups
 * @private
 */
dudeGraph.Renderer.prototype._initializeRendererGroups = function () {
    var renderer = this;
    _.forEach(this._data.groups, function (groupData) {
        renderer._createRendererGroup(groupData);
    });
};

/**
 * Assigns rendererGroup parents
 * @private
 */
dudeGraph.Renderer.prototype._initializeRendererGroupParents = function () {
    var renderer = this;
    _.forEach(this._data.blocks, function (rendererBlockData) {
        var rendererBlock = renderer._getRendererBlockById(rendererBlockData.id);
        if (rendererBlockData.parent) {
            var rendererGroupParent = renderer._getRendererGroupById(rendererBlockData.parent);
            if (!rendererGroupParent) {
                throw new Error("Cannot find rendererBlock parent id `" + rendererBlockData.parent + "`");
            }
            //noinspection JSCheckFunctionSignatures
            renderer._addRendererNodeParent(rendererBlock, rendererGroupParent);
        }
    });
    _.forEach(this._data.groups, function (rendererGroupData) {
        var rendererGroup = renderer._getRendererGroupById(rendererGroupData.id);
        if (rendererGroupData.parent) {
            var rendererGroupParent = renderer._getRendererGroupById(rendererGroupData.parent);
            if (!rendererGroupParent) {
                throw new Error("Cannot find rendererGroup parent id `" + rendererGroupData.parent + "`");
            }
            //noinspection JSCheckFunctionSignatures
            renderer._addRendererNodeParent(rendererGroup, rendererGroupParent);
        }
    });
};
/**
 * Initializes the listeners to automatically updates the renderer when a graph change occurs
 * @private
 */
dudeGraph.Renderer.prototype._initializeListeners = function () {
    var renderer = this;
    this._cgGraph.on("cg-block-create", this.createRendererBlock.bind(this));
    this._cgGraph.on("cg-block-name-change", function (cgBlock) {
        renderer._updateSelectedD3Blocks(renderer._getD3NodesFromRendererNodes(
            renderer._getRendererBlocksByCgBlock(cgBlock)));
    });
    this._cgGraph.on("cg-point-value-change", function (cgPoint) {
        renderer._updateSelectedD3Blocks(renderer._getD3NodesFromRendererNodes(
            renderer._getRendererBlocksByCgBlock(cgPoint._cgBlock)));
    });
};
/**
 * Returns the rendererNode associated with the given id
 * @param {String} id
 * @returns {dudeGraph.RendererBlock|null}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererBlockById = function (id) {
    return this._rendererBlockIds.get(id) || null;
};

/**
 * Returns the rendererBlocks bound to the given cgBlock
 * @param {dudeGraph.Block} cgBlock
 * @returns {Array<dudeGraph.RendererBlock>}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererBlocksByCgBlock = function (cgBlock) {
    var rendererBlocks = [];
    _.forEach(this._rendererBlocks, function (rendererBlock) {
        if (rendererBlock.cgBlock === cgBlock) {
            rendererBlocks.push(rendererBlock);
        }
    });
    return rendererBlocks;
};

/**
 * Creates a renderer block
 * @param {Object} rendererBlockData
 * @returns {dudeGraph.RendererBlock}
 * @private
 */
dudeGraph.Renderer.prototype._createRendererBlock = function (rendererBlockData) {
    if (!rendererBlockData.id) {
        throw new Error("Cannot create a rendererBlock without an id");
    }
    if (this._getRendererBlockById(rendererBlockData.id) !== null) {
        throw new Error("Multiple rendererBlocks for id `" + rendererBlockData.id + "`");
    }
    var cgBlock = this._cgGraph.blockById(rendererBlockData.cgBlock);
    if (!cgBlock) {
        throw new Error("Cannot link cgBlock `" + rendererBlockData.cgBlock +
            "` to rendererBlock `" + rendererBlockData.id + "`");
    }
    var rendererBlock = _.merge({}, rendererBlockData);
    rendererBlock.type = "block";
    rendererBlock.parent = null;
    rendererBlock.cgBlock = cgBlock;
    rendererBlock.id = rendererBlockData.id;
    rendererBlock.rendererPoints = [];
    rendererBlock.position = rendererBlockData.position || [0, 0];
    rendererBlock.size = rendererBlockData.size || this._config.block.size;
    this._createRendererPoints(rendererBlock);
    this._rendererBlocks.push(rendererBlock);
    this._rendererBlockIds.set(rendererBlock.id, rendererBlock);
    return rendererBlock;
};

/**
 * Removes the given rendererBlock, and all its rendererConnections
 * Also removes the cgBlock from the cgGraph if it is the last reference
 * @param {dudeGraph.RendererBlock} rendererBlock
 * @private
 */
dudeGraph.Renderer.prototype._removeRendererBlock = function (rendererBlock) {
    var renderer = this;
    var rendererBlockFound = this._rendererBlocks.indexOf(rendererBlock);
    if (rendererBlockFound === -1) {
        throw new Error("Cannot find rendererBlock `" + rendererBlock.id + "`");
    }
    _.forEach(rendererBlock.rendererPoints, function (rendererPoint) {
        renderer._removeRendererPointRendererConnections(rendererPoint);
    });
    this._removeRendererNodeParent(rendererBlock);
    this._rendererBlocks.splice(rendererBlockFound, 1);
    if (this._getRendererBlocksByCgBlock(rendererBlock.cgBlock).length === 0) {
        this._cgGraph.removeBlock(rendererBlock.cgBlock);
    }
};
/**
 * Creates a rendererConnection
 * @param {Object} rendererConnectionData
 * @param {Boolean} [ignoreCgConnection=false] - Whether we ignore the creation of a cgConnection
 * @private
 */
dudeGraph.Renderer.prototype._createRendererConnection = function (rendererConnectionData, ignoreCgConnection) {
    var outputRendererPoint = rendererConnectionData.outputRendererPoint || this._getRendererPointByName(this._getRendererBlockById(rendererConnectionData.outputBlockId), rendererConnectionData.outputName);
    var inputRendererPoint = rendererConnectionData.inputRendererPoint || this._getRendererPointByName(this._getRendererBlockById(rendererConnectionData.inputBlockId), rendererConnectionData.inputName);
    var cgConnection = rendererConnectionData.cgConnection;
    if (!outputRendererPoint) {
        throw new Error("Cannot find the outputRendererPoint");
    }
    if (!inputRendererPoint) {
        throw new Error("Cannot find the inputRendererPoint");
    }
    if (!ignoreCgConnection) {
        cgConnection = outputRendererPoint.cgPoint.connect(inputRendererPoint.cgPoint);
    } else {
        _.forEach(this._rendererConnections, function (rendererConnection) {
            if (rendererConnection.cgConnection === cgConnection) {
                throw new Error("Connections `" + cgConnection +
                    "` is already handled in the renderer by the rendererConnection `" + rendererConnection + "`");
            }
        });
    }
    if (!cgConnection) {
        throw new Error("Cannot create a rendererConnection without a cgConnection");
    }
    var rendererConnection = {
        "cgConnection": cgConnection,
        "outputRendererPoint": outputRendererPoint,
        "inputRendererPoint": inputRendererPoint
    };
    this._rendererConnections.push(rendererConnection);
};

/**
 * Removes the given rendererConnection
 * @param {dudeGraph.RendererConnection} rendererConnection
 * @private
 */
dudeGraph.Renderer.prototype._removeRendererConnection = function (rendererConnection) {
    var rendererConnectionFound = this._rendererConnections.indexOf(rendererConnection);
    if (rendererConnectionFound === -1) {
        throw new Error("Connection not found");
    }
    rendererConnection.outputRendererPoint.cgPoint.disconnect(rendererConnection.inputRendererPoint.cgPoint);
    this._rendererConnections.splice(rendererConnectionFound, 1);
};
/**
 * Returns the rendererGroup associated with the given id
 * @param {String} id
 * @returns {dudeGraph.RendererGroup|null}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererGroupById = function (id) {
    return this._rendererGroupIds.get(id) || null;
};

/**
 * Creates a rendererGroup
 * @param {Object} rendererGroupData
 * @returns {dudeGraph.RendererGroup}
 * @private
 */
dudeGraph.Renderer.prototype._createRendererGroup = function (rendererGroupData) {
    if (!rendererGroupData.id) {
        throw new Error("Cannot create a rendererGroup without an id");
    }
    if (this._getRendererGroupById(rendererGroupData.id)) {
        throw new Error("Duplicate rendererGroup for id `" + rendererGroupData.id + "`");
    }
    var rendererGroup = _.merge({}, rendererGroupData);
    rendererGroup.type = "group";
    rendererGroup.id = rendererGroupData.id;
    rendererGroup.parent = null;
    rendererGroup.children = [];
    rendererGroup.position = rendererGroupData.position || [0, 0];
    rendererGroup.size = rendererGroupData.size || this._config.group.size;
    this._rendererGroups.push(rendererGroup);
    this._rendererGroupIds.set(rendererGroup.id, rendererGroup);
    return rendererGroup;
};

/**
 * Removes the rendererGroup
 * @param {dudeGraph.RendererGroup} rendererGroup
 * @private
 */
dudeGraph.Renderer.prototype._removeRendererGroup = function (rendererGroup) {
    var rendererGroupFound = this._rendererGroups.indexOf(rendererGroup);
    if (rendererGroupFound === -1) {
        throw new Error("RendererGroup not found and thus cannot be removed");
    }
    this._removeRendererNodeParent(rendererGroup);
    this._rendererGroups.splice(rendererGroupFound, 1);
};
/**
 * Removes the given rendererNode from the renderer
 * Also removes the cgBlock if it is the rendererNode was the last reference on it
 * @param {dudeGraph.RendererNode} rendererNode
 * @private
 */
dudeGraph.Renderer.prototype._removeRendererNode = function (rendererNode) {
    if (rendererNode.type === "block") {
        this._removeRendererBlock(rendererNode);
    } else {
        this._removeRendererGroup(rendererNode);
    }
};

/**
 * Returns the parent hierarchy of the given rendererNode
 * @param {dudeGraph.RendererNode} rendererNode
 * @returns {Array<dudeGraph.RendererGroup>}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererNodeParents = function (rendererNode) {
    var parents = [];
    var parent = rendererNode.parent;
    while (parent) {
        parents.push(parent);
        parent = parent.parent;
    }
    return parents;
};

/**
 * Adds the given rendererNode in the rendererGroupParent
 * @param {dudeGraph.RendererNode} rendererNode
 * @param {dudeGraph.RendererGroup} rendererGroupParent
 * @private
 */
dudeGraph.Renderer.prototype._addRendererNodeParent = function (rendererNode, rendererGroupParent) {
    if (rendererNode.parent === rendererGroupParent) {
        return;
    }
    (function checkRendererNodeParentOfRendererGroupParent(checkRendererGroupParent) {
        if (checkRendererGroupParent === rendererNode) {
            throw new Error("Cannot add `" + rendererNode.id + "` as a child of `" + rendererGroupParent.id +
                "`, because `" + rendererNode.id + "` is equal or is a parent of `" + rendererGroupParent.id + "`");
        }
        if (checkRendererGroupParent.parent) {
            checkRendererNodeParentOfRendererGroupParent(checkRendererGroupParent.parent);
        }
    })(rendererGroupParent);
    this._removeRendererNodeParent(rendererNode);
    rendererGroupParent.children.push(rendererNode);
    rendererNode.parent = rendererGroupParent;
};

/**
 * Removes the rendererNode from his parent
 * @param {dudeGraph.RendererNode} rendererNode
 * @private
 */
dudeGraph.Renderer.prototype._removeRendererNodeParent = function (rendererNode) {
    if (rendererNode.parent) {
        rendererNode.parent.children.splice(rendererNode.parent.children.indexOf(rendererNode), 1);
        rendererNode.parent = null;
    }
};
/**
 * Returns the rendererPoint associated with the given name
 * @param {dudeGraph.RendererBlock} rendererBlock
 * @param {String} rendererPointName
 * @returns {dudeGraph.RendererPoint|null}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererPointByName = function (rendererBlock, rendererPointName) {
    return _.find(rendererBlock.rendererPoints, function (rendererPoint) {
            return rendererPoint.cgPoint.cgName === rendererPointName;
        }
    );
};

/**
 * Creates the rendererPoints for a given rendererBlock
 * @param {dudeGraph.RendererBlock} rendererBlock
 * @private
 */
dudeGraph.Renderer.prototype._createRendererPoints = function (rendererBlock) {
    rendererBlock.rendererPoints = [];
    _.forEach(rendererBlock.cgBlock.cgOutputs, function (cgOutput) {
        rendererBlock.rendererPoints.push({
            "type": "point",
            "rendererBlock": rendererBlock,
            "index": rendererBlock.cgBlock.cgOutputs.indexOf(cgOutput),
            "cgPoint": cgOutput,
            "isOutput": true
        });
    });
    _.forEach(rendererBlock.cgBlock.cgInputs, function (cgInput) {
        rendererBlock.rendererPoints.push({
            "type": "point",
            "rendererBlock": rendererBlock,
            "index": rendererBlock.cgBlock.cgInputs.indexOf(cgInput),
            "cgPoint": cgInput,
            "isOutput": false
        });
    });
};

/**
 * Returns all rendererConnections for the given rendererPoint
 * @param {dudeGraph.RendererPoint} rendererPoint
 * @returns {Array<dudeGraph.RendererConnection>}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererPointRendererConnections = function (rendererPoint) {
    var rendererConnections = [];
    _.forEach(this._rendererConnections, function (rendererConnection) {
        if (rendererConnection.outputRendererPoint === rendererPoint || rendererConnection.inputRendererPoint === rendererPoint) {
            rendererConnections.push(rendererConnection);
        }
    });
    return rendererConnections;
};

/**
 * Removes all rendererConnections for the given rendererPoint
 * @param {dudeGraph.RendererPoint} rendererPoint
 * @private
 */
dudeGraph.Renderer.prototype._removeRendererPointRendererConnections = function (rendererPoint) {
    var renderer = this;
    var removeRendererConnections = renderer._getRendererPointRendererConnections(rendererPoint);
    _.forEach(removeRendererConnections, function (removeRendererConnection) {
        renderer._removeRendererConnection(removeRendererConnection);
    });
};
/**
 * Creates d3Points
 * @param {d3.selection} d3Block - The svg group which will contains the d3Points of the current block
 * @private
 */
dudeGraph.Renderer.prototype._createD3Points = function (d3Block) {
    var renderer = this;
    var createdD3Points = d3Block
        .selectAll(".cg-output, .cg-input")
        .data(function (rendererBlock) {
            return rendererBlock.rendererPoints;
        }, function (rendererPoint) {
            return rendererPoint.cgPoint.cgName;
        })
        .enter()
        .append("svg:g")
        .attr("class", function (rendererPoint) {
            return "cg-" + (rendererPoint.isOutput ? "output" : "input");
        })
        .each(function () {
            renderer._createD3PointShapes(d3.select(this));
        });
    createdD3Points
        .append("svg:text")
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", function (rendererPoint) {
            return rendererPoint.isOutput ? "end" : "start";
        })
        .text(function (rendererPoint) {
            return rendererPoint.cgPoint.cgName;
        });
    this._updateSelectedD3Points(createdD3Points);
};

/**
 * Updates the selected d3Points
 * @param {d3.selection} updatedD3Points
 * @private
 */
dudeGraph.Renderer.prototype._updateSelectedD3Points = function (updatedD3Points) {
    var renderer = this;
    updatedD3Points
        .classed("cg-empty", function (rendererPoint) {
            return rendererPoint.cgPoint.empty();
        })
        .classed("cg-stream", function (rendererPoint) {
            return rendererPoint.cgPoint.pointType === "Stream";
        })
        .attr("transform", function (rendererPoint) {
            return "translate(" + renderer._getRendererPointPosition(rendererPoint, true) + ")";
        });
    updatedD3Points
        .select("text")
        .attr("transform", function (rendererPoint) {
            if (rendererPoint.isOutput) {
                return "translate(" + [-renderer._config.point.radius * 2 - renderer._config.block.padding] + ")";
            } else {
                return "translate(" + [renderer._config.point.radius * 2 + renderer._config.block.padding] + ")";
            }
        });
};

/**
 * Creates the d3PointShapes
 * @param {d3.selection} d3Point
 * @returns {d3.selection}
 * @private
 */
dudeGraph.Renderer.prototype._createD3PointShapes = function (d3Point) {
    var renderer = this;
    d3Point
        .selectAll(".cg-point-shape")
        .data(d3Point.data(), function (rendererPoint) {
            return rendererPoint.cgPoint.cgName;
        })
        .enter()
        .append("svg:path")
        .classed("cg-point-shape", true)
        .attr("d", function (rendererPoint) {
            var r = renderer._config.point.radius;
            if (rendererPoint.cgPoint.pointType === "Stream") {
                return ["M " + -r + " " + -r * 1.5 + " L " + -r + " " + r * 1.5 + " L " + r + " " + 0 + " Z"];
            } else {
                return ["M 0, 0", "m " + -r + ", 0", "a " + [r, r] + " 0 1,0 " + r * 2 + ",0", "a " + [r, r] + " 0 1,0 " + -(r * 2) + ",0"];
            }
        })
        .call(renderer._removeRendererConnectionBehavior())
        .call(renderer._dragRendererConnectionBehavior());
};
/**
 * Creates d3Blocks with the existing rendererBlocks
 * @private
 */
dudeGraph.Renderer.prototype._createD3Blocks = function () {
    var renderer = this;
    this.d3Blocks
        .data(this._rendererBlocks, function (rendererBlock) {
            var nbPoints = Math.max(rendererBlock.cgBlock.cgInputs.length, rendererBlock.cgBlock.cgOutputs.length);
            rendererBlock.size = [
                renderer._config.block.size[0],
                nbPoints * renderer._config.point.height + renderer._config.block.header
            ];
            return rendererBlock.id;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (rendererBlock) {
            return renderer._getRendererNodeUniqueID(rendererBlock);
        })
        .classed("cg-block", true)
        .call(this._dragRendererNodeBehavior())
        .call(this._removeRendererNodeFromParentBehavior())
        .each(function (rendererBlock) {
            d3.select(this).classed("cg-" + _.kebabCase(rendererBlock.cgBlock.blockType), true);
            var creator = renderer._rendererBlockCreators[rendererBlock.cgBlock.blockType];
            if (creator !== undefined) {
                creator.call(this, renderer);
            } else {
                renderer._defaultBlockCreator.call(this, renderer);
            }
        });
    // BUG: getBBox returns 0 when the d3Blocks are not yet rendered
    setTimeout(this._updateD3Blocks.bind(this), 10);
};

dudeGraph.Renderer.prototype._defaultBlockCreator = function (renderer) {
    var d3Block = d3.select(this);
    d3Block
        .append("svg:rect")
        .attr("rx", function () {
            return renderer._config.block.borderRadius || 0;
        })
        .attr("ry", function () {
            return renderer._config.block.borderRadius || 0;
        });
    d3Block
        .append("svg:text")
        .classed("cg-title", true)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "text-before-edge");
    d3Block
        .append("svg:g")
        .classed("cg-points", true);
    renderer._createD3Points(d3Block.select(".cg-points"));
};

/**
 * Updates all d3Blocks
 * @private
 */
dudeGraph.Renderer.prototype._updateD3Blocks = function () {
    this._updateSelectedD3Blocks(this.d3Blocks);
};

/**
 * Updates selected d3Blocks
 * @param {d3.selection} updatedD3Blocks
 * @private
 */
dudeGraph.Renderer.prototype._updateSelectedD3Blocks = function (updatedD3Blocks) {
    var renderer = this;
    updatedD3Blocks.each(function (rendererBlock) {
        var updater = renderer._rendererBlockUpdaters[rendererBlock.cgBlock.blockType];
        if (updater !== undefined) {
            updater.call(this, renderer);
        } else {
            renderer._defaultBlockUpdater.call(this, renderer);
        }
    });
};

dudeGraph.Renderer.prototype._defaultBlockUpdater = function (renderer) {
    var d3Block = d3.select(this);
    d3Block
        .select("text")
        .text(function (rendererBlock) {
            return rendererBlock.cgBlock.cgName;
        });
    d3Block
        .each(function (rendererBlock) {
            return renderer._computeRendererBlockSize(rendererBlock);
        });
    d3Block
        .attr("transform", function (rendererBlock) {
            return "translate(" + rendererBlock.position + ")";
        });
    d3Block
        .select("rect")
        .attr("width", function (rendererBlock) {
            return rendererBlock.size[0];
        })
        .attr("height", function (rendererBlock) {
            return rendererBlock.size[1];
        });
    d3Block
        .select("text")
        .attr("transform", function (block) {
            return "translate(" + [block.size[0] / 2, renderer._config.block.padding] + ")";
        });
    renderer._updateSelectedD3Points(d3Block.select(".cg-points").selectAll(".cg-output, .cg-input"));
};

/**
 * Removes d3Blocks when rendererBlocks are removed
 * @private
 */
dudeGraph.Renderer.prototype._removeD3Blocks = function () {
    var removedRendererBlocks = this.d3Blocks
        .data(this._rendererBlocks, function (rendererBlock) {
            return rendererBlock.id;
        })
        .exit()
        .remove();
};
/**
 * Creates d3Connections with the existing rendererConnections
 * @private
 */
dudeGraph.Renderer.prototype._createD3Connections = function () {
    var createdD3Connections = this.d3Connections
        .data(this._rendererConnections, function (rendererConnection) {
            if (rendererConnection) {
                return rendererConnection.outputRendererPoint.rendererBlock.id + ":" + rendererConnection.outputRendererPoint.cgPoint.cgName + "," +
                    rendererConnection.inputRendererPoint.rendererBlock.id + ":" + rendererConnection.inputRendererPoint.cgPoint.cgName;
            }
        })
        .enter()
        .append("svg:path")
        .classed("cg-connection", true)
        .classed("cg-stream", function (rendererConnection) {
            return rendererConnection.inputRendererPoint.cgPoint.pointType === "Stream";
        });
    this._updateSelectedD3Connections(createdD3Connections);
};

/**
 * Updates all d3Connections
 * @private
 */
dudeGraph.Renderer.prototype._updatedD3Connections = function () {
    this._updateSelectedD3Connections(this.d3Connections);
};

/**
 * Updates selected d3Connections
 * @param {d3.selection} updatedD3Connections
 * @private
 */
dudeGraph.Renderer.prototype._updateSelectedD3Connections = function (updatedD3Connections) {
    var renderer = this;
    updatedD3Connections
        .attr("d", function (rendererConnection) {
            var rendererPointPosition1 = this._getRendererPointPosition(rendererConnection.outputRendererPoint);
            var rendererPointPosition2 = this._getRendererPointPosition(rendererConnection.inputRendererPoint);
            return renderer._computeConnectionPath(rendererPointPosition1, rendererPointPosition2);
        }.bind(this));
};

/**
 * Removes d3Connections when rendererConnections are removed
 * @private
 */
dudeGraph.Renderer.prototype._removeD3Connections = function () {
    var removedRendererConnections = this.d3Connections
        .data(this._rendererConnections, function (rendererConnection) {
            if (rendererConnection) {
                return rendererConnection.outputRendererPoint.rendererBlock.id + ":" + rendererConnection.outputRendererPoint.cgPoint.cgName + "," +
                    rendererConnection.inputRendererPoint.rendererBlock.id + ":" + rendererConnection.inputRendererPoint.cgPoint.cgName;
            }
        })
        .exit()
        .remove();
};
/**
 * Creates d3Groups with the existing rendererGroups
 * @private
 */
dudeGraph.Renderer.prototype._createD3Groups = function () {
    var createdD3Groups = this.d3Groups
        .data(this._rendererGroups, function (rendererGroup) {
            return rendererGroup.id;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (rendererGroup) {
            return this._getRendererNodeUniqueID(rendererGroup);
        }.bind(this))
        .attr("class", "cg-group")
        .call(this._dragRendererNodeBehavior())
        .call(this._removeRendererNodeFromParentBehavior());
    createdD3Groups
        .append("svg:rect")
        .attr("rx", this._config.group.borderRadius || 0)
        .attr("ry", this._config.group.borderRadius || 0);
    createdD3Groups
        .append("svg:text")
        .attr("class", "cg-title")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "text-before-edge");
    // TODO: getBBox returns 0 when the d3Blocks are not yet rendered
    setTimeout(this._updateD3Groups.bind(this), 10);
};

/**
 * Updates all d3Groups
 * @private
 */
dudeGraph.Renderer.prototype._updateD3Groups = function () {
    this._updateSelectedD3Groups(this.d3Groups);
};

/**
 * Updates selected d3Groups
 * @param {d3.selection} updatedD3Groups
 * @private
 */
dudeGraph.Renderer.prototype._updateSelectedD3Groups = function (updatedD3Groups) {
    var renderer = this;
    updatedD3Groups
        .select("text")
        .text(function (rendererGroup) {
            return rendererGroup.description;
        });
    updatedD3Groups
        .each(function (rendererGroup) {
            return renderer._computeRendererGroupPositionAndSize(rendererGroup);
        });
    updatedD3Groups
        .attr("transform", function (rendererGroup) {
            return "translate(" + rendererGroup.position + ")";
        });
    updatedD3Groups
        .select("rect")
        .attr("width", function (rendererGroup) {
            return rendererGroup.size[0];
        })
        .attr("height", function (rendererGroup) {
            return rendererGroup.size[1];
        });
    updatedD3Groups
        .select("text")
        .attr("transform", function (rendererGroup) {
            return "translate(" + [rendererGroup.size[0] / 2, renderer._config.group.padding] + ")";
        });
};

/**
 * Removes d3Groups when rendererGroups are removed
 * @private
 */
dudeGraph.Renderer.prototype._removeD3Groups = function () {
    var removedD3Groups = this.d3Groups
        .data(this._rendererGroups, function (rendererGroup) {
            return rendererGroup.id;
        })
        .exit()
        .remove();
};
/**
 * This method will update all nodes and their parents if needed
 * @param {d3.selection} d3Nodes
 * @private
 */
dudeGraph.Renderer.prototype._updateSelectedD3Nodes = function (d3Nodes) {
    var renderer = this;
    var updateParents = [];
    d3Nodes
        .attr("transform", function (rendererNode) {
            updateParents = updateParents.concat(renderer._getRendererNodeParents(rendererNode));
            return "translate(" + rendererNode.position + ")";
        });
    if (updateParents.length > 0) {
        this._updateSelectedD3Groups(this._getD3NodesFromRendererNodes(updateParents));
    }
    // TODO: Optimize this to only update the needed connections
    this._updatedD3Connections();
};
/**
 * Creates the collision quadtree
 * @private
 */
dudeGraph.Renderer.prototype._createRendererBlocksCollisions = function () {
    this._rendererBlocksQuadtree = d3.geom.quadtree()
        .x(function (rendererBlock) {
            return rendererBlock.position[0];
        })
        .y(function (rendererBlock) {
            return rendererBlock.position[1];
        })(this._rendererBlocks);
};

/**
 * Creates the collision quadtree
 * @private
 */
dudeGraph.Renderer.prototype._createRendererGroupsCollisions = function () {
    this._rendererGroupsQuadtree = d3.geom.quadtree()
        .x(function (rendererGroup) {
            return rendererGroup.position[0];
        })
        .y(function (rendererGroup) {
            return rendererGroup.position[1];
        })(this._rendererGroups);
};

/**
 * Creates the collision quadtree
 * @private
 */
dudeGraph.Renderer.prototype._createRendererPointsCollisions = function () {
    var renderer = this;
    var rendererPoints = [];
    _.forEach(this._rendererBlocks, function (rendererBlock) {
        rendererPoints = rendererPoints.concat(rendererBlock.rendererPoints);
    });
    this._rendererPointsQuadtree = d3.geom.quadtree()
        .x(function (rendererPoint) {
            return renderer._getRendererPointPosition(rendererPoint)[0];
        })
        .y(function (rendererPoint) {
            return renderer._getRendererPointPosition(rendererPoint)[1];
        })(rendererPoints);
};

/**
 * Returns all RendererNodes overlapping the given area
 * @param {Number} x0 - Top left x
 * @param {Number} y0 - Top left y
 * @param {Number} x3 - Bottom right x
 * @param {Number} y3 - Bottom right y
 * @return {Array<dudeGraph.RendererNode>}
 * @private
 */
dudeGraph.Renderer.prototype._getNearestRendererBlocks = function (x0, y0, x3, y3) {
    // TODO: Update the quadtree only when needed
    this._createRendererBlocksCollisions();
    var rendererBlocks = [];
    this._rendererBlocksQuadtree.visit(function (d3QuadtreeNode, x1, y1, x2, y2) {
        var rendererBlock = d3QuadtreeNode.point;
        if (rendererBlock) {
            var bounds = [rendererBlock.position[0], rendererBlock.position[1], rendererBlock.position[0] + rendererBlock.size[0], rendererBlock.position[1] + rendererBlock.size[1]];
            if (!(x0 > bounds[2] || y0 > bounds[3] || x3 < bounds[0] || y3 < bounds[1])) {
                rendererBlocks.push(rendererBlock);
            }
        }
        return x1 - 50 >= x3 || y1 - 35 >= y3 || x2 + 50 < x0 || y2 + 35 < y0;
    });
    return rendererBlocks;
};

/**
 * Get the best rendererGroup that can accept the given rendererNode
 * @param {dudeGraph.RendererNode} rendererNode
 * @returns {dudeGraph.RendererGroup|null}
 * @private
 */
dudeGraph.Renderer.prototype._getNearestRendererGroup = function (rendererNode) {
    // TODO: Update the quadtree only when needed
    this._createRendererGroupsCollisions();
    var bestRendererGroups = [];
    var x0 = rendererNode.position[0];
    var y0 = rendererNode.position[1];
    var x3 = rendererNode.position[0] + rendererNode.size[0];
    var y3 = rendererNode.position[1] + rendererNode.size[1];
    this._rendererGroupsQuadtree.visit(function (d3QuadtreeNode, x1, y1, x2, y2) {
        var rendererGroup = d3QuadtreeNode.point;
        if (rendererGroup && rendererGroup !== rendererNode) {
            var bounds = [rendererGroup.position[0], rendererGroup.position[1], rendererGroup.position[0] + rendererGroup.size[0], rendererGroup.position[1] + rendererGroup.size[1]];
            if (x0 > bounds[0] && y0 > bounds[1] && x3 < bounds[2] && y3 < bounds[3]) {
                bestRendererGroups.push(rendererGroup);
            }
        }
        return false; // TODO: Optimize
    });
    var bestRendererGroup = null;
    pandora.forEach(bestRendererGroups, function (bestRendererGroupPossible) {
        if (rendererNode.parent && bestRendererGroupPossible === rendererNode.parent) {
            bestRendererGroup = bestRendererGroupPossible;
            return true;
        }
        if (bestRendererGroup === null) {
            bestRendererGroup = bestRendererGroupPossible;
        } else if (bestRendererGroupPossible.size[0] < bestRendererGroup.size[0] && bestRendererGroupPossible.size[1] < bestRendererGroup.size[1]) {
            bestRendererGroup = bestRendererGroupPossible;
        }
    });
    return bestRendererGroup;
};

/**
 * Returns the nearest renderer point at the given position
 * @param {[Number, Number]} position
 * @return {dudeGraph.Point|null}
 * @private
 */
dudeGraph.Renderer.prototype._getNearestRendererPoint = function (position) {
    // TODO: Update the quadtree only when needed
    this._createRendererPointsCollisions();
    var rendererPoint = this._rendererPointsQuadtree.find(position);
    if (rendererPoint) {
        var rendererPointPosition = this._getRendererPointPosition(rendererPoint);
        if (rendererPointPosition[0] > position[0] - this._config.point.height && rendererPointPosition[0] < position[0] + this._config.point.height &&
            rendererPointPosition[1] > position[1] - this._config.point.height && rendererPointPosition[1] < position[1] + this._config.point.height) {
            return rendererPoint;
        }
    }
    return null;
};
/**
 * Internal function of d3
 * @param dispatch
 * @returns {event}
 */
function d3_dispatch_event(dispatch) {
    var listeners = [], listenerByName = d3.map();

    function event() {
        var z = listeners, i = -1, n = z.length, l;
        while (++i < n) {
            l = z[i].on;
            if (l) {
                l.apply(this, arguments);
            }
        }
        return dispatch;
    }

    event.on = function (name, listener) {
        var l = listenerByName.get(name), i;
        if (arguments.length < 2) return l && l.on;
        if (l) {
            l.on = null;
            listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
            listenerByName.remove(name);
        }
        if (listener) listeners.push(listenerByName.set(name, {on: listener}));
        return dispatch;
    };
    return event;
}

/**
 * Internal function of d3
 * @param target
 */
function d3_eventDispatch(target) {
    var dispatch = d3.dispatch(), i = 0, n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
    dispatch.of = function (thiz, argumentz) {
        return function (e1) {
            var e0;
            try {
                e0 = e1.sourceEvent = d3.event;
                e1.target = target;
                d3.event = e1;
                dispatch[e1.type].apply(thiz, argumentz);
            } finally {
                d3.event = e0;
            }
        };
    };
    return dispatch;
}

/**
 * Click behavior
 */
d3.behavior.mousedown = function () {
    var event = d3_eventDispatch(mousedown, "mousedown");
    function mousedown(selection) {
        selection.each(function (i) {
            var dispatch = event.of(this, arguments);
            d3.select(this).on("mousedown", clicked);
            function clicked() {
                dispatch({
                    "type": "mousedown"
                });
            }
        });
    }
    return d3.rebind(mousedown, event, "on");
};

/**
 * Double click behavior
 */
d3.behavior.doubleClick = function () {
    var event = d3_eventDispatch(doubleClick, "dblclick");
    function doubleClick(selection) {
        selection.each(function (i) {
            var dispatch = event.of(this, arguments);
            d3.select(this).on("dblclick", clicked);
            function clicked() {
                dispatch({
                    "type": "dblclick"
                });
            }
        });
    }
    return d3.rebind(doubleClick, event, "on");
};
/**
 * Returns an absolute position in the SVG from the relative position in the SVG container
 * It takes into account all transformations applied to the SVG
 * Example: renderer._getAbsolutePosition(d3.mouse(this));
 * @param {[Number, Number]} point
 * @return {[Number, Number]}
 * @private
 */
dudeGraph.Renderer.prototype._getAbsolutePosition = function (point) {
    this._svgPoint.x = point[0];
    this._svgPoint.y = point[1];
    var position = this._svgPoint.matrixTransform(this._d3Root.node().getCTM().inverse());
    return [position.x, position.y];
};

/**
 * Returns a relative position in the SVG container from absolute position in the SVG
 * It takes into account all transformations applied to the SVG
 * Example: renderer._getRelativePosition(d3.mouse(this));
 * @param {[Number, Number]} point
 * @return {[Number, Number]}
 * @private
 */
dudeGraph.Renderer.prototype._getRelativePosition = function (point) {
    this._svgPoint.x = point[0];
    this._svgPoint.y = point[1];
    var position = this._svgPoint.matrixTransform(this._d3Root.node().getScreenCTM().inverse());
    return [position.x, position.y];
};

/**
 * Returns the bounding box for all the given rendererNodes
 * @param {Array<dudeGraph.RendererNode>} rendererNodes
 * @returns {[[Number, Number], [Number, Number]]}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererNodesBoundingBox = function (rendererNodes) {
    var topLeft = null;
    var bottomRight = null;
    _.forEach(rendererNodes, function (rendererNode) {
        if (!topLeft) {
            topLeft = new pandora.Vec2(rendererNode.position);
        }
        if (!bottomRight) {
            bottomRight = new pandora.Vec2(rendererNode.position[0] + rendererNode.size[0], rendererNode.position[1] + rendererNode.size[1]);
        }
        topLeft.x = Math.min(rendererNode.position[0], topLeft.x);
        topLeft.y = Math.min(rendererNode.position[1], topLeft.y);
        bottomRight.x = Math.max(bottomRight.x, rendererNode.position[0] + rendererNode.size[0]);
        bottomRight.y = Math.max(bottomRight.y, rendererNode.position[1] + rendererNode.size[1]);
    });
    return [topLeft.toArray(), bottomRight.toArray()];
};

/**
 * Computes the size of the given rendererBlock depending on its text or inputs/outputs
 * @param {dudeGraph.RendererBlock} rendererBlock
 * @private
 */
dudeGraph.Renderer.prototype._computeRendererBlockSize = function (rendererBlock) {
    var d3Block = this._getD3NodesFromRendererNodes([rendererBlock]);
    rendererBlock.size[0] = Math.max(rendererBlock.size[0], d3Block.select("text").node().getBBox().width + this._config.block.padding * 2);
    var d3Points = d3Block.select(".cg-points").selectAll(".cg-output, .cg-input");
    // console.log(d3Points);
    var maxOutput = 0;
    var maxInput = 0;
    d3Points.each(function (rendererPoint) {
       var d3Point = d3.select(this);
        if (rendererPoint.isOutput) {
            maxOutput = Math.max(maxOutput, d3Point.select("text").node().getBBox().width);
        } else {
            maxInput = Math.max(maxInput, d3Point.select("text").node().getBBox().width);
        }
    });
    rendererBlock.size[0] = Math.max(rendererBlock.size[0], maxOutput + maxInput + this._config.block.padding * 4 + this._config.point.radius * 2 + this._config.point.offset);
};

/**
 * Computes the position and the size of the given rendererGroup depending of its children
 * @param {dudeGraph.RendererGroup} rendererGroup
 * @private
 */
dudeGraph.Renderer.prototype._computeRendererGroupPositionAndSize = function (rendererGroup) {
    var renderer = this;
    if (rendererGroup.children.length > 0) {
        var size = renderer._getRendererNodesBoundingBox(rendererGroup.children);
        rendererGroup.position = [
            size[0][0] - renderer._config.group.padding,
            size[0][1] - renderer._config.group.padding - renderer._config.group.header];
        rendererGroup.size = [
            size[1][0] - size[0][0] + renderer._config.group.padding * 2,
            size[1][1] - size[0][1] + renderer._config.group.padding * 2 + renderer._config.group.header
        ];
    }
    rendererGroup.size = [
        Math.max(rendererGroup.size[0], renderer._config.group.size[0] + renderer._config.group.padding * 2),
        Math.max(rendererGroup.size[1], renderer._config.group.size[1] + renderer._config.group.padding * 2 + renderer._config.group.header)
    ];
    var d3Group = this._getD3NodesFromRendererNodes([rendererGroup]);
    rendererGroup.size[0] = Math.max(rendererGroup.size[0], d3Group.select("text").node().getBBox().width + renderer._config.group.padding * 2);
    (function computeRendererGroupParentPositionAndSize(rendererGroupParent) {
        if (rendererGroupParent) {
            renderer._computeRendererGroupPositionAndSize(rendererGroupParent);
            computeRendererGroupParentPositionAndSize(rendererGroupParent.parent);
        }
    })(rendererGroup.parent);
};

/**
 * Returns the rendererPoint position
 * @param {dudeGraph.RendererPoint} rendererPoint
 * @param {Boolean} relative Whether the position is relative to the block position.
 * @return {[Number, Number]}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererPointPosition = function (rendererPoint, relative) {
    var offsetX = relative ? 0 : rendererPoint.rendererBlock.position[0];
    var offsetY = relative ? 0 : rendererPoint.rendererBlock.position[1];
    var func = this._pointPositionGetters[rendererPoint.rendererBlock.cgBlock.blockType];
    if (func) {
        return func.call(this, rendererPoint, offsetX, offsetY);
    } else {
        if (rendererPoint.isOutput) {
            return [
                offsetX + rendererPoint.rendererBlock.size[0] - this._config.block.padding,
                offsetY + this._config.block.header + this._config.point.height * rendererPoint.index
            ];
        } else {
            return [
                offsetX + this._config.block.padding,
                offsetY + this._config.block.header + this._config.point.height * rendererPoint.index
            ];
        }
    }
};

/**
 * Computes the connection path between two points
 * @param {[Number, Number]} point1
 * @param {[Number, Number]} point2
 * @returns {String}
 * @private
 */
dudeGraph.Renderer.prototype._computeConnectionPath = function (point1, point2) {
    var step = 150;
    if (point1[0] - point2[0] < 0) {
        step += Math.max(-100, point1[0] - point2[0]);
    }
    return pandora.formatString("M{x},{y}C{x1},{y1} {x2},{y2} {x3},{y3}", {
        x: point1[0], y: point1[1],
        x1: point1[0] + step, y1: point1[1],
        x2: point2[0] - step, y2: point2[1],
        x3: point2[0], y3: point2[1]
    });
};
/**
 * Returns an unique HTML usable id for the given rendererNode
 * @param {dudeGraph.RendererNode} rendererNode
 * @param {Boolean?} sharp - True to include the sharp to select, False otherwise
 * @return {String}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererNodeUniqueID = function (rendererNode, sharp) {
    return pandora.formatString("{0}cg-{1}-{2}", sharp ? "#" : "", rendererNode.type, rendererNode.id);
};

/**
 * Returns a selection of d3Nodes from rendererNodes
 * @param {Array<dudeGraph.RendererNode>} rendererNodes
 * @returns {d3.selection}
 * @private
 */
dudeGraph.Renderer.prototype._getD3NodesFromRendererNodes = function (rendererNodes) {
    var groupedSelectionIds = d3.set();
    pandora.forEach(rendererNodes, function (rendererNode) {
        groupedSelectionIds.add(this._getRendererNodeUniqueID(rendererNode, true));
    }.bind(this));
    return this._d3Root.selectAll(groupedSelectionIds.values().join(", "));
};

/**
 * Moves the d3 selection nodes to the top front of their respective parents
 * @param {d3.selection} d3Selection
 * @returns {d3.selection}
 * @private
 */
dudeGraph.Renderer.prototype._d3MoveToFront = function (d3Selection) {
    return d3Selection.each(function () {
        this.parentNode.appendChild(this);
    });
};