/**
 * The graph that contains and manages the blocks and the connections
 * @class
 * @extends {EventEmitter}
 */
dudeGraph.Graph = function () {
    /**
     * Map the types to their validators
     * @type {Object<String, Function>}
     * @private
     */
    this._graphTypes = {
        "Array": _.isArray,
        "Object": _.isObject,
        "Number": _.isNumber,
        "String": _.isString,
        "Boolean": _.isBoolean
    };
    Object.defineProperty(this, "graphTypes", {
        get: function () {
            return this._graphTypes;
        }.bind(this)
    });

    /**
     * The blocks in the graph
     * @type {Array<dudeGraph.Block>}
     * @private
     */
    this._graphBlocks = [];
    Object.defineProperty(this, "graphBlocks", {
        get: function () {
            return this._graphBlocks;
        }.bind(this)
    });

    /**
     * Maps the blocks ids to their blocks
     * @type {Object<String, dudeGraph.Block>}
     * @private
     */
    this._graphBlocksIds = {};
    Object.defineProperty(this, "graphBlocksIds", {
        get: function () {
            return this._graphBlocksIds;
        }.bind(this)
    });

    /**
     * The connections in the graph
     * @type {Array<dudeGraph.Connection>}
     * @private
     */
    this._graphConnections = [];
    Object.defineProperty(this, "graphConnections", {
        get: function () {
            return this._graphConnections;
        }.bind(this)
    });
};

dudeGraph.Graph.prototype = _.create(EventEmitter.prototype, {
    "constructor": dudeGraph.Graph,
    "className": "Graph"
});

/**
 * Adds the type to the graph
 * @param {String} type
 * @param {String} validator
 */
dudeGraph.Graph.prototype.addType = function (type, validator) {};
/**
 * Removes the type from the graph
 * @param {String} type
 */
dudeGraph.Graph.prototype.removeType = function (type) {};
/**
 * Returns whether the graph handles the given type
 * @param {String} type
 * @returns {Boolean}
 */
dudeGraph.Graph.prototype.hasType = function (type) {
    return !_.isUndefined(this._graphTypes[type]);
};
/**
 * Returns true if the given value is of the given type
 * @param {Object|null} valueType
 * @param {Object} value
 * @returns {Boolean}
 */
dudeGraph.Graph.prototype.canAssign = function (valueType, value) {
    if (valueType === null) {
        return false;
    }
    if (value === null) {
        return true;
    }
    var validator = this._graphTypes[valueType];
    if (_.isUndefined(validator)) {
        throw new Error("Cannot find suitable validator to validate `" + value + "` for type `" + valueType + "`");
    }
    return validator(value);
};

/**
 * Adds a block to the graph
 * @param {dudeGraph.Block} block
 */
dudeGraph.Graph.prototype.addBlock = function (block) {
    if (block.blockGraph !== null) {
        throw new Error("`" + block.blockFancyName + "` is already in a graph");
    }
    if (block.blockId !== null && !_.isUndefined(this._graphBlocksIds[block.blockId])) {
        throw new Error("Cannot add `" + block.blockFancyName + "`: duplicate id `" + block.blockId + "`");
    }
    block.blockGraph = this;
    if (block.blockId === null) {
        block.blockId = dudeGraph.uuid();
    }
    this._graphBlocks.push(block);
    this._graphBlocksIds[block.blockId] = block;
    this.emit("block-add", block);
};
/**
 * Removes the given block from the graph
 * @param {dudeGraph.Block} block
 */
dudeGraph.Graph.prototype.removeBlock = function (block) {};
/**
 * Clones the blocks and the connections
 * @param {Array<dudeGraph.Block>} blocks
 */
dudeGraph.Graph.prototype.cloneBlocks = function (blocks) {};

/**
 * Returns the block found by the given blockId or null
 * @param {String} blockId
 * @returns {dudeGraph.Block|null}
 */
dudeGraph.Graph.prototype.blockById = function (blockId) {
    return this._graphBlocksIds[blockId] || null;
};
/**
 * Returns the blocks having the given name
 * @param {String} blockName
 * @returns {Array<dudeGraph.Block>}
 */
dudeGraph.Graph.prototype.blocksByName = function (blockName) {};
/**
 * Returns the blocks having the given type
 * @param {String} blockType
 * @returns {Array<dudeGraph.Block>}
 */
dudeGraph.Graph.prototype.blocksByType = function (blockType) {};

/**
 * Connects the given outputPoint to the given inputPoint
 * This method should never be called directly, prefer point.connect or block.connectTo
 * @param {dudeGraph.Point} outputPoint
 * @param {dudeGraph.Point} inputPoint
 * @returns {dudeGraph.Connection}
 */
dudeGraph.Graph.prototype.connectPoints = function (outputPoint, inputPoint) {
    if (outputPoint === inputPoint) {
        throw new Error("`Cannot connect `" + outputPoint.pointFancyName + "` to itself");
    }
    if (!outputPoint.pointOutput) {
        throw new Error("`" + outputPoint.pointFancyName + "` is not an output");
    }
    if (inputPoint.pointOutput) {
        throw new Error("`" + outputPoint.pointFancyName + "` is not an input");
    }
    if (!outputPoint.acceptConnect(inputPoint)) {
        throw new Error("`" + outputPoint.pointFancyName + "` cannot accept to connect to `" + inputPoint.pointFancyName + "`");
    }
    if (!inputPoint.acceptConnect(outputPoint)) {
        throw new Error("`" + inputPoint.pointFancyName + "` cannot accept to connect to `" + outputPoint.pointFancyName + "`");
    }
    if (outputPoint.pointValueType !== inputPoint.pointValueType) {
        throw new Error("Cannot connect `" + outputPoint.pointFancyName + "` to `" + inputPoint.pointFancyName +
            "`: Types `" + outputPoint.pointValueType + "` and `" + inputPoint.pointValueType + "` are incompatible");
    }
    _.forEach(this._graphConnections, function (connection) {
        if (connection.connectionOutputPoint === outputPoint && connection.connectionInputPoint === inputPoint) {
            throw new Error("`" + connection.connectionFancyName + "` already exists");
        }
    });
    var connection = new dudeGraph.Connection(outputPoint, inputPoint);
    outputPoint.addConnection(connection);
    try {
        inputPoint.addConnection(connection);
    } catch (e) {
        outputPoint.removeConnection(connection);
        throw e;
    }
    this._graphConnections.push(connection);
    this.emit("connection-add", connection);
};
/**
 * Disconnects the given outputPoint from the given inputPoint
 * This method should never be called directly, prefer point.disconnect or block.disconnectFrom
 * @param {dudeGraph.Point} outputPoint
 * @param {dudeGraph.Point} inputPoint
 */
dudeGraph.Graph.prototype.disconnectPoints = function (outputPoint, inputPoint) {
    var connectionFound = _.find(this._graphConnections, function (connection) {
        return connection.connectionOutputPoint === outputPoint && connection.connectionInputPoint === inputPoint;
    }) || null;
    if (connectionFound === null) {
        throw new Error("Cannot find a connection between `" + outputPoint.pointFancyName + "` and `" + inputPoint.pointFancyName + "`");
    }
    outputPoint.removeConnection(connectionFound);
    inputPoint.removeConnection(connectionFound);
    _.pull(this._graphConnections, connectionFound);
    this.emit("connection-remove", connectionFound);
};