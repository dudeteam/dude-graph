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
(function () {

    /**
     * Returns the browser.
     * http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
     * @return {"Opera"|"Firefox"|"Safari"|"Chrome"|"IE"|"Edge"|"Unknown"}
     */
    var browser = function () {
        var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        if (isOpera) {
            return "Opera";
        }
        else if (typeof InstallTrigger !== 'undefined') {
            return "Firefox";
        }
        else if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
            return "Safari";
        }
        else if (navigator.userAgent.indexOf('Edge') !== -1) {
            return "Edge";
        }
        else if (!!window.chrome && !isOpera) {
            return "Chrome";
        }
        else {
            //noinspection PointlessBooleanExpressionJS
            if (false || !!document.documentMode) {
                return "IE";
            }
            else {
                return "Unknown";
            }
        }
    };

    _.mixin({
        /**
         * Returns the browser.
         * @return {"Opera"|"Firefox"|"Safari"|"Chrome"|"IE"|"Edge"|"Unknown"}
         */
        browser: browser,

        /**
         * Runs the function if the current browser is in the browsers
         * @param {Array<String>} browsers
         * @param {Function?} funcOk
         * @param {Function?} funcKo
         */
        browserIf: function (browsers, funcOk, funcKo) {
            if(_.contains(browsers, browser())) {
                (funcOk && funcOk || function() {})();
            } else {
                (funcKo && funcKo || function() {})();
            }
        }
    });
})();
(function () {
    _.mixin({
        /**
         * Clamps a value between a minimum number and a maximum number.
         * @param value {Number}
         * @param min {Number}
         * @param max {Number}
         * @return {Number}
         */
        clamp: function (value, min, max) {
            return Math.min(Math.max(value, min), max);
        }
    });
})();
(function () {
    /**
     * Generate a random bit of a UUID
     * @returns {String}
     */
    var s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    /**
     * The UUID's salt
     * @type {String}
     */
    var salt = s4();

    _.mixin({
        /**
         * Generate a random salted UUID
         * @returns {String}
         */
        uuid: function () {
            return salt + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
        }
    });
})();
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Represents the graph whom holds the entities
 * @extends {pandora.EventEmitter}
 * @constructor
 */
dudeGraph.Graph = function () {
    pandora.EventEmitter.call(this);

    /**
     * All existing types for this graph instance, the key being the type name and the value being an array
     * of all possible conversions.
     * @type {Object<String, Array>}
     * @private
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
        "Entity": ["Entity"],
        "Resource": ["Resource"]
    };

    /**
     * All validators attached to types.
     * @type {Object<String, Function>}
     * @private
     */
    this._validators = {
        "Array": function (value) {
            return _.isArray(value);
        },
        "String": function (value) {
            return _.isString(value);
        },
        "Number": function (value) {
            return _.isNumber(value) || /^[0-9]+(\.[0-9]+)?$/.test(value);
        },
        "Boolean": function (value) {
            return _.isBoolean(value) || /^(true|false)/.test(value);
        },
        "Resource": function (value) {
            return _.isObject(value);
        }
    };

    /**
     * Collection of blocks in the graph
     * @type {Array<dudeGraph.Block>}
     */
    Object.defineProperty(this, "cgBlocks", {
        get: function () {
            return this._cgBlocks;
        }.bind(this)
    });
    this._cgBlocks = [];

    /**
     * Map to access a block by its id
     * @type {Object} {"42": {dudeGraph.Block}}
     */
    Object.defineProperty(this, "cgBlocksIds", {
        get: function () {
            return this._cgBlocksIds;
        }.bind(this)
    });
    this._cgBlocksIds = {};

    /**
     * Connections between blocks points
     * @type {Array<dudeGraph.Connection>}
     */
    Object.defineProperty(this, "cgConnections", {
        get: function () {
            return this._cgConnections;
        }.bind(this)
    });
    this._cgConnections = [];

};

/**
 * @extends {pandora.EventEmitter}
 */
dudeGraph.Graph.prototype = _.create(pandora.EventEmitter.prototype, {
    "constructor": dudeGraph.Graph
});

/**
 * Adds a block to the graph
 * @param {dudeGraph.Block} cgBlock - cgBlock to add to the graph
 * @param {Boolean?} quiet - Whether the event should be emitted
 * @emit "dude-graph-block-create" {dudeGraph.Block}
 * @return {dudeGraph.Block}
 */
dudeGraph.Graph.prototype.addBlock = function (cgBlock, quiet) {
    var cgBlockId = cgBlock.cgId;
    if (cgBlock.cgGraph !== this) {
        throw new Error("This block does not belong to this graph");
    }
    if (cgBlockId === null || _.isUndefined(cgBlockId)) {
        throw new Error("Block id is null");
    }
    if (this._cgBlocksIds[cgBlockId]) {
        throw new Error("Block with id `" + cgBlockId + "` already exists");
    }
    cgBlock.validate();
    this._cgBlocks.push(cgBlock);
    this._cgBlocksIds[cgBlockId] = cgBlock;
    if (!quiet) {
        this.emit("dude-graph-block-create", cgBlock);
    }
    return cgBlock;
};

/**
 * Removes a block from the graph
 * @param {dudeGraph.Block} cgBlock
 */
dudeGraph.Graph.prototype.removeBlock = function (cgBlock) {
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
    this.emit("dude-graph-block-remove", cgBlock);
};

/**
 * Returns a block by it's unique id
 * @param {String} cgBlockId
 * @return {dudeGraph.Block}
 */
