cg.JSONLoader = (function () {

    /**
     * Load a graph from JSON data.
     * @constructor
     */
    function JSONLoader() {
        this._blocks = [];
    }

    /**
     *
     * @param graph
     * @param data
     */
    JSONLoader.prototype.load = function (graph, data) {
        for (var dataName in data) {
            if (data.hasOwnProperty(dataName)) {
                var loader = this["_load" + cg.camelcase(dataName)];
                if (loader) {
                    loader.call(this, data[dataName], graph);
                } else {
                    throw new cg.GraphError("Missing loader for " + dataName + ".");
                }
            }
        }
    };

    /**
     *
     * @param modelsData
     * @param graph
     * @private
     */
    JSONLoader.prototype._loadModels = function (modelsData, graph) {
        for (var modelName in modelsData) {
            if (modelsData.hasOwnProperty(modelName)) {
                var modelData = modelsData[modelName];
                modelData.name = modelName;
                graph.addModel(new cg[cg.camelcase(modelData.type)](modelData));
            }
        }
    };

    /**
     *
     * @param {cg.Graph} graph
     * @param {Object} modelsData
     * @private
     */
    JSONLoader.prototype._loadChildren = function (modelsData, graph) {
        for (var childIndex = 0; childIndex < modelsData.length; ++childIndex) {
            var childData = modelsData[childIndex];
            this.loadNode(childData, graph, graph);
        }
    };

    /**
     *
     * @param {Object} connectionsData
     * @param {cg.Graph} graph
     * @private
     */
    JSONLoader.prototype._loadConnections = function (connectionsData, graph) {
        for (var connectionIndex = 0; connectionIndex < connectionsData.length; ++connectionIndex) {
            var connectionData = connectionsData[connectionIndex];
            var firstBlock = this._blocks[connectionData.from.block];
            var secondBlock = this._blocks[connectionData.to.block];
            if (!firstBlock) {
                throw new cg.GraphError('Connection "from block" not found', connectionData, connectionData.from.block);
            }
            if (!secondBlock) {
                throw new cg.GraphError('Connection "to block" not found', connectionData, connectionData.to.block);
            }
            var firstPoint = firstBlock.outputs[connectionData.from.point];
            var secondPoint = secondBlock.inputs[connectionData.to.point];
            if (!firstPoint) {
                throw new cg.GraphError('Connection "from block point" not found', connectionData, connectionData.from.block, connectionData.from.point);
            }
            if (false && !secondPoint) {
                throw new cg.GraphError('Connection "to block point" not found', connectionData, connectionData.to.block, connectionData.to.point);
            }
            var connection = new cg.Connection(firstPoint, secondPoint);
            firstPoint.addConnection(connection);
            secondPoint.addConnection(connection);
        }
    };

    /**
     * Load a cg.Node.
     * @param {Object} nodeData
     * @param {cg.Graph} graph
     * @param {cg.Node} parent
     * @returns {cg.Node}
     */
    JSONLoader.prototype.loadNode = function (nodeData, graph, parent) {
        var nodeLoader = this["_load" + cg.camelcase("node-" + nodeData._type)];
        if (nodeLoader) {
            nodeLoader.call(this, nodeData, graph, parent);
        } else {
            throw new cg.GraphError('Missing node loader for', nodeData._type);
        }
    };

    /**
     * Load a cg.Group
     * @param {Object} groupData
     * @param {cg.Graph} graph
     * @param {cg.Node} parent
     * @private
     */
    JSONLoader.prototype._loadNodeGroup = function (groupData, graph, parent) {
        var group = new cg.Group(groupData._id, groupData.name, new cg.Vec2(groupData.position), new cg.Vec2(groupData.size));
        graph.addNode(group, parent);

        for (var childIndex = 0; childIndex < groupData.children.length; ++childIndex) {
            var childData = groupData.children[childIndex];
            this.loadNode(childData, graph, group);
        }
    };

    /**
     * Load an cg.block.
     * @param {Object} blockData
     * @param {cg.Graph} graph
     * @param {cg.Node} parent
     * @private
     */
    JSONLoader.prototype._loadNodeBlock = function (blockData, graph, parent) {
        var block = new cg.Block(blockData._id, graph.getModel(blockData.name), new cg.Vec2(blockData.position));
        this._blocks[block.__id] = block;
        graph.addNode(block, parent);
    };

    return JSONLoader;

})();