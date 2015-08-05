cg.JSONLoader = (function () {

    /**
     * Creates the loader.
     * @extends {pandora.EventEmitter}
     * @constructor
     * @param cgGraph {Object} The graph to load
     * @param data {Object} The graph data
     * @param models {Object} The models used to load the graph
     */
    var JSONLoader = pandora.class_("JSONLoader", pandora.EventEmitter, function (cgGraph, data, models) {
        pandora.EventEmitter.call(this);
        this._cgGraph = cgGraph;
        this._data = data;
        this._models = models;
        this._pointTypes = {};
        this._blockTypes = {};
        this.addBlockType(cg.Block);
        this.addBlockType(cg.Function);
        this.addBlockType(cg.Instruction);
        this.addBlockType(cg.Delegate);
        this.addBlockType(cg.Variable);
        this.addBlockType(cg.Each);
        this.addBlockType(cg.Range);
        this.addBlockType(cg.Condition);
        this.addBlockType(cg.Getter);
        this.addBlockType(cg.Operator);
        this.addPointType(cg.Stream);
        this.addPointType(cg.Point);
    });

    /**
     * Registers the given point type as a possible point that can be found into the graph. All points should inherit
     * from cg.Point.
     * @param pointType
     */
    JSONLoader.prototype.addPointType = function (pointType) {
        var typeName = pandora.typename(pointType.prototype);
        if (this._pointTypes[typeName] !== undefined) {
            throw new cg.GraphSerializationError("Point type `{0}` already added to the loader");
        }
        this._pointTypes[typeName] = function (cgBlock, cgPointData, isOutput) {
            var point = new pointType(cgBlock, cgPointData, isOutput);
            cgBlock.addPoint(point);
            return point;
        };
    };

    /**
     * Registers the given block type as a possible block that can be found into the graph. All blocks should inherit
     * from cg.Block.
     * @param blockType
     */
    JSONLoader.prototype.addBlockType = function (blockType) {
        var typeName = pandora.typename(blockType.prototype);
        if (this._blockTypes[typeName] !== undefined) {
            throw new cg.GraphSerializationError("Block type `{0}` already added to the loader");
        }
        this._blockTypes[typeName] = function (cgGraph, cgBlockData) {
            var block = new blockType(cgGraph, cgBlockData);
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
     * Loads the points of a given block, this method is called automatically be the cg.Block instances to load
     * their points.
     * @param cgBlock {cg.Block}
     * @param cgBlockData {Object}
     * @private
     */
    JSONLoader.prototype.loadPoints = function (cgBlock, cgBlockData) {
        var self = this;
        var loadPoint = function (cgBlock, cgPointData, isOutput) {
            if (!cgPointData.cgName) {
                throw new cg.GraphSerializationError("JSONLoader::_loadPoints() Block `{0}`: Point property `cgName` is required", cgBlock.cgId);
            }
            var cgPointType = cgPointData.cgType || "Point";
            var cgPointDeserializer = self._pointTypes[cgPointType];
            if (!cgPointDeserializer) {
                throw new cg.GraphSerializationError("JSONLoader::_loadPoints() Block `{0}`: Cannot deserialize point `{1}` of type `{2}`", cgBlock.cgId, cgPointData.cgName, cgPointType);
            }
            cgPointDeserializer.call(self, cgBlock, cgPointData, isOutput);
        };
        if (cgBlockData.cgOutputs) {
            pandora.forEach(cgBlockData.cgOutputs, function (output) {
                loadPoint(cgBlock, output, true);
            });
        }
        if (cgBlockData.cgInputs) {
            pandora.forEach(cgBlockData.cgInputs, function (input) {
                loadPoint(cgBlock, input, false);
            });
        }
    };

    JSONLoader.prototype.loadBlock = function (cgBlockData) {
        if (!cgBlockData.hasOwnProperty("cgId")) {
            throw new cg.GraphSerializationError("JSONLoader::_loadBlocks() Block property `cgId` is required");
        }
        if (cgBlockData.cgModel) {
            if (this._models[cgBlockData.cgModel] === undefined) {
                throw new cg.GraphSerializationError("JSONLoader::_loadBlocks() Model `{0}` not found",
                    cgBlockData.cgModel);
            }
            pandora.mergeObjects(cgBlockData, this._models[cgBlockData.cgModel]);
        }
        var cgBlockType = cgBlockData.cgType || "Block";
        var cgBlockDeserializer = this._blockTypes[cgBlockType];
        if (!cgBlockDeserializer) {
            throw new cg.GraphSerializationError("JSONLoader::_loadBlocks() Type `{0}` not added to the loader", cgBlockType);
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
        pandora.forEach(cgBlocksData, this.loadBlock.bind(this));
    };

    /**
     *
     * @param cgGraph {cg.Graph}
     * @param cgConnectionsData {Array<{cgOutputBlockId: String, cgOutputName: String, cgInputBlockId: String, cgInputName: String,}>}
     * @private
     */
    JSONLoader.prototype._loadConnections = function (cgGraph, cgConnectionsData) {
        pandora.forEach(cgConnectionsData, function (cgConnectionData) {
            var cgOutputBlockId = cgConnectionData.cgOutputBlockId;
            var cgOutputName = cgConnectionData.cgOutputName;
            var cgInputBlockId = cgConnectionData.cgInputBlockId;
            var cgInputName = cgConnectionData.cgInputName;
            var cgOutputBlock = cgGraph.blockById(cgOutputBlockId);
            if (!cgOutputBlock) {
                throw new cg.GraphSerializationError("JSONLoader::_loadConnections() Output block not found for id `{0}`", cgOutputBlockId);
            }
            var cgInputBlock = cgGraph.blockById(cgInputBlockId);
            if (!cgInputBlock) {
                throw new cg.GraphSerializationError("JSONLoader::_loadConnections() Input block not found for id `{0}`", cgInputBlockId);
            }
            var cgOutputPoint = cgOutputBlock.outputByName(cgOutputName);
            if (!cgOutputPoint) {
                throw new cg.GraphSerializationError("JSONLoader::_loadConnections() Output point `{0}` not found in block `{1}`", cgOutputName, cgOutputBlockId);
            }
            var cgInputPoint = cgInputBlock.inputByName(cgInputName);
            if (!cgInputPoint) {
                throw new cg.GraphSerializationError("JSONLoader::_loadConnections() Input point `{0}` not found in block `{1}`", cgInputName, cgInputBlockId);
            }
            cgOutputPoint.connect(cgInputPoint);
        });
    };

    return JSONLoader;

})();