dudeGraph.Graph.prototype.blockById = function (cgBlockId) {
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
dudeGraph.Graph.prototype.blockByName = function (cgBlockName) {
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
 * @param {String} blockType
 * @returns {Array<dudeGraph.Block>}
 */
dudeGraph.Graph.prototype.blocksByType = function (blockType) {
    var blocks = [];
    _.forEach(this.cgBlocks, function (cgBlock) {
        if (cgBlock.blockType === blockType) {
            blocks.push(cgBlock);
        }
    });
    return blocks;
};

/**
 * Returns the next unique block id
 * @returns {String}
 */
dudeGraph.Graph.prototype.nextBlockId = function () {
    return _.uuid();
};

/**
 * Creates a connection between two cgPoints
 * @param {dudeGraph.Point} cgOutputPoint
 * @param {dudeGraph.Point} cgInputPoint
 * @emit "dude-graph-connection-create" {dudeGraph.Connection}
 * @returns {dudeGraph.Connection|null}
 */
dudeGraph.Graph.prototype.connectPoints = function (cgOutputPoint, cgInputPoint) {
    if (this.connectionByPoints(cgOutputPoint, cgInputPoint) !== null) {
        throw new Error("Connection already exists between these two points: `" +
            cgOutputPoint.cgName + "` and `" + cgInputPoint.cgName + "`");
    }
    if (cgOutputPoint.isOutput === cgInputPoint.isOutput) {
        throw new Error("Cannot connect either two inputs or two outputs: `" +
            cgOutputPoint.cgName + "` and `" + cgInputPoint.cgName + "`");
    }
    if (!cgOutputPoint.acceptConnect(cgInputPoint)) {
        throw new Error("Point `" +
            cgOutputPoint.cgName + "` does not accept to connect to `" + cgInputPoint.cgName + "` (too many connections)");
    }
    if (!cgInputPoint.acceptConnect(cgOutputPoint)) {
        throw new Error("Point `" +
            cgInputPoint.cgName + "` does not accept to connect to `" + cgOutputPoint.cgName + "` (too many connections)");
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
    this.emit("dude-graph-connection-create", cgConnection);
    return cgConnection;
};

/**
 * Removes a connection between two connected cgPoints
 * @param {dudeGraph.Point} cgOutputPoint
 * @param {dudeGraph.Point} cgInputPoint
 * @emit "dude-graph-connection-create" {dudeGraph.Connection}
 * @returns {dudeGraph.Connection}
 */
dudeGraph.Graph.prototype.disconnectPoints = function (cgOutputPoint, cgInputPoint) {
    var cgConnection = this.connectionByPoints(cgOutputPoint, cgInputPoint);
    if (cgConnection === null) {
        throw new Error("No connections between these two points: `" +
            cgOutputPoint.cgName + "` and `" + cgInputPoint.cgName + "`");
    }
    this._cgConnections.splice(this._cgConnections.indexOf(cgConnection), 1);
    cgOutputPoint._cgConnections.splice(cgOutputPoint._cgConnections.indexOf(cgConnection), 1);
    cgInputPoint._cgConnections.splice(cgInputPoint._cgConnections.indexOf(cgConnection), 1);
    this.emit("dude-graph-connection-remove", cgConnection);
    return cgConnection;
};

/**
 * Disconnect all connections from this point
 * @param {dudeGraph.Point} cgPoint
 */
dudeGraph.Graph.prototype.disconnectPoint = function (cgPoint) {
    var cgPointConnections = cgPoint.cgConnections;
    _.forEach(cgPointConnections, function (cgConnection) {
        this.disconnectPoints(cgConnection.cgOutputPoint, cgConnection.cgInputPoint);
    }.bind(this));
};

/**
 * Returns the list of connections for every points in the given block
 * @param {dudeGraph.Block} cgBlock
 * @returns {Array<dudeGraph.Connection>}
 */
dudeGraph.Graph.prototype.connectionsByBlock = function (cgBlock) {
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
dudeGraph.Graph.prototype.connectionByPoints = function (cgOutputPoint, cgInputPoint) {
    return _.find(this._cgConnections, function (cgConnection) {
        return cgConnection.cgOutputPoint === cgOutputPoint && cgConnection.cgInputPoint === cgInputPoint;
    }) || null;
};

/**
 * Returns the list of connections for a given point
 * @param {dudeGraph.Point} cgPoint
 * @returns {Array<dudeGraph.Connection>}
 */
dudeGraph.Graph.prototype.connectionsByPoint = function (cgPoint) {
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
dudeGraph.Graph.prototype.cloneBlocks = function (cgBlocks) {
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

/**
 * Add a validator predicate for the given `type`
 * @param {String} type - The type on which this validator will be applied
 * @param {Function} validator - A function which takes a value in parameter and returns true if it can be assigned
 */
dudeGraph.Graph.prototype.addValidator = function (type, validator) {
    this._validators[type] = validator;
};

/**
 * Checks whether the first type can be converted into the second one.
 * @param {String} firstType
 * @param {String} secondType
 * @returns {Boolean}
 */
dudeGraph.Graph.prototype.canConvert = function (firstType, secondType) {
    return firstType === secondType || (this._cgTypes[firstType] &&
        this._cgTypes[firstType].indexOf(secondType) !== -1);
};

/**
 * Checks whether the given `value` is assignable to the given `type`.
 * @param {*} value - A value to check.
 * @param {String} type - The type that the value should have
 */
dudeGraph.Graph.prototype.canAssign = function (value, type) {
    return value === null || (this._validators[type] && this._validators[type](value));
};

/**
 * Tries to update the blocks types from templates parameters to match the `cgPoint` type with the given `type`.
 * @param {dudeGraph.Point} cgPoint - The point on which the connection will be created
 * @param {String} type - The type of the connection that we try to attach
 * @returns {Boolean}
 */
dudeGraph.Graph.prototype.updateTemplate = function (cgPoint, type) {
    return cgPoint.cgBlock.updateTemplate(cgPoint, type);
};
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Block is the base class of dude-graph nodes
 * A Block has a list of inputs and outputs points
 * @param {dudeGraph.Graph} cgGraph - See Getter definition
 * @param {{cgId: Number, cgTemplates: Object}} data - See getter definition
 * @param {String} blockType - See getter definition
 * @constructor
 */
dudeGraph.Block = function (cgGraph, data, blockType) {
    data = data || {};

    /**
     * Reference to the graph
     * @type {dudeGraph.Graph}
     */
    Object.defineProperty(this, "cgGraph", {
        get: function () {
            return this._cgGraph;
        }.bind(this)
    });
    this._cgGraph = cgGraph;
    if (!cgGraph) {
        throw new Error("Block() Cannot create a Block without a graph");
    }

    /**
     * The type of this block defined as a string, "Block" by default.
     * @type {String}
     */
    Object.defineProperty(this, "blockType", {
        get: function () {
            return this._blockType;
        }.bind(this)
    });
    this._blockType = blockType || "Block";

    /**
     * Unique id of this block
     * @type {String}
     */
    Object.defineProperty(this, "cgId", {
        get: function () {
            return this._cgId;
        }.bind(this)
    });
    this._cgId = data.cgId || cgGraph.nextBlockId();

    /**
     * Block fancy name
     * @type {String}
     * @emit "dude-graph-block-name-changed" {dudeGraph.Block} {String} {String}
     */
    Object.defineProperty(this, "cgName", {
        get: function () {
            return this._cgName;
        }.bind(this),
        set: function (cgName) {
            var oldCgName = this._cgName;
            this._cgName = cgName;
            this._cgGraph.emit("dude-graph-block-name-change", this, oldCgName, cgName);
        }.bind(this)
    });
    this._cgName = data.cgName || this._blockType;

    /**
     * Template types that can be used on this block points. Each template type contains a list of possibly
     * applicable types.
     * @type {Object<String, Array>}
     */
    Object.defineProperty(this, "cgTemplates", {
        get: function () {
            return this._cgTemplates;
        }.bind(this)
    });
    this._cgTemplates = data.cgTemplates || {};

    /**
     * Input points
     * @type {Array<dudeGraph.Point>}
     */
    Object.defineProperty(this, "cgInputs", {
        get: function () {
            return this._cgInputs;
        }.bind(this)
    });
    this._cgInputs = [];

    /**
     * Output points
     * @type {Array<dudeGraph.Point>}
     */
    Object.defineProperty(this, "cgOutputs", {
        get: function () {
            return this._cgOutputs;
        }.bind(this)
    });
    this._cgOutputs = [];
};

/**
 * Validates the block content
 * Called when the graph adds this block
 */
dudeGraph.Block.prototype.validate = function () {};

/**
 * Adds an input or an output point
 * @param {dudeGraph.Point} cgPoint
 * @emit "cg-point-create" {dudeGraph.Block} {dudeGraph.Point}
 * @return {dudeGraph.Point}
 */
dudeGraph.Block.prototype.addPoint = function (cgPoint) {
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
dudeGraph.Block.prototype.outputByName = function (cgOutputName) {
    return _.find(this._cgOutputs, function (cgOutput) {
        return cgOutput.cgName === cgOutputName;
    });
};

/**
 * Returns whether this block contains the specified input
 * @param {String} cgInputName
 * @return {dudeGraph.Point|null}
 */
dudeGraph.Block.prototype.inputByName = function (cgInputName) {
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
dudeGraph.Block.prototype.updateTemplate = function (cgPoint, type) {
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
dudeGraph.Block.prototype.clone = function (cgGraph) {
    if (this._blockType !== "Block") {
        throw new Error("Method `clone` must be overridden by `" + this._blockType + "`");
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
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

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
 * @param {Boolean} isOutput - True if this point is an output, False for an input
 * @param {String} pointType - The type of this point represented as a string
 * @constructor
 */
dudeGraph.Point = function (cgBlock, data, isOutput, pointType) {

    /**
     * The graph of the block
     * @type {dudeGraph.Graph}
     */
    Object.defineProperty(this, "cgGraph", {
        get: function () {
            return this._cgGraph;
        }.bind(this)
    });
    this._cgGraph = cgBlock.cgGraph;

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
     */
    Object.defineProperty(this, "cgBlock", {
        get: function () {
            return this._cgBlock;
        }.bind(this)
    });
    this._cgBlock = cgBlock;

    /**
     * The block input/output name
     * @type {String}
     */
    Object.defineProperty(this, "cgName", {
        get: function () {
            return this._cgName;
        }.bind(this)
    });
    this._cgName = data.cgName || this._pointType;

    /**
     * Point type, True if this point is an output, False for an input
     * @type {Boolean}
     */
    Object.defineProperty(this, "isOutput", {
        get: function () {
            return this._isOutput;
        }.bind(this)
    });
    this._isOutput = isOutput;

    /**
     * Connections from/to this point
     * @type {Array<dudeGraph.Connection>}
     */
    Object.defineProperty(this, "cgConnections", {
        get: function () {
            return this._cgConnections;
        }.bind(this)
    });
    this._cgConnections = [];

    /**
     * Whether this point accept one or several connections.
     * @type {Boolean}
     */
    Object.defineProperty(this, "singleConnection", {
        get: function () {
            return this._singleConnection;
        }.bind(this),
        set: function (singleConnection) {
            this._singleConnection = singleConnection;
        }.bind(this)
    });
    this._singleConnection = _.isUndefined(data.singleConnection) ? true : data.singleConnection;

    /**
     * The name of the template type used (from parent block).
     * @type {String|null}
     */
    Object.defineProperty(this, "cgTemplate", {
        get: function () {
            return this._cgTemplate;
        }.bind(this)
    });
    this._cgTemplate = data.cgTemplate || null;

    /**
     * The point current value type
     * Example: Number (Yellow color)
     * @type {String}
     * @emit "cg-point-value-type-change" {dudeGraph.Point} {Object} {Object}
     */
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
    this._cgValueType = data.cgValueType;
    if (_.isUndefined(data.cgValueType)) {
        throw new Error("Cannot create the point `" + this._cgName + "` in block `" + this._cgBlock.cgId +
            "` without specifying a value type");
    }

    /**
     * The point current value
     * @type {Object|null}
     * @emit "cg-point-value-change" {dudeGraph.Point} {Object} {Object}
     */
    Object.defineProperty(this, "cgValue", {
        configurable: true,
        get: function () {
            return this._cgValue;
        }.bind(this),
        set: function (cgValue) {
            if (cgValue !== null && !this.acceptValue(cgValue)) {
                throw new Error("Cannot set `cgValue`: Point `" + this._cgName + "` cannot accept more than " +
                    "one connection");
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
    this._cgValue = data.cgValue || null;
    if (!_.isUndefined(data.cgValue) && isOutput) {
        throw new Error("Shouldn't create output point `" + this._cgName + "` in block `" +
            this._cgBlock.cgId + "` with a value.");
    }
};

/**
 * Returns whether this cgPoint is empty (no connections and no cgValue)
 * @returns {Boolean}
 */
dudeGraph.Point.prototype.empty = function () {
    return this._cgConnections.length === 0 && this._cgValue === null;
};

/**
 * Returns whether this cgPoint accepts a connection if there is room to the given cgPoint
 * @param {dudeGraph.Point} cgPoint
 * @returns {Boolean}
 */
dudeGraph.Point.prototype.acceptConnect = function (cgPoint) {
    return !this._singleConnection || (this._cgConnections.length === 0 && this._cgValue === null);
};

/**
 * Returns whether this cgPoint accepts a cgValue
 * @param {*?} cgValue
 * @returns {Boolean}
 */
dudeGraph.Point.prototype.acceptValue = function (cgValue) {
    return !this._singleConnection || this._cgConnections.length === 0;
};

/**
 * Adds a connection from this cgPoint to the given cgPoint
 * @param {dudeGraph.Point} cgPoint
 * @return {dudeGraph.Connection}
 */
dudeGraph.Point.prototype.connect = function (cgPoint) {
    if (this._isOutput) {
        return this._cgGraph.connectPoints(this, cgPoint);
    } else {
        return this._cgGraph.connectPoints(cgPoint, this);
    }
};

/**
 * Removes the connections between this cgPoint and the given cgPoint
 * @param {dudeGraph.Point} cgPoint
 */
dudeGraph.Point.prototype.disconnect = function (cgPoint) {
    if (this._isOutput) {
        return this._cgGraph.disconnectPoints(this, cgPoint);
    } else {
        return this._cgGraph.disconnectPoints(cgPoint, this);
    }
};

/**
 * Returns a copy of this point
 * @param {dudeGraph.Block} cgBlock - The block on which this cloned point will be attached to
 * @return {dudeGraph.Point}
 */
dudeGraph.Point.prototype.clone = function (cgBlock) {
    if (this._pointType !== "Point") {
        throw new Error("Method `clone` must be overridden by `" + this._pointType + "`");
    }
    return new dudeGraph.Point(cgBlock, {
        cgName: this._cgName,
        cgValueType: this._cgValueType,
        cgValue: this._cgValue
    }, this._isOutput);
};
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Connection connects one output point to an input point
 * There can be only one connection for two given output/input points
 * @param {dudeGraph.Point} outputPoint
 * @param {dudeGraph.Point} inputPoint
 * @constructor
 */
dudeGraph.Connection = function (outputPoint, inputPoint) {

    /**
     * The output point where the connection begins
     * @type {dudeGraph.Point}
     * @private
     */
    Object.defineProperty(this, "cgOutputPoint", {
        get: function () {
            return this._cgOutputPoint;
        }.bind(this)
    });
    this._cgOutputPoint = outputPoint;
    if (!outputPoint.isOutput) {
        throw new Error("outputPoint is not an output");
    }

    /**
     * The input point where the connection ends
     * @type {dudeGraph.Point}
     * @private
     */
    Object.defineProperty(this, "cgInputPoint", {
        get: function () {
            return this._cgInputPoint;
        }.bind(this)
    });
    this._cgInputPoint = inputPoint;
    if (inputPoint.isOutput) {
        throw new Error("inputPoint is not an input");
    }

};

/**
 * Returns the other point
 * @param {dudeGraph.Point} cgPoint
 * returns {dudeGraph.Point}
 */
dudeGraph.Connection.prototype.otherPoint = function (cgPoint) {
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
dudeGraph.Connection.prototype.remove = function () {
    // TODO
};
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This specific point represent a stream. In other words, it's an abstract way to order instruction blocks into
 * the graph. This type doesn't transform data but represents the execution stream. That's why it can't hold a value
 * or have a specific value type.
 * @param {dudeGraph.Block} cgBlock - Reference to the related cgBlock.
 * @param {Object} data - JSON representation of this stream point
 * @param {Boolean} isOutput - Defined whether this point is an output or an input
 * @constructor
 */
dudeGraph.Stream = function (cgBlock, data, isOutput) {
    dudeGraph.Point.call(this, cgBlock, _.merge(data, {
        "cgName": data.cgName,
        "cgValueType": "Stream"
    }), isOutput, "Stream");
    Object.defineProperty(this, "cgValue", {
        get: function () {
            throw new Error("Stream has no `cgValue`.");
        }.bind(this),
        set: function () {
            throw new Error("Stream has no `cgValue`.");
        }.bind(this)
    });
};

/**
 * @extends {dudeGraph.Point}
 */
dudeGraph.Stream.prototype = _.create(dudeGraph.Point.prototype, {
    "constructor": dudeGraph.Stream
});


/**
 * Returns a copy of this Stream
 * @param {dudeGraph.Block} cgBlock - The block on which the cloned stream will be attached to
 * @returns {dudeGraph.Stream}
 */
dudeGraph.Stream.prototype.clone = function (cgBlock) {
    return new dudeGraph.Stream(cgBlock, this._cgName, this._isOutput);
};
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This is like function however, it takes a stream in input and output. In code it would represent function
 * separated by semicolons.
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Assignation = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Assignation");
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Assignation.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Assignation
});

/**
 * Validates the block content
 * Called when the graph adds this block
 */
dudeGraph.Assignation.prototype.validate = function () {
    if (!(this.inputByName("in") instanceof dudeGraph.Stream)) {
        throw new Error("Assignation `" + this.cgId + "` must have an input `in` of type `Stream`");
    }
    if (!(this.inputByName("this") instanceof dudeGraph.Point)) {
        throw new Error("Assignation `" + this.cgId + "` must have an input `this` of type `Point`");
    }
    if (!(this.inputByName("other") instanceof dudeGraph.Point)) {
        throw new Error("Assignation `" + this.cgId + "` must have an input `other` of type `Point`");
    }
    if (this.inputByName("this")._cgValueType !== this.inputByName("other")._cgValueType) {
        throw new Error("Assignation `" + this.cgId + "` inputs `this` and `other` must have the same cgValueType");
    }
    if (!(this.outputByName("out") instanceof dudeGraph.Stream)) {
        throw new Error("Assignation `" + this.cgId + "` must have an output `out` of type `Stream`");
    }
};
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Condition = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Condition");
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Condition.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Condition
});

/**
 * Validates the block content
 * Called when the graph adds this block
 */
dudeGraph.Condition.prototype.validate = function () {
    if (!(this.inputByName("in") instanceof dudeGraph.Stream)) {
        throw new Error("Condition `" + this.cgId + "` must have an input `in` of type `Stream`");
    }
    if (!(this.inputByName("test") instanceof dudeGraph.Point) || this.inputByName("test").cgValueType !== "Boolean") {
        throw new Error("Condition `" + this.cgId + "` must have an input `test` of type `Point` of cgValueType `Boolean`");
    }
    if (!(this.outputByName("true") instanceof dudeGraph.Stream)) {
        throw new Error("Condition `" + this.cgId + "` must have an output `true` of type `Stream`");
    }
    if (!(this.outputByName("false") instanceof dudeGraph.Stream)) {
        throw new Error("Condition `" + this.cgId + "` must have an output `false` of type `Stream`");
    }
};
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This is like function however, it takes a stream in input and output. In code it would represent function
 * separated by semicolons.
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Delegate = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Delegate");
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Delegate.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Delegate
});

/**
 * Validates the block content
 * Called when the graph adds this block
 */
dudeGraph.Delegate.prototype.validate = function () {
    if (!(this.outputByName("out") instanceof dudeGraph.Stream)) {
        throw new Error("Delegate `" + this.cgId + "` must have an output `out` of type `Stream`");
    }
};
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Each = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Each");
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Each.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Each
});
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This block represents a simple function that takes some inputs and returns one or zero output.
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Function = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Function");
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Function.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Function
});
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This block represents a simple Getter that takes some inputs and returns one or zero output.
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Getter = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Getter");
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Getter.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Getter
});
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This is like function however, it takes a stream in input and output. In code it would represent function
 * separated by semicolons.
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Instruction = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Instruction");
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Instruction.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Instruction
});

/**
 * Validates the block content
 * Called when the graph adds this block
 */
dudeGraph.Instruction.prototype.validate = function () {
    if (!(this.inputByName("in") instanceof dudeGraph.Stream)) {
        throw new Error("Instruction `" + this.cgId + "` must have an input `in` of type `Stream`");
    }
    if (!(this.outputByName("out") instanceof dudeGraph.Stream)) {
        throw new Error("Instruction `" + this.cgId + "` must have an output `out` of type `Stream`");
    }
};
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This block represents a simple Operator that takes some inputs and returns one or zero output.
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Operator = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Operator");
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Operator.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Operator
});

