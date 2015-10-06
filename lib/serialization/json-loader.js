dudeGraph.JSONLoader = (function () {

    /**
     * Creates the loader.
     * @extends {pandora.EventEmitter}
     * @constructor
     * @param cgGraph {Object} The graph to load
     * @param {Object} data The graph data
     * @param models {Object} The models used to load the graph
     */
    var JSONLoader = pandora.class_("JSONLoader", pandora.EventEmitter, function (cgGraph, data, models) {
        pandora.EventEmitter.call(this);
        this._cgGraph = cgGraph;
        this._data = data;
        this._blocksTree = models;
        this._pointTypes = {};
        this._blockTypes = {};
        this.addPointType(dudeGraph.Stream);
        this.addPointType(dudeGraph.Point);
    });

    /**
     * Registers the given point type as a possible point that can be found into the graph. All points should inherit
     * from dudeGraph.Point.
     * @param pointType
     */
    JSONLoader.prototype.addPointType = function (pointType) {
        var typeName = pandora.typename(pointType.prototype);
        if (this._pointTypes[typeName] !== undefined) {
            throw new Error("Point type `" + typeName + "` already added to the loader");
        }
        this._pointTypes[typeName] = function (cgBlock, cgPointData, isOutput) {
            var point = new pointType(cgBlock, cgPointData, isOutput);
            cgBlock.addPoint(point);
            return point;
        };
    };

    /**
     * Registers the given block type as a possible block that can be found into the graph. All blocks should inherit
     * from dudeGraph.Block.
     * @param blockType
     */
    JSONLoader.prototype.addBlockType = function (blockType) {
        var typeName = pandora.typename(blockType.prototype);
        if (this._blockTypes[typeName] !== undefined) {
            throw new Error("Block type `" + typeName + "` already added to the loader");
        }
        this._blockTypes[typeName] = function (cgGraph, cgBlockData) {
            var block = new blockType.buildBlock(cgGraph, cgBlockData);
            cgGraph.addBlock(block);
            return block;
        };
    };

    /**
     * Loads the graph from the given json data.
     */
    JSONLoader.prototype.load = function () {
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
    JSONLoader.prototype.loadPoints = function (cgBlock, cgBlockData) {
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
    JSONLoader.prototype.loadBlock = function (cgBlockData) {
        if (!cgBlockData.hasOwnProperty("cgId")) {
            throw new Error("Block property `cgId` is required");
        }
        if (cgBlockData.cgModel) {
            if (this._blocksTree[cgBlockData.cgModel] === undefined) {
                throw new Error("JSONLoader::Model `" + cgBlockData.cgModel + "` not found");
            }
            pandora.mergeObjects(cgBlockData, this._blocksTree[cgBlockData.cgModel]);
        }
        var cgBlockType = cgBlockData.cgType || "Block";
        var cgBlockDeserializer = this._blockTypes[cgBlockType];
        if (!cgBlockDeserializer) {
            throw new Error("Type `" + cgBlockType + "` not added to the loader");
        }
        cgBlockDeserializer.call(this, this._cgGraph, cgBlockData);
    };

    /**
     *
     * @param cgGraph
     * @param cgBlocksData {Array<Object>}
     * @private
     */
    JSONLoader.prototype._loadBlocks = function (cgGraph, cgBlocksData) {
        _.forEach(cgBlocksData, this.loadBlock.bind(this));
    };

    /**
     *
     * @param {dudeGraph.Graph} cgGraph
     * @param cgConnectionsData {Array<{cgOutputBlockId: String, cgOutputName: String, cgInputBlockId: String, cgInputName: String,}>}
     * @private
     */
    JSONLoader.prototype._loadConnections = function (cgGraph, cgConnectionsData) {
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

    return JSONLoader;

})();