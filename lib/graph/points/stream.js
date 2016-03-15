/**
 * This specific point represent a stream. In other words, it's an abstract way to order instruction blocks into
 * the graph. This type doesn't transform data but represents the execution stream. That's why it can't hold a value
 * or have a specific value type.
 * @param {Boolean} pointOutput
 * @param {dudeGraph.Point.pointDataTypedef} pointData
 * @class
 * @extends {dudeGraph.Point}
 */
dudeGraph.StreamPoint = function (pointOutput, pointData) {
    dudeGraph.Point.call(this, pointOutput, _.merge(pointData, {
        "pointValueType": "Stream"
    }));
};

dudeGraph.StreamPoint.prototype = _.create(dudeGraph.Point.prototype, {
    "constructor": dudeGraph.StreamPoint,
    "className": "StreamPoint"
});