/**
 * Point is a named value that is held by a block, it can accepts a direct value or be connected to other compatible block points
 * @param {Boolean} pointOutput
 * @param {Object} pointData
 * @param {String} pointData.pointName
 * @param {String|null} [pointData.pointTemplate=null]
 * @param {String} pointData.pointValueType
 * @param {Object|null} [pointData.pointValue=null]
 * @param {Boolean} [pointData.pointSingleConnection=true]
 * @class
 * @extends {EventEmitter}
 */
dudeGraph.Point = function (pointOutput, pointData) {
    /**
     * The parent block
     * @type {dudeGraph.Block}
     * @readonly
     * @protected
     */
    this._pointBlock = null;
    Object.defineProperty(this, "pointBlock", {
        set: function (pointBlock) {
            if (this._pointBlock !== null) {
                throw new Error("`" + this.pointFancyName + "` cannot redefine `pointBlock`");
            }
            this._pointBlock = pointBlock;
        }.bind(this),
        get: function () {
            return this._pointBlock;
        }.bind(this)
    });

    /**
     * Whether the point is an output or an input
     * @type {Boolean}
     * @readonly
     * @protected
     */
    this._pointOutput = pointOutput;
    Object.defineProperty(this, "pointOutput", {
        get: function () {
            return this._pointOutput;
        }.bind(this)
    });

    /**
     * The point type
     * @type {String}
     * @readonly
     * @protected
     */
    this._pointType = this.className;
    Object.defineProperty(this, "pointType", {
        get: function () {
            return this._pointType;
        }.bind(this)
    });

    /**
     * The point name
     * @type {String}
     * @protected
     */
    this._pointName = null;
    Object.defineProperty(this, "pointName", {
        get: function () {
            return this._pointName;
        }.bind(this)
    });

    /**
     * The point template
     * @type {String}
     * @protected
     */
    this._pointTemplate = null;
    Object.defineProperty(this, "pointTemplate", {
        get: function () {
            return this._pointTemplate;
        }.bind(this)
    });

    /**
     * The type of the value this point holds
     * @type {String|null}
     * @protected
     */
    this._pointValueType = null;
    Object.defineProperty(this, "pointValueType", {
        get: function () {
            return this._pointValueType;
        }.bind(this),
        set: this.changeValueType
    });

    /**
     * The value this point holds of `pointValueType`
     * @type {Object|null}
     * @protected
     */
    this._pointValue = null;
    Object.defineProperty(this, "pointValue", {
        get: function () {
            return this._pointValue;
        }.bind(this),
        set: this.changeValue
    });

    /**
     * The connections involving this point
     * @type {Array<dudeGraph.Connection>}
     * @protected
     */
    this._pointConnections = [];
    Object.defineProperty(this, "pointConnections", {
       get: function () {
           return this._pointConnections;
       }.bind(this)
    });

    /**
     * Whether this point can only accept one connection
     * @type {Boolean}
     * @protected
     */
    this._pointSingleConnection = true;
    Object.defineProperty(this, "pointSingleConnection", {
        get: function () {
            return this._pointSingleConnection;
        }.bind(this)
    });

    /**
     * The point fancy name
     * @type {String}
     */
    Object.defineProperty(this, "pointFancyName", {
        get: function () {
            return this._pointName + " @" + this._pointBlock.blockFancyName;
        }.bind(this)
    });

    this.initialize(pointData);
};

dudeGraph.Point.prototype = _.create(EventEmitter.prototype, {
    "constructor": dudeGraph.Point,
    "className": "Point"
});

/**
 * Initializes the point
 * @param {Object} pointData
 * @param {String} pointData.pointName
 * @param {String|null} [pointData.pointTemplate=null]
 * @param {String} pointData.pointValueType
 * @param {Object|null} [pointData.pointValue=null]
 * @param {Boolean} [pointData.pointSingleConnection=true]
 */
dudeGraph.Point.prototype.initialize = function (pointData) {
    this._pointName = pointData.pointName;
    this._pointTemplate = pointData.pointTemplate || null;
    this._pointValueType = pointData.pointValueType;
    this._pointValue = pointData.pointValue || null;
    this._pointSingleConnection = _.isUndefined(pointData.pointSingleConnection) ? true : pointData.pointSingleConnection;
};