/**
 * Validates the block content
 * Called when the graph adds this block
 */
dudeGraph.Operator.prototype.validate = function () {
    if (this.cgInputs.length !== 2) {
        throw new Error("Operator `" + this.cgId + "` must only take 2 inputs");
    }
    if (this.cgOutputs.length !== 1) {
        throw new Error("Operator `" + this.cgId + "` must return one value");
    }
};
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Range = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Range");
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Range.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Range
});
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Variable = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Variable");

    /**
     * The type of this variable, the block will return a point of this type.
     * @type {String}
     * @private
     */
    Object.defineProperty(this, "cgValueType", {
        get: function () {
            return this._cgValueType;
        }.bind(this)
    });
    this._cgValueType = data.cgValueType;

    /**
     * The current value of the Variable.
     * @type {*}
     * @private
     */
    Object.defineProperty(this, "cgValue", {
        get: function () {
            return this._cgValue;
        }.bind(this),
        set: function (value) {
            this._cgValue = value;
            this.cgOutputs[0].cgValue = value;
        }.bind(this)
    });
    this._cgValue = data.cgValue;
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Variable.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Variable
});

/**
 * Validates the block content
 * Called when the graph adds this block
 */
dudeGraph.Variable.prototype.validate = function () {
    if (!(this.outputByName("value") instanceof dudeGraph.Point)) {
        throw new Error("Variable `" + this.cgId + "` must have an output `value` of type `Point`");
    }
};
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Dude-graph default loader
 * @constructor
 */
