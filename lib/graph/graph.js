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
 *
 * @param {String} type
 * @param {String} validator
 */
dudeGraph.Graph.prototype.addType = function (type, validator) {};
/**
 *
 * @param {String} type
 */
dudeGraph.Graph.prototype.removeType = function (type) {};
/**
 *
 * @param {Object|null} valueType
 * @param {String} value
 */
dudeGraph.Graph.prototype.canAssign = function (valueType, value) {};

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
    block.validate();
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
 *
 * @param {String} blockName
 */
dudeGraph.Graph.prototype.blocksByName = function (blockName) {};
/**
 *
 * @param {String} blockType
 */
dudeGraph.Graph.prototype.blocksByType = function (blockType) {};

/**
 *
 * @param {dudeGraph.Point} outputPoint
 * @param {dudeGraph.Point} inputPoint
 */
dudeGraph.Graph.prototype.connectPoints = function (outputPoint, inputPoint) {};
/**
 *
 * @param {dudeGraph.Point} outputPoint
 * @param {dudeGraph.Point} inputPoint
 */
dudeGraph.Graph.prototype.disconnectPoints = function (outputPoint, inputPoint) {};