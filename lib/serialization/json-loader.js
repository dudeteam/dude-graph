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
        pandora.forEach(data, function (obj, name) {
            var loader = this["_load" + pandora.camelcase(name, "-")];
            if (loader) {
                loader.call(this, obj, graph);
            } else {
                this.emit("error", new pandora.MissingOverloadError("load" + pandora.camelcase(name, "-"), "JSONLoader"));
            }
        }.bind(this));
    };

    /**
     *
     * @param modelsData
     * @param graph
     * @private
     */
    JSONLoader.prototype._loadModels = function (modelsData, graph) {
        pandora.forEach(modelsData, function (model, name) {
            model.name = name;
            graph.addModel(new cg[pandora.camelcase(model.type, "-")](model));
        });
    };

    /**
     *
     * @param {cg.Graph} graph
     * @param {Object} modelsData
     * @private
     */
    JSONLoader.prototype._loadChildren = function (modelsData, graph) {
        pandora.forEach(modelsData, function (model) {
            this.loadNode(model, graph, graph);
        }.bind(this));
    };

    /**
     *
     * @param {Object} connectionsData
     * @param {cg.Graph} graph
     * @private
     */
    JSONLoader.prototype._loadConnections = function (connectionsData, graph) {
        pandora.forEach(connectionsData, function (connectionData) {
            var firstBlock = this._blocks[connectionData.from.block];
            var secondBlock = this._blocks[connectionData.to.block];
            if (!firstBlock) {
                this.emit("error", new cg.GraphError('Connection "from block" not found'), connectionData, connectionData.from.block);
            }
            if (!secondBlock) {
                this.emit("error", new cg.GraphError('Connection "to block" not found'), connectionData, connectionData.to.block);
            }
            var firstPoint = firstBlock.outputs[connectionData.from.point];
            var secondPoint = secondBlock.inputs[connectionData.to.point];
            if (!firstPoint) {
                this.emit("error", new cg.GraphError('Connection "from block point" not found'), connectionData, connectionData.from.block, connectionData.from.point);
            }
            if (false && !secondPoint) { // TODO: WTF is that???
                this.emit("error", new cg.GraphError('Connection "to block point" not found'), connectionData, connectionData.to.block, connectionData.to.point);
            }
            var connection = new cg.Connection(firstPoint, secondPoint);
            graph.addConnection(connection);
        }.bind(this));
    };

    /**
     * Load a cg.Node.
     * @param {Object} nodeData
     * @param {cg.Graph} graph
     * @param {cg.Node} parent
     * @returns {cg.Node}
     */
    JSONLoader.prototype.loadNode = function (nodeData, graph, parent) {
        var nodeLoader = this["_load" + pandora.camelcase("node-" + nodeData._type, "-")];
        if (nodeLoader) {
            nodeLoader.call(this, nodeData, graph, parent);
        } else {
            this.emit("error", new cg.GraphError("Missing node loader for {0}", nodeData._type));
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
        var group = new cg.Group(groupData._id, groupData.name, new pandora.Vec2(groupData.position), new pandora.Vec2(groupData.size));
        graph.addNode(group, parent);
        pandora.forEach(groupData.children, function (childData) {
            this.loadNode(childData, graph, group);
        }.bind(this));
    };

    /**
     * Load an cg.block.
     * @param {Object} blockData
     * @param {cg.Graph} graph
     * @param {cg.Node} parent
     * @private
     */
    JSONLoader.prototype._loadNodeBlock = function (blockData, graph, parent) {
        var block = new cg.Block(blockData._id, graph.getModel(blockData.name), new pandora.Vec2(blockData.position), blockData.value);
        this._blocks[block.__id] = block;
        graph.addNode(block, parent);
    };

    return JSONLoader;

})();