dudeGraph.Loader = function () {
    /**
     * Registered block types
     * @type {Object}
     * @private
     */
    this._blockTypes = {
        "Block": dudeGraph.Block
    };

    /**
     * Registered point types
     * @type {Object}
     * @private
     */
    this._pointTypes = {
        "Point": dudeGraph.Point
    };
};

/**
 * Registers a new block type
 * @param {String} blockType
 * @param {dudeGraph.Block} blockConstructor
 */
dudeGraph.Loader.prototype.registerBlockType = function (blockType, blockConstructor) {
    this._blockTypes[blockType] = blockConstructor;
};

/**
 * Registers a new point type
 * @param {String} pointType
 * @param {dudeGraph.Point} pointConstructor
 */
dudeGraph.Loader.prototype.registerPointType = function (pointType, pointConstructor) {
    this._pointTypes[pointType] = pointConstructor;
};

/**
 * Loads a cgGraph from a json
 * @param {dudeGraph.Graph} cgGraph - The graph to load
 * @param {Object} cgGraphData - The graph data
 * @param {Array<Object>} cgGraphData.blocks - The graph blocks
 * @param {Array<Object>} cgGraphData.connections - The graph connections
 */
dudeGraph.Loader.prototype.load = function (cgGraph, cgGraphData) {
    var loader = this;
    _.forEach(cgGraphData.blocks, function (cgBlockData) {
        loader.loadBlock(cgGraph, cgBlockData);
    });
    _.forEach(cgGraphData.connections, function (cgConnectionData) {
        loader.loadConnection(cgGraph, cgConnectionData);
    });
};

/**
 * @param {dudeGraph.Graph} cgGraph - The graph to load the block to
 * @param {Object} cgBlockData - The block data
 * @returns {dudeGraph.Block}
 */
dudeGraph.Loader.prototype.loadBlock = function (cgGraph, cgBlockData) {
    var loader = this;
    if (!cgBlockData.hasOwnProperty("cgId")) {
        throw new Error("Block property `cgId` is required");
    }
    var blockConstructor = this._blockTypes[cgBlockData.cgType];
    if (_.isUndefined(blockConstructor)) {
        throw new Error("Block type `" + cgBlockData.cgType + "` not registered by the loader");
    }
    var cgBlock = new blockConstructor(cgGraph, cgBlockData, cgBlockData.cgType);
    _.forEach(cgBlockData.cgOutputs, function (cgOutputData) {
        loader.loadPoint(cgBlock, cgOutputData, true);
    });
    _.forEach(cgBlockData.cgInputs, function (cgInputData) {
        loader.loadPoint(cgBlock, cgInputData, false);
    });
    cgGraph.addBlock(cgBlock);
    return cgBlock;
};

/**
 * @param {dudeGraph.Block} cgBlock - The block to load the point to
 * @param {Object} cgPointData - The point data
 * @param {Boolean} isOutput - Whether the point is an output or an input
 * @returns {dudeGraph.Point}
 */
dudeGraph.Loader.prototype.loadPoint = function (cgBlock, cgPointData, isOutput) {
    if (!cgPointData.cgName) {
        throw new Error("Block `" + cgBlock.cgId + "`: Point property `cgName` is required");
    }
    var cgPointType = cgPointData.cgType;
    var cgPointConstructor = this._pointTypes[cgPointType];
    if (!cgPointConstructor) {
        throw new Error("Point type `" + cgPointType + "` not registered by the loader");
    }
    var cgPoint = new cgPointConstructor(cgBlock, cgPointData, isOutput);
    cgBlock.addPoint(cgPoint);
    return cgPoint;
};

/**
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} cgConnectionData
 * @private
 */
dudeGraph.Loader.prototype.loadConnection = function (cgGraph, cgConnectionData) {
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
};
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Dude-graph default saver
 * @constructor
 */
dudeGraph.Saver = function () {};

