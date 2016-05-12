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
     * @type {dudeGraph.Graph.graphValueTypeTypedef|null}
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
     * The value this point holds of type `pointValueType`
     * @type {*|null}
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
     * The point property
     * @type {Object}
     * @private
     */
    this._pointPropertyData = {};
    Object.defineProperty(this, "pointPropertyData", {
        get: function () {
            return this._pointPropertyData;
        }.bind(this),
        set: function (pointPropertyData) {
            this._pointPropertyData = pointPropertyData;
        }.bind(this)
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
     * The point policy
     * @type {Number}
     * @private
     */
    this._pointPolicy = 0;
    Object.defineProperty(this, "pointPolicy", {
        get: function () {
            return this._pointPolicy;
        }.bind(this)
    });

    /**
     * The point fancy name
     * @type {String}
     */
    Object.defineProperty(this, "pointFancyName", {
        get: function () {
            return "Point (`" + this._pointName + "` in " + (this._pointBlock ? this._pointBlock.blockFancyName : "Unbound") + ")";
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
    var defaultPointPolicy = ["VALUE", "SINGLE_CONNECTION", "CONVERSION"];
    this._pointName = pointData.pointName;
    this._pointTemplate = pointData.pointTemplate || null;
    this._pointValueType = pointData.pointValueType;
    this._pointValue = !_.isUndefined(pointData.pointValue) ? pointData.pointValue : null;
    this._pointPolicy = dudeGraph.PointPolicy.deserialize(pointData.pointPolicy || defaultPointPolicy);
    if (!_.isString(this._pointName)) {
        throw new Error("`" + this.pointFancyName + "` `pointName` must be a non-null String");
    }
    if (this._pointTemplate === null && !_.isString(this._pointValueType)) {
        throw new Error("`" + this.pointFancyName +
            "` `pointValueType` must be a non-null String if no `pointTemplate` is provided");
    }
    if (this.hasPolicy(dudeGraph.PointPolicy.SINGLE_CONNECTION) && this.hasPolicy(dudeGraph.PointPolicy.MULTIPLE_CONNECTIONS)) {
        throw new Error("`" + this.pointFancyName + "` `pointPolicy` cannot be `SINGLE_CONNECTION` and `MULTIPLE_CONNECTIONS`");
    }
};

/**
 * Validate the point when added to the block
 */
dudeGraph.Point.prototype.validate = function () {
    if (this._pointTemplate === null) {
        this.changeValueType(this._pointValueType, true);
    } else {
        var template = this._pointBlock.templateByName(this._pointTemplate);
        if (template === null) {
            throw new Error("`" + this.pointFancyName + "` has no template `" + this._pointTemplate + "`");
        }
        this.changeValueType(template.valueType, true);
    }
    this.changeValue(this._pointValue, true);
};

/**
 * Returns whether this point has the given labelPolicy
 * @param {Number} policy
 * @returns {Boolean}
 */
dudeGraph.Point.prototype.hasPolicy = function (policy) {
    return dudeGraph.PointPolicy.has(this._pointPolicy, policy);
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
    if (this._pointBlock.blockGraph.graphValueTypeByName(valueType) === null) {
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
 * @param {*|null} value
 * @param {Boolean} [ignoreEmit=false]
 */
dudeGraph.Point.prototype.changeValue = function (value, ignoreEmit) {
    if (this._pointBlock === null) {
        throw new Error("`" + this.pointFancyName + "` cannot change value when not bound to a block");
    }
    if (value !== null && !this.emptyConnection()) {
        throw new Error("`" + this.pointFancyName + "` cannot change value when connected to another point");
    }
    if (value !== null && !this.hasPolicy(dudeGraph.PointPolicy.VALUE)) {
        throw new Error("`" + this.pointFancyName + "` cannot change value when the policy `VALUE` is disabled");
    }
    var oldValue = this._pointValue;
    var assignValue = this._pointBlock.blockGraph.convertValue(this._pointValueType, value);
    if (_.isUndefined(assignValue)) {
        throw new Error("`" + this._pointBlock.blockGraph.graphFancyName + "` " + value +
            "` is not compatible with type `" + this._pointValueType + "`");
    }
    this._pointValue = assignValue;
    if (!ignoreEmit) {
        this.emit("value-change", assignValue, oldValue);
        this._pointBlock.blockGraph.emit("point-value-change", this, assignValue, oldValue);
        this._pointBlock.pointValueChanged(this, assignValue, oldValue);
    }
};

/**
 * Whether this point accepts to connect to the given point
 * @param {dudeGraph.Point} point
 * @returns {Boolean}
 */
dudeGraph.Point.prototype.acceptConnect = function (point) {
    return point === point;
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
 * @typedef {Object} dudeGraph.Point.pointDataTypedef
 * @property {String} pointName
 * @property {String|null} [pointTemplate=null]
 * @property {String} [pointValueType=null]
 * @property {*|null} [pointValue=null]
 * @property {Array<String>} [pointPolicy=["VALUE", "SINGLE_CONNECTION", "CONVERSION"]]
 */

/**
 * @type {Object}
 */
dudeGraph.PointPolicy = {
    /**
     * Whether this point can have a pointValue
     */
    "VALUE": 1,

    /**
     * Whether this point can only have one connection
     */
    "SINGLE_CONNECTION": 2,

    /**
     * Whether this point can have zero, one or more connections
     */
    "MULTIPLE_CONNECTIONS": 4,

    /**
     * Whether this point can convert its pointValueType
     */
    "CONVERSION": 8,

    /**
     * Serializes the policy number to an array of policy labels
     * @param {Number} policy
     */
    "serialize": function (policy) {
        var labels = [];
        for (var labelPolicy in this) {
            if (this.hasOwnProperty(labelPolicy)) {
                if (_.isNumber(this[labelPolicy])) {
                    if ((this[labelPolicy] & policy) !== 0) {
                        labels.push(labelPolicy);
                    }
                }
            }
        }
        return labels;
    },

    /**
     * Deserializes the policy labels into a policy number
     * @param {Array<String>} labels
     */
    "deserialize": function (labels) {
        var self = this;
        var policy = 0;
        _.forEach(labels, function (labelPolicy) {
            var labelPolicyValue = self[labelPolicy];
            if (typeof labelPolicyValue === "undefined") {
                throw new Error("`"+ labelPolicy + "` is not a valid point policy");
            }
            policy |= labelPolicyValue;
        });
        return policy;
    },

    /**
     * Returns whether the given policy includes the given policyLabel
     * @param {Number} policy
     * @param {Number} checkPolicy
     * @returns {Boolean}
     */
    "has": function (policy, checkPolicy) {
        return (policy & checkPolicy) !== 0;
    }
};