/**
 * Represent a connection between 2 points of the graph.
 * @param firstPoint
 * @param secondPoint
 * @constructor
 */
cg.Connection = function (firstPoint, secondPoint) {
    this._firstPoint = firstPoint;
    this._secondPoint = secondPoint;
};

cg.Connection.prototype = {
    get firstPoint() { return this._firstPoint; },
    get secondPoint() { return this._secondPoint; }
};