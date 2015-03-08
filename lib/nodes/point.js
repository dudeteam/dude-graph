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

        /**
         *
         * @type {cg.Action}
         * @private
         */
        this._action = action;
        Object.defineProperty(this, "action", {
            get: function () { return this._action; }.bind(this)
        });

        /**
         * Point index within the action.
         * @type {Number}
         * @private
         */
        this._index = index;
        Object.defineProperty(this, "index", {
            get: function () { return this._index; }.bind(this)
        });

        /**
         * Point type.
         * @type {Number}
         * @private
         */
        this._type = type;
        Object.defineProperty(this, "type", {
            get: function () { return this._type; }.bind(this)
        });

        /**
         * Name of the point.
         * @type {String}
         * @private
         */
        this._name = name;
        Object.defineProperty(this, "name", {
            get: function () { return this._name; }.bind(this)
        });

        /**
         *
         * @type {Boolean}
         * @private
         */
        this._isInput = isInput;
        Object.defineProperty(this, "isInput", {
            get: function () { return this._isInput; }.bind(this)
        });

        /**
         *
         * @type {Array}
         * @private
         */
        this._connections = [];
        Object.defineProperty(this, "connections", {
            get: function () { return this._connections; }.bind(this)
        });

        /**
         * Point data
         * @type {Object}
         * @private
         */
        this._data = {};
        Object.defineProperty(this, "data", {
            get: function () { return this._data; }.bind(this),
            set: function (data) { this._data = data; }.bind(this)
        });
    }

    cg.inherit(Point, cg.EventEmitter);

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
        if (!this.hasConnection(connection) && !connection.otherPoint(this).hasConnection(connection)) {
            this.action.graph.emit("connection.add", connection);
        }
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
        connection.emit("remove");
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