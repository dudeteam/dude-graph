/**
 * @param {Boolean} pointOutput
 * @param {dudeGraph.Point.pointDataTypedef} pointData
 * @class
 * @extends {dudeGraph.Point}
 */
dudeGraph.ResourcePoint = function (pointOutput, pointData) {
    dudeGraph.Point.call(this, pointOutput, pointData);
};

dudeGraph.ResourcePoint.prototype = _.create(dudeGraph.Point.prototype, {
    "constructor": dudeGraph.ResourcePoint,
    "className": "ResourcePoint"
});