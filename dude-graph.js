//noinspection JSUnusedLocalSymbols
/**
 * @namespace dudeGraph
 * @type {Object}
 */
var dudeGraph = (function() {
    var namespace = {};
    if (typeof exports !== "undefined") {
        if (typeof module !== "undefined" && module.exports) {
            exports = module.exports = namespace;
        }
        exports.dudeGraph = namespace;
    } else {
        window.dudeGraph = namespace;
    }
    return namespace;
})();
/**
 * The browser name.
 * @type {String}
 */
dudeGraph.browser = (function () {
    var isOpera = !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
    if (isOpera) {
        return "Opera";
    }
    else { //noinspection JSUnresolvedVariable
        if (typeof InstallTrigger !== "undefined") {
            return "Firefox";
        }
        else if (Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0) {
            return "Safari";
        }
        else if (navigator.userAgent.indexOf("Edge") !== -1) {
            return "Edge";
        }
        else { //noinspection JSUnresolvedVariable
            if (!!window.chrome && !isOpera) {
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
        }
    }
})();

/**
 * Runs the function if the current browser is in the browsers
 * @param {Array<String>} browsers
 * @param {Function} [funcOk]
 * @param {Function} [funcKo]
 */
dudeGraph.browserIf = function (browsers, funcOk, funcKo) {
    if (_.includes(browsers, dudeGraph.browser)) {
        (funcOk && funcOk || function () {})();
    } else {
        (funcKo && funcKo || function () {})();
    }
};
/**
 * Clamps a value between a minimum number and a maximum number.
 * @param value {Number}
 * @param min {Number}
 * @param max {Number}
 * @return {Number}
 */
dudeGraph.clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};

(function () {
    /**
     * Generates a random bit of an UUID
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

    /**
     * Generates a salted UUID
     * @returns {String}
     */
    dudeGraph.uuid = function () {
        return salt + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    };
})();
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Represents the graph whom holds the entities
 * @class
 * @extends {EventEmitter}
 */
dudeGraph.Graph = function () {
    /**
     * All existing types for this graph instance, the key being the type name and the value being an array
     * of all possible conversions
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
     * The types validators, the key is the type and the value is a function that validates the type value
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
        },
        "Choice": function (value) {
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
     * @type {Object} {String: dudeGraph.Block}
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

dudeGraph.Graph.prototype = _.create(EventEmitter.prototype, {
    "constructor": dudeGraph.Graph
});

/**
 * Adds a block to the graph
 * @param {dudeGraph.Block} cgBlock - cgBlock to add to the graph
 * @param {Boolean} [quiet=false] - Whether the event should be emitted
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

//noinspection JSUnusedGlobalSymbols
/**
 * Returns the blocks with the given name.
 * @param {String} cgBlockName
 * @returns {dudeGraph.Block}
 */
dudeGraph.Graph.prototype.blocksByName = function (cgBlockName) {
    return _.filter(this.cgBlocks, function (cgBlock) {
        return cgBlock.cgName === cgBlockName;
    });
};

//noinspection JSUnusedGlobalSymbols
/**
 * Returns an array of blocks which have the given type.
 * @param {String|dudeGraph.Block} blockType
 * @returns {Array<dudeGraph.Block>}
 */
dudeGraph.Graph.prototype.blocksByType = function (blockType) {
    return _.filter(this.cgBlocks, function (cgBlock) {
        if (_.isString(blockType)) {
            return cgBlock.blockType === blockType;
        } else {
            return cgBlock instanceof blockType;
        }
    });
};

/**
 * Returns the next unique block id
 * @returns {String}
 */
dudeGraph.Graph.prototype.nextBlockId = function () {
    return dudeGraph.uuid();
};

/**
 * Creates a connection between two cgPoints
 * @param {dudeGraph.Point} cgOutputPoint
 * @param {dudeGraph.Point} cgInputPoint
 * @emit "dude-graph-connection-create" {dudeGraph.Connection}
 * @returns {dudeGraph.Connection}
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
        throw new Error("Point `" + cgOutputPoint.cgName + "` " +
            "does not accept to connect to `" + cgInputPoint.cgName + "` (too many connections)");
    }
    if (!cgInputPoint.acceptConnect(cgOutputPoint)) {
        throw new Error("Point `" + cgInputPoint.cgName + "` " +
            "does not accept to connect to `" + cgOutputPoint.cgName + "` (too many connections)");
    }
    if (!this.canConvert(cgOutputPoint.cgValueType, cgInputPoint.cgValueType) && !this.updateTemplate(cgInputPoint, cgOutputPoint.cgValueType)) {
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
    _.forEach(cgPoint.cgConnections, function (cgConnection) {
        this.disconnectPoints(cgConnection.cgOutputPoint, cgConnection.cgInputPoint);
    }.bind(this));
};

/**
 * Returns the list of connections for every points in the given block
 * @param {dudeGraph.Block} cgBlock
 * @returns {Array<dudeGraph.Connection>}
 */
dudeGraph.Graph.prototype.connectionsByBlock = function (cgBlock) {
    return _.map(this._cgConnections, function (cgConnection) {
        return cgConnection.cgOutputPoint.cgBlock === cgBlock || cgConnection.cgInputPoint.cgBlock === cgBlock;
    });
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

//noinspection JSUnusedGlobalSymbols
/**
 * Returns the list of connections for a given point
 * @param {dudeGraph.Point} cgPoint
 * @returns {Array<dudeGraph.Connection>}
 */
dudeGraph.Graph.prototype.connectionsByPoint = function (cgPoint) {
    return _.map(this._cgConnections, function (cgConnection) {
        return cgConnection.cgOutputPoint === cgPoint || cgConnection.cgInputPoint === cgPoint;
    });
};

//noinspection JSUnusedGlobalSymbols
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

//noinspection JSUnusedGlobalSymbols
/**
 * Add a validator predicate for the given `type`
 * @param {String} type - The type on which this validator will be applied
 * @param {Function} validator - A function which takes a value in parameter and returns true if it can be assigned
 */
dudeGraph.Graph.prototype.addValidator = function (type, validator) {
    this._validators[type] = validator;
};

/**
 * Checks whether the first type can be converted into the second one
 * @param {String} firstType
 * @param {String} secondType
 * @returns {Boolean}
 */
dudeGraph.Graph.prototype.canConvert = function (firstType, secondType) {
    return firstType === secondType || (this._cgTypes[firstType] &&
        this._cgTypes[firstType].indexOf(secondType) !== -1);
};

/**
 * Checks whether the given value is assignable to the given type
 * @param {*} value - A value to check.
 * @param {String} type - The type that the value should have
 */
dudeGraph.Graph.prototype.canAssign = function (value, type) {
    return value === null || (this._validators[type] && this._validators[type](value));
};

/**
 * Tries to update the blocks types from templates parameters to match the cgPoint type with the given type
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
 * @param {Object} data - The block initial data
 * @param {String?} data.cgId - The block unique identifier
 * @param {String?} data.cgTemplates - The templated types that this block accept
 * @class
 */
dudeGraph.Block = function (cgGraph, data) {
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
    this._blockType = this.className;

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

dudeGraph.Block.prototype = _.create(Object.prototype, {
    "constructor": dudeGraph.Block,
    "className": "Block"
});

/**
 * Validates the block content
 * Called when the graph adds this block
 */
dudeGraph.Block.prototype.validate = function () {};

/**
 * Adds an input or an output point
 * @param {dudeGraph.Point} cgPoint
 * @emit "cg-point-add" {dudeGraph.Block} {dudeGraph.Point}
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
    this._cgGraph.emit("cg-point-add", this, cgPoint);
    return cgPoint;
};

/**
 * Removes the given point
 * @param {dudeGraph.Point} cgPoint
 */
dudeGraph.Block.prototype.removePoint = function (cgPoint) {
    if (!_.isEmpty(cgPoint.cgConnections)) {
        // TODO: Remove connections
        throw new Error("not yet implemented");
    }
    if (cgPoint.isOutput) {
        if (!_.includes(this._cgOutputs, cgPoint)) {
            throw new Error("Block has no output `" + cgPoint.cgName + "`");
        }
        _.pull(this._cgOutputs, cgPoint);
    } else {
        if (!_.includes(this._cgInputs, cgPoint)) {
            throw new Error("Block has no input `" + cgPoint.cgName + "`");
        }
        _.pull(this._cgInputs, cgPoint);
    }
    this._cgGraph.emit("cg-point-remove", this, cgPoint);
};

/**
 * Returns whether this block contains the specified output
 * @param {String} cgOutputName
 * @return {dudeGraph.Point|null}
 */
dudeGraph.Block.prototype.outputByName = function (cgOutputName) {
    return _.find(this._cgOutputs, function (cgOutput) {
        return cgOutput.cgName === cgOutputName;
    }) || null;
};

/**
 * Returns whether this block contains the specified input
 * @param {String} cgInputName
 * @return {dudeGraph.Point|null}
 */
dudeGraph.Block.prototype.inputByName = function (cgInputName) {
    return _.find(this._cgInputs, function (cgInput) {
        return cgInput.cgName === cgInputName;
    }) || null;
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
 * Called when the cgValue of a point changed
 * @param {dudeGraph.Point} cgPoint
 * @param {Object|null} cgValue
 * @param {Object|null} oldCgValue
 */
dudeGraph.Block.prototype.pointValueChanged = function (cgPoint, cgValue, oldCgValue) {
};

/**
 * Returns a copy of this block
 * @return {dudeGraph.Block}
 */
dudeGraph.Block.prototype.clone = function () {
    var cgBlockClone = new this.constructor(this._cgGraph, {"cgId": this._cgGraph.nextBlockId(), "cgName": this._cgName});
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
 * @param {Object} data - The point data
 * @param {String} data.cgName - The point data
 * @param {String} [data.cgValue=null] - The point data
 * @param {String} [data.cgValueType=null] - The point data
 * @param {String} [data.cgTemplate=null] - The point data
 * @param {String} [data.singleConnection=null] - The point data
 * @param {Boolean} isOutput - True if this point is an output, False for an input
 * @param {String} pointType - The type of this point represented as a string
 * @class
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
    this._pointType = this.className;

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
                this._cgBlock.pointValueChanged(this, cgValue, oldCgValue);
                this._cgGraph.emit("cg-point-value-change", this, oldCgValue, cgValue);
            } else {
                throw new Error("Invalid value `" + String(cgValue) +
                    "` for `" + this._cgValueType + "` in `" + this._cgName + "`");
            }
        }.bind(this)
    });
    if (isOutput && data.cgValue !== null && !_.isUndefined(data.cgValue)) {
        throw new Error("Cannot create output point `" + this._cgName + "` in block `" +
            this._cgBlock.cgId + "` with a value.");
    }
    this._cgValue = data.cgValue || null;
};

dudeGraph.Point.prototype = _.create(Object.prototype, {
    "constructor": dudeGraph.Point,
    "className": "Point"
});

/**
 * Returns whether this cgPoint is empty (no cgValue)
 * @returns {Boolean}
 */
dudeGraph.Point.prototype.empty = function () {
    return this._cgValue === null;
};

//noinspection JSUnusedLocalSymbols
/**
 * Returns whether this cgPoint accepts a connection if there is room to the given cgPoint
 * @param {dudeGraph.Point} cgPoint
 * @returns {Boolean}
 */
dudeGraph.Point.prototype.acceptConnect = function (cgPoint) {
    return !this._singleConnection || (this._cgConnections.length === 0 && this._cgValue === null);
};

