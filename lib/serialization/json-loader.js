cg.JSONLoader = (function () {

    /**
     *
     * @extends {pandora.EventEmitter}
     * @constructor
     */
    var JSONLoader = pandora.class_("JSONLoader", pandora.EventEmitter, function () {
        pandora.EventEmitter.call(this);
    });

    /**
     *
     * @param cgGraph {cg.Graph}
     * @param cgBlocksData {Array<{cgType: "Function", cgId: "32", cgInputs: *Object, cgOutputs: *Object}>}
     * @param cgConnectionsData {Array<{cgOutputBlockId: String, cgOutputName: String, cgInputBlockId: String, cgInputName: String,}>}
     */
    JSONLoader.prototype.load = function (cgGraph, cgBlocksData, cgConnectionsData) {
        this._loadBlocks(cgGraph, cgBlocksData);
        this._loadPoints(cgGraph, cgBlocksData);
        if (cgConnectionsData) {
            this._loadConnections(cgGraph, cgConnectionsData);
        }
    };

    /**
     *
     * @param cgGraph {cg.Graph}
     * @param cgBlocksData {Array<{cgType: "Function", cgId: "32"}>}
     * @private
     */
    JSONLoader.prototype._loadBlocks = function (cgGraph, cgBlocksData) {
        var self = this;
        pandora.forEach(cgBlocksData, function (cgBlockData) {
            if (!cgBlockData.hasOwnProperty("cgId")) {
                throw new cg.GraphSerializationError("JSONLoader::_loadBlocks() Block property `cgId` is required");
            }
            var cgBlockType = cgBlockData.cgType || "Block";
            var cgBlockDeserializer = self[pandora.camelcase("_loadBlock" + cgBlockType)];
            if (!cgBlockDeserializer) {
                throw new cg.GraphSerializationError("JSONLoader::_loadBlocks() Block `{0}`: Cannot deserialize block of type `{1}`", cgBlockData.cgId, cgBlockType);
            }
            cgBlockDeserializer(cgGraph, cgBlockData);
        });
    };

    /**
     *
     * @param cgGraph {cg.Graph}
     * @param cgBlockData {{cgId: "32", cgType: "Block|undefined"}}
     * @returns {cg.Block}
     * @private
     */
    JSONLoader.prototype._loadBlockBlock = function(cgGraph, cgBlockData) {
        var cgBlock = new cg.Block(cgGraph, cgBlockData.cgId);
        cgGraph.addBlock(cgBlock);
        return cgBlock;
    };

    /**
     *
     * @param cgGraph {cg.Graph}
     * @param cgBlocksData {Array<{cgId: "32", cgInputs: *Object, cgOutputs: *Object}>}
     * @private
     */
    JSONLoader.prototype._loadPoints = function (cgGraph, cgBlocksData) {
        var self = this;
        var loadPoint = function(cgBlock, cgPointData, isOutput) {
            if (!cgPointData.cgName) {
                throw new cg.GraphSerializationError("JSONLoader::_loadPoints() Block `{0}`: Point property `cgName` is required", cgBlock.cgId);
            }
            var cgPointType = cgPointData.cgType || "Point";
            var cgPointDeserializer = self[pandora.camelcase("_loadPoint" + cgPointType)];
            if (!cgPointDeserializer) {
                throw new cg.GraphSerializationError("JSONLoader::_loadPoints() Block `{0}`: Cannot deserialize point `{1}` of type `{2}`", cgBlock.cgId, cgPointData.cgName, cgPointType);
            }
            cgPointDeserializer(cgBlock, cgPointData, isOutput);
        };
        pandora.forEach(cgBlocksData, function (cgBlockData) {
            var cgBlock = cgGraph.blockById(cgBlockData.cgId);
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
        });
    };

    /**
     *
     * @param cgBlock {cg.Block}
     * @param cgPointData {Object}
     * @param isOutput {Boolean}
     * @returns {cg.Point}
     * @private
     */
    JSONLoader.prototype._loadPointPoint = function(cgBlock, cgPointData, isOutput) {
        var cgName = cgPointData.cgName;
        var cgValue = cgPointData.cgValue;
        var cgValueType = cgPointData.cgValueType;
        var cgPoint = new cg.Point(cgBlock, cgName, isOutput);
        if (cgValue !== undefined) {
            if (isOutput) {
                throw new cg.GraphSerializationError("JSONLoader::_loadPointPoint() Block `{0}` and {1} `{2}`: Cannot set cgValue for an output point", cgBlock.cgId, (isOutput ? "output" : "input"), cgName);
            }
            cgPoint.cgValue = cgValue;
        } else {
            if (!cgValueType) {
                throw new cg.GraphSerializationError("JSONLoader::_loadPointPoint() Block `{0}` and {1} `{2}`: cgValueType is required and cannot be deduced from cgValue", cgBlock.cgId, (isOutput ? "output" : "input"), cgName);
            }
            cgPoint.cgValueType = cgValueType;
        }
        cgBlock.addPoint(cgPoint);
        return cgPoint;
    };

    /**
     *
     * @param cgBlock {cg.Block}
     * @param cgPointData {Object}
     * @param isOutput {Boolean}
     * @returns {cg.Point}
     * @private
     */
    JSONLoader.prototype._loadPointStream = function(cgBlock, cgPointData, isOutput) {
        var cgPointStream = new cg.Stream(cgBlock, cgPointData.cgName, isOutput);
        cgBlock.addPoint(cgPointStream);
        return cgPointStream;
    };

    /**
     *
     * @param cgGraph {cg.Graph}
     * @param cgConnectionsData {Array<{cgOutputBlockId: String, cgOutputName: String, cgInputBlockId: String, cgInputName: String,}>}
     * @private
     */
    JSONLoader.prototype._loadConnections = function(cgGraph, cgConnectionsData) {
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