/**
 * Saves a cgGraph as json
 * @param {dudeGraph.Graph} cgGraph - The graph to save
 */
dudeGraph.Saver.prototype.save = function (cgGraph) {
    var saver = this;
    return {
        "blocks": _.map(cgGraph.cgBlocks, function (cgBlock) {
            return saver.saveBlock(cgBlock);
        }),
        "connections": _.map(cgGraph.cgConnections, function (cgConnection) {
            return saver.saveConnection(cgConnection);
        })
    };
};


/**
 * Saves the block
 * @param {dudeGraph.Block} cgBlock
 * @return {Object}
 */
dudeGraph.Saver.prototype.saveBlock = function (cgBlock) {
    var saver = this;
    return {
        "cgType": cgBlock._blockType,
        "cgId": cgBlock._cgId,
        "cgName": cgBlock._cgName,
        "cgInputs": _.map(cgBlock._cgInputs, function (cgPoint) {
            return saver.savePoint(cgPoint);
        }),
        "cgOutputs": _.map(cgBlock._cgOutputs, function (cgPoint) {
            return saver.savePoint(cgPoint);
        })
    };
};

/**
 * Saves the point
 * @param {dudeGraph.Point} cgPoint
 * @return {Object}
 */
dudeGraph.Saver.prototype.savePoint = function (cgPoint) {
    var pointData = {
        "cgType": cgPoint.pointType,
        "cgName": cgPoint._cgName,
        "cgValueType": cgPoint._cgValueType,
        "singleConnection": cgPoint._singleConnection
    };
    if (!cgPoint._isOutput) {
        pointData.cgValue = cgPoint._cgValue;
    }
    return pointData;
};

/**
 * Saves the connection
 * @param {dudeGraph.Connection} cgConnection
 * @return {Object}
 */
dudeGraph.Saver.prototype.saveConnection = function (cgConnection) {
    return {
        "cgOutputName": cgConnection._cgOutputPoint._cgName,
        "cgOutputBlockId": cgConnection._cgOutputPoint._cgBlock._cgId,
        "cgInputName": cgConnection._cgInputPoint._cgName,
        "cgInputBlockId": cgConnection._cgInputPoint._cgBlock._cgId
    };
};
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * @constructor
 */
dudeGraph.Renderer = function () {
    /**
     * The graph to render
     * @type {dudeGraph.Graph}
     */
    this._graph = null;
    /**
     * Returns all d3Connections
     * @type {d3.selection}
     */
    Object.defineProperty(this, "graph", {
        get: function () {
            return this._graph;
        }.bind(this)
    });

    /**
     * Renderer configuration
     * @type {Object}
     * @private
     */
    this._config = null;
    Object.defineProperty(this, "config", {
        get: function () {
            return this._config;
        }.bind(this)
    });

    /**
     * Renderer zoom information
     * @type {null}
     * @private
     */
    this._zoom = null;

    /**
     * The root SVG node of the renderer
     * @type {d3.selection}
     */
    this._d3Svg = null;

    /**
     * The root group node of the renderer
     * @type {d3.selection}
     */
    this._d3Root = null;

    /**
     * The SVG group for the d3Groups
     * @type {d3.selection}
     */
    this._d3Groups = null;

    /**
     * The SVG connection for the d3Connections
     * @type {d3.selection}
     */
    this._d3Connections = null;

    /**
     * The SVG group for the d3Blocks
     * @type {d3.selection}
     */
    this._d3Block = null;

    /**
     * The renderer blocks
     * @type {Array<dudeGraph.RenderBlock>}
     * @private
     */
    this._renderBlocks = null;

    /**
     * The renderer groups
     * @type {Array<dudeGraph.RenderGroup>}
     * @private
     */
    this._renderGroups = null;

    /**
     * The renderer connections
     * @type {Array<dudeGraph.RenderConnection>}
     * @private
     */
    this._renderConnections = null;

    /**
     * The renderer block renderers
     * @type {d3.map<String, dudeGraph.RenderBlock>}
     * @private
     */
    this._renderBlockRenders = null;

    /**
     * Association map from id to render block
     * @type {d3.map<String, dudeGraph.RenderBlock>}
     * @private
     */
    this._renderBlockIds = null;

    /**
     * Association map from id to render group
     * @type {d3.map<String, dudeGraph.RenderGroup>}
     * @private
     */
    this._renderGroupIds = null;

    /**
     * The renderBlocks quadtree
     * @type {d3.geom.quadtree}
     * @private
     */
    this._renderBlocksQuadtree = null;

    /**
     * The renderGroups quadtree
     * @type {d3.geom.quadtree}
     * @private
     */
    this._renderGroupsQuadtree = null;

    /**
     * The renderPoints quadtree
     * @type {d3.geom.quadtree}
     * @private
     */
    this._renderPointsQuadtree = null;

    /**
     * Returns all d3Nodes (d3Blocks and d3Groups)
     * @type {d3.selection}
     */
    Object.defineProperty(this, "d3Nodes", {
        get: function () {
            return this._d3Root.selectAll(".dude-graph-block, .dude-graph-group");
        }.bind(this)
    });

    /**
     * Returns all d3Blocks
     * @type {d3.selection}
     */
    Object.defineProperty(this, "d3Blocks", {
        get: function () {
            return this._d3Block.selectAll(".dude-graph-block");
        }.bind(this)
    });

    /**
     * Returns all d3Groups
     * @type {d3.selection}
     */
    Object.defineProperty(this, "d3Groups", {
        get: function () {
            return this._d3Groups.selectAll(".dude-graph-group");
        }.bind(this)
    });

    /**
     * Returns all d3Connections
     * @type {d3.selection}
     */
    Object.defineProperty(this, "d3Connections", {
        get: function () {
            return this._d3Connections.selectAll(".dude-graph-connection");
        }.bind(this)
    });
};

/**
 * @extends {EventEmitter}
 */
dudeGraph.Renderer.prototype = _.create(EventEmitter.prototype, {
    "constructor": dudeGraph.Renderer
});

/**
 * Initializes the renderer
 * @param {dudeGraph.Graph} cgGraph
 * @param {SVGElement} svgElement
 * @param {Object?} config
 */
dudeGraph.Renderer.prototype.initialize = function (cgGraph, svgElement, config) {
    this._graph = cgGraph;
    this._d3Svg = d3.select(svgElement);
    this._d3Root = this._d3Svg.append("svg:g").attr("id", "dude-graph-renderer");
    this._d3Groups = this._d3Root.append("svg:g").attr("id", "dude-graph-groups");
    this._d3Connections = this._d3Root.append("svg:g").attr("id", "dude-graph-connections");
    this._d3Block = this._d3Root.append("svg:g").attr("id", "dude-graph-blocks");
    this._renderBlocks = [];
    this._renderGroups = [];
    this._renderConnections = [];
    this._renderBlockTypes = {
        "Block": dudeGraph.RenderBlock
    };
    this._renderBlockIds = {};
    this._renderGroupIds = {};
    this._renderBlocksQuadtree = null;
    this._renderGroupsQuadtree = null;
    this._renderPointsQuadtree = null;
    this._config = _.defaultsDeep(config || {}, dudeGraph.Renderer.defaultConfig);
    this._zoom = dudeGraph.Renderer.defaultZoom;
    this._createZoomBehavior();
};

/**
 * Registers a renderBlock
 * @param {String} renderBlockType
 * @param {dudeGraph.RenderBlock} rendererBlockConstructor
 */
dudeGraph.Renderer.prototype.registerRenderBlock = function (renderBlockType, renderBlockConstructor) {
    this._renderBlockTypes[renderBlockType] = renderBlockConstructor;
};
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Default renderer configuration
 * @type {Object}
 */
dudeGraph.Renderer.defaultConfig = {
    "zoom": {
        "min": 0.25,
        "max": 5,
        "margin": [10, 10],
        "transitionSpeed": 800
    },
    "block": {
        "padding": 10,
        "header": 50,
        "pointSpacing": 10
    },
    "group": {
        "padding": 10,
        "header": 30
    },
    "point": {
        "height": 20,
        "padding": 10,
        "radius": 3
    }
};