//noinspection JSUnusedLocalSymbols
/**
 * Returns whether this cgPoint accepts a cgValue
 * @param {Object} [cgValue]
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
 * Removes the connection between this cgPoint and the given cgPoint
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
    return new this.constructor(cgBlock, {
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
 * @class
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

//noinspection JSUnusedGlobalSymbols
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
    this._cgOutputPoint.disconnect(this._cgOutputPoint);
};
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * @param {dudeGraph.Block} cgBlock - Reference to the related cgBlock.
 * @param {Object} data - JSON representation of this stream point
 * @param {Boolean} isOutput - Defined whether this point is an output or an input
 * @class
 * @extends {dudeGraph.Point}
 */
dudeGraph.Choice = function (cgBlock, data, isOutput) {
    dudeGraph.Point.call(this, cgBlock, _.merge(data, {
        "cgValueType": "Choice"
    }), isOutput);
    Object.defineProperty(this, "choice", {
        get: function () {
            return this._cgValue.choice;
        }.bind(this),
        set: function (choice) {
            if (!this.validateChoice(choice)) {
                throw new Error("Choice `" + choice + "` is not in the possible choices");
            }
            this.cgValue = {
                "choices": this._cgValue.choices,
                "choice": choice
            };
        }.bind(this)
    });
    Object.defineProperty(this, "choices", {
        get: function () {
            return this._cgValue.choices;
        }.bind(this)
    });
    if (!this.validateChoice(this._cgValue.choice)) {
        throw new Error("Choice `" + this._cgValue.choice + "` is not in the possible choices");
    }
};

dudeGraph.Choice.prototype = _.create(dudeGraph.Point.prototype, {
    "constructor": dudeGraph.Choice,
    "className": "Choice"
});

/**
 * Returns whether this Choice is empty
 * @returns {Boolean}
 * @override
 */
dudeGraph.Choice.prototype.empty = function () {
    return this._cgValue === null || this._cgValue.choice === null;
};

/**
 * Returns whether the given choice is in the possible choices
 * @param {Object} choice
 * @returns {Boolean}
 */
dudeGraph.Choice.prototype.validateChoice = function (choice) {
    return choice === null || _.includes(this.cgValue.choices, choice);
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
 * @class
 * @extends {dudeGraph.Point}
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

dudeGraph.Stream.prototype = _.create(dudeGraph.Point.prototype, {
    "constructor": dudeGraph.Stream,
    "className": "Stream"
});
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This is like function however, it takes a stream in input and output. In code it would represent function
 * separated by semicolons.
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Assignation = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data);
};

dudeGraph.Assignation.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Assignation,
    "className": "Assignation"
});

/**
 * Validates the block content
 * Called when the graph adds this block
 * @override
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
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Condition = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data);
};

dudeGraph.Condition.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Condition,
    "className": "Condition"
});

/**
 * Validates the block content
 * Called when the graph adds this block
 * @override
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
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Delegate = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data);
};

dudeGraph.Delegate.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Delegate,
    "className": "Delegate"
});

/**
 * Validates the block content
 * Called when the graph adds this block
 * @override
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
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Each = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data);
};

dudeGraph.Each.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Each,
    "className": "Each"
});
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * The expression RegExp "%(name:Type)"
 * @type {RegExp}
 */
var TypeRegex = /%\((\w+):(String|Number|Boolean)\)/g;

/**
 * An expression block with dynamic value points depending on the format
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Expression = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data);
};

dudeGraph.Expression.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Expression,
    "className": "Expression"
});

/**
 * Validates the block content
 * Called when the graph adds this block
 * @override
 */
dudeGraph.Expression.prototype.validate = function () {
    if (!(this.inputByName("format") instanceof dudeGraph.Point) || this.inputByName("format").cgValueType !== "String") {
        throw new Error("Expression `" + this.cgId + "` must have an input `format` of type `Point` of cgValueType `String`");
    }
};

//noinspection JSUnusedLocalSymbols
/**
 * Called when the cgValue of a point changed
 * @param {dudeGraph.Point} cgPoint
 * @param {Object|null} cgValue
 * @param {Object|null} oldCgValue
 */
dudeGraph.Expression.prototype.pointValueChanged = function (cgPoint, cgValue, oldCgValue) {
    var expression = this;
    if (cgPoint.cgName === "format") {
        var match = true;
        while (match) {
            match = TypeRegex.exec(cgValue);
            if (match) {
                if (expression.inputByName(match[1]) === null) {
                    var point = new dudeGraph.Point(expression, {"cgName": match[1], "cgValueType": match[2]}, false, "Point");
                    expression.addPoint(point);
                }
            }
        }
        var inputs = _.clone(expression.cgInputs);
        _.forEach(inputs, function (input) {
            if (input.cgName === "format") {
                return;
            }
            if (cgValue.indexOf("%(" + input.cgName + ":" + input.cgValueType + ")") === -1) {
                expression.removePoint(input);
            }
        });
    }
};
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This block represents a simple function that takes some inputs and returns one or zero output.
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Function = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data);
};

dudeGraph.Function.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Function,
    "className": "Function"
});
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This block represents a simple Getter that takes some inputs and returns one or zero output.
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Getter = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data);
};

dudeGraph.Getter.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Getter,
    "className": "Getter"
});
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * This is like function however, it takes a stream in input and output. In code it would represent function
 * separated by semicolons.
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Instruction = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data);
};

dudeGraph.Instruction.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Instruction,
    "className": "Instruction"
});

/**
 * Validates the block content
 * Called when the graph adds this block
 * @override
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
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Operator = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data);
};

dudeGraph.Operator.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Operator,
    "className": "Operator"
});

/**
 * Validates the block content
 * Called when the graph adds this block
 * @override
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
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Range = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data);
};

dudeGraph.Range.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Range,
    "className": "Range"
});
//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Variable = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data);

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

dudeGraph.Variable.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Variable,
    "className": "Variable"
});

/**
 * Validates the block content
 * Called when the graph adds this block
 * @override
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
 * @class
 */
