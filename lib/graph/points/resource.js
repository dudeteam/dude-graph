/**
 * @param {Boolean} pointOutput
 * @param {dudeGraph.Point.pointDataTypedef} pointData
 * @class
 * @extends {dudeGraph.Point}
 */
dudeGraph.Resource = function (pointOutput, pointData) {
    dudeGraph.Point.call(this, pointOutput, _.merge(pointData, {
        "pointValueType": "Resource"
    }));

    /**
     * The value this point holds of type `pointValueType`
     * @type {dudeGraph.Resource.pointValueTypedef|null}
     * @protected
     * @override
     */
    this._pointValue = null;
};

dudeGraph.Resource.prototype = _.create(dudeGraph.Point.prototype, {
    "constructor": dudeGraph.Resource,
    "className": "Resource"
});

/**
 * Returns whether the point has no value
 * @returns {Boolean}
 * @override
 */
dudeGraph.Resource.prototype.emptyValue = function () {
    return this._pointValue === null || _.isUndefined(this._pointValue.resourceValue) || this._pointValue.resourceValue === null;
};

/**
 * Changes the point valueType
 * @param {String} valueType
 * @param {Boolean} [ignoreEmit=false]
 * @override
 */
dudeGraph.Resource.prototype.changeValueType = function (valueType, ignoreEmit) {
    if (valueType !== "Resource") {
        throw new Error("`" + this._pointValue + "` can only be of value type `Resource`");
    }
    dudeGraph.Point.prototype.changeValueType.call(this, valueType, ignoreEmit);
};

/**
 * Changes the point value
 * @param {Object|null} value
 * @param {Boolean} [ignoreEmit=false]
 * @override
 */
dudeGraph.Resource.prototype.changeValue = function (value, ignoreEmit) {
    // TODO: check value is in resources
    dudeGraph.Point.prototype.changeValue.call(this, value, ignoreEmit);
};

/**
 * Global resources
 * @type {Array}
 */
dudeGraph.Resources = [];

/**
 * @typedef {Object} dudeGraph.Resource.pointValueTypedef
 * @property {String} resourceType
 * @property {Object|null} resourceValue
 */