/**
 * Default renderer zoom
 * @type {Object}
 */
dudeGraph.Renderer.defaultZoom = {
    "translate": [0, 0],
    "scale": 1
};
/**
 * @param {dudeGraph.Renderer} renderer
 * @param {String} nodeId
 * @constructor
 */
dudeGraph.RenderNode = function (renderer, nodeId) {
    /**
     * Reference on the renderer
     * @type {dudeGraph.Renderer}
     * @protected
     */
    this._renderer = renderer;

    /**
     * The node id
     * @type {String}
     * @protected
     */
    this._nodeId = nodeId;
    Object.defineProperty(this, "nodeId", {
        configurable: true,
        get: function () {
            return this._nodeId;
        }.bind(this)
    });

    /**
     * The node name
     * @type {String}
     * @protected
     */
    this._nodeName = null;
    Object.defineProperty(this, "nodeName", {
        configurable: true,
        get: function () {
            return this._nodeName;
        }.bind(this),
        set: function (nodeName) {
            this._nodeName = nodeName;
        }.bind(this)
    });

    /**
     * Returns the node fancyName
     * @type {String}
     */
    Object.defineProperty(this, "nodeFancyName", {
        configurable: true,
        get: function () {
            return this._nodeName + " (#" + this._nodeId + ")";
        }.bind(this)
    });

    /**
     * The node renderGroup parent
     * @type {dudeGraph.RenderGroup}
     * @protected
     */
    this._nodeParent = null;
    Object.defineProperty(this, "nodeParent", {
        configurable: true,
        get: function () {
            return this._nodeParent;
        }.bind(this),
        set: function (nodeParent) {
            if (this._nodeParent !== null) {
                this._nodeParent.removeChildRenderNode(this);
            }
            nodeParent.addChildRenderNode(this);
            this._nodeParent = nodeParent;
        }.bind(this)
    });

    /**
     * The node position
     * @type {[Number, Number]}
     * @protected
     */
    this._nodePosition = [0, 0];
    Object.defineProperty(this, "nodePosition", {
        configurable: true,
        get: function () {
            return this._nodePosition;
        }.bind(this),
        set: function (nodePosition) {
            this._nodePosition = nodePosition;
        }.bind(this)
    });

    /**
     * The node size
     * @type {[Number, Number]}
     * @protected
     */
    this._nodeSize = [0, 0];
    Object.defineProperty(this, "nodeSize", {
        configurable: true,
        get: function () {
            return this._nodeSize;
        }.bind(this),
        set: function (nodeSize) {
            this._nodeSize = nodeSize;
        }.bind(this)
    });

    /**
     * The d3Node that holds this renderNode
     * @type {d3.selection}
     * @protected
     */
    this._d3Node = null;
    Object.defineProperty(this, "d3Node", {
        configurable: true,
        get: function () {
            return this._d3Node;
        }.bind(this)
    });
};

/**
 * Creates the svg representation of this renderNode
 * @param {d3.selection} d3Node
 */
dudeGraph.RenderNode.prototype.create = function (d3Node) {
    this._d3Node = d3Node;
};

/**
 * Moves the svg representation of this renderNode
 */
dudeGraph.RenderNode.prototype.move = function () {
    this._d3Node
        .attr("transform", "translate(" + this._nodePosition + ")");
};

/**
 * Updates the svg representation of this renderNode
 */
dudeGraph.RenderNode.prototype.update = function () {
    this.move();
};

/**
 * Removes the svg representation of this renderNode
 */
dudeGraph.RenderNode.prototype.remove = function () {
};
/**
 * @param {dudeGraph.Renderer} renderer
 * @param {String} rendererBlockId
 * @param {dudeGraph.Block} block
 * @extends {dudeGraph.RenderNode}
 * @constructor
 */
dudeGraph.RenderBlock = function (renderer, rendererBlockId, block) {
    dudeGraph.RenderNode.call(this, renderer, rendererBlockId);

    /**
     * The dudeGraph.Block this renderBlock is linked to
     * @type {dudeGraph.Block}
     * @private
     */
    this._block = block;
    Object.defineProperty(this, "block", {
        get: function () {
            return this._block;
        }.bind(this)
    });

    /**
     * The renderPoints of this renderBlock
     * @type {Array<dudeGraph.RenderPoint>}
     * @private
     */
    this._renderPoints = [];
    Object.defineProperty(this, "renderPoints", {
        get: function () {
            return this._renderPoints;
        }.bind(this),
        set: function (renderPoints) {
            this._renderPoints = renderPoints;
            this._renderOutputPoints = _.filter(this.renderPoints, function (renderPoint) {
                return renderPoint.point.isOutput;
            });
            this._renderInputPoints = _.filter(this.renderPoints, function (renderPoint) {
                return !renderPoint.point.isOutput;
            });
        }.bind(this)
    });

    /**
     * The d3Points
     * @type {d3.selection}
     */
    this._d3Points = null;
    Object.defineProperty(this, "d3Points", {
        get: function () {
            return this._d3Points.selectAll(".dude-graph-point");
        }.bind(this)
    });
};

/**
 * RenderBlock factory
 * @param {dudeGraph.Renderer} renderer
 * @param {Object} renderBlockData
 */
dudeGraph.RenderBlock.buildRenderBlock = function (renderer, renderBlockData) {
    var block = renderer.graph.blockById(renderBlockData.cgBlock);
    if (!block) {
        throw new Error("Unknown block `" + renderBlockData.cgBlock + "` for renderBlock `" + renderBlockData.id + "`");
    }
    var renderBlock = new dudeGraph.RenderBlock(renderer, renderBlockData.id, block);
    renderBlock.nodeName = renderBlockData.description || block.cgName || "";
    renderBlock.nodePosition = renderBlockData.position || [0, 0];
    renderBlock.parentGroup = renderBlockData.parent || null;
    renderBlock.renderPoints = Array.prototype.concat(
        _.map(block.cgOutputs, function (output, i) {
            return new dudeGraph.RenderPoint(renderer, renderBlock, output, i);
        }),
        _.map(block.cgInputs, function (input, i) {
            return new dudeGraph.RenderPoint(renderer, renderBlock, input, i);
        })
    );
    return renderBlock;
};

/**
 * @extends {dudeGraph.RenderNode}
 */
dudeGraph.RenderBlock.prototype = _.create(dudeGraph.RenderNode.prototype, {
    "constructor": dudeGraph.RenderBlock
});

/**
 * Creates the d3Block for this renderBlock
 * @param {d3.selection} d3Block
 * @override
 */
dudeGraph.RenderBlock.prototype.create = function (d3Block) {
    var renderBlock = this;
    dudeGraph.RenderNode.prototype.create.call(this, d3Block);
    this._d3Rect = d3Block.append("svg:rect");
    this._d3Title = d3Block.append("svg:text")
        .attr("dominant-baseline", "text-before-edge")
        .attr("text-anchor", "middle");
    _.browserIf(["IE", "Edge"], function () {
        renderBlock._d3Title
            .attr("dy", "0.4em");
    }, function () {
        renderBlock._d3Title
            .attr("dominant-baseline", "text-before-edge");
    });
    this._d3Points = d3Block
        .append("svg:g")
        .classed("dude-graph-points", true);
    this.d3Points
        .data(this.renderPoints, function (renderPoint) {
            return renderPoint.point.cgName;
        })
        .enter()
        .append("g")
        .classed("dude-graph-point", true)
        .each(function (renderPoint) {
            renderPoint.create(d3.select(this));
        });
    this.updateSize();
    this.update();
};

/**
 * Updates the d3Block for this renderBlock
 * @override
 */
dudeGraph.RenderBlock.prototype.update = function () {
    dudeGraph.RenderNode.prototype.update.call(this);
    this._d3Rect
        .attr({
            "x": 0,
            "y": 0,
            "width": this._nodeSize[0],
            "height": this._nodeSize[1]
        });
    this._d3Title
        .text(this._nodeName)
        .attr("transform", "translate(" + [this._nodeSize[0] / 2, this._renderer.config.block.padding] + ")");
    this.d3Points
        .each(function (renderPoint) {
            renderPoint.update();
        });
    this.move();
};

