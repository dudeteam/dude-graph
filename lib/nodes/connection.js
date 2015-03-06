cg.Connection = (function () {

    /**
     * Represent a connection between 2 points of the graph.
     * @param firstPoint {cg.Point}
     * @param secondPoint {cg.Point}
     * @constructor
     */
    function Connection(firstPoint, secondPoint) {
        this._firstPoint = firstPoint;
        this._secondPoint = secondPoint;
        this._data = {};
    }

    Connection.prototype.__proto__ = {
        get firstPoint() { return this._firstPoint; },
        get secondPoint() { return this._secondPoint; },
        get data() { return this._data; },
        set data(data) { this._data = data; }
    };

    return Connection;

})();