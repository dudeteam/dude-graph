//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Creates the loader.
 * @extends {pandora.EventEmitter}
 * @constructor
 * @param cgGraph {Object} The graph to load
 * @param {Object} data The graph data
 * @param models {Object} The models used to load the graph
 */
dudeGraph.JSONLoader = function (cgGraph, data, models) {
    pandora.EventEmitter.call(this);
    this._cgGraph = cgGraph;
    this._data = data;
    this._blocksTree = models;
    this._pointTypes = {};
    this._blockTypes = {};
    this.addPointType("Stream", dudeGraph.Stream);
    this.addPointType("Point", dudeGraph.Point);
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.JSONLoader.prototype = _.create(pandora.EventEmitter.prototype, {
    "constructor": dudeGraph.JSONLoader
});

/**
 * Registers the given point type as a possible point that can be found into the graph. All points should inherit
 * from dudeGraph.Point.
 * @param pointType {String}
 * @param pointClass {dudeGraph.Point}
 */
dudeGraph.JSONLoader.prototype.addPointType = function (pointType, pointClass) {
    if (this._pointTypes[pointType] !== undefined) {
        throw new Error("Point type `" + pointType + "` already added to the loader");
    }
    this._pointTypes[pointType] = function (cgBlock, cgPointData, isOutput) {
        var point = new pointClass(cgBlock, cgPointData, isOutput);
        cgBlock.addPoint(point);
        return point;
    };
};

/**
 * Registers the given block type as a possible block that can be found into the graph. All blocks should inherit
 * from dudeGraph.Block.
 * @param blockType {String}
 * @param blockClass {dudeGraph.Block}
 */
dudeGraph.JSONLoader.prototype.addBlockType = function (blockType, blockClass) {
    if (this._blockTypes[blockType] !== undefined) {
        throw new Error("Block type `" + blockType + "` already added to the loader");
    }
    this._blockTypes[blockType] = function (cgGraph, cgBlockData) {
        var block = new blockClass(cgGraph, cgBlockData);
        cgGraph.addBlock(block);
        return block;
    };
};

/**
 * Loads the graph from the given json data.
 */
dudeGraph.JSONLoader.prototype.load = function () {
    this._loadBlocks(this._cgGraph, this._data.blocks);
    if (this._data.connections) {
        this._loadConnections(this._cgGraph, this._data.connections);
    }
};

/**
 * Loads the points of a given block, this method is called automatically be the dudeGraph.Block instances to load
 * their points.
 * @param {dudeGraph.Block} cgBlock
 * @param cgBlockData {Object}
 * @private
 */
dudeGraph.JSONLoader.prototype.loadPoints = function (cgBlock, cgBlockData) {
    var self = this;
    var loadPoint = function (cgBlock, cgPointData, isOutput) {
        if (!cgPointData.cgName) {
            throw new Error("Block `" + cgBlock.cgId + "`: Point property `cgName` is required");
        }
        var cgPointType = cgPointData.cgType || "Point";
        var cgPointDeserializer = self._pointTypes[cgPointType];
        if (!cgPointDeserializer) {
            throw new Error("Block `" + cgBlock.cgId + "`: Cannot deserialize point `" + cgPointData.cgName +
                "` of type `" + cgPointType + "`");
        }
        cgPointDeserializer.call(self, cgBlock, cgPointData, isOutput);
    };
    if (cgBlockData.cgOutputs) {
        _.forEach(cgBlockData.cgOutputs, function (output) {
            loadPoint(cgBlock, output, true);
        });
    }
    if (cgBlockData.cgInputs) {
        _.forEach(cgBlockData.cgInputs, function (input) {
            loadPoint(cgBlock, input, false);
        });
    }
};

/**
 *
 * @param cgBlockData
 */
dudeGraph.JSONLoader.prototype.loadBlock = function (cgBlockData) {
    if (!cgBlockData.hasOwnProperty("cgId")) {
        throw new Error("Block property `cgId` is required");
    }
    var blockConstructor = this._blockTypes[cgBlockData.cgType || "Block"];
    if (!blockConstructor) {
        throw new cg.GraphSerializationError("JSONLoader::_loadBlocks() Type `{0}` not added to the loader", cgBlockType);
    }
    blockConstructor.call(this, this._cgGraph, cgBlockData);
};

/**
 *
 * @param cgGraph
 * @param cgBlocksData {Array<Object>}
 * @private
 */
dudeGraph.JSONLoader.prototype._loadBlocks = function (cgGraph, cgBlocksData) {
    _.forEach(cgBlocksData, this.loadBlock.bind(this));
};

/**
 *
 * @param {dudeGraph.Graph} cgGraph
 * @param cgConnectionsData {Array<{cgOutputBlockId: String, cgOutputName: String, cgInputBlockId: String, cgInputName: String,}>}
 * @private
 */
dudeGraph.JSONLoader.prototype._loadConnections = function (cgGraph, cgConnectionsData) {
    _.forEach(cgConnectionsData, function (cgConnectionData) {
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
    });
};