/**
 * Computes the renderBlock size
 */
dudeGraph.RenderBlock.prototype.updateSize = function () {
    var widerOutput = _.max(this._renderOutputPoints, function (renderPoint) {
        return renderPoint.pointSize[0];
    });
    var widerInput = _.max(this._renderInputPoints, function (renderPoint) {
        return renderPoint.pointSize[0];
    });
    var titleWidth = this._renderer.textBoundingBox(this._nodeName)[0];
    var maxOutputWidth = widerOutput !== -Infinity ? widerOutput.pointSize[0] : 0;
    var maxInputWidth = widerInput !== -Infinity ? widerInput.pointSize[0] : 0;
    var maxPoints = this._renderOutputPoints.length > this._renderInputPoints.length;
    var maxPointsHeight = _.sum(maxPoints ? this._renderOutputPoints : this._renderInputPoints, function (renderPoint) {
        return renderPoint.pointSize[1];
    });
    var maxWidth = Math.max(
        titleWidth + this._renderer.config.block.padding * 2,
        maxOutputWidth + maxInputWidth + this._renderer.config.block.pointSpacing
    );
    this._nodeSize = [
        maxWidth,
        maxPointsHeight + this._renderer.config.block.header
    ];
};
/**
 * @param {dudeGraph.Renderer} renderer
 * @param {String} groupId
 * @extends {dudeGraph.RenderNode}
 * @constructor
 */
dudeGraph.RenderGroup = function (renderer, groupId) {
    dudeGraph.RenderNode.call(this, renderer, groupId);

    /**
     * The group children
     * @type {Array<dudeGraph.RenderNode>}
     * @private
     */
    this._childrenRenderNodes = [];
};

/**
 * RenderGroup factory
 * @param {dudeGraph.Renderer} renderer
 * @param {Object} renderGroupData
 */
dudeGraph.RenderGroup.buildRenderGroup = function (renderer, renderGroupData) {
    return new dudeGraph.RenderGroup(renderer, renderGroupData.id);
};

/**
 * @extends {dudeGraph.RenderNode}
 */
dudeGraph.RenderGroup.prototype = _.create(dudeGraph.RenderNode.prototype, {
    "constructor": dudeGraph.RenderGroup
});

/**
 * Creates the svg representation of this renderGroup
 * @param {d3.selection} d3Group
 * @override
 */
dudeGraph.RenderGroup.prototype.create = function (d3Group) {
    dudeGraph.RenderNode.prototype.create.call(this, d3Group);
    this.update();
};

/**
 * Adds the render node as child
 * @param {dudeGraph.RenderNode} renderNode
 */
dudeGraph.RenderGroup.prototype.addChildRenderNode = function (renderNode) {
    var renderNodeChildFound = _.find(this._childrenRenderNodes, renderNode);
    if (!_.isUndefined(renderNodeChildFound)) {
        throw new Error("`" + renderNode.nodeFancyName + "` is already a child of `" + this.nodeFancyName + "`");
    }
    this._childrenRenderNodes.push(renderNode);
};

/**
 * Removes the render node from children
 * @param {dudeGraph.RenderNode} renderNode
 */
dudeGraph.RenderGroup.prototype.removeChildRenderNode = function (renderNode) {
    var renderNodeChildFound = _.find(this._childrenRenderNodes, renderNode);
    if (_.isUndefined(renderNodeChildFound)) {
        throw new Error("`" + renderNode.nodeFancyName + "` is not a child of `" + this.nodeFancyName + "`");
    }
    _.pull(this._childrenRenderNodes, renderNode);
};
/**
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.RenderBlock} renderBlock
 * @param {dudeGraph.Point} point
 * @param {Number} index
 * @constructor
 */
dudeGraph.RenderPoint = function (renderer, renderBlock, point, index) {
    /**
     * Reference on the renderer
     * @type {dudeGraph.Renderer}
     * @private
     */
    this._renderer = renderer;

    /**
     * The host renderBlock
     * @type {dudeGraph.RenderBlock}
     * @private
     */
    this._renderBlock = renderBlock;
    Object.defineProperty(this, "renderBlock", {
        get: function () {
            return this._renderBlock;
        }.bind(this)
    });

    /**
     * The point index in the renderBlock
     * @type {Number}
     * @private
     */
    this._index = index;
    Object.defineProperty(this, "index", {
        get: function () {
            return this._index;
        }.bind(this)
    });

    /**
     * The point
     * @type {dudeGraph.Point}
     * @private
     */
    this._point = point;
    Object.defineProperty(this, "point", {
        get: function () {
            return this._point;
        }.bind(this)
    });

    /**
     * The point position in the d3Block
     * @type {[Number, Number]}
     * @private
     */
    Object.defineProperty(this, "pointPosition", {
        get: function () {
            if (this.point.isOutput) {
                return [
                    this._renderBlock.nodeSize[0] - this._renderer.config.point.padding,
                    this._renderer.config.block.header + this._renderer.config.point.height * this._index
                ];
            } else {
                return [
                    this._renderer.config.point.padding,
                    this._renderer.config.block.header + this._renderer.config.point.height * this._index
                ];
            }
        }.bind(this)
    });

    /**
     * The point size in the d3Block
     * @type {[Number, Number]}
     * @private
     */
    Object.defineProperty(this, "pointSize", {
        get: function () {
            var textBoundingBox = this._renderer.textBoundingBox(this._point.cgName);
            return [
                textBoundingBox[0] + this._renderer.config.point.padding * 2,
                Math.max(textBoundingBox[1], this._renderer.config.point.height)
            ];
        }.bind(this)
    });

    /**
     * The d3Point that holds this renderPoint
     * @type {d3.selection}
     * @private
     */
    this._d3PointGroup = null;
    Object.defineProperty(this, "d3PointGroup", {
        get: function () {
            return this._d3PointGroup;
        }.bind(this)
    });
};

/**
 * Creates the svg representation of this renderPoint
 * @param d3PointGroup
 */
dudeGraph.RenderPoint.prototype.create = function (d3PointGroup) {
    var renderPoint = this;
    this._d3PointGroup = d3PointGroup;
    this._d3Circle = d3PointGroup
        .append("svg:circle");
    this._d3Text = d3PointGroup
        .append("svg:text")
        .attr("text-anchor", this._point.isOutput ? "end" : "start");
    _.browserIf(["IE", "Edge", "Firefox"], function () {
        renderPoint._d3Text
            .attr("dy", "0.25em");
    }, function () {
        renderPoint._d3Text
            .attr("alignment-baseline", "middle");
    });
};

/**
 * Updates the svg representation of this renderPoint
 */
dudeGraph.RenderPoint.prototype.update = function () {
    var position = this.pointPosition;
    this._d3Circle
        .attr({
            "cx": position[0] + (this.point.isOutput ? -1 : 1) * this._renderer.config.point.radius / 2,
            "cy": position[1],
            "r": this._renderer.config.point.radius
        });
    this._d3Text
        .text(this._point.cgName)
        .attr({
            "x": position[0] + (this.point.isOutput ? -1 : 1) * this._renderer.config.point.padding,
            "y": position[1]
        });
};

/**
 * Removes the svg representation of this renderPoint
 */
dudeGraph.RenderPoint.prototype.remove = function () {

};
/**
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.Block} block
 * @param {String} blockId
 * @extends {dudeGraph.RenderBlock}
 * @constructor
 */
dudeGraph.RenderVariable = function (renderer, block, blockId) {
    dudeGraph.RenderBlock.call(this, renderer, block, blockId);
};

/**
 * RenderVariable factory
 * @param {dudeGraph.Renderer} renderer
 * @param {Object} renderBlockData
 */
dudeGraph.RenderVariable.buildRenderBlock = function (renderer, renderBlockData) {
    return dudeGraph.RenderBlock.buildRenderBlock.call(this, renderer, renderBlockData);
};

/**
 * @extends {dudeGraph.RenderBlock}
 */
