/**
 * @param {Boolean} pointOutput
 * @param {dudeGraph.Point.pointDataTypedef} pointData
 * @class
 * @extends {dudeGraph.Point}
 */
dudeGraph.ResourcePoint = function (pointOutput, pointData) {
    dudeGraph.Point.call(this, pointOutput, _.merge(pointData, {
        "pointValueType": "Resource"
    }));

    /**
     * The value this point holds of type `pointValueType`
     * @type {dudeGraph.ResourcePoint.pointValueTypedef|null}
     * @protected
     * @override
     */
    this._pointValue = null;
};

dudeGraph.ResourcePoint.prototype = _.create(dudeGraph.Point.prototype, {
    "constructor": dudeGraph.ResourcePoint,
    "className": "ResourcePoint"
});

/**
 * Returns whether the point has no value
 * @returns {Boolean}
 * @override
 */
dudeGraph.ResourcePoint.prototype.emptyValue = function () {
    return this._pointValue === null || _.isUndefined(this._pointValue.resourceValue) || this._pointValue.resourceValue === null;
};

/**
 * Changes the point valueType
 * @param {String} valueType
 * @param {Boolean} [ignoreEmit=false]
 * @override
 */
dudeGraph.ResourcePoint.prototype.changeValueType = function (valueType, ignoreEmit) {
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
dudeGraph.ResourcePoint.prototype.changeValue = function (value, ignoreEmit) {
    // TODO: check if value is in resources
    dudeGraph.Point.prototype.changeValue.call(this, value, ignoreEmit);
};

/**
 * @typedef {Object} dudeGraph.Resource.pointValueTypedef
 * @property {String} resourceType
 * @property {Object|null} resourceValue
 */