/**
 * @param {Boolean} pointOutput
 * @param {dudeGraph.Point.pointDataTypedef} pointData
 * @class
 * @extends {dudeGraph.Point}
 */
dudeGraph.VariablePoint = function (pointOutput, pointData) {
    dudeGraph.Point.call(this, pointOutput, pointData);
};

dudeGraph.VariablePoint.prototype = _.create(dudeGraph.Point.prototype, {
    "constructor": dudeGraph.VariablePoint,
    "className": "VariablePoint"
});

/**
 * Changes the point value
 * @param {Object|null} value
 * @param {Boolean} [ignoreEmit=false]
 * @override
 */
dudeGraph.Point.prototype.changeValue = function (value, ignoreEmit) {
    if (value !== null) {
        throw new Error("`" + this.pointFancyName + "` cannot change point variable value");
    }
};