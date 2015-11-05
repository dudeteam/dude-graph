//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Dude-graph default loader
 * @constructor
 */
dudeGraph.Loader = function () {
    this._blockTypes = {
        "Block": dudeGraph.Block
    };
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
    if (typeof blockConstructor === "undefined") {
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