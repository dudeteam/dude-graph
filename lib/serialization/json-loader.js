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
        console.dir(cgGraph);
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
            if (!cgBlockData.hasOwnProperty("cgType")) {
                throw new cg.GraphSerializationError("JSONLoader::_loadBlocks() Block definition lacks property `cgType`");
            }
            if (!cgBlockData.hasOwnProperty("cgId")) {
                throw new cg.GraphSerializationError("JSONLoader::_loadBlocks() Block definition lacks property `cgId`");
            }
            var cgBlockDeserializer = self[pandora.camelcase("_loadBlock" + cgBlockData.cgType)];
            if (!cgBlockDeserializer) {
                throw new cg.GraphSerializationError("JSONLoader::_loadBlocks() Cannot deserialize block of type `{0}`", cgBlockData.cgType);
            }
            cgBlockDeserializer(cgGraph, cgBlockData);
        });
    };

    /**
     *
     * @param cgGraph {cg.Graph}
     * @param cgBlockData {{cgId: "32", cgType: "Function"}}
     * @returns {cg.Function}
     * @private
     */
    JSONLoader.prototype._loadBlockFunction = function(cgGraph, cgBlockData) {
        var cgBlockFunction = new cg.Function(cgGraph, cgBlockData.cgId);
        cgGraph.addBlock(cgBlockFunction);
        return cgBlockFunction;
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
                throw new cg.GraphSerializationError("JSONLoader::_loadPoints() Point definition lacks property `cgName`");
            }
            var cgPointType = cgPointData.cgType || "Point";
            var cgPointDeserializer = self[pandora.camelcase("_loadPoint" + cgPointType)];
            if (!cgPointDeserializer) {
                throw new cg.GraphSerializationError("JSONLoader::_loadPoints() Cannot deserialize point of type `{0}`", cgPointType);
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
        var cgValueType = cgPointData.cgValueType || pandora.typename(cgValue);
        var cgPoint = new cg.Point(cgBlock, cgName, isOutput);

        if (cgValue) {
            cgPoint.cgValue = cgValue;
        } else {
            if (!cgValueType) {
                throw new cg.GraphSerializationError("JSONLoader::_loadPointPoint() cgValueType is required and cannot be deduced from cgValue");
            }
            cgPoint.cgValueType = cgValueType;
        }
        cgBlock.addPoint(cgPoint);
        return cgPoint;
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
            if (!cgOutputBlockId || !cgOutputName || !cgInputBlockId || !cgInputName) {
                throw new cg.GraphSerializationError("JSONLoader::_loadConnections() Data missing", cgConnectionData);
            }
            var cgOutputBlock = cgGraph.blockById(cgOutputBlockId);
            if (!cgOutputBlock) {
                throw new cg.GraphSerializationError("JSONLoader::_loadConnections() Output block not found for id `{0}`", cgOutputBlockId);
            }
            var cgInputBlock = cgGraph.blockById(cgInputBlockId);
            if (!cgInputBlock) {
                throw new cg.GraphSerializationError("JSONLoader::_loadConnections() Input block not found for id `{0}`", cgInputBlockId);
            }
            var cgOutputPoint = cgOutputBlock.output(cgOutputName);
            if (!cgOutputPoint) {
                throw new cg.GraphSerializationError("JSONLoader::_loadConnections() Output point `{0}` not found in block `{1}`", cgOutputName, cgOutputBlockId);
            }
            var cgInputPoint = cgInputBlock.input(cgInputName);
            if (!cgInputPoint) {
                throw new cg.GraphSerializationError("JSONLoader::_loadConnections() Input point `{0}` not found in block `{1}`", cgInputName, cgInputBlockId);
            }
            cgOutputPoint.connect(cgInputPoint);
        });
    };

    return JSONLoader;

})();