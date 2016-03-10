/**
 * Point is a named value that is held by a block, it can accepts a direct value or be connected to other compatible block points
 * @param {Boolean} pointOutput
 * @param {dudeGraph.Point.pointDataTypedef} pointData
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
            if (pointBlock !== null && this._pointBlock !== null) {
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
            return this._pointName + " @" + (this._pointBlock ? this._pointBlock.blockFancyName : "Unbound point");
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
 * @param {dudeGraph.Point.pointDataTypedef} pointData
 */
dudeGraph.Point.prototype.initialize = function (pointData) {
    this._pointName = pointData.pointName;
    this._pointTemplate = pointData.pointTemplate || null;
    this._pointValueType = pointData.pointValueType;
    this._pointValue = pointData.pointValue || null;
    this._pointSingleConnection = _.isUndefined(pointData.pointSingleConnection) ? true : pointData.pointSingleConnection;
    if (!_.isString(this._pointName)) {
        throw new Error("`" + this.pointFancyName + "` `pointName` must be a non-null String");
    }
    if (this._pointTemplate === null && !_.isString(this._pointValueType)) {
        throw new Error("`" + this.pointFancyName +
            "` `pointValueType` must be a non-null String if no `pointTemplate` is provided");
    }
};

/**
 * Validate the point when added to the block
 */
dudeGraph.Point.prototype.validate = function () {
    if (this._pointTemplate === null) {
        this.changeValueType(this._pointValueType, true);
    } else {
        var template = this._pointBlock.template(this._pointTemplate);
        if (template === null) {
            throw new Error();
        }
        this.changeValueType(template.valueType, true);
    }
    this.changeValue(this._pointValue, true);
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
 * @param {Boolean} [ignoreEmit=false]
 */
dudeGraph.Point.prototype.changeValueType = function (valueType, ignoreEmit) {
    if (this._pointBlock === null) {
        throw new Error("`" + this.pointFancyName + "` cannot change value type when not bound to a block");
    }
    if (!this._pointBlock.blockGraph.hasType(valueType)) {
        throw new Error("`" + this._pointBlock.blockGraph.graphFancyName + "` has no value type `" + valueType + "`");
    }
    if (_.isUndefined(this._pointBlock.blockGraph.convertValue(valueType, this._pointValue))) {
        throw new Error("`" + this._pointValue + "` is not compatible with value type `" + valueType + "`");
    }
    var oldValueType = this._pointValueType;
    this._pointValueType = valueType;
    if (!ignoreEmit) {
        this.emit("value-type-change", valueType, oldValueType);
        this._pointBlock.blockGraph.emit("point-value-type-change", this, valueType, oldValueType);
    }
    this.changeValue(this._pointValue, !!ignoreEmit);
};
/**
 * Changes the point value
 * @param {Object|null} value
 * @param {Boolean} [ignoreEmit=false]
 */
dudeGraph.Point.prototype.changeValue = function (value, ignoreEmit) {
    if (this._pointBlock === null) {
        throw new Error("`" + this.pointFancyName + "` cannot change value when not bound to a block");
    }
    var oldValue = this._pointValue;
    var assignValue = this._pointBlock.blockGraph.convertValue(this._pointValueType, value);
    if (_.isUndefined(assignValue)) {
        throw new Error("`" + this._pointBlock.blockGraph + "` " + value +
            "` is not compatible with type `" + this._pointValueType + "`");
    }
    this._pointValue = assignValue;
    if (!ignoreEmit) {
        this.emit("value-change", assignValue, oldValue);
        this._pointBlock.blockGraph.emit("point-value-change", this, assignValue, oldValue);
        this._pointBlock.pointValueChanged(this, assignValue, oldValue);
    }
};

//noinspection JSUnusedLocalSymbols
/**
 * Whether this point accepts to connect to the given point
 * @param {dudeGraph.Point} point
 * @returns {Boolean}
 */
dudeGraph.Point.prototype.acceptConnect = function (point) {
    return this.emptyValue() && (!this._pointSingleConnection || this.emptyConnection());
};

/**
 * Connects to the given point
 * @param {dudeGraph.Point} point
 * @returns {dudeGraph.Connection}
 */
dudeGraph.Point.prototype.connect = function (point) {
    if (this._pointBlock === null) {
        throw new Error("`" + this.pointFancyName + "` cannot connect to another point when not bound to a block");
    }
    return this._pointBlock.connectPointTo(this, point);
};
/**
 * Disconnects from the given point
 * @param {dudeGraph.Point} point
 */
dudeGraph.Point.prototype.disconnect = function (point) {
    if (this._pointBlock === null) {
        throw new Error("`" + this.pointFancyName + "` cannot disconnect from another point when not bound to a block");
    }
    return this.pointBlock.disconnectPointFrom(this, point);
};
/**
 * Disconnects from all connected points
 */
dudeGraph.Point.prototype.disconnectAll = function () {
    var point = this;
    _.forEachRight(this._pointConnections, function (connection) {
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
        throw new Error("`" + this.pointFancyName + "` cannot redefine `" + connection.connectionFancyName + "`");
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
        throw new Error("`" + this.pointFancyName + "` has no connection `" + connection.connectionFancyName + "`");
    }
    _.pull(this._pointConnections, connectionFound);
};

/**
 * Clone the point and its pointValueType and pointValue
 * @returns {dudeGraph.Point}
 */
dudeGraph.Point.prototype.clone = function () {};

/**
 * @typedef {Object} dudeGraph.Point.pointDataTypedef
 * @property {String} pointName
 * @property {String|null} [pointTemplate=null]
 * @property {String} [pointValueType=null]
 * @property {Object|null} [pointValue=null]
 * @property {Boolean} [pointSingleConnection=true]
 */