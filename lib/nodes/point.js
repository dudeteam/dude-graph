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
        cg.EventEmitter.call(this);
        this._action = action;
        this._index = index;
        this._type = type;
        this._name = name;
        this._isInput = isInput;
        this._connections = [];
        this._data = {};
    }

    cg.inherit(Point, cg.EventEmitter);

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
     * Check whether the point contains the connection.
     * @param connection
     * @returns {boolean}
     */
    Point.prototype.hasConnection = function (connection) {
        return this._connections.indexOf(connection) !== -1;
    };

    /**
     * Add a connection for this point.
     * @param connection
     */
    Point.prototype.addConnection = function (connection) {
        connection.inputPoint.emit("connection.add", connection);
        connection.outputPoint.emit("connection.add", connection);
        if (connection.inputPoint !== this && connection.outputPoint !== this) {
            throw new cg.GraphError("This point does not belong to this connection", this, connection);
        }
        this._connections.push(connection);
    };

    /**
     * Remove a connection for this point.
     * @param connection
     */
    Point.prototype.removeConnection = function (connection) {
        connection.emit("disconnect");
        var connectionIndex = this._connections.indexOf(connection);
        if (connectionIndex === -1) {
            throw new cg.GraphError("Connection not found in this point", this, connection);
        }
        this._connections.splice(connectionIndex, 1);
        connection.inputPoint.emit("connection.remove", connection);
        connection.outputPoint.emit("connection.remove", connection);
    };

    /**
     * Remove all connections attached to this point.
     */
    Point.prototype.disconnect = function () {
        while (this._connections.length) {
            this.action.graph.removeConnection(this._connections[0]);
        }
    };

    return Point;

})();