//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Represents the graph whom holds the entities
 * @extends {pandora.EventEmitter}
 * @constructor
 */
dudeGraph.Graph = function (data, models) {
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
        "Entity": ["Entity"]
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
 * Add a validator predicate for the given `type`
 * @param {String} type - The type on which this validator will be applied
 * @param {Function} fn - A function which takes a value in parameter and returns true if it can be assigned
 */
dudeGraph.Graph.prototype.addValidator = function (type, fn) {
    this._validators[type] = fn;
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
 * Tries to update the blocks types from templates parameters to match the `point` type with the given `type`.
 * @param point - The point on which the connection will be created
 * @param type - The type of the connection that we try to attach
 * @returns {boolean}
 */
dudeGraph.Graph.prototype.updateTemplate = function (point, type) {
    return point.cgBlock.updateTemplate(point, type);
};

/**
 * Adds a block to the graph
 * @param {dudeGraph.Block} cgBlock - cgBlock to add to the graph
 * @param {Boolean} quiet - Whether the event should be emitted
 * @emit "cg-block-create" {dudeGraph.Block}
 * @return {dudeGraph.Block}
 */
dudeGraph.Graph.prototype.addBlock = function (cgBlock, quiet) {
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
    this.emit("cg-block-remove", cgBlock);
};

/**
 * Creates a connection between two cgPoints
 * @param {dudeGraph.Point} cgOutputPoint
 * @param {dudeGraph.Point} cgInputPoint
 * @emit "cg-connection-create" {dudeGraph.Connection}
 * @returns {dudeGraph.Connection|null}
 */
dudeGraph.Graph.prototype._connectPoints = function (cgOutputPoint, cgInputPoint) {
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
dudeGraph.Graph.prototype._disconnectPoints = function (cgOutputPoint, cgInputPoint) {
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
dudeGraph.Graph.prototype.disconnectPoint = function (cgPoint) {
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
    return dudeGraph.UUID.generate();
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
    return pandora.findIf(this._cgConnections, function (cgConnection) {
        return cgConnection.cgOutputPoint === cgOutputPoint && cgConnection.cgInputPoint === cgInputPoint;
    });
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
