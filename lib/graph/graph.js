/**
 * The graph that contains and manages the blocks and the connections
 * @class
 * @extends {EventEmitter}
 */
dudeGraph.Graph = function () {
    /**
     * Map the types to their validators
     * @type {Object<String, {converter: dudeGraph.Graph.convertTypeCallback, compatible: Array<String>}>}
     * @private
     */
    this._graphTypes = this._graphTypes = {
        "Number": {
            "convert": function (value) {
                if (_.isNumber(value)) {
                    return value;
                }
                if (/^[0-9]+(\.[0-9]+)?$/.test(value)) {
                    return _.toNumber(value);
                }
                if (value === "true" || value === true) {
                    return 1;
                }
                if (value === "false" || value === false) {
                    return 0;
                }
                return undefined;
            },
            "compatible": ["Boolean"]
        },
        "String": {
            "convert": function (value) {
                if (_.isString(value)) {
                    return value;
                }
                if (_.isNumber(value) || _.isBoolean(value)) {
                    return _.toString(value);
                }
                return undefined;
            },
            "compatible": ["Number", "Boolean"]
        },
        "Boolean": {
            "convert": function (value) {
                if (_.isBoolean(value)) {
                    return value;
                }
                if (value === 1 || value === "true") {
                    return true;
                }
                if (value === 0 || value === "false") {
                    return false;
                }
                return undefined;
            },
            "compatible": ["Number"]
        },
        "Array": {
            "convert": function (value) {
                if (_.isArray(value)) {
                    return value;
                }
                return undefined;
            },
            "compatible": []
        },
        "Object": {
            "convert": function (value) {
                if (_.isObject(value)) {
                    return value;
                }
                return undefined;
            },
            "compatible": []
        },
        "Stream": {
            "convert": function () {
                return undefined;
            },
            "compatible": []
        }
    };

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

    /**
     * The graph fancy name
     * @type {String}
     */
    Object.defineProperty(this, "graphFancyName", {
        get: function () {
            return "Graph";
        }
    });
};

dudeGraph.Graph.prototype = _.create(EventEmitter.prototype, {
    "constructor": dudeGraph.Graph,
    "className": "Graph"
});

/**
 * Adds the type to the graph
 * @param {String} type
 * @param {Object} typeInfo
 * @param {dudeGraph.Graph.convertTypeCallback} [typeInfo.convert=_.noop]
 * @param {Array<String>} [typeInfo.compatible=[]]
 */
dudeGraph.Graph.prototype.addType = function (type, typeInfo) {
    if (!_.isUndefined(this._graphTypes[type])) {
        throw new Error("`" + this.graphFancyName + "` cannot redefine value type`" + type + "`");
    }
    this._graphTypes[type] = {
        "convert": typeInfo.convert || _.noop,
        "compatible": typeInfo.compatible || []
    };
};
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
 * Converts the given value to the given type if possible or returns undefined
 * @param {String} valueType
 * @param {Object|null} value
 * @returns {*|undefined}
 */
dudeGraph.Graph.prototype.convertValue = function (valueType, value) {
    if (value === null) {
        return null;
    }
    var typeInfo = this._graphTypes[valueType];
    if (_.isUndefined(typeInfo)) {
        throw new Error("`" + this.graphFancyName + "` has no value type `" + valueType + "`");
    }
    if (_.isUndefined(typeInfo.convert)) {
        throw this._graphTypes;
    }
    return typeInfo.convert(value);
};
/**
 * Returns whether the connection can be converted from inputValueType to outputValueType
 * @param {String} outputValueType
 * @param {String} inputValueType
 * @returns {Boolean}
 */
dudeGraph.Graph.prototype.convertConnection = function (outputValueType, inputValueType) {
    var typeInfo = this._graphTypes[outputValueType];
    if (_.isUndefined(typeInfo)) {
        throw new Error("`" + this.graphFancyName + "` cannot find compatible type to convert connection from `" +
            outputValueType + "` to `" + inputValueType + "`");
    }
    return outputValueType === inputValueType || _.includes(typeInfo.compatible, inputValueType);
};

/**
 * Adds a block to the graph
 * @param {dudeGraph.Block} block
 */
dudeGraph.Graph.prototype.addBlock = function (block) {
    if (block.blockGraph !== null) {
        throw new Error("`" + block.blockFancyName + "` cannot redefined `blockGraph`");
    }
    if (block.blockId !== null && !_.isUndefined(this._graphBlocksIds[block.blockId])) {
        throw new Error("`" + this.graphFancyName + "` cannot redefine id `" + block.blockId + "`");
    }
    block.blockGraph = this;
    if (block.blockId === null) {
        block.blockId = dudeGraph.uuid();
    }
    block.validate();
    this._graphBlocks.push(block);
    this._graphBlocksIds[block.blockId] = block;
    this.emit("block-add", block);
};
/**
 * Removes the given block from the graph
 * @param {dudeGraph.Block} block
 */
dudeGraph.Graph.prototype.removeBlock = function (block) {
    if (block.blockGraph !== this || !_.includes(this._graphBlocks, block)) {
        throw new Error("`" + this.graphFancyName + "` has no block `" + block.blockFancyName + "`");
    }
    block.removeAllPoints();
    _.pull(this._graphBlocks, block);
    delete this._graphBlocksIds[block.blockId];
    this.emit("block-remove", block);
};
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
        throw new Error("`" + this.graphFancyName + "` cannot connect `" + outputPoint.pointFancyName + "` to itself");
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
    if (!this.convertConnection(outputPoint.pointValueType, inputPoint.pointValueType)) {
        if (outputPoint.pointTemplate !== null || inputPoint.pointTemplate !== null) {
            try {
                outputPoint.pointBlock.updateTemplate(outputPoint.pointTemplate, inputPoint.pointValueType);
            } catch (ex) {
                if (inputPoint.pointTemplate !== null) {
                    inputPoint.pointBlock.updateTemplate(inputPoint.pointTemplate, outputPoint.pointValueType);
                }
            }
        } else {
            throw new Error("`" + this.graphFancyName + "` cannot connect `" +
                outputPoint.pointFancyName + "` to `" + inputPoint.pointFancyName + "` because types `" +
                outputPoint.pointValueType + "` and `" + inputPoint.pointValueType + "` are incompatible");
        }
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
    return connection;
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
        throw new Error("`" + this.graphFancyName + "` cannot find a connection between `" +
            outputPoint.pointFancyName + "` and `" + inputPoint.pointFancyName + "`");
    }
    outputPoint.removeConnection(connectionFound);
    inputPoint.removeConnection(connectionFound);
    _.pull(this._graphConnections, connectionFound);
    this.emit("connection-remove", connectionFound);
};

/**
 * Callback to convert the given value to valueType, or undefined on conversion failure
 * @callback dudeGraph.Graph.convertTypeCallback
 * @param {Object|null} value
 * @returns {Object|undefined}
 */