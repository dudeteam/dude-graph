cg.JSONLoader = (function () {

    /**
     * Load a graph from JSON data.
     * @constructor
     */
    var JSONLoader = pandora.class_("JSONLoader", pandora.EventEmitter, function () {
        pandora.EventEmitter.call(this);
        this._blocks = [];
    });

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

    JSONLoader.prototype._loadTypes = function (typesData, graph) {
        graph.types = typesData;
        for (var i = 0; i < typesData.length; ++i) {
            graph.addModel(new cg.Value({"value-type": typesData[i]}));
        }
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
            this.loadEntity(model, graph, graph);
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
                this.emit("error", new pandora.Exception('Connection "from block" not found'), connectionData, connectionData.from.block);
            }
            if (!secondBlock) {
                this.emit("error", new pandora.Exception('Connection "to block" not found'), connectionData, connectionData.to.block);
            }
            var firstPoint = firstBlock.getPoint(connectionData.from.point, "outputs");
            var secondPoint = secondBlock.getPoint(connectionData.to.point, "inputs");
            if (!firstPoint) {
                this.emit("error", new pandora.Exception('Connection "from block point" not found'), connectionData, connectionData.from.block, connectionData.from.point);
            }
            if (!secondPoint) {
                this.emit("error", new pandora.Exception('Connection "to block point" not found'), connectionData, connectionData.to.block, connectionData.to.point);
            }
            var connection = new cg.Connection(firstPoint, secondPoint);
            graph.addConnection(connection);
        }.bind(this));
    };

    /**
     * Load a cg.Entity.
     * @param {Object} entityData
     * @param {cg.Graph} graph
     * @param {cg.Entity} parent
     * @returns {cg.Entity}
     */
    JSONLoader.prototype.loadEntity = function (entityData, graph, parent) {
        var entityLoader = this["_load" + pandora.camelcase("entity-" + entityData._type, "-")];
        if (entityLoader) {
            entityLoader.call(this, entityData, graph, parent);
        } else {
            this.emit("error", new cg.GraphError("Missing entity loader for {0}", entityData._type));
        }
    };

    /**
     * Load a cg.Group
     * @param {Object} groupData
     * @param {cg.Graph} graph
     * @param {cg.Entity} parent
     * @private
     */
    JSONLoader.prototype._loadEntityGroup = function (groupData, graph, parent) {
        var group = new cg.Group(groupData._id, groupData._name, new pandora.Vec2(groupData.position), new pandora.Vec2(groupData.size));
        graph.addEntity(group, parent);
        pandora.forEach(groupData.children, function (childData) {
            this.loadEntity(childData, graph, group);
        }.bind(this));
    };

    /**
     * Load an cg.block.
     * @param {Object} blockData
     * @param {cg.Graph} graph
     * @param {cg.Entity} parent
     * @private
     */
    JSONLoader.prototype._loadEntityBlock = function (blockData, graph, parent) {
        var block = new cg.Block(blockData._id, graph.getModel(blockData._name), new pandora.Vec2(blockData.position), blockData.value);
        this._blocks[block.__id] = block;
        graph.addEntity(block, parent);
    };

    return JSONLoader;

})();