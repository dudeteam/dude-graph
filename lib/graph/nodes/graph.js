cg.Graph = (function () {

    /**
     * Represent a graph of connected actions.
     * @constructor
     */
    function Graph() {
        cg.Group.call(this, null, cg.functionName(this.constructor), new cg.Vec2(0, 0), new cg.Vec2(0, 0));

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
            get: function () { return this._connections;}.bind(this)
        });

        /**
         *
         * @type {Object}
         * @private
         */
        this._registeredGroupIds = {};

        /**
         *
         * @type {Object}
         * @private
         */
        this._registeredBlockIds = {};
    }

    cg.inherit(Graph, cg.Group);

    /**
     * You can't remove the graph node.
     * @override
     */
    Graph.prototype.remove = function() {
        this.emit("error", new cg.GraphError("Can't remove graph node.", parent));
    };

    /**
     * Add the node to the parent in this graph.
     * @param node {cg.Node}
     * @param parent {cg.Group}
     * @return {cg.Node|null} return the node if successfully added, or null otherwise
     */
    Graph.prototype.addNode = function (node, parent) {
        if (parent.graph !== this) {
            this.emit("error", new cg.GraphError("The parent does not belong to this graph.", parent));
            return null;
        }
        if (node instanceof cg.Group) {
            if (this._registeredGroupIds[node._id]) {
                this.emit("error", new cg.GraphError("This id is already used for group {0}", node._id));
                return null;
            }
            this._registeredGroupIds[node._id] = node;
        } else if (node instanceof cg.Block) {
            if (this._registeredBlockIds[node._id]) {
                this.emit("error", new cg.GraphError("This id is already used for a block {0}", node._id));
                return null;
            }
            this._registeredBlockIds[node._id] = node;
        }
        parent.addChild(node);
        this.emit("node.add", node);
        return node;
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
     * Add the connection object into the graph.
     * @param connection {cg.Connection}
     * @return {cg.Connection|null} the connection if the add was successful, null otherwise
     */
    Graph.prototype.addConnection = function (connection) {
        if (this._connections.indexOf(connection) !== -1) {
            this.emit("error", new cg.GraphError("This connection is already in the graph"));
            return null;
        }
        var graphForInput = connection.inputPoint.action.graph;
        var graphForOutput = connection.outputPoint.action.graph;
        if (graphForInput !== this || graphForOutput !== this) {
            this.emit("error", new cg.GraphError("This connection does not belong to this graph"));
            return null;
        }
        if (connection.inputPoint.addConnection(connection) && connection.outputPoint.addConnection(connection)) {
            this.emit("connection.add", connection);
            this._connections.push(connection);
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

    return Graph;

})();