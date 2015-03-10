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
            get: function () {
                return this._action;
            }.bind(this)
        });

        /**
         * Point index within the action.
         * @type {Number}
         * @private
         */
        this._index = index;
        Object.defineProperty(this, "index", {
            get: function () {
                return this._index;
            }.bind(this)
        });

        /**
         * Point type.
         * @type {Number}
         * @private
         */
        this._type = type;
        Object.defineProperty(this, "type", {
            get: function () {
                return this._type;
            }.bind(this)
        });

        /**
         * Name of the point.
         * @type {String}
         * @private
         */
        this._name = name;
        Object.defineProperty(this, "name", {
            get: function () {
                return this._name;
            }.bind(this)
        });

        /**
         *
         * @type {Boolean}
         * @private
         */
        this._isInput = isInput;
        Object.defineProperty(this, "isInput", {
            get: function () {
                return this._isInput;
            }.bind(this)
        });

        /**
         *
         * @type {Array}
         * @private
         */
        this._connections = [];
        Object.defineProperty(this, "connections", {
            get: function () {
                return this._connections;
            }.bind(this)
        });

        /**
         * Point data
         * @type {Object}
         * @private
         */
        this._data = {};
        Object.defineProperty(this, "data", {
            get: function () {
                return this._data;
            }.bind(this),
            set: function (data) {
                this._data = data;
            }.bind(this)
        });
    }

    cg.inherit(Point, cg.EventEmitter);

    /**
     * Add a connection for this point, this is called by graph.addConnection(connection) and dispatched here if the connection has this point.
     * Never call this directly
     * @param {cg.Connection} connection
     * @return {cg.Connection|null} the connection if the add was successful, null otherwise
     */
    Point.prototype.addConnection = function (connection) {
        if (this._connections.indexOf(connection) !== -1) {
            this.emit("error", new cg.GraphError("This connection is already in this point"));
            return null;
        }
        this._connections.push(connection);
        this.emit("connection.add", connection);
        return connection;
    };

    /**
     * Remove a connection for this point, this is called by graph.removeConnection(connection) and dispatched here if the connection has this point.
     * Never call this directly
     * @param connection
     */
    Point.prototype.removeConnection = function (connection) {
        var foundConnection = this._connections.indexOf(connection);
        if (foundConnection === -1) {
            this.emit("error", new cg.GraphError("This connection was not in this point"));
            return null;
        }
        this._connections.splice(foundConnection, 1);
        this.emit("connection.remove", connection);
        return connection;
    };

    /**
     * Remove all connections attached to this point.
     */
    Point.prototype.disconnect = function () {
        while (this._connections.length) {
            if (!this.action.graph.removeConnection(this._connections[0])) {
                return;
            }
        }
    };

    return Point;

})();