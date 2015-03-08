cg.Connection = (function () {

    /**
     * Represent a connection between 2 points of the graph.
     * @param firstPoint {cg.Point}
     * @param secondPoint {cg.Point}
     * @constructor
     */
    function Connection(firstPoint, secondPoint) {
        if (!firstPoint.isInput) {
            this._outputPoint = firstPoint;
            this._inputPoint = secondPoint;
        } else {
            this._outputPoint = secondPoint;
            this._inputPoint = firstPoint;
        }
        this._data = {};
    }

    Connection.prototype.__proto__ = {
        get outputPoint() { return this._outputPoint; },
        get inputPoint() { return this._inputPoint; },
        get data() { return this._data; },
        set data(data) { this._data = data; }
    };

    return Connection;

})();