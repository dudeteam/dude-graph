cg.Graph = (function () {

    /**
     * Represent a graph of connected actions.
     * @extends cg.Group
     * @constructor
     */
    var Graph = pandora.class_("Graph", cg.Group, function () {
        cg.Group.call(this, null, this.constructor.typename, new pandora.Vec2(0, 0), new pandora.Vec2(0, 0));

        /**
         * Contains the model of actions that can be created.
         * @type {Object}
         * @private
         */
        this._models = {};
        Object.defineProperty(this, "models", {
            get: function () { return this._models; }.bind(this)
        });

        /**
         * Contains all connections of the graph.
         * @type {Array}
         * @private
         */
        this._connections = [];
        Object.defineProperty(this, "connections", {
            get: function () { return this._connections; }.bind(this)
        });

        /**
         *
         * @type {Object}
         * @private
         */
        this._registeredGroupIds = {};

        /**
         * Used to generate new ids for groups automatically.
         * @type {number}
         * @private
         */
        this._groupIdOffset = 0;

        /**
         *
         * @type {Object}
         * @private
         */
        this._registeredBlockIds = {};

        /**
         * Used to generate new ids for blocks automatically.
         * @type {number}
         * @private
         */
        this._blockIdOffset = 0;

    });

    /**
     * Return the next ID available for groups in this graph.
     * @returns {Number}
     */
    Graph.prototype.getNextGroupId = function () {
        while (this._registeredGroupIds[this._groupIdOffset] !== undefined) {
            this._groupIdOffset++;
        }
        return this._groupIdOffset;
    };

    /**
     * Return the next ID available for blocks in this graph.
     * @returns {Number}
     */
    Graph.prototype.getNextBlockId = function () {
        while (this._registeredBlockIds[this._blockIdOffset] !== undefined) {
            this._blockIdOffset++;
        }
        return this._blockIdOffset;
    };

    /**
     * Add a model of action.
     * @param model {cg.Model|cg.Getter}
     */
    Graph.prototype.addModel = function (model) {
        this._models[model.name] = model;
    };

    /**
     * Get a model from its name.
     * @param name {String}
     */
    Graph.prototype.getModel = function (name) {
        return this._models[name];
    };

    /**
     * Find models within the graph.
     * @param options {{type: String?, isInput: Boolean?, limit: Number?}} some search options.
     * @option options.type {String?} search only model that has the given type in input or output
     * @option options.isInput {Boolean?} whether the type to search is an input or an output
     * @option options.limit {Number?} the maximal number of result
     * @option options.pattern {RegExp} a pattern to match the model name
     */
    Graph.prototype.findModels = function (options) {
        var models = [];
        options = options || {};
        options.limit = options.limit || 5;
        options.pattern = options.pattern || /.+/g;
        pandora.forEach(this.models, function (model, name) {
            if (options.pattern.test(name) === true) {
                models.push(name);
            }
            if (models.length == options.limit) {
                return true;
            }
        });
        return models;
    };

    /**
     * Add the entity to the parent in this graph.
     * @param entity {cg.Entity}
     * @param parent {cg.Group}
     * @return {cg.Entity|null} return the entity if successfully added, or null otherwise
     */
    Graph.prototype.addEntity = function (entity, parent) {
        if (parent.graph !== this) {
            this.emit("error", new cg.GraphError("The parent does not belong to this graph.", parent));
        } else if (entity.parent) {
            this.emit("error", new cg.GraphError("This entity already has a parent, maybe you would like to call moveEntity instead", parent));
        } else {
            if (entity instanceof cg.Graph) {
                this.emit("error", new cg.GraphError("Cannot add a parent to a graph", entity));
                return null;
            }
            if (entity instanceof cg.Group) {
                if (this._registeredGroupIds[entity._id]) {
                    this.emit("error", new cg.GraphError("This id is already in use for group {0}", entity._id));
                    return null;
                }
                this._registeredGroupIds[entity._id] = entity;
            } else if (entity instanceof cg.Block) {
                if (this._registeredBlockIds[entity._id]) {
                    this.emit("error", new cg.GraphError("This id is already in use for a block {0}", entity._id));
                    return null;
                }
                this._registeredBlockIds[entity._id] = entity;
            }
            parent._addChild(entity);
            this.emit("entity.add", entity);
            return entity;
        }
        return null;
    };

    /**
     * Change the entity position in the graph by adding it to the given parent.
     * @param entity {cg.Entity}
     * @param newParent {cg.Group}
     * @return {cg.Entity|null} return the entity if successfully added, or null otherwise
     */
    Graph.prototype.moveEntity = function (entity, newParent) {
        if (newParent.graph !== this) {
            this.emit("error", new cg.GraphError("The new parent does not belong to this graph.", newParent));
            return null;
        } else if (!entity.parent || entity.graph !== this) {
            this.emit("error", new cg.GraphError("This entity does not belong to this graph.", newParent));
        } else {
            newParent._addChild(entity);
            return entity;
        }
        return null;
    };

    /**
     * @param entity {cg.Entity|cg.Group|cg.Block}
     * @param entity
     */
    Graph.prototype.removeEntity = function (entity) {
        if (!entity.parent || entity.graph !== this) {
            this.emit("error", new cg.GraphError("This entity does not belong to this graph.", newParent));
        } else {
            if (entity instanceof cg.Group) {
                delete this._registeredGroupIds[entity._id];
            } else {
                delete this._registeredBlockIds[entity._id];
            }
            entity._remove();
        }
    };

    /**
     *
     * @return {Array<cg.Group>}
     */
    Graph.prototype.groups = function () {
        var groups = [];
        for (var group in this._registeredGroupIds) {
            if (this._registeredGroupIds.hasOwnProperty(group)) {
                groups.push(this._registeredGroupIds[group]);
            }
        }
        return groups;
    };

    /**
     *
     * @return {Array<cg.Block>}
     */
    Graph.prototype.blocks = function () {
        var blocks = [];
        for (var block in this._registeredBlockIds) {
            if (this._registeredBlockIds.hasOwnProperty(block)) {
                blocks.push(this._registeredBlockIds[block]);
            }
        }
        return blocks;
    };

    /**
     * Return the group by id.
     * @param id
     * @return {cg.Group|null}
     */
    Graph.prototype.groupById = function (id) {
        return this._registeredGroupIds[id] || null;
    };

    /**
     * Return the block by id.
     * @param id
     * @return {cg.Block|null}
     */
    Graph.prototype.blockById = function (id) {
        return this._registeredBlockIds[id] || null;
    };

    /**
     * Add the connection object into the graph.
     * @param connection {cg.Connection}
     * @return {cg.Connection|null} the connection if the add was successful, null otherwise
     */
    Graph.prototype.addConnection = function (connection) {
        var error = false;
        pandora.forEach(this._connections, function (currentConnection) {
            if (currentConnection.equal(connection)) {
                error = true;
                return true;
            }
        });
        if (error) {
            this.emit("error", new cg.GraphError("This connection is already in the graph"));
            return null;
        }
        var graphForInput = connection.inputPoint.block.graph;
        var graphForOutput = connection.outputPoint.block.graph;
        if (graphForInput !== this || graphForOutput !== this) {
            this.emit("error", new cg.GraphError("This connection does not belong to this graph"));
            return null;
        }
        if (connection.inputPoint.type !== connection.outputPoint.type) {
            this.emit("error", new cg.GraphError("Cannot create connection between types {0} and {1}",
                connection.inputPoint.type, connection.outputPoint.type));
            return null;
        }
        if (connection.inputPoint.block._id === connection.outputPoint.block._id) {
            this.emit("error", new cg.GraphError("Cannot link a block to itself"));
            return null;
        }
        if (connection.inputPoint.addConnection(connection) && connection.outputPoint.addConnection(connection)) {
            this._connections.push(connection);
            this.emit("connection.add", connection);
            return connection;
        }
        return null;
    };

    /**
     * Remove the connection object from the graph.
     * @param connection {cg.Connection}
     */
    Graph.prototype.removeConnection = function (connection) {
        var foundConnection = this._connections.indexOf(connection);
        if (foundConnection === -1) {
            this.emit("error", new cg.GraphError("This connection was not in this graph"));
            return null;
        }
        if (connection.inputPoint.removeConnection(connection) && connection.outputPoint.removeConnection(connection)) {
            this._connections.splice(foundConnection, 1);
            this.emit("connection.remove", connection);
            connection.emit("remove");
            return connection;
        }
        return null;
    };

    /**
     * You can't remove the graph entity.
     * @protected
     * @override
     */
    Graph.prototype._remove = function () {
        this.emit("error", new cg.GraphError("Cannot remove graph entity.", parent));
    };

    return Graph;

})();