dudeGraph.RenderVariable.prototype = _.create(dudeGraph.RenderBlock.prototype, {
    "constructor": dudeGraph.RenderBlock
});
/**
 * Returns the renderBlock associated with the given id
 * @param {String} blockId
 * @returns {dudeGraph.RenderBlock|null}
 */
dudeGraph.Renderer.prototype.getRenderBlockById = function (blockId) {
    return this._renderBlockIds[blockId] || null;
};

/**
 * Creates a render block bound to a block
 * @param {Object} renderBlockData
 * @returns {dudeGraph.RenderBlock}
 */
dudeGraph.Renderer.prototype.createRenderBlock = function (renderBlockData) {
    var block = this._graph.blockById(renderBlockData.cgBlock);
    if (block === null) {
        throw 42; // TODO: remove
    }
    var rendererBlockType = this._renderBlockTypes[block.blockType];
    if (!rendererBlockType) {
        throw new Error("Render block type `" + block.blockType + "` not registered in the renderer");
    }
    var renderBlock = rendererBlockType.buildRenderBlock(this, renderBlockData);
    if (renderBlock.nodeId === null) {
        throw new Error("Cannot create a renderBlock without an id");
    }
    var renderBlockFound = this.getRenderBlockById(renderBlock.nodeId);
    if (renderBlockFound !== null) {
        throw new Error("Duplicate renderBlocks for id `" + renderBlock.nodeId + "`: `" +
            renderBlockFound.nodeFancyName + "` was here before `" + renderBlock.nodeFancyName + "`");
    }
    this._renderBlocks.push(renderBlock);
    this._renderBlockIds[renderBlock.nodeId] = renderBlock;
    return renderBlock;
};
/**
 * Returns the renderGroup associated with the given id
 * @param {String} groupId
 * @returns {dudeGraph.RenderGroup|null}
 */
dudeGraph.Renderer.prototype.getRenderGroupById = function (groupId) {
    return this._renderGroupIds[groupId] || null;
};

/**
 * Creates a renderer group bound to a cgGroup
 * @param {Object} renderGroupData
 * @returns {dudeGraph.RenderGroup}
 * @private
 */
dudeGraph.Renderer.prototype._createRenderGroup = function (renderGroupData) {
    var renderGroup = dudeGraph.RenderGroup.buildRenderGroup(this, renderGroupData);
    if (renderGroup.nodeId === null) {
        throw new Error("Cannot create a renderGroup without an id");
    }
    var renderGroupFound = this.getRenderGroupById(renderGroup.nodeId);
    if (renderGroupFound !== null) {
        throw new Error("Duplicate renderGroups for id `" + renderGroup.nodeId + "`: `" +
            renderGroupFound.nodeFancyName + "` was here before `" + renderGroup.nodeFancyName + "`");
    }
    this._renderGroups.push(renderGroup);
    this._renderGroupIds[renderGroup.nodeId] = renderGroup;
    return renderGroup;
};
/**
 * Creates zoom and pan
 * @private
 */
dudeGraph.Renderer.prototype._createZoomBehavior = function () {
    var renderer = this;
    this._zoomBehavior = d3.behavior.zoom()
        .scaleExtent([this._config.zoom.min, this._config.zoom.max])
        .on("zoom", function () {
            if (d3.event.sourceEvent) {
                _.browserIf(["IE"], function () {
                    d3.event.sourceEvent.defaultPrevented = true;
                }, function () {
                    d3.event.sourceEvent.preventDefault();
                });
            }
            renderer._d3Root.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            renderer._zoom.translate = renderer._zoomBehavior.translate();
            renderer._zoom.scale = renderer._zoomBehavior.scale();
        }.bind(this));
    this._d3Svg.call(this._zoomBehavior);
};

/**
 * Updates the zoom and pan location
 * @private
 */
dudeGraph.Renderer.prototype._updateZoom = function () {
    this._d3Svg
        .transition()
        .duration(this._config.zoom.transitionSpeed)
        .call(this._zoomBehavior.translate(this._zoom.translate).scale(this._zoom.scale).event);
};
/**
 * Creates d3Blocks with the existing renderBlocks
 * @private
 */
dudeGraph.Renderer.prototype._createD3Blocks = function () {
    this.d3Blocks
        .data(this._renderBlocks, function (renderBlock) {
            return renderBlock.nodeId;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (renderBlock) {
            return renderBlock.nodeId;
        })
        .classed("dude-graph-block", true)
        .each(function (renderBlock) {
            renderBlock.create(d3.select(this));
        });
    this._updateD3Blocks();
};

/**
 * Creates d3Blocks with the existing renderBlocks
 * @private
 */
dudeGraph.Renderer.prototype._updateD3Blocks = function () {
    this.d3Blocks.each(function (renderBlock) {
        renderBlock.update();
    });
};

/**
 * Removes d3Blocks when rendererBlocks are removed
 * @private
 */
dudeGraph.Renderer.prototype._removeD3Blocks = function () {
    this.d3Blocks
        .data(this._renderBlocks, function (renderBlock) {
            return renderBlock.nodeId;
        })
        .exit()
        .each(function (renderBlock) {
            renderBlock.remove();
        })
        .remove();
};
/**
 * Creates d3Groups with the existing renderGroups
 * @private
 */
dudeGraph.Renderer.prototype._createD3Groups = function () {
    this.d3Groups
        .data(this._renderGroups, function (renderGroup) {
            return renderGroup.nodeId;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (renderGroup) {
            return renderGroup.nodeId;
        })
        .classed("dude-graph-group", true)
        .each(function (renderGroup) {
        renderGroup.create(d3.select(this));
    });
    this._updateD3Groups();
};

/**
 * Creates d3Groups with the existing renderGroups
 * @private
 */
dudeGraph.Renderer.prototype._updateD3Groups = function () {
    this.d3Groups.each(function (renderGroup) {
        renderGroup.update();
    });
};

/**
 * Removes d3Groups when renderGroups are removed
 * @private
 */
dudeGraph.Renderer.prototype._removeD3Groups = function () {
    this.d3Groups
        .data(this._renderGroups, function (renderGroup) {
            return renderGroup.nodeId;
        })
        .exit()
        .each(function (renderGroup) {
            renderGroup.remove();
        })
        .remove();
};
/**
 * Loads the renderer from data
 * @param {Object} data
 * @param {Array<Object>} data.blocks
 * @param {Array<Object>} data.groups
 * @param {Array<Object>} data.connections
 */
dudeGraph.Renderer.prototype.load = function (data) {
    var renderer = this;
    _.forEach(data.blocks, function (renderBlockData) {
        renderer.createRenderBlock(renderBlockData);
    });
    _.forEach(data.groups, function (renderGroupData) {
        renderer._createRenderGroup(renderGroupData);
    });
    _.forEach(data.blocks, function (renderBlockData) {
        var renderBlock = renderer.getRenderBlockById(renderBlockData.id);
        if (renderBlockData.parent) {
            var renderGroupParent = renderer.getRenderGroupById(renderBlockData.parent);
            if (renderGroupParent === null) {
                throw new Error("Cannot find renderBlock `" + renderBlock.nodeFancyName + "` parent id `" + renderBlockData.parent + "`");
            }
            renderBlock.nodeParent = renderGroupParent;
        }
    });
    _.forEach(data.groups, function (renderGroupData) {
        var renderGroup = renderer.getRenderGroupById(renderGroupData.id);
        if (renderGroupData.parent) {
            var renderGroupParent = renderer.getRenderGroupById(renderGroupData.parent);
            if (renderGroupParent === null) {
                throw new Error("Cannot find renderGroup `" + renderGroup.nodeFancyName + "` parent id `" + renderGroupData.parent + "`");
            }
            renderGroup.nodeParent = renderGroupParent;
        }
    });
    this._createD3Blocks();
    this._createD3Groups();
};

/**
 * Returns the text bounding box, prediction can be done accurately while using a monospace font
 * Always use a monospace font for fast prediction of the text size, unless you'd like to deal with FOUT and getBBox...
 * @param {String|SVGTextElement} text
 */
dudeGraph.Renderer.prototype.textBoundingBox = function (text) {
    if (text instanceof SVGTextElement) {
        text = text.textContent;
    }
    return [text.length * 8, 17];
};