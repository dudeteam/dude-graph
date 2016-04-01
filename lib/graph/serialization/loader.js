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
 * Loads a graph from a json
 * @param {dudeGraph.Graph} graph - The graph to load
 * @param {Object} graphData - The graph data
 * @param {Array<Object>} graphData.blocks - The graph blocks
 * @param {Array<Object>} graphData.connections - The graph connections
 * @param {Array<Object>} graphData.variables - The graph variables
 */
dudeGraph.GraphLoader.prototype.load = function (graph, graphData) {
    var loader = this;
    _.forEach(graphData.blocks, function (blockData) {
        loader.loadBlock(graph, blockData);
    });
    _.forEach(graphData.connections, function (connectionData) {
        loader.loadConnection(graph, connectionData);
    });
    _.forEach(graphData.variables, function (variableData) {
        loader.loadVariable(graph, variableData);
    });
};

/**
 * @param {dudeGraph.Graph} graph - The graph to load the block to
 * @param {Object} blockData - The block data
 * @returns {dudeGraph.Block}
 */
dudeGraph.GraphLoader.prototype.loadBlock = function (graph, blockData) {
    var loader = this;
    if (!blockData.hasOwnProperty("blockId")) {
        throw new Error("Block property `blockId` is required");
    }
    var blockConstructor = this._blockTypes[blockData.blockType];
    if (_.isUndefined(blockConstructor)) {
        throw new Error("Block type `" + blockData.blockType + "` not registered by the loader");
    }
    var block = new blockConstructor(blockData);
    graph.addBlock(block);
    _.forEach(blockData.blockOutputs, function (outputData) {
        loader.loadPoint(block, true, outputData);
    });
    _.forEach(blockData.blockInputs, function (inputData) {
        loader.loadPoint(block, false, inputData);
    });
    block.validatePoints();
    return block;
};

/**
 * @param {dudeGraph.Block} block - The block to load the point to
 * @param {Boolean} isOutput - Whether the point is an output or an input
 * @param {Object} pointData - The point data
 * @returns {dudeGraph.Point}
 */
dudeGraph.GraphLoader.prototype.loadPoint = function (block, isOutput, pointData) {
    if (!pointData.pointName) {
        throw new Error("Block `" + block.blockId + "`: Point property `pointName` is required");
    }
    var pointType = pointData.pointType;
    var pointConstructor = this._pointTypes[pointType];
    if (!pointConstructor) {
        throw new Error("Point type `" + pointType + "` not registered by the loader");
    }
    var point = new pointConstructor(isOutput, pointData);
    block.addPoint(point);
    return point;
};

/**
 * @param {dudeGraph.Graph} graph
 * @param {Object} connectionData
 * @private
 */
dudeGraph.GraphLoader.prototype.loadConnection = function (graph, connectionData) {
    var outputBlockId = connectionData.connectionOutputBlock;
    var outputName = connectionData.connectionOutputPoint;
    var inputBlockId = connectionData.connectionInputBlock;
    var inputName = connectionData.connectionInputPoint;
    var outputBlock = graph.blockById(outputBlockId);
    if (!outputBlock) {
        throw new Error("Output block not found for id `" + outputBlockId + "`");
    }
    var inputBlock = graph.blockById(inputBlockId);
    if (!inputBlock) {
        throw new Error("Input block not found for id `" + inputBlockId + "`");
    }
    var outputPoint = outputBlock.outputByName(outputName);
    if (!outputPoint) {
        throw new Error("Output point `" + outputName + "` not found in block `" + outputBlockId + "`");
    }
    var inputPoint = inputBlock.inputByName(inputName);
    if (!inputPoint) {
        throw new Error("Input point `" + inputName + "` not found in block `" + inputBlockId + "`");
    }
    outputPoint.connect(inputPoint);
};

/**
 * @param {dudeGraph.Graph} graph
 * @param {Object} variableData
 * @private
 */
dudeGraph.GraphLoader.prototype.loadVariable = function (graph, variableData) {
    graph.addVariable(new dudeGraph.Variable({
        "variableName": variableData.variableName,
        "variableValueType": variableData.variableValueType,
        "variableValue": variableData.variableValue,
        "variableBlock": graph.blockById(variableData.variableBlock)
    }));
};