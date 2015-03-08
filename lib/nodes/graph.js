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

    }

    cg.inherit(Graph, cg.Group);

    /**
     *
     */
    Graph.prototype.remove = function() {
        this.emit("error", new cg.GraphError("Can't remove graph node.", parent));
    };

    /**
     * Add the node to the parent in this graph.
     * @param node {cg.Node}
     * @param parent {cg.Group}
     */
    Graph.prototype.addNode = function (node, parent) {
        if (parent.graph !== this) {
            this.emit("error", new cg.GraphError("The parent does not belong to this graph.", parent));
        }
        parent.addChild(node);
        this.emit("node.add", node);
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
     * Check whether the graph contains the connection.
     * @param connection {cg.Connection}
     * @returns {Boolean}
     */
    Graph.prototype.hasConnection = function (connection) {
        return this._connections.indexOf(connection) !== -1;
    };

    /**
     * Add the connection object into the graph.
     * @param connection {cg.Connection}
     */
    Graph.prototype.addConnection = function (connection) {
        if (this._connections.indexOf(connection) === -1) {
            this.emit("connection.add", connection);
            this._connections.push(connection);
            connection.inputPoint.addConnection(connection);
            connection.outputPoint.addConnection(connection);
        }
    };

    /**
     * Remove the connection object from the graph.
     * @param connection {cg.Connection}
     */
    Graph.prototype.removeConnection = function (connection) {
        this._connections.splice(this._connections.indexOf(connection), 1);
        connection.inputPoint.removeConnection(connection);
        connection.outputPoint.removeConnection(connection);
    };

    return Graph;

})();