dudeGraph.GraphLoader = function () {
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
dudeGraph.GraphLoader.prototype.registerBlockType = function (blockType, blockConstructor) {
    this._blockTypes[blockType] = blockConstructor;
};

/**
 * Registers a new point type
 * @param {String} pointType
 * @param {dudeGraph.Point} pointConstructor
 */
dudeGraph.GraphLoader.prototype.registerPointType = function (pointType, pointConstructor) {
    this._pointTypes[pointType] = pointConstructor;
};

/**
 * Loads a cgGraph from a json
 * @param {dudeGraph.Graph} cgGraph - The graph to load
 * @param {Object} cgGraphData - The graph data
 * @param {Array<Object>} cgGraphData.blocks - The graph blocks
 * @param {Array<Object>} cgGraphData.connections - The graph connections
 */
dudeGraph.GraphLoader.prototype.load = function (cgGraph, cgGraphData) {
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
dudeGraph.GraphLoader.prototype.loadBlock = function (cgGraph, cgBlockData) {
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
dudeGraph.GraphLoader.prototype.loadPoint = function (cgBlock, cgPointData, isOutput) {
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
dudeGraph.GraphLoader.prototype.loadConnection = function (cgGraph, cgConnectionData) {
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
 * @class
 */
dudeGraph.GraphSaver = function () {};

/**
 * Saves a cgGraph as json
 * @param {dudeGraph.Graph} cgGraph - The graph to save
 * @return {Object}
 */
dudeGraph.GraphSaver.prototype.save = function (cgGraph) {
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
dudeGraph.GraphSaver.prototype.saveBlock = function (cgBlock) {
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
dudeGraph.GraphSaver.prototype.savePoint = function (cgPoint) {
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
dudeGraph.GraphSaver.prototype.saveConnection = function (cgConnection) {
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
 * @class
 * @extends {EventEmitter}
 */
dudeGraph.Renderer = function () {
    /**
     * The graph to render
     * @type {dudeGraph.Graph}
     * @private
     */
    this._graph = null;
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
     * @private
     */
    this._d3Svg = null;

    /**
     * The root group node of the renderer
     * @type {d3.selection}
     * @private
     */
    this._d3Root = null;

    /**
     * The SVG group for the d3Groups
     * @type {d3.selection}
     * @private
     */
    this._d3Groups = null;

    /**
     * The SVG connection for the d3Connections
     * @type {d3.selection}
     * @private
     */
    this._d3Connections = null;

    /**
     * The SVG group for the d3Blocks
     * @type {d3.selection}
     * @private
     */
    this._d3Block = null;

    /**
     * The SVG point to perform SVG matrix transformations
     * @type {SVGPoint}
     * @private
     */
    this._svgPoint = null;

    /**
     * The renderBlocks
     * @type {Array<dudeGraph.RenderBlock>}
     * @private
     */
    this._renderBlocks = null;

    /**
     * The renderGroups
     * @type {Array<dudeGraph.RenderGroup>}
     * @private
     */
    this._renderGroups = null;

    /**
     * The renderConnections
     * @type {Array<dudeGraph.RenderConnection>}
     * @private
     */
    this._renderConnections = null;

    /**
     * The selected renderNodes
     * @type {Array<dudeGraph.RenderNode>}
     * @private
     */
    this._selectedRenderNodes = null;

    /**
     * The renderBlock types
     * @type {d3.map<String, dudeGraph.RenderBlock>}
     * @private
     */
    this._renderBlockTypes = null;

    /**
     * Association map from id to renderBlock
     * @type {d3.map<String, dudeGraph.RenderBlock>}
     * @private
     */
    this._renderBlockIds = null;

    /**
     * Association map from id to renderGroup
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

dudeGraph.Renderer.prototype = _.create(EventEmitter.prototype, {
    "constructor": dudeGraph.Renderer
});

/**
 * Initializes the renderer
 * @param {dudeGraph.Graph} cgGraph
 * @param {SVGElement} svgElement
 * @param {Object} [config]
 */
dudeGraph.Renderer.prototype.initialize = function (cgGraph, svgElement, config) {
    var renderer = this;
    this._graph = cgGraph;
    this._d3Svg = d3.select(svgElement);
    this._d3Root = this._d3Svg.append("svg:g").attr("id", "dude-graph-renderer");
    this._d3Groups = this._d3Root.append("svg:g").attr("id", "dude-graph-groups");
    this._d3Connections = this._d3Root.append("svg:g").attr("id", "dude-graph-connections");
    this._d3Block = this._d3Root.append("svg:g").attr("id", "dude-graph-blocks");
    this._svgPoint = svgElement.createSVGPoint();
    this._renderBlocks = [];
    this._renderGroups = [];
    this._renderConnections = [];
    this._selectedRenderNodes = [];
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
    this._graph.on("cg-point-value-change", function (point) {
        var renderBlocks = renderer.renderBlocksByBlock(point.cgBlock);
        _.forEach(renderBlocks, function (renderBlock) {
            renderBlock.update();
        });
    });
    this._graph.on("cg-point-add", function (block, point) {
        var renderBlocks = renderer.renderBlocksByBlock(block);
        _.forEach(renderBlocks, function (renderBlock) {
            renderer.createRenderPoint(renderBlock, {
                "point": point
            }, true);
        });
    });
    this._graph.on("cg-point-remove", function (block, point) {
        var renderBlocks = renderer.renderBlocksByBlock(block);
        _.forEach(renderBlocks, function (renderBlock) {
            var renderPoint = renderer.renderPointByName(renderBlock, point.cgName, point.isOutput);
            renderer.removeRenderPoint(renderPoint, true);
        });
    });
    this._createSelectionBehavior();
    this._createZoomBehavior();
};

/**
 * Registers a renderBlock
 * @param {String} renderBlockType
 * @param {dudeGraph.RenderBlock} renderBlockConstructor
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
        "min": 0.01,
        "max": 5,
        "margin": [10, 10],
        "transitionSpeed": 800
    },
    "block": {
        "padding": 10,
        "header": 50,
        "pointSpacing": 10,
        "borderRadius": 5
    },
    "grid": {
        "active": false,
        "spacingX": 20,
        "spacingY": 20
    },
    "group": {
        "padding": 10,
        "header": 30,
        "borderRadius": 5,
        "minSize": [200, 150]
    },
    "point": {
        "height": 20,
        "padding": 10,
        "radius": 3
    },
    "connection": {
        "step": 50
    },
    "typeColors": {
        "Stream": "#aaaaaa",
        "Boolean": "#cc99cd",
        "Number": "#5990bd",
        "String": "#aac563",
        "Resource": "#ffa8c2",
        "Object": "#d9b762",
        "Entity": "#667e7f"
    },
    "defaultColor": "#ffaaff"
};

/**
 * Default renderer zoom
 * @type {{translate: Array<Number>, scale: Number}}
 */
dudeGraph.Renderer.defaultZoom = {
    "translate": [0, 0],
    "scale": 1
};
/**
 * @param {dudeGraph.Renderer} renderer
 * @param {String} nodeId
 * @class
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
    this._getNodeName = function () {
        return this._nodeName;
    }.bind(this);
    this._setNodeName = function (nodeName) {
        this._nodeName = nodeName;
        if (this._d3Node !== null) {
            this.computePosition();
            this.computeSize();
            this.update();
        }
    }.bind(this);
    Object.defineProperty(this, "nodeName", {
        configurable: true,
        get: this._getNodeName,
        set: this._setNodeName
    });

    /**
     * The node size
     * @type {Array<Number>}
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
     * The node position
     * @type {Array<Number>}
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
     * The offset position
     * @type {Array<Number>}
     * @protected
     */
    this._movePosition = [0, 0];
    Object.defineProperty(this, "movePosition", {
        configurable: true,
        get: function () {
            return this._movePosition;
        }.bind(this),
        set: function (_movePosition) {
            this._movePosition = _movePosition;
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
 * Called when the renderNode is selected
 * @callback
 */
dudeGraph.RenderNode.prototype.select = function () {
};

/**
 * Called when the renderNode is unselected
 * @callback
 */
dudeGraph.RenderNode.prototype.unselect = function () {
};

/**
 * Called when the renderNode should compute its new size
 */
dudeGraph.RenderNode.prototype.computeSize = function () {

};

/**
 * Called when the renderNode should compute its new position
 */
dudeGraph.RenderNode.prototype.computePosition = function () {

};

/**
 * Applies dom events on node renderNode in order to select and move it.
 */
dudeGraph.RenderNode.prototype.moveEvent = function () {
    var renderNode = this;
    this._d3Node.call(d3.behavior.drag()
        .on("dragstart", function () {
            dudeGraph.stopD3ImmediatePropagation();
            dudeGraph.preventD3Default();
            if (!d3.event.sourceEvent.shiftKey) {
                renderNode._renderer.clearSelection();
            }
            renderNode._renderer.addToSelection([renderNode]);
            this.parentNode.appendChild(this);
        })
        .on("drag", function () {
            dudeGraph.preventD3Default();
            var translateRenderNode = function (currentRenderNode) {
                if (renderNode._renderer._config.grid.active) {
                    currentRenderNode.movePosition[0] += d3.event.dx;
                    currentRenderNode.movePosition[1] += d3.event.dy;
                    currentRenderNode.nodePosition[0] = Math.round(currentRenderNode.movePosition[0] / renderNode._renderer._config.grid.spacingX) * renderNode._renderer._config.grid.spacingX;
                    currentRenderNode.nodePosition[1] = Math.round(currentRenderNode.movePosition[1] / renderNode._renderer._config.grid.spacingY) * renderNode._renderer._config.grid.spacingY;
                } else {
                    currentRenderNode.nodePosition[0] += d3.event.dx;
                    currentRenderNode.nodePosition[1] += d3.event.dy;
                }
                currentRenderNode.move();
                _.forEach(currentRenderNode._renderPoints, function (renderPoint) {
                    _.forEach(renderPoint.renderConnections, function (renderConnection) {
                        renderConnection.update();
                    });
                });
            };
            translateRenderNode(renderNode);
            if (renderNode instanceof dudeGraph.RenderGroup) {
                _.forEach(renderNode.renderBlocksChildren, function (childRenderNode) {
                    translateRenderNode(childRenderNode);
                });
            } else {
                var renderGroupParent = renderNode.renderGroupParent;
                if (renderGroupParent !== null) {
                    renderGroupParent.computePosition();
                    renderGroupParent.computeSize();
                    renderGroupParent.update();
                }
            }
        })
        .on("dragend", function (renderNode) {
            dudeGraph.preventD3Default();
            if (renderNode instanceof dudeGraph.RenderBlock && renderNode.renderGroupParent === null) {
                var renderGroup = renderNode._renderer.nearestRenderGroup(renderNode);
                if (renderGroup !== null) {
                    renderNode.renderGroupParent = renderGroup;
                    renderGroup.computePosition();
                    renderGroup.computeSize();
                    renderGroup.update();
                }
            }
        })
    );
};
/**
 * @param {dudeGraph.Renderer} renderer
 * @param {String} rendererBlockId
 * @param {dudeGraph.Block} block
 * @class
 * @extends {dudeGraph.RenderNode}
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
     * The node name
     * @type {String}
     * @protected
     */
    Object.defineProperty(this, "nodeName", {
        configurable: true,
        get: this._getNodeName,
        set: function (nodeName) {
            this._setNodeName(nodeName);
            if (this.renderGroupParent !== null) {
                this.renderGroupParent.computePosition();
                this.renderGroupParent.computeSize();
                this.renderGroupParent.update();
            }
            _.forEach(this._renderPoints, function (renderPoint) {
                renderPoint.computePosition();
                renderPoint.update();
                _.forEach(renderPoint.renderConnections, function (renderConnection) {
                    renderConnection.update();
                });
            });
        }.bind(this)
    });

    /**
     * The renderBlock renderGroup parent
     * @type {dudeGraph.RenderGroup}
     * @protected
     */
    this._renderGroupParent = null;
    Object.defineProperty(this, "renderGroupParent", {
        configurable: true,
        get: function () {
            return this._renderGroupParent;
        }.bind(this),
        set: function (nodeParent) {
            if (this._renderGroupParent !== null) {
                this._renderGroupParent.removeChild(this);
            }
            if (nodeParent !== null) {
                nodeParent.addChild(this);
            }
            this._renderGroupParent = nodeParent;
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
        }.bind(this)
    });

    /**
     * The output renderPoints of this renderBlock
     * @type {Array<dudeGraph.RenderPoint>}
     */
    Object.defineProperty(this, "renderOutputPoints", {
        get: function () {
            return _.filter(this.renderPoints, function (renderPoint) {
                return renderPoint.point.isOutput;
            });
        }
    });

    /**
     * The input renderPoints of this renderBlock
     * @type {Array<dudeGraph.RenderPoint>}
     */
    Object.defineProperty(this, "renderInputPoints", {
        get: function () {
            return _.filter(this.renderPoints, function (renderPoint) {
                return !renderPoint.point.isOutput;
            });

        }
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

dudeGraph.RenderBlock.prototype = _.create(dudeGraph.RenderNode.prototype, {
    "constructor": dudeGraph.RenderBlock
});

/**
 * Creates the d3Block for this renderBlock
 * @param {d3.selection} d3Block
 * @override
 */
dudeGraph.RenderBlock.prototype.create = function (d3Block) {
    dudeGraph.RenderNode.prototype.create.call(this, d3Block);
    this._d3Rect = this._d3Node.append("svg:rect")
        .attr("rx", this._renderer.config.block.borderRadius)
        .attr("ry", this._renderer.config.block.borderRadius);
    this._d3Title = this._d3Node.append("svg:text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "text-before-edge");
    this._d3Points = this._d3Node
        .append("svg:g")
        .classed("dude-graph-points", true);
    this.computeSize();
    this.update();
};

/**
 * Updates the d3Block for this renderBlock
 * @override
 */
dudeGraph.RenderBlock.prototype.update = function () {
    dudeGraph.RenderNode.prototype.update.call(this);
    var renderBlock = this;
    this._d3Rect
        .attr({
            "width": this._nodeSize[0],
            "height": this._nodeSize[1]
        });
    this._d3Title
        .text(this._nodeName)
        .attr({
            "x": this._nodeSize[0] / 2,
            "y": this._renderer.config.block.padding
        });
    dudeGraph.browserIf(["IE", "Edge"], function () {
        renderBlock._d3Title.attr("y",
            renderBlock._renderer.config.block.padding +
            renderBlock._renderer.measureText(renderBlock._d3Title)[1] / 2);
    });
    this.d3Points
        .each(function (renderPoint) {
            renderPoint.update();
        });
    this.move();
};

/**
 * Computes the renderBlock size
 * @override
 */
dudeGraph.RenderBlock.prototype.computeSize = function () {
    var widerOutput = _.maxBy(this.renderOutputPoints, function (renderPoint) {
        return renderPoint.pointSize[0];
    });
    var widerInput = _.maxBy(this.renderInputPoints, function (renderPoint) {
        return renderPoint.pointSize[0];
    });
    var titleWidth = this._renderer.measureText(this._nodeName)[0];
    var maxOutputWidth = _.isUndefined(widerOutput) ? 0 : widerOutput.pointSize[0];
    var maxInputWidth = _.isUndefined(widerInput) ? 0 : widerInput.pointSize[0];
    var maxPoints = this.renderOutputPoints.length > this.renderInputPoints.length;
    var maxPointsHeight = _.sumBy(maxPoints ? this.renderOutputPoints : this.renderInputPoints, function (renderPoint) {
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
 * Updates the d3Blocks to create/remove associated renderPoints
 */
dudeGraph.RenderBlock.prototype.updatePoints = function () {
    var renderPoints = this.d3Points
        .data(this.renderPoints, function (renderPoint) {
            return renderPoint.pointFancyName;
        });
    renderPoints
        .enter()
        .append("g")
        .classed("dude-graph-point", true);
    renderPoints
        .exit()
        .each(function (renderPoint) {
            renderPoint.remove();
        })
        .remove();
    this.d3Points
        .each(function (renderPoint) {
            renderPoint.create(d3.select(this));
            renderPoint.removeConnectionsEvent();
            renderPoint.dragConnectionEvent();
        });
    this.computeSize();
    this.d3Points
        .each(function (renderPoint) {
            renderPoint.computePosition();
            renderPoint.update();
        });
    this.update();
};

/**
 * Builds a renderPoint from data
 * @param {Object} renderPointData
 * @returns {dudeGraph.RenderPoint}
 */
dudeGraph.RenderBlock.prototype.createRenderPoint = function (renderPointData) {
    return dudeGraph.RenderPoint.buildRenderPoint(this._renderer, this, renderPointData);
};

/**
 * Adds a renderPoint
 * @param {dudeGraph.RenderPoint} renderPoint
 */
dudeGraph.RenderBlock.prototype.addRenderPoint = function (renderPoint) {
    var renderPointFound = _.find(this._renderPoints, renderPoint);
    if (!_.isUndefined(renderPointFound)) {
        throw new Error("`" + renderPoint.pointFancyName + "` is already a renderPoint of `" + this.nodeFancyName + "`");
    }
    this._renderPoints.push(renderPoint);
    this._updateRenderPointsIndexes();
};

/**
 * Removes a renderPoint
 * @param {dudeGraph.RenderPoint} renderPoint
 */
dudeGraph.RenderBlock.prototype.removeRenderPoint = function (renderPoint) {
    var renderPointFound = _.find(this._renderPoints, renderPoint);
    if (_.isUndefined(renderPointFound)) {
        throw new Error("`" + renderPoint.pointFancyName + "` is not a renderPoint of `" + this.nodeFancyName + "`");
    }
    _.pull(this._renderPoints, renderPoint);
    this._updateRenderPointsIndexes();
};

/**
 * Applies dom events on this renderNode in order to remove it from its parent.
 */
dudeGraph.RenderNode.prototype.removeParentEvent = function () {
    var renderBlock = this;
    this._d3Node.call(d3.behavior.doubleClick()
        .on("dblclick", function () {
            var renderGroupParent = renderBlock.renderGroupParent;
            if (renderGroupParent !== null) {
                dudeGraph.stopD3ImmediatePropagation();
                renderBlock.renderGroupParent = null;
                renderGroupParent.computePosition();
                renderGroupParent.computeSize();
                renderGroupParent.update();
            }
        })
    );
};

/**
 * Updates the indexes of the renderPoints
 * @protected
 */
dudeGraph.RenderBlock.prototype._updateRenderPointsIndexes = function () {
    _.forEach(this.renderOutputPoints, function (renderPoint, index) {
        renderPoint.index = index;
    });
    _.forEach(this.renderInputPoints, function (renderPoint, index) {
        renderPoint.index = index;
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
    var renderBlock = new this(renderer, renderBlockData.id, block);
    renderBlock.nodeName = renderBlockData.description || block.cgName || "";
    renderBlock.nodePosition = renderBlockData.position || [0, 0];
    renderBlock.movePosition = renderBlock.nodePosition.slice();
    renderBlock.parentGroup = renderBlockData.parent || null;
    return renderBlock;
};
/**
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.Connection} connection
 * @param {dudeGraph.RenderPoint} outputRenderPoint
 * @param {dudeGraph.RenderPoint} inputRenderPoint
 * @class
 */
dudeGraph.RenderConnection = function (renderer, connection, outputRenderPoint, inputRenderPoint) {
    /**
     * Reference on the renderer
     * @type {dudeGraph.Renderer}
     * @private
     */
    this._renderer = renderer;

    /**
     * The connection
     * @type {dudeGraph.Connection}
     * @private
     */
    this._connection = connection;
    Object.defineProperty(this, "connection", {
        get: function () {
            return this._connection;
        }.bind(this)
    });

    /**
     * The connection unique id
     * @type {String}
     */
    Object.defineProperty(this, "connectionId", {
        get: function () {
            return this.outputRenderPoint.renderBlock.nodeId + ":" + this.outputRenderPoint.point.cgName + "," +
                this.inputRenderPoint.renderBlock.nodeId + ":" + this.inputRenderPoint.point.cgName;
        }.bind(this)
    });

    /**
     * The output renderPoint
     * @type {dudeGraph.RenderPoint}
     * @private
     */
    this._outputRenderPoint = outputRenderPoint;
    Object.defineProperty(this, "outputRenderPoint", {
        get: function () {
            return this._outputRenderPoint;
        }.bind(this)
    });

    /**
     * The input renderPoint
     * @type {dudeGraph.RenderPoint}
     * @private
     */
    this._inputRenderPoint = inputRenderPoint;
    Object.defineProperty(this, "inputRenderPoint", {
        get: function () {
            return this._inputRenderPoint;
        }.bind(this)
    });

    /**
     * Whether this connection is used to draw to dragging connection
     * @type {Boolean}
     * @private
     */
    this._dragging = false;
    Object.defineProperty(this, "dragging", {
        get: function () {
            return this._dragging;
        }.bind(this),
        set: function (dragging) {
            this._dragging = dragging;
        }.bind(this)
    });

    /**
     * Returns the fake dragging point used to draw a connection
     * @type {Object}
     */
    Object.defineProperty(this, "draggingRenderPoint", {
        get: function () {
            if (!this.dragging) {
                throw new Error("Cannot get the dragging renderPoint of a non dragging connection");
            }
            return this._outputRenderPoint instanceof dudeGraph.RenderPoint ?
                this._inputRenderPoint : this._outputRenderPoint;
        }.bind(this)
    });

    /**
     * Returns the real starting renderPoint used to draw a connection
     * @type {dudeGraph.RenderPoint}
     */
    Object.defineProperty(this, "realRenderPoint", {
        get: function () {
            if (!this.dragging) {
                throw new Error("Cannot get the real renderPoint of a non dragging connection");
            }
            return this._outputRenderPoint instanceof dudeGraph.RenderPoint ?
                this._outputRenderPoint : this._inputRenderPoint;
        }.bind(this)
    });

    /**
     * The d3Connection that holds this renderConnection
     * @type {d3.selection}
     * @private
     */
    this._d3Connection = null;
    Object.defineProperty(this, "d3Connection", {
        get: function () {
            return this._d3Connection;
        }.bind(this)
    });
};

/**
 * Creates the svg representation of this renderConnection
 * @param {d3.selection} d3Connection
 */
dudeGraph.RenderConnection.prototype.create = function (d3Connection) {
    this._d3Connection = d3Connection;
    this._d3Line = d3.svg.line()
        .interpolate("basis");
};

/**
 * Updates the svg representation of this renderConnection
 */
dudeGraph.RenderConnection.prototype.update = function () {
    var step = this._renderer.config.connection.step;
    if (this._outputRenderPoint.pointAbsolutePosition[0] > this._inputRenderPoint.pointAbsolutePosition[0]) {
        step += Math.max(
            -this._renderer.config.connection.step,
            Math.min(
                this._outputRenderPoint.pointAbsolutePosition[0] - this._inputRenderPoint.pointAbsolutePosition[0],
                this._renderer.config.connection.step
            )
        );
    }
    var outputRenderPointPosition = this._outputRenderPoint.pointAbsolutePosition;
    var inputRenderPointPosition = this._inputRenderPoint.pointAbsolutePosition;
    var connectionPoints = [
        [outputRenderPointPosition[0], outputRenderPointPosition[1]],
        [outputRenderPointPosition[0] + step, outputRenderPointPosition[1]],
        [inputRenderPointPosition[0] - step, inputRenderPointPosition[1]],
        [inputRenderPointPosition[0], inputRenderPointPosition[1]]
    ];
    var inputColor = this._renderer.config.typeColors[this.inputRenderPoint.point.cgValueType];
    var outputColor = this._renderer.config.typeColors[this.outputRenderPoint.point.cgValueType];
    this._d3Connection
        .attr({
            "d": this._d3Line(connectionPoints),
            "stroke": inputColor || outputColor || this._renderer.config.defaultColor,
            "stroke-linecap": "round"
        });
    if (this._dragging) {
        this._d3Connection
            .attr("stroke-dasharray", "5,5");
    }
};

/**
 * Removes the svg representation of this renderConnection
 */
dudeGraph.RenderConnection.prototype.remove = function () {
};

/**
 * RenderConnection factory
 * @param {dudeGraph.Renderer} renderer
 * @param {Object} renderConnectionData
 * The parameters are either:
 * @param {Number?} renderConnectionData.cgConnectionIndex
 * @param {String?} renderConnectionData.outputRendererBlockId
 * @param {String?} renderConnectionData.inputRendererBlockId
 * Or either:
 * @param {dudeGraph.Connection?} renderConnectionData.connection
 * @param {dudeGraph.RenderBlock?} renderConnectionData.outputRenderBlock
 * @param {dudeGraph.RenderBlock?} renderConnectionData.inputRenderBlock
 */
// TODO: Improve error messages depending on the parameters set used
dudeGraph.RenderConnection.buildRenderConnection = function (renderer, renderConnectionData) {
    var connection = renderConnectionData.connection || renderer._graph.cgConnections[renderConnectionData.cgConnectionIndex];
    if (!connection) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex + "` does not exist");
    }
    var outputRenderBlock = renderConnectionData.outputRenderBlock || renderer.renderBlockById(renderConnectionData.outputRendererBlockId);
    var inputRenderBlock = renderConnectionData.inputRenderBlock || renderer.renderBlockById(renderConnectionData.inputRendererBlockId);
    if (outputRenderBlock === null) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex +
            "`: Cannot find outputRenderBlock `" + renderConnectionData.outputRendererBlockId + "`");
    }
    if (inputRenderBlock === null) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex +
            "`: Cannot find inputRenderBlock `" + renderConnectionData.inputRendererBlockId + "`");
    }
    if (outputRenderBlock.block !== connection.cgOutputPoint.cgBlock) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex +
            "`: output render block `" + outputRenderBlock.nodeFancyName +
            "` is not holding a reference to the output block `" + connection.cgOutputPoint.cgBlock.cgId + "`");
    }
    if (inputRenderBlock.block !== connection.cgInputPoint.cgBlock) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex +
            "`: input render block `" + inputRenderBlock.nodeFancyName +
            "` is not holding a reference to the input block `" + connection.cgInputPoint.cgBlock.cgId + "`");
    }
    var outputRendererPoint = renderer.renderPointByName(outputRenderBlock, connection.cgOutputPoint.cgName, true);
    var inputRendererPoint = renderer.renderPointByName(inputRenderBlock, connection.cgInputPoint.cgName, false);
    if (!outputRendererPoint) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex +
            "`: Cannot find outputRenderPoint `" + connection.cgOutputPoint.cgName + "`");
    }
    if (!inputRendererPoint) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex +
            "`: Cannot find inputRenderPoint `" + connection.cgInputPoint.cgName + "`");
    }
    return new this(renderer, connection, outputRendererPoint, inputRendererPoint);
};
/**
 * @param {dudeGraph.Renderer} renderer
 * @param {String} groupId
 * @class
 * @extends {dudeGraph.RenderNode}
 */
dudeGraph.RenderGroup = function (renderer, groupId) {
    dudeGraph.RenderNode.call(this, renderer, groupId);

    /**
     * The renderBlocks children
     * @type {Array<dudeGraph.RenderBlock>}
     * @private
     */
    this._renderBlocksChildren = [];
    Object.defineProperty(this, "renderBlocksChildren", {
        get: function () {
            return this._renderBlocksChildren;
        }.bind(this)
    });
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
    this._d3Rect = d3Group.append("svg:rect")
        .attr("rx", this._renderer.config.group.borderRadius)
        .attr("ry", this._renderer.config.group.borderRadius);
    this._d3Title = d3Group.append("svg:text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "text-before-edge");
    this.update();
    this.computePosition();
    this.computeSize();
    this.move();
};

/**
 * Updates the svg representation of this renderGroup
 * @override
 */
dudeGraph.RenderGroup.prototype.update = function () {
    dudeGraph.RenderNode.prototype.update.call(this);
    var renderGroup = this;
    this._d3Rect
        .attr({
            "width": this._nodeSize[0],
            "height": this._nodeSize[1]
        });
    this._d3Title
        .text(this._nodeName)
        .attr({
            "x": this._nodeSize[0] / 2,
            "y": renderGroup._renderer.config.group.padding
        });
    dudeGraph.browserIf(["IE", "Edge"], function () {
        renderGroup._d3Title.attr("y",
            renderGroup._renderer.config.group.padding + renderGroup._renderer.measureText(renderGroup._d3Title)[1] / 2);
    });
};

/**
 * Called when the renderGroup should compute its new size
 * @override
 */
dudeGraph.RenderGroup.prototype.computeSize = function () {
    var contentBoundingBox = this._renderer.renderNodesBoundingRect(this._renderBlocksChildren, true);
    if (contentBoundingBox !== null) {
        this._nodeSize = [
            contentBoundingBox[1][0] - contentBoundingBox[0][0] + this._renderer.config.group.padding * 2,
            contentBoundingBox[1][1] - contentBoundingBox[0][1] + this._renderer.config.group.padding * 2 + this._renderer.config.group.header
        ];
    }
    this._nodeSize = [
        Math.max(this._nodeSize[0], this._renderer.config.group.minSize[0] + this._renderer.config.group.padding * 2),
        Math.max(this._nodeSize[1], this._renderer.config.group.minSize[1] + this._renderer.config.group.padding * 2 + this._renderer.config.group.header)
    ];
    this._nodeSize[0] = Math.max(this._nodeSize[0], this._renderer.measureText(this._d3Title)[0] + this._renderer.config.group.padding * 2);
};

/**
 * Called when the renderGroup should compute its new position
 * @override
 */
dudeGraph.RenderGroup.prototype.computePosition = function () {
    var contentBoundingBox = this._renderer.renderNodesBoundingRect(this._renderBlocksChildren, true);
    if (contentBoundingBox !== null) {
        this._nodePosition = [
            contentBoundingBox[0][0] - this._renderer.config.group.padding,
            contentBoundingBox[0][1] - this._renderer.config.group.padding - this._renderer.config.group.header
        ];
    }
};

/**
 * Adds the renderBlock as a child
 * @param {dudeGraph.RenderBlock} renderBlock
 */
dudeGraph.RenderGroup.prototype.addChild = function (renderBlock) {
    var renderNodeChildFound = _.find(this._renderBlocksChildren, renderBlock);
    if (!_.isUndefined(renderNodeChildFound)) {
        throw new Error("`" + renderBlock.nodeFancyName + "` is already a child of `" + this.nodeFancyName + "`");
    }
    this._renderBlocksChildren.push(renderBlock);
};

/**
 * Removes the child renderBlock
 * @param {dudeGraph.RenderBlock} renderBlock
 */
dudeGraph.RenderGroup.prototype.removeChild = function (renderBlock) {
    var renderNodeChildFound = _.find(this._renderBlocksChildren, renderBlock);
    if (_.isUndefined(renderNodeChildFound)) {
        throw new Error("`" + renderBlock.nodeFancyName + "` is not a child of `" + this.nodeFancyName + "`");
    }
    _.pull(this._renderBlocksChildren, renderBlock);
};

/**
 * Removes all the children renderBlocks
 */
dudeGraph.RenderGroup.prototype.removeAllChildren = function () {
    var children = _.clone(this._renderBlocksChildren);
    _.forEach(children, function (renderBlockChild) {
        renderBlockChild.renderGroupParent = null;
    });
};

/**
 * RenderGroup factory
 * @param {dudeGraph.Renderer} renderer
 * @param {Object} renderGroupData
 */
dudeGraph.RenderGroup.buildRenderGroup = function (renderer, renderGroupData) {
    var renderGroup = new this(renderer, renderGroupData.id);
    renderGroup.nodeName = renderGroupData.description || "";
    renderGroup.nodePosition = renderGroupData.position || [0, 0];
    renderGroup.nodeSize = renderGroupData.size || [0, 0];
    return renderGroup;
};
/**
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.RenderBlock} renderBlock
 * @param {dudeGraph.Point} point
 * @param {Number} index
 * @class
 */
dudeGraph.RenderPoint = function (renderer, renderBlock, point) {
    /**
     * Reference on the renderer
     * @type {dudeGraph.Renderer}
     * @protected
     */
    this._renderer = renderer;

    /**
     * The point
     * @type {dudeGraph.Point}
     * @protected
     */
    this._point = point;
    Object.defineProperty(this, "point", {
        get: function () {
            return this._point;
        }.bind(this)
    });

    /**
     * The point index in the renderBlock
     * @type {Number}
     * @protected
     */
    this._index = 0;
    Object.defineProperty(this, "index", {
        get: function () {
            return this._index;
        }.bind(this),
        set: function (index) {
            this._index = index;
        }.bind(this)
    });

    /**
     * The host renderBlock
     * @type {dudeGraph.RenderBlock}
     * @protected
     */
    this._renderBlock = renderBlock;
    Object.defineProperty(this, "renderBlock", {
        get: function () {
            return this._renderBlock;
        }.bind(this)
    });

    /**
     * The renderConnections attached to this renderPoint
     * @type {Array<dudeGraph.RenderConnection>}
     * @protected
     */
    this._renderConnections = [];
    Object.defineProperty(this, "renderConnections", {
        get: function () {
            return this._renderConnections;
        }.bind(this)
    });

    /**
     * Whether the point is hidden in the renderer
     * @type {Boolean}
     * @private
     */
    this._pointHidden = false;
    Object.defineProperty(this, "pointHidden", {
        set: function (pointHidden) {
            this._pointHidden = pointHidden;
        }.bind(this),
        get: function () {
            return this._pointHidden;
        }.bind(this)
    });

    /**
     * The point size in the d3Block
     * @type {Array<Number>}
     * @protected
     */
    this._pointSize = [0, 0];
    Object.defineProperty(this, "pointSize", {
        get: function () {
            return this._pointSize;
        }.bind(this)
    });

    /**
     * The point position in the d3Block
     * @type {Array<Number>}
     * @protected
     */
    this._pointPosition = [0, 0];
    Object.defineProperty(this, "pointPosition", {
        get: function () {
            return this._pointPosition;
        }.bind(this)
    });

    /**
     * The point position in the d3Svg
     * @type {Array<Number>}
     * @protected
     */
    Object.defineProperty(this, "pointAbsolutePosition", {
        get: function () {
            var renderBlockPosition = this._renderBlock.nodePosition;
            return [
                renderBlockPosition[0] + this._pointPosition[0],
                renderBlockPosition[1] + this._pointPosition[1]
            ];
        }.bind(this)
    });

    /**
     * The renderPoint fancyName
     * @type {String}
     */
    Object.defineProperty(this, "pointFancyName", {
        get: function () {
            return (this._point.isOutput ? "Output " : "Input ") + this._point.cgName + " (#" + this._index + ")";
        }.bind(this)
    });

    /**
     * The d3Point that holds this renderPoint
     * @type {d3.selection}
     * @protected
     */
    this._d3Point = null;
    Object.defineProperty(this, "d3Point", {
        get: function () {
            return this._d3Point;
        }.bind(this)
    });
};

/**
 * Creates the svg representation of this renderPoint
 * @param {d3.selection} d3PointGroup
 */
dudeGraph.RenderPoint.prototype.create = function (d3PointGroup) {
    var r = this._renderer.config.point.radius;
    var renderPoint = this;
    this._d3Point = d3PointGroup;
    this._d3Circle = d3PointGroup
        .append("svg:path")
        .attr("d", function () {
            if (renderPoint._point instanceof dudeGraph.Stream) {
                return "M " + -r + " " + -r * 1.5 + " L " + -r + " " + r * 1.5 + " L " + r + " " + 0 + " Z";
            } else {
                return "M 0,0m " + -r + ", 0a " + [r, r] + " 0 1,0 " + r * 2 + ",0a " + [r, r] + " 0 1,0 " + -(r * 2) + ",0";
            }
        });
    this._d3Title = d3PointGroup
        .append("svg:text")
        .attr({
            "text-anchor": this._point.isOutput ? "end" : "start",
            "dominant-baseline": "middle",
            "x": (this.point.isOutput ? -1 : 1) * this._renderer.config.point.padding
        });
    dudeGraph.browserIf(["IE", "Edge"], function () {
        renderPoint._d3Title.attr("y",
            renderPoint._pointPosition[1] + renderPoint._renderer.measureText(renderPoint._d3Title)[1] / 4);
    });
    this.computeSize();
};

/**
 * Updates the svg representation of this renderPoint
 */
dudeGraph.RenderPoint.prototype.update = function () {
    var pointColor = this._renderer.config.typeColors[this.point.cgValueType] || this._renderer.config.defaultColor;
    this._d3Point.attr("transform", "translate(" + this.pointPosition + ")");
    this._d3Circle
        .attr({
            "stroke": pointColor,
            "fill": this.empty() ? "transparent" : pointColor
        });
    this._d3Title
        .text(this._point.cgName);
};

/**
 * Removes the svg representation of this renderPoint
 */
dudeGraph.RenderPoint.prototype.remove = function () {

};

/**
 * Computes the renderPoint size
 */
dudeGraph.RenderPoint.prototype.computeSize = function () {
    var textBoundingBox = this._renderer.measureText(this._point.cgName);
    this._pointSize = [
        textBoundingBox[0] + this._renderer.config.point.padding * 2,
        this._renderer.config.point.height
    ];
};

/**
 * Computes the renderPoint position
 */
dudeGraph.RenderPoint.prototype.computePosition = function () {
    if (this.point.isOutput) {
        this._pointPosition = [
            this._renderBlock.nodeSize[0] - this._renderer.config.point.padding,
            this._renderer.config.block.header + this._renderer.config.point.height * this._index
        ];
    } else {
        this._pointPosition = [
            this._renderer.config.point.padding,
            this._renderer.config.block.header + this._renderer.config.point.height * this._index
        ];
    }
};

/**
 * Removes the connection from the point event
 */
dudeGraph.RenderPoint.prototype.removeConnectionsEvent = function () {
    var renderPoint = this;
    this._d3Circle.call(d3.behavior.mousedown()
        .on("mousedown", function () {
            if (d3.event.sourceEvent.altKey) {
                dudeGraph.preventD3Default();
                dudeGraph.stopD3ImmediatePropagation();
                renderPoint._renderer.emptyRenderPoint(renderPoint, true);
            }
        })
    );
};

/**
 * Creates the connection drag event
 */
dudeGraph.RenderPoint.prototype.dragConnectionEvent = function () {
    var renderPoint = this;
    var renderConnection = null;
    var dragPoint = {
        "renderBlock": {
            "nodeId": "drawing"
        },
        "point": {
            "cgName": "drawing"
        },
        "pointAbsolutePosition": [0, 0]
    };
    renderPoint._d3Circle.call(d3.behavior.drag()
        .on("dragstart", function () {
            dudeGraph.stopD3ImmediatePropagation();
            dragPoint.pointAbsolutePosition = d3.mouse(renderPoint._renderer._d3Root.node());
            if (renderPoint._point.isOutput) {
                //noinspection JSCheckFunctionSignatures
                renderConnection = new dudeGraph.RenderConnection(renderPoint._renderer, null, renderPoint, dragPoint);
            } else {
                //noinspection JSCheckFunctionSignatures
                renderConnection = new dudeGraph.RenderConnection(renderPoint._renderer, null, dragPoint, renderPoint);
            }
            renderConnection.dragging = true;
            renderPoint._renderer._renderConnections.push(renderConnection);
            renderPoint._renderer.createD3Connections();
        })
        .on("drag", function () {
            dragPoint.pointAbsolutePosition = d3.mouse(renderPoint._renderer._d3Root.node());
            renderConnection.update();
        })
        .on("dragend", function () {
            var position = d3.mouse(renderPoint._renderer._d3Root.node());
            var renderPointFound = renderPoint._renderer.nearestRenderPoint(position);
            if (renderPointFound && renderPoint !== renderPointFound) {
                try {
                    var connection = renderPointFound.point.connect(renderPoint._point);
                    renderPoint._renderer.createRenderConnection({
                        "cgConnectionIndex": renderPoint._renderer.graph.cgConnections.indexOf(connection),
                        "outputRendererBlockId": renderPoint._point.isOutput ? renderPoint._renderBlock.nodeId : renderPointFound.renderBlock.nodeId,
                        "inputRendererBlockId": renderPoint._point.isOutput ? renderPointFound.renderBlock.nodeId : renderPoint._renderBlock.nodeId
                    });
                    renderPoint._renderer.createD3Connections();
                    renderPoint.update();
                    renderPointFound.update();
                } catch (ex) {
                    renderPoint._renderer.emit("error", ex);
                }
            } else {
                renderPoint._renderer.emit(
                    "drop-connection",
                    renderConnection,
                    d3.mouse(renderPoint._renderer._d3Root.node()),
                    d3.mouse(document.body));
            }
            _.pull(renderPoint._renderer._renderConnections, renderConnection);
            renderConnection = null;
            renderPoint._renderer.removeD3Connections();
        })
    );
};

/**
 * Returns whether this renderPoint is empty.
 * @returns {Boolean}
 */
dudeGraph.RenderPoint.prototype.empty = function () {
    return _.isEmpty(this.renderConnections) && this._point.empty();
};

/**
 * RenderPoint factory
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.RenderBlock} renderBlock
 * @param {Object} renderPointData
 * @param {dudeGraph.Point} renderPointData.point
 * @param {Object} renderPointData.renderPoint
 * @param {Boolean} [renderPointData.renderPoint.hidden=false]
 * @returns {dudeGraph.RenderPoint}
 */
dudeGraph.RenderPoint.buildRenderPoint = function (renderer, renderBlock, renderPointData) {
    var renderPoint = new this(renderer, renderBlock, renderPointData.point);
    renderPoint.pointHidden = (renderPointData.renderPoint && renderPointData.renderPoint.hidden) || false;
    if (renderPoint.pointHidden) {
        console.log(renderPoint.pointFancyName);
    }
    return renderPoint;
};
/**
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.Block} block
 * @param {String} blockId
 * @class
 * @extends {dudeGraph.RenderBlock}
 */
dudeGraph.RenderVariable = function (renderer, block, blockId) {
    dudeGraph.RenderBlock.call(this, renderer, block, blockId);
};

dudeGraph.RenderVariable.prototype = _.create(dudeGraph.RenderBlock.prototype, {
    "constructor": dudeGraph.RenderVariable
});

/**
 *
 * @param d3Block
 */
dudeGraph.RenderVariable.prototype.create = function (d3Block) {
    dudeGraph.RenderBlock.prototype.create.call(this, d3Block);
    var variableType = this.block.cgOutputs[0].cgValueType;
    var variableColor = this._renderer.config.typeColors[variableType];
    if (!_.isUndefined(variableColor)) {
        this._d3Rect.attr("style", "fill: " + variableColor + "; stroke: " + variableColor + ";");
    }
};

/**
 *
 * @param d3Block
 */
dudeGraph.RenderVariable.prototype.update = function (d3Block) {
    dudeGraph.RenderBlock.prototype.update.call(this, d3Block);
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
 * Returns the renderBlock associated with the given id
 * @param {String} blockId
 * @returns {dudeGraph.RenderBlock|null}
 */
dudeGraph.Renderer.prototype.renderBlockById = function (blockId) {
    return this._renderBlockIds[blockId] || null;
};

/**
 * Returns the renderBlocks associated with the given block
 * @param {dudeGraph.Block} block
 */
dudeGraph.Renderer.prototype.renderBlocksByBlock = function (block) {
    return _.filter(this._renderBlocks, function (renderBlock) {
        return renderBlock.block === block;
    });
};

/**
 * Creates a render block bound to a block
 * @param {Object} renderBlockData
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 * @returns {dudeGraph.RenderBlock}
 */
dudeGraph.Renderer.prototype.createRenderBlock = function (renderBlockData, forceUpdate) {
    var renderer = this;
    var block = this._graph.blockById(renderBlockData.cgBlock);
    if (block === null) {
        throw new Error("Unknown block `" + renderBlockData.cgBlock + "` for renderBlock `" + renderBlockData.id + "`");
    }
    var rendererBlockType = this._renderBlockTypes[block.blockType];
    if (!rendererBlockType) {
        throw new Error("Render block type `" + block.blockType + "` not registered in the renderer");
    }
    var renderBlock = rendererBlockType.buildRenderBlock(this, renderBlockData);
    if (renderBlock.nodeId === null ||  _.isUndefined(renderBlock.nodeId)) {
        throw new Error("Cannot create a renderBlock without an id");
    }
    var renderBlockFound = this.renderBlockById(renderBlock.nodeId);
    if (renderBlockFound !== null) {
        throw new Error("Duplicate renderBlocks for id `" + renderBlock.nodeId + "`: `" +
            renderBlockFound.nodeFancyName + "` was here before `" + renderBlock.nodeFancyName + "`");
    }
    this._renderBlocks.push(renderBlock);
    this._renderBlockIds[renderBlock.nodeId] = renderBlock;
    var createRenderPoint = function (point) {
        var renderPointCustomData = renderBlockData[point.isOutput ? "outputs": "inputs"];
        renderPointCustomData = renderPointCustomData && renderPointCustomData[point.cgName];
        renderer.createRenderPoint(renderBlock, {
            "renderPoint": renderPointCustomData,
            "point": point
        });
    };
    _.forEach(renderBlock.block.cgOutputs, createRenderPoint);
    _.forEach(renderBlock.block.cgInputs, createRenderPoint);
    if (forceUpdate) {
        this.createD3Blocks();
    }
    return renderBlock;
};

/**
 * Removes the given renderBlock and the underlying block
 * @param {dudeGraph.RenderBlock} renderBlock
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 */
dudeGraph.Renderer.prototype.removeRenderBlock = function (renderBlock, forceUpdate) {
    var renderer = this;
    _.forEach(renderBlock.renderPoints, function (renderPoint) {
        renderer.emptyRenderPoint(renderPoint, forceUpdate);
    });
    _.pull(this._renderBlocks, renderBlock);
    if (_.isEmpty(this.renderBlocksByBlock(renderBlock.block))) {
        this._graph.removeBlock(renderBlock.block);
    }
    if (renderBlock.renderGroupParent) {
        renderBlock.renderGroupParent.removeChild(renderBlock);
    }
    if (forceUpdate) {
        if (renderBlock.renderGroupParent) {
            renderBlock.renderGroupParent.computePosition();
            renderBlock.renderGroupParent.computeSize();
            renderBlock.renderGroupParent.update();
        }
        this.removeD3Blocks();
    }
};
/**
 * Creates a renderConnection from data
 * @param {Object} rendererConnectionData
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 */
dudeGraph.Renderer.prototype.createRenderConnection = function (rendererConnectionData, forceUpdate) {
    var renderConnection = dudeGraph.RenderConnection.buildRenderConnection(this, rendererConnectionData);
    renderConnection.outputRenderPoint.renderConnections.push(renderConnection);
    renderConnection.inputRenderPoint.renderConnections.push(renderConnection);
    this._renderConnections.push(renderConnection);
    if (forceUpdate) {
        this.createD3Connections();
        renderConnection.outputRenderPoint.update();
        renderConnection.inputRenderPoint.update();
    }
    return renderConnection;
};

/**
 * Removes the given renderConnection and the underlying connection
 * @param {dudeGraph.RenderConnection} renderConnection
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 */
dudeGraph.Renderer.prototype.removeRenderConnection = function (renderConnection, forceUpdate) {
    renderConnection.outputRenderPoint.point.disconnect(renderConnection.inputRenderPoint.point);
    _.pull(renderConnection.outputRenderPoint.renderConnections, renderConnection);
    _.pull(renderConnection.inputRenderPoint.renderConnections, renderConnection);
    _.pull(this._renderConnections, renderConnection);
    if (forceUpdate) {
        renderConnection.outputRenderPoint.update();
        renderConnection.inputRenderPoint.update();
        this.removeD3Connections();
    }
};
/**
 * Returns the renderGroup associated with the given id
 * @param {String} groupId
 * @returns {dudeGraph.RenderGroup|null}
 */
dudeGraph.Renderer.prototype.renderGroupById = function (groupId) {
    return this._renderGroupIds[groupId] || null;
};

/**
 * Creates a renderer group bound to a cgGroup
 * @param {Object} renderGroupData
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 * @returns {dudeGraph.RenderGroup}
 */
dudeGraph.Renderer.prototype.createRenderGroup = function (renderGroupData, forceUpdate) {
    var renderGroup = dudeGraph.RenderGroup.buildRenderGroup(this, renderGroupData);
    if (renderGroup.nodeId === null || _.isUndefined(renderGroup.nodeId)) {
        throw new Error("Cannot create a renderGroup without an id");
    }
    var renderGroupFound = this.renderGroupById(renderGroup.nodeId);
    if (renderGroupFound !== null) {
        throw new Error("Duplicate renderGroups for id `" + renderGroup.nodeId + "`: `" +
            renderGroupFound.nodeFancyName + "` was here before `" + renderGroup.nodeFancyName + "`");
    }
    this._renderGroups.push(renderGroup);
    this._renderGroupIds[renderGroup.nodeId] = renderGroup;
    if (forceUpdate) {
        this.createD3Groups();
    }
    return renderGroup;
};

/**
 * Removes the given renderBlock and the underlying block
 * @param {dudeGraph.RenderGroup} renderGroup
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 */
dudeGraph.Renderer.prototype.removeRenderGroup = function (renderGroup, forceUpdate) {
    renderGroup.removeAllChildren();
    _.pull(this._renderGroups, renderGroup);
    if (forceUpdate) {
        this.removeD3Groups();
    }
};
/**
 * Returns the renderPoint associated with the given name in the given renderBlock
 * @param {dudeGraph.RenderBlock} renderBlock
 * @param {String} renderPointName
 * @param {Boolean} isOutput
 * @returns {dudeGraph.RenderPoint|null}
 */
dudeGraph.Renderer.prototype.renderPointByName = function (renderBlock, renderPointName, isOutput) {
    return _.find(renderBlock.renderPoints, function (renderPoint) {
            return renderPoint.point.cgName === renderPointName && renderPoint.point.isOutput === isOutput;
        }) || null;
};

/**
 * Creates a renderPoint bound to a point
 * @param {dudeGraph.RenderBlock} renderBlock
 * @param {Object} renderPointData
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 * @returns {dudeGraph.RenderPoint}
 */
dudeGraph.Renderer.prototype.createRenderPoint = function (renderBlock, renderPointData, forceUpdate) {
    var renderPoint = renderBlock.createRenderPoint(renderPointData);
    renderBlock.addRenderPoint(renderPoint);
    if (forceUpdate) {
        renderBlock.updatePoints();
    }
};

/**
 * Removes the given renderPoint
 * @param {dudeGraph.RenderPoint} renderPoint
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 */
dudeGraph.Renderer.prototype.removeRenderPoint = function (renderPoint, forceUpdate) {
    renderPoint.renderBlock.removeRenderPoint(renderPoint);
    if (forceUpdate) {
        renderPoint.renderBlock.updatePoints();
    }
};

/**
 * Empties the given renderPoint by removing the value or connections
 * @param {dudeGraph.RenderPoint} renderPoint
 * @param {Boolean} [forceUpdate=false] - Whether to force update the renderer
 */
dudeGraph.Renderer.prototype.emptyRenderPoint = function (renderPoint, forceUpdate) {
    var renderer = this;
    var renderConnections = _.clone(renderPoint.renderConnections);
    _.forEach(renderConnections, function (renderConnection) {
        renderer.removeRenderConnection(renderConnection, forceUpdate);
    });
};
/**
 * Creates the renderBlocks collision quadtree
 * @private
 */
dudeGraph.Renderer.prototype._createRenderBlocksCollisions = function () {
    this._renderBlocksQuadtree = d3.geom.quadtree()
        .x(function (renderBlock) {
            return renderBlock.nodePosition[0];
        })
        .y(function (renderBlock) {
            return renderBlock.nodePosition[1];
        })(this._renderBlocks);
};

/**
 * Creates the renderPoints collision quadtree
 * @private
 */
dudeGraph.Renderer.prototype._createRenderPointsCollisions = function () {
    var renderPoints = [];
    _.forEach(this._renderBlocks, function (rendererBlock) {
        renderPoints = renderPoints.concat(rendererBlock.renderPoints);
    });
    this._renderPointsQuadtree = d3.geom.quadtree()
        .x(function (renderPoint) {
            return renderPoint.pointAbsolutePosition[0];
        })
        .y(function (renderPoint) {
            return renderPoint.pointAbsolutePosition[1];
        })(renderPoints);
};

/**
 * Creates the collision quadtree
 * @private
 */
dudeGraph.Renderer.prototype._createRenderGroupsCollisions = function () {
    this._renderGroupsQuadtree = d3.geom.quadtree()
        .x(function (renderGroup) {
            return renderGroup.nodePosition[0];
        })
        .y(function (renderGroup) {
            return renderGroup.nodePosition[1];
        })(this._renderGroups);
};

/**
 * Returns all RendererNodes overlapping the given area
 * @param {Array<Array<Number>>} rect
 * @return {Array<dudeGraph.RenderBlock>}
 */
dudeGraph.Renderer.prototype.nearestRenderBlocks = function (rect) {
    this._createRenderBlocksCollisions(); // TODO: Update the quadtree only when needed
    var renderBlocks = [];
    this._renderBlocksQuadtree.visit(function (d3QuadtreeNode, x1, y1, x2, y2) {
        var renderBlock = d3QuadtreeNode.point;
        if (renderBlock) {
            var bounds = [
                renderBlock.nodePosition[0],
                renderBlock.nodePosition[1],
                renderBlock.nodePosition[0] + renderBlock.nodeSize[0],
                renderBlock.nodePosition[1] + renderBlock.nodeSize[1]
            ];
            if (!(rect[0][0] > bounds[2] || rect[0][1] > bounds[3] || rect[1][0] < bounds[0] || rect[1][1] < bounds[1])) {
                renderBlocks.push(renderBlock);
            }
        }
        return x1 - 50 >= rect[1][0] || y1 - 35 >= rect[1][1] || x2 + 50 < rect[0][0] || y2 + 35 < rect[0][1];
    });
    return renderBlocks;
};

/**
 * Returns the best renderGroup capable of containing the given renderBlock
 * @param {dudeGraph.RenderBlock} renderBlock
 * @returns {dudeGraph.RenderGroup|null}
 */
dudeGraph.Renderer.prototype.nearestRenderGroup = function (renderBlock) {
    // TODO: Update the quadtree only when needed
    this._createRenderGroupsCollisions();
    var bestRenderGroups = [];
    var x0 = renderBlock.nodePosition[0];
    var y0 = renderBlock.nodePosition[1];
    var x3 = renderBlock.nodePosition[0] + renderBlock.nodeSize[0];
    var y3 = renderBlock.nodePosition[1] + renderBlock.nodeSize[1];
    this._renderGroupsQuadtree.visit(function (d3QuadtreeNode) { // function (d3QuadtreeNode, x1, y1, x2, y2)
        var renderGroup = d3QuadtreeNode.point;
        if (renderGroup && renderGroup !== renderBlock) {
            var bounds = [renderGroup.nodePosition[0], renderGroup.nodePosition[1], renderGroup.nodePosition[0] + renderGroup.nodeSize[0], renderGroup.nodePosition[1] + renderGroup.nodeSize[1]];
            if (x0 > bounds[0] && y0 > bounds[1] && x3 < bounds[2] && y3 < bounds[3]) {
                bestRenderGroups.push(renderGroup);
            }
        }
        return false; // TODO: Optimize
    });
    var bestRenderGroup = null;
    _.forEach(bestRenderGroups, function (bestRenderGroupPossible) {
        if (renderBlock.renderGroupParent && bestRenderGroupPossible === renderBlock.renderGroupParent) {
            bestRenderGroup = bestRenderGroupPossible;
            return false;
        }
        if (bestRenderGroup === null) {
            bestRenderGroup = bestRenderGroupPossible;
        } else if (bestRenderGroupPossible.nodeSize[0] < bestRenderGroup.nodeSize[0] && bestRenderGroupPossible.nodeSize[1] < bestRenderGroup.nodeSize[1]) {
            bestRenderGroup = bestRenderGroupPossible;
        }
    });
    return bestRenderGroup;
};

/**
 * Returns the nearest renderer point at the given position
 * @param {Array<Number>} position
 * @return {dudeGraph.RenderPoint|null}
 */
dudeGraph.Renderer.prototype.nearestRenderPoint = function (position) {
    this._createRenderPointsCollisions(); // TODO: Update the quadtree only when needed
    var renderPoint = this._renderPointsQuadtree.find(position);
    if (renderPoint) {
        var renderPointPosition = renderPoint.pointAbsolutePosition;
        if (renderPointPosition[0] > position[0] - this._config.point.height && renderPointPosition[0] < position[0] + this._config.point.height &&
            renderPointPosition[1] > position[1] - this._config.point.height && renderPointPosition[1] < position[1] + this._config.point.height) {
            return renderPoint;
        }
    }
    return null;
};
/**
 * Creates the select brush
 * @private
 */
dudeGraph.Renderer.prototype._createSelectionBehavior = function () {
    var renderer = this;
    var selectBrush = null;
    this._d3Svg.call(d3.behavior.drag()
        .on("dragstart", function () {
            if (d3.event.sourceEvent.shiftKey) {
                d3.event.sourceEvent.stopImmediatePropagation();
                selectBrush = renderer._d3Svg
                    .append("svg:rect")
                    .classed("dude-graph-select", true)
                    .datum(d3.mouse(this));
            } else {
                renderer.clearSelection();
            }
        })
        .on("drag", function () {
            if (selectBrush) {
                var position = d3.mouse(this);
                selectBrush.attr({
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
            if (selectBrush !== null) {
                var attr = function (attrName) {
                    return parseInt(selectBrush.attr(attrName));
                };
                var position = renderer.screenToWorld([attr("x"), attr("y")]);
                var size = renderer.screenToWorld([attr("width") + attr("x"), attr("height") + attr("y")]);
                var renderNodes = renderer.nearestRenderBlocks([position, size]);
                if (d3.event.sourceEvent.altKey) {
                    renderer.removeFromSelection(renderNodes);
                } else {
                    renderer.addToSelection(renderNodes);
                }
                selectBrush.remove();
                selectBrush = null;
            }
        })
    );
};
/**
 * Adds the given renderNodes to the current selection
 * @param {Array<dudeGraph.RenderNode>} renderNodes - The renderNodes to add to the selection
 */
dudeGraph.Renderer.prototype.addToSelection = function (renderNodes) {
    var renderer = this;
    _.forEach(renderNodes, function (renderNode) {
        if (!_.includes(renderer._selectedRenderNodes, renderNode)) {
            renderNode.select();
            renderNode.d3Node.classed("dude-graph-selected", true);
            renderer._selectedRenderNodes.push(renderNode);
            renderer.emit("select", renderNode);
        }
    });
};

/**
 * Removes the given renderNodes from the current selection
 * @param {Array<dudeGraph.RenderNode>} renderNodes - The renderNodes to remove from the selection
 */
dudeGraph.Renderer.prototype.removeFromSelection = function (renderNodes) {
    var renderer = this;
    _.remove(this._selectedRenderNodes, function (selectedRenderNode) {
        if (_.includes(renderNodes, selectedRenderNode)) {
            selectedRenderNode.unselect();
            selectedRenderNode.d3Node.classed("dude-graph-selected", false);
            renderer.emit("unselect", selectedRenderNode);
            return true;
        }
        return false;
    });
};

/**
 * Clears the selection
 */
dudeGraph.Renderer.prototype.clearSelection = function () {
    this.removeFromSelection(this._selectedRenderNodes);
    this.emit("unselect-all");
};

/**
 * Select all the renderNodes
 * @param {Boolean} [ignoreBlocks=false] - Whether to not select all blocks
 * @param {Boolean} [ignoreGroups=false] - Whether to not select all groups
 */
dudeGraph.Renderer.prototype.selectAll = function (ignoreBlocks, ignoreGroups) {
    this.clearSelection();
    if (!ignoreBlocks) {
        this.addToSelection(this._renderBlocks);
    }
    if (!ignoreGroups) {
        this.addToSelection(this._renderGroups);
    }
};

/**
 * Removes the selected renderNodes
 */
dudeGraph.Renderer.prototype.removeSelection = function () {
    var renderer = this;
    _.forEach(this._selectedRenderNodes, function (renderNode) {
        if (renderNode instanceof dudeGraph.RenderBlock) {
            renderer.removeRenderBlock(renderNode, true);
        } else {
            renderer.removeRenderGroup(renderNode, true);
        }
    });
    this.clearSelection();
};

/**
 * Creates a renderGroup for the selection
 * @param {String} name
 * @returns {dudeGraph.RenderGroup}
 */
dudeGraph.Renderer.prototype.createRenderGroupForSelection = function (name) {
    var renderGroup = this.createRenderGroup({
        "id": dudeGraph.uuid(),
        "description": name
    });
    _.forEach(this._selectedRenderNodes, function (renderNode) {
        renderNode.renderGroupParent = renderGroup;
    });
    this.createD3Groups();
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
                dudeGraph.preventD3Default();
            }
            renderer._d3Root.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            renderer._zoom.translate = d3.event.translate;
            renderer._zoom.scale = d3.event.scale;
        }.bind(this));
    this._d3Svg.call(this._zoomBehavior);
    this._updateZoom();
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
 * Zoom to best fit the given bounding box
 * @param {Object} boundingBox
 * @param {Number} boundingBox.x
 * @param {Number} boundingBox.y
 * @param {Number} boundingBox.width
 * @param {Number} boundingBox.height
 * @private
 */
dudeGraph.Renderer.prototype._zoomToBoundingBox = function (boundingBox) {
    var svgBBox = this._d3Svg.node().getBoundingClientRect();
    var scaleExtent = this._zoomBehavior.scaleExtent();
    var dx = boundingBox.width - boundingBox.x;
    var dy = boundingBox.height - boundingBox.y;
    var x = (boundingBox.x + boundingBox.width) / 2;
    var y = (boundingBox.y + boundingBox.height) / 2;
    var scale = dudeGraph.clamp(0.9 / Math.max(dx / svgBBox.width, dy / svgBBox.height), scaleExtent[0], scaleExtent[1]);
    var translate = [svgBBox.width / 2 - scale * x, svgBBox.height / 2 - scale * y];
    this._zoom.scale = scale;
    this._zoom.translate = translate;
    this._updateZoom();
};

/**
 * Zooms to best fit the given renderNodes
 * @param {Array<dudeGraph.RenderNode>} renderNodes
 */
dudeGraph.Renderer.prototype.zoomToFitRenderNodes = function (renderNodes) {
    if (!_.isEmpty(renderNodes)) {
        var boundingRect = this.renderNodesBoundingRect(renderNodes);
        this._zoomToBoundingBox({
            "x": boundingRect[0][0] - this._config.zoom.margin[0] / 2,
            "y": boundingRect[0][1] - this._config.zoom.margin[1] / 2,
            "width": boundingRect[1][0] + this._config.zoom.margin[0],
            "height": boundingRect[1][1] + this._config.zoom.margin[1]
        });
    }
};

/**
 * Pan to best fit the given renderNodes
 * @param {Array<dudeGraph.RenderNode>} renderNodes
 */
dudeGraph.Renderer.prototype.panToFitRenderNodes = function (renderNodes) {
    var saveScaleExtent = this._zoomBehavior.scaleExtent();
    this._zoomBehavior.scaleExtent([1, 1]);
    this.zoomToFitRenderNodes(renderNodes);
    this._zoomBehavior.scaleExtent(saveScaleExtent);
};

/**
 * Zooms to best fit all renderNodes
 */
dudeGraph.Renderer.prototype.zoomToFit = function () {
    this.zoomToFitRenderNodes(this._renderBlocks.concat(this._renderGroups));
};

/**
 * Zooms to best fit the selected renderNodes
 */
dudeGraph.Renderer.prototype.zoomToFitSelection = function () {
    this.zoomToFitRenderNodes(this._selectedRenderNodes);
};

/**
 * Resets the zoom to zero
 */
dudeGraph.Renderer.prototype.zoomReset = function () {
    this._zoom.translate = [0, 0];
    this._zoom.scale = 1;
    this._updateZoom();
};
/**
 * Creates d3Blocks with the existing renderBlocks
 */
dudeGraph.Renderer.prototype.createD3Blocks = function () {
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
            renderBlock.removeParentEvent();
            renderBlock.moveEvent();
            renderBlock.updatePoints();
        });
    this.updateD3Blocks();
};

/**
 * Updates d3Blocks with the existing renderBlocks
 */
dudeGraph.Renderer.prototype.updateD3Blocks = function () {
    this.d3Blocks.each(function (renderBlock) {
        renderBlock.update();
    });
};

/**
 * Removes d3Blocks when rendererBlocks are removed
 */
dudeGraph.Renderer.prototype.removeD3Blocks = function () {
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
 * Creates d3Connections with the existing renderConnections
 */
dudeGraph.Renderer.prototype.createD3Connections = function () {
    this.d3Connections
        .data(this._renderConnections, function (renderConnection) {
            return renderConnection.connectionId;
        })
        .enter()
        .append("svg:path")
        .attr("id", function (renderConnection) {
            return renderConnection.connectionId;
        })
        .classed("dude-graph-connection", true)
        .each(function (renderConnection) {
            renderConnection.create(d3.select(this));
        });
    this.updateD3Connections();
};

/**
 * Updates d3Connections with the existing renderConnections
 */
dudeGraph.Renderer.prototype.updateD3Connections = function () {
    this.d3Connections.each(function (renderConnection) {
        renderConnection.update();
    });
};

/**
 * Removes d3Connections when renderConnections are removed
 */
dudeGraph.Renderer.prototype.removeD3Connections = function () {
    this.d3Connections
        .data(this._renderConnections, function (renderConnection) {
            return renderConnection.connectionId;
        })
        .exit()
        .each(function (renderConnection) {
            renderConnection.remove();
        })
        .remove();
};
/**
 * Creates d3Groups with the existing renderGroups
 */
dudeGraph.Renderer.prototype.createD3Groups = function () {
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
            renderGroup.moveEvent();
        });
    this.updateD3Groups();
};

/**
 * Updates d3Groups with the existing renderGroups
 */
dudeGraph.Renderer.prototype.updateD3Groups = function () {
    this.d3Groups.each(function (renderGroup) {
        renderGroup.update();
    });
};

/**
 * Removes d3Groups when renderGroups are removed
 */
dudeGraph.Renderer.prototype.removeD3Groups = function () {
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
 * @param {Array<Object>} [data.blocks]
 * @param {Array<Object>} [data.groups]
 * @param {Array<Object>} [data.connections]
 * @param {{translate: Array<Number>, scale: Number}} [data.zoom]
 * @param {{translate: Array<Number>, scale: Number}} [data.config.zoom]
 */
dudeGraph.Renderer.prototype.load = function (data) {
    var renderer = this;
    _.forEach(data.blocks, function (renderBlockData) {
        renderer.createRenderBlock(renderBlockData);
    });
    _.forEach(data.groups, function (renderGroupData) {
        renderer.createRenderGroup(renderGroupData);
    });
    _.forEach(data.connections, function (renderConnectionData) {
        renderer.createRenderConnection(renderConnectionData);
    });
    _.forEach(data.blocks, function (renderBlockData) {
        var renderBlock = renderer.renderBlockById(renderBlockData.id);
        if (renderBlockData.parent) {
            var renderGroupParent = renderer.renderGroupById(renderBlockData.parent);
            if (renderGroupParent === null) {
                throw new Error("Cannot find renderBlock `" + renderBlock.nodeFancyName + "` parent id `" + renderBlockData.parent + "`");
            }
            renderBlock.renderGroupParent = renderGroupParent;
        }
    });
    this._zoom = _.defaultsDeep(data.zoom || (data.config && data.config.zoom) || {}, dudeGraph.Renderer.defaultZoom);
    this._updateZoom();
    this.createD3Blocks();
    this.createD3Groups();
    this.createD3Connections();
};
/**
 * Saves the renderNodes and renderConnections
 * @returns {Object}
 */
dudeGraph.Renderer.prototype.save = function () {
    return {
        "zoom": {
            "translate": this._zoom.translate || [0, 0],
            "scale": this._zoom.scale || 1
        },
        "blocks": _.map(this._renderBlocks, function (renderBlock) {
            var renderBlockData = {
                "id": renderBlock.nodeId,
                "cgBlock": renderBlock.block.cgId,
                "description": renderBlock.nodeName,
                "position": renderBlock.nodePosition,
                "parent": renderBlock.renderGroupParent ? renderBlock.renderGroupParent.nodeId : null
            };
            var saveRenderPointCustomData = function (renderPoint) {
                if (renderPoint.pointHidden) {
                    var renderPointData = renderBlockData[renderPoint.point.isOutput ? "outputs" : "inputs"] = {};
                    renderPointData[renderPoint.point.cgName] = {"hidden": renderPoint.pointHidden};
                }
            };
            _.forEach(renderBlock.renderPoints, saveRenderPointCustomData);
            return renderBlockData;
        }),
        "groups": _.map(this._renderGroups, function (renderGroup) {
            return {
                "id": renderGroup.nodeId,
                "description": renderGroup.nodeName,
                "position": renderGroup.nodePosition
            };
        }),
        "connections": _.map(this._renderConnections, function (renderConnection, i) {
            return {
                "cgConnectionIndex": i,
                "outputName": renderConnection.outputRenderPoint.point.cgName,
                "outputRendererBlockId": renderConnection.outputRenderPoint.renderBlock.nodeId,
                "inputName": renderConnection.inputRenderPoint.point.cgName,
                "inputRendererBlockId": renderConnection.inputRenderPoint.renderBlock.nodeId
            };
        })
    };
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
    dispatch.of = function (self, args) {
        return function (e1) {
            var e0;
            try {
                e0 = e1.sourceEvent = d3.event;
                e1.target = target;
                d3.event = e1;
                dispatch[e1.type].apply(self, args);
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
 * Prevents d3 event
 */
dudeGraph.preventD3Default = function () {
    dudeGraph.browserIf(["IE"], function () {
        d3.event.sourceEvent.defaultPrevented = true;
    }, function () {
        d3.event.sourceEvent.preventDefault();
    });
};

/**
 * Stop d3 event propagation
 */
dudeGraph.stopD3ImmediatePropagation = function () {
    d3.event.sourceEvent.stopImmediatePropagation();
};
/**
 * Returns the text width and height
 * @param {String|d3.selection} text
 * @return {Array<Number>}
 */
dudeGraph.Renderer.prototype.measureText = function (text) {
    if (text instanceof d3.selection) {
        // Use this for perfect text bounding box
        // var boundingBox = text.node().getBBox();
        // return [boundingBox.width, boundingBox.height];
        text = text.text();
    }
    return [text.length * 8, 17]; // Inconsolata font prediction
};

/**
 * Returns the rect (top left, bottom right) for all the given renderNodes
 * @param {Array<dudeGraph.RenderNode>} renderNodes
 * @param {Boolean} [nullable=false] - Whether to return null or [[0, 0], [0, 0]]
 * @returns {Array<Array<Number>>}
 */
dudeGraph.Renderer.prototype.renderNodesBoundingRect = function (renderNodes, nullable) {
    var topLeft = [Infinity, Infinity];
    var bottomRight = [-Infinity, -Infinity];
    _.forEach(renderNodes, function (renderNode) {
        topLeft[0] = Math.min(topLeft[0], renderNode.nodePosition[0]);
        topLeft[1] = Math.min(topLeft[1], renderNode.nodePosition[1]);
        bottomRight[0] = Math.max(bottomRight[0], renderNode.nodePosition[0] + renderNode.nodeSize[0]);
        bottomRight[1] = Math.max(bottomRight[1], renderNode.nodePosition[1] + renderNode.nodeSize[1]);
    });
    if (topLeft[0] === Infinity || bottomRight[0] === -Infinity) {
        return nullable ? null : [[0, 0], [0, 0]];
    }
    return [topLeft, bottomRight];
};

/**
 * Returns world coordinates from screen coordinates
 * Example: renderer.screenToWorld(d3.mouse(this));
 * @param {Array<Number>} point
 * @return {Array<Number>}
 */
dudeGraph.Renderer.prototype.screenToWorld = function (point) {
    this._svgPoint.x = point[0];
    this._svgPoint.y = point[1];
    var position = this._svgPoint.matrixTransform(this._d3Root.node().getCTM().inverse());
    return [position.x, position.y];
};
// Default blocks / points / renderBlocks
dudeGraph.defaultBlocks = [
    {"block": "Assignation", "type": dudeGraph.Assignation},
    {"block": "Expression", "type": dudeGraph.Expression},
    {"block": "Condition", "type": dudeGraph.Condition},
    {"block": "Delegate", "type": dudeGraph.Delegate},
    {"block": "Each", "type": dudeGraph.Each},
    {"block": "Function", "type": dudeGraph.Function},
    {"block": "Getter", "type": dudeGraph.Getter},
    {"block": "Instruction", "type": dudeGraph.Instruction},
    {"block": "Operator", "type": dudeGraph.Operator},
    {"block": "Range", "type": dudeGraph.Range},
    {"block": "Variable", "type": dudeGraph.Variable}
];
dudeGraph.defaultPoints = [
    {"point": "Choice", "type": dudeGraph.Choice},
    {"point": "Stream", "type": dudeGraph.Stream}
];
dudeGraph.defaultRenderBlocks = [
    {"renderBlock": "Assignation", "type": dudeGraph.RenderBlock},
    {"renderBlock": "Expression", "type": dudeGraph.RenderBlock},
    {"renderBlock": "Condition", "type": dudeGraph.RenderBlock},
    {"renderBlock": "Delegate", "type": dudeGraph.RenderBlock},
    {"renderBlock": "Each", "type": dudeGraph.RenderBlock},
    {"renderBlock": "Function", "type": dudeGraph.RenderBlock},
    {"renderBlock": "Getter", "type": dudeGraph.RenderBlock},
    {"renderBlock": "Instruction", "type": dudeGraph.RenderBlock},
    {"renderBlock": "Operator", "type": dudeGraph.RenderBlock},
    {"renderBlock": "Range", "type": dudeGraph.RenderBlock},
    {"renderBlock": "Variable", "type": dudeGraph.RenderVariable}
];
//# sourceMappingURL=dude-graph.js.map
