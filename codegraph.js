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
    if (!firstOption) {
        return format;
    } else if (typeof firstOption === "object") {
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
        return typeof args[number] != 'undefined' ? args[number] : match;
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
/**
 * This file gathers some stub that could be moved to pandora
 */

/**
 *
 * @param object
 * @returns {{name: {String}, value: {Object}}}
 */
pandora.decomposeObject = function (object) {
    var objectName = null;
    var objectValue = null;
    pandora.forEach(object, function (_objectValue, _objectName) {
        objectName = _objectName;
        objectValue = _objectValue;
        return true;
    });
    return {
        "name": objectName,
        "value": objectValue
    };
};
cg.Graph = (function () {

    /**
     * Represents the graph whom holds the entities
     * @extends {pandora.EventEmitter}
     * @constructor
     */
    var Graph = pandora.class_("Graph", pandora.EventEmitter, function () {
        pandora.EventEmitter.call(this);

        /**
         * Next block id
         * @type {number}
         * @private
         */
        this._nextBlockId = 0;

        /**
         * Collection of blocks in the graph
         * @type {Array}
         * @private
         */
        this._blocks = [];

        /**
         * Map to access a block by its id
         * @type {Object}
         * @private
         */
        this._blocksIds = {};
    });

    /**
     * Adds a block to the graph
     * @param {cg.Block} block
     */
    Graph.prototype.addBlock = function (block) {
        var blockId = block.cgId;
        if (blockId === null || blockId === undefined) {
            throw new cg.GraphError("Graph::addBlock() block id is null");
        }
        if (this._blocksIds[blockId]) {
            throw new cg.GraphError("Graph::addBlock() block with id {0} already exists", blockId);
        }
        this._blocks.push(block);
        this._blocksIds[blockId] = block;
    };

    /**
     * Returns the next unique block id
     * @returns {number}
     */
    Graph.prototype.nextBlockId = function () {
        return ++this._nextBlockId;
    };

    /**
     * Returns whether this type is allowed as an input or an output
     * @param type
     * @returns {boolean}
     */
    Graph.prototype.isTypeAllowed = function (type) {
        switch (pandora.typename(type)) {
            case "Number":
            case "String":
            case "Boolean":
                return true;
            default:
                return false;
        }
    };

    return Graph;

})();
cg.Block = (function() {

    /**
     * Block is the base class for all codegraph nodes
     * A Block has a list of inputs and outputs
     * Inputs and outputs are simple fields in the Block object with get and set properties
     * @extends {pandora.EventEmitter}
     * @param graph {cg.Graph}
     * @param id {number}
     * @constructor
     */
    var Block = pandora.class_("Block", pandora.EventEmitter, function(graph, id) {
        pandora.EventEmitter.call(this);

        if (!graph) {
            throw new cg.GraphError("Block() Cannot create a Block without a graph");
        }

        /**
         * Reference to the graph
         * @type {cg.Graph|null}
         * @private
         */
        this._cgGraph = graph;
        Object.defineProperty(this, "cgGraph", {
            get: function() { return this._cgGraph;}.bind(this)
        });

        /**
         * Unique id of this block
         * @type {cg.Graph|null}
         * @private
         */
        this._cgId = id || graph.nextBlockId();
        Object.defineProperty(this, "cgId", {
            get: function() { return this._cgId; }.bind(this)
        });

        /**
         * Inputs fields names
         * @type {Array<String>}
         * @private
         */
        this._cgInputs = [];
        Object.defineProperty(this, "cgInputs", {
            get: function () { return this._cgInputs; }.bind(this)
        });

        /**
         * Outputs fields names
         * @type {Array<String>}
         * @private
         */
        this._cgOutputs = [];
        Object.defineProperty(this, "cgOutputs", {
            get: function () { return this._cgOutputs; }.bind(this)
        });

    });

    /**
     * Transput is the hypernym of input/output
     * This method is used as a helper to add whether inputs or outputs
     * @param transputs {Array<Object>} [{"x": 0}, {"y": 0}]
     * @param isInput {Boolean} True if we add the transputs to the inputs, False to the outputs
     */
    Block.prototype._addTransputs = function (transputs, isInput) {
        var self = this;
        var transputType = isInput ? "input" : "output";
        var transputContainer = isInput ? this._cgInputs : this._cgOutputs;
        pandora.forEach(transputs, function (transput) {
            var decomposedTransput = pandora.decomposeObject(transput);
            var transputName = decomposedTransput.name;
            var transputValue = decomposedTransput.value;
            if (!self._cgGraph.isTypeAllowed(transputValue)) {
                // TODO: Rethink the concept of types, and allowed types for transputs
                throw new cg.GraphError("The {0} `{1}` was created with an unknown type: {2}", transputType, transputName, pandora.typename(transputValue));
            }
            if (self.hasInput(transputName) || self.hasOutput(transputName)) {
                // TODO: Silently ignore if the transput type and the transput value type is the same, or convertible
                throw new cg.GraphError("Trying to add an {0} but `{1}` already exists as an {2}", transputType, transputName, self.hasInput(transputName) ? "input" : "output");
            }
            transputContainer.push(transputName);
            self["_" + transputName] = transputValue;
            self.emit(pandora.formatString("{0}-{1}-created", transputType, transputName));
            Object.defineProperty(self, transputName, {
                get: function () {
                    return self["_" + transputName];
                },
                set: function (newValue) {
                    var oldValue = self["_" + transputName];
                    if (typeof(oldValue) != typeof(newValue)) {
                        // TODO: Silently ignore if the type is convertible
                        throw new cg.GraphError("The {0} `{1}` was expecting a value of type {2}, but {3} was found instead", transputType, transputName, pandora.typename(oldValue), pandora.typename(newValue));
                    }
                    self["_" + transputName] = newValue;
                    self._cgGraph.emit(pandora.formatString("entity-{0}-{0}-updated", self._cgId, transputName), oldValue, newValue);
                    self.emit(pandora.formatString("{0}-{1}-updated", transputType, transputName), oldValue, newValue);
                }
            });
        });
    };

    /**
     * Add inputs to this block
     * @param inputs {Object} [{"x": 0}, {"y": 0}]
     * @protected
     */
    Block.prototype.addInputs = function (inputs) {
        this._addTransputs(inputs, true);
    };

    /**
     * Add outputs to this block
     * @param outputs {Object} [{"x": 0}, {"y": 0}]
     * @protected
     */
    Block.prototype.addOutputs = function (outputs) {
        this._addTransputs(outputs, false);
    };

    /**
     * Returns whether this block contains the specified input
     * @param {String} inputName
     * @return {boolean}
     */
    Block.prototype.hasInput = function(inputName) {
        return this._cgInputs.indexOf(inputName) !== -1;
    };

    /**
     * Returns whether this block contains the specified input
     * @param {String} outputName
     * @return {boolean}
     */
    Block.prototype.hasOutput  = function(outputName) {
        return this._cgOutputs.indexOf(outputName) !== -1;
    };

    return Block;

})();
cg.Function = (function() {

    /**
     *
     * @extends {cg.Block}
     * @param graph {cg.Graph}
     * @param id {number}
     * @constructor
     */
    var Function = pandora.class_("Function", cg.Block, function(graph, id) {
        cg.Block.call(this, graph, id);
    });

    return Function;

})();