/**
 * Validate the point when added to the block
 */
dudeGraph.Point.prototype.validate = function () {
    if (!this._pointBlock.blockGraph.hasType(this._pointValueType)) {
        throw new Error("The graph cannot handle type `" + this._pointValueType + "`");
    }
    if (!this._pointBlock.blockGraph.canAssign(this._pointValueType, this._pointValue)) {
        throw new Error("`" + this._pointValue + "` is not compatible with type `" + this._pointValueType + "`");
    }
    // TODO: Check template and if value type is a template
};

/**
 * Returns whether the point has no value
 * @returns {Boolean}
 */
dudeGraph.Point.prototype.emptyValue = function () {
    return this._pointValue === null;
};
/**
 * Returns whether the point has no connection
 * @returns {Boolean}
 */
dudeGraph.Point.prototype.emptyConnection = function () {
    return this._pointConnections.length === 0;
};
/**
 * Returns whether the point has no value and no connection
 * @returns {Boolean}
 */
dudeGraph.Point.prototype.empty = function () {
    return this.emptyValue() && this.emptyConnection();
};

/**
 * Changes the point valueType
 * @param {String} valueType
 */
dudeGraph.Point.prototype.changeValueType = function (valueType) {

};
/**
 * Changes the point value
 * @param {Object|null} value
 */
dudeGraph.Point.prototype.changeValue = function (value) {
    if (!this._pointBlock.blockGraph.canAssign(this._pointValueType, value)) {
        throw new Error("`" + value + "` is not compatible with type `" + this._pointValueType + "`");
    }
    this._pointValue = value;
    this._pointBlock.blockGraph.emit("value-change");
};

/**
 * Whether this point accepts to connect to the given point
 * @param {dudeGraph.Point} point
 * @returns {Boolean}
 */
dudeGraph.Point.prototype.acceptConnect = function (point) {
    return this.emptyValue() && (!this._pointSingleConnection || this._pointConnections.length === 0);
};

/**
 * Connects to the given point
 * @param {dudeGraph.Point} point
 * @returns {dudeGraph.Connection}
 */
dudeGraph.Point.prototype.connect = function (point) {
    return this.pointBlock.connectPointTo(this, point);
};
/**
 * Disconnects from the given point
 * @param {dudeGraph.Point} point
 */
dudeGraph.Point.prototype.disconnect = function (point) {
    return this.pointBlock.disconnectPointFrom(this, point);
};
/**
 * Disconnects from all connected points
 */
dudeGraph.Point.prototype.disconnectAll = function () {
    var point = this;
    var connections = _.clone(this._pointConnections);
    _.forEach(connections, function (connection) {
        point.disconnect(connection.other(point));
    });
};
/**
 * Adds the connection
 * @param {dudeGraph.Connection} connection
 */
dudeGraph.Point.prototype.addConnection = function (connection) {
    if (this.pointBlock === null) {
        throw new Error("`" + this.pointFancyName + "` cannot be connected when the point is not bound to a block");
    }
    if (connection.connectionOutputPoint !== this && connection.connectionInputPoint !== this) {
        throw new Error("`" + this.pointFancyName + "` is not involved in `" + connection.connectionFancyName + "`");
    }
    var connectionFound = _.find(connection, this._pointConnections) || null;
    if (connectionFound !== null) {
        throw new Error("`" + connection.connectionFancyName + "` already exists in `" + this.pointFancyName + "`");
    }
    this._pointConnections.push(connection);
};
/**
 * Removes the given connection
 * @param {dudeGraph.Connection} connection
 */
dudeGraph.Point.prototype.removeConnection = function (connection) {
    if (connection.connectionOutputPoint !== this && connection.connectionInputPoint !== this) {
        throw new Error("`" + this.pointFancyName + "` is not involved in `" + connection.connectionFancyName + "`");
    }
    var connectionFound = _.find(this._pointConnections, connection) || null;
    if (connectionFound === null) {
        throw new Error("Cannot find `" + connection.connectionFancyName + "` in `" + this.pointFancyName + "`");
    }
    _.pull(this._pointConnections, connectionFound);
};

/**
 * Clone the point and its pointValueType and pointValue
 * @returns {dudeGraph.Point}
 */
dudeGraph.Point.prototype.clone = function () {};