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
 * Loads a graph from a json
 * @param {dudeGraph.Graph} graph - The graph to load
 * @param {Object} graphData - The graph data
 * @param {Array<Object>} graphData.blocks - The graph blocks
 * @param {Array<Object>} graphData.connections - The graph connections
 */
dudeGraph.GraphLoader.prototype.load = function (graph, graphData) {
    var loader = this;
    _.forEach(graphData.blocks, function (cgBlockData) {
        loader.loadBlock(graph, cgBlockData);
    });
    _.forEach(graphData.connections, function (cgConnectionData) {
        loader.loadConnection(graph, cgConnectionData);
    });
};

/**
 * @param {dudeGraph.Graph} graph - The graph to load the block to
 * @param {Object} cgBlockData - The block data
 * @returns {dudeGraph.Block}
 */
dudeGraph.GraphLoader.prototype.loadBlock = function (graph, cgBlockData) {
    var loader = this;
    if (!cgBlockData.hasOwnProperty("cgId")) {
        throw new Error("Block property `cgId` is required");
    }
    var blockConstructor = this._blockTypes[cgBlockData.cgType];
    if (_.isUndefined(blockConstructor)) {
        throw new Error("Block type `" + cgBlockData.cgType + "` not registered by the loader");
    }
    var cgBlock = new blockConstructor(graph, cgBlockData, cgBlockData.cgType);
    _.forEach(cgBlockData.cgOutputs, function (cgOutputData) {
        loader.loadPoint(cgBlock, cgOutputData, true);
    });
    _.forEach(cgBlockData.cgInputs, function (cgInputData) {
        loader.loadPoint(cgBlock, cgInputData, false);
    });
    graph.addBlock(cgBlock);
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
 * @param {dudeGraph.Graph} graph
 * @param {Object} cgConnectionData
 * @private
 */
dudeGraph.GraphLoader.prototype.loadConnection = function (graph, cgConnectionData) {
    var cgOutputBlockId = cgConnectionData.cgOutputBlockId;
    var cgOutputName = cgConnectionData.cgOutputName;
    var cgInputBlockId = cgConnectionData.cgInputBlockId;
    var cgInputName = cgConnectionData.cgInputName;
    var cgOutputBlock = graph.blockById(cgOutputBlockId);
    if (!cgOutputBlock) {
        throw new Error("Output block not found for id `" + cgOutputBlockId + "`");
    }
    var cgInputBlock = graph.blockById(cgInputBlockId);
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