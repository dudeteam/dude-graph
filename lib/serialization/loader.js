cg.Loader = (function () {

    /**
     * Load a graph from JSON data.
     * @constructor
     */
    function Loader() {
        this._ids = [];
        this._actions = [];
    }

    /**
     *
     * @param graph
     * @param data
     */
    Loader.prototype.load = function (graph, data) {
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
    Loader.prototype._loadModels = function (modelsData, graph) {
        for (var modelName in modelsData) {
            if (modelsData.hasOwnProperty(modelName)) {
                var modelData = modelsData[modelName];
                graph.addModel(new cg.Model(modelName, modelData.inputs, modelData.outputs));
            }
        }
    };

    /**
     *
     * @param {cg.Graph} graph
     * @param {Object} modelsData
     * @private
     */
    Loader.prototype._loadChildren = function (modelsData, graph) {
        for (var childIndex = 0; childIndex < modelsData.length; ++childIndex) {
            var childData = modelsData[childIndex];
            graph.addChild(this.loadNode(childData, graph, graph));
        }
    };

    /**
     *
     * @param {Object} connectionsData
     * @param {cg.Graph} graph
     * @private
     */
    Loader.prototype._loadConnections = function (connectionsData, graph) {
        for (var connectionIndex = 0; connectionIndex < connectionsData.length; ++connectionIndex) {
            var connectionData = connectionsData[connectionIndex];
            var firstAction = this._actions[connectionData.from.action];
            var secondAction = this._actions[connectionData.to.action];
            if (!firstAction) {
                throw new cg.GraphError('Connection "from action" not found', connectionData, connectionData.from.action);
            }
            if (!secondAction) {
                throw new cg.GraphError('Connection "to action" not found', connectionData, connectionData.to.action);
            }
            var firstPoint = firstAction.outputs[connectionData.from.point];
            var secondPoint = secondAction.inputs[connectionData.to.point];
            if (!firstPoint) {
                throw new cg.GraphError('Connection "from action point" not found', connectionData, connectionData.from.action, connectionData.from.point);
            }
            if (false && !secondPoint) {
                throw new cg.GraphError('Connection "to action point" not found', connectionData, connectionData.to.action, connectionData.to.point);
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
    Loader.prototype.loadNode = function (nodeData, graph, parent) {
        var nodeType = nodeData._type;
        var nodeId = nodeData._id;
        if (!this._ids[nodeType]) {
            this._ids[nodeType] = {};
            this._ids[nodeType][nodeId] = true;
        } else {
            if (this._ids[nodeType][nodeId]) {
                throw new cg.GraphError('Duplicated _id', nodeId, 'for type', nodeType);
            }
            this._ids[nodeType][nodeId] = true;
        }
        var nodeLoader = this["_load" + cg.camelcase("node-" + nodeData._type)];
        if (nodeLoader) {
            return nodeLoader.call(this, nodeData, graph, parent);
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
    Loader.prototype._loadNodeGroup = function (groupData, graph, parent) {
        var group = new cg.Group(groupData._id, graph, parent, groupData.name, new cg.Vec2(groupData.position), new cg.Vec2(groupData.size));

        for (var childIndex = 0; childIndex < groupData.children.length; ++childIndex) {
            var childData = groupData.children[childIndex];
            group.addChild(this.loadNode(childData, graph, group));
        }
        return group;
    };

    /**
     * Load an cg.Action.
     * @param {Object} actionData
     * @param {cg.Graph} graph
     * @param {cg.Node} parent
     * @private
     */
    Loader.prototype._loadNodeAction = function (actionData, graph, parent) {
        var action = new cg.Action(actionData._id, graph, parent, graph.getModel(actionData.name), new cg.Vec2(actionData.position));
        this._actions[action.__id] = action;
        return action;
    };

    return Loader;

})();