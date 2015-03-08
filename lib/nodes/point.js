cg.Point = (function () {

    /**
     * Represent a point into the graph to connect an action to another.
     * @param action {cg.Action} The action on which the point is attached.
     * @param index {Number} The vertical index of the point within the block.
     * @param type {Number} The type of this connection (e.g. Number, Color, etc...).
     * @param name {Number} The name of this connection.
     * @param isInput {Boolean} Whether the point is an input or an output.
     * @constructor
     */
    function Point(action, index, type, name, isInput) {
        this._action = action;
        this._index = index;
        this._type = type;
        this._name = name;
        this._isInput = isInput;
        this._connections = [];
        this._data = {};
    }

    Point.prototype.__proto__ = {
        get action() { return this._action; },
        get index() { return this._index; },
        get type() { return this._type; },
        get name() { return this._name; },
        get isInput() { return this._isInput; },
        get connections() { return this._connections; },
        get data() { return this._data; },
        set data(data) { this._data = data; }
    };

    /**
     * Add a connection for this point.
     * @param connection
     */
    Point.prototype.addConnection = function (connection) {
        if (connection.inputPoint !== this && connection.outputPoint !== this) {
            throw new cg.GraphError("This point does not belong to this connection", this, connection);
        }
        this._connections.push(connection);
        this.action.graph.addConnection(connection);
    };

    /**
     * Remove a connection for this point.
     * @param connection
     */
    Point.prototype.removeConnection = function (connection) {
        var connectionIndex = this._connections.indexOf(connection);

        if (connectionIndex === -1) {
            throw new cg.GraphError("Connection not found in this point", this, connection);
        }
        this._connections.splice(connectionIndex, 1);
    };

    return Point;

})();