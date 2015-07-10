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
     * @param graph {cg.Graph}
     * @param blocksData {Array<{cgType: "Function", cgId: "32", cgInputs: *Object, cgOutputs: *Object}>}
     */
    JSONLoader.prototype.load = function (graph, blocksData) {
        this._loadBlocks(graph, blocksData);
        this._loadPoints(graph, blocksData);
    };

    /**
     *
     * @param graph {cg.Graph}
     * @param blocksData {Array<{cgType: "Function", cgId: "32"}>}
     * @private
     */
    JSONLoader.prototype._loadBlocks = function (graph, blocksData) {
        pandora.forEach(blocksData, function (blockData) {
            if (!blockData.hasOwnProperty("cgType")) {
                throw new cg.GraphError("JSONLoader::_loadBlocks() Block definition lacks property `cgType`");
            }
            if (!blockData.hasOwnProperty("cgId")) {
                throw new cg.GraphError("JSONLoader::_loadBlocks() Block definition lacks property `cgId`");
            }
            var cgBlockCreator = cg[blockData.cgType];
            if (!cgBlockCreator) {
                throw new cg.GraphError("JSONLoader::_loadBlocks() Cannot create a block of type `{0}`", blockData.cgType);
            }
            var block = new cg[blockData.cgType](graph, blockData.cgId);
            graph.addBlock(block);
        });
    };

    /**
     *
     * @param graph {cg.Graph}
     * @param blocksData {Array<{cgId: "32", cgInputs: *Object, cgOutputs: *Object}>}
     * @private
     */
    JSONLoader.prototype._loadPoints = function (graph, blocksData) {
        pandora.forEach(blocksData, function (blockData) {
            var block = graph.blockById(blockData.cgId);
            if (blockData.cgInputs) {
                pandora.forEach(blockData.cgInputs, function (input) {
                    var inputDecomposed = pandora.decomposeObject(input);
                    console.log("Create input", inputDecomposed.name, "with value", inputDecomposed.value);
                });
            }
            if (blockData.cgOutputs) {
                pandora.forEach(blockData.cgOutputs, function (output) {
                    var outputDecomposed = pandora.decomposeObject(output);
                    console.log("Create output", outputDecomposed.name, "with value", outputDecomposed.value);
                });
            }
        });
    };

    return JSONLoader;

})();