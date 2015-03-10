cg.Connection = (function () {

    /**
     * Represent a connection between 2 points of the graph.
     * @param firstPoint {cg.Point}
     * @param secondPoint {cg.Point}
     * @constructor
     */
    function Connection(firstPoint, secondPoint) {
        cg.EventEmitter.call(this);

        /**
         * Represent the input point of the connection.
         * @type {cg.Point}
         * @private
         */
        this._inputPoint = firstPoint.isInput ? firstPoint : secondPoint;
        Object.defineProperty(this, "inputPoint", {
            get: function () { return this._inputPoint; }.bind(this)
        });

        /**
         * Represent the output point of the connection.
         * @type {cg.Point}
         * @private
         */
        this._outputPoint = firstPoint.isInput ? secondPoint : firstPoint;
        Object.defineProperty(this, "outputPoint", {
            get: function () { return this._outputPoint; }.bind(this)
        });

        /**
         * Contain some user defined data.
         * @type {Object}
         * @private
         */
        this._data = {};
        Object.defineProperty(this, "data", {
            get: function () { return this._data; }.bind(this),
            set: function (data) { this._data = data; }.bind(this)
        });

    }

    cg.inherit(Connection, cg.EventEmitter);

    /**
     * Return the point of the connection which is not the one given in parameter.
     * @param point {cg.Point}
     * @returns {cg.Point}
     */
    Connection.prototype.otherPoint = function (point) {
        return point === this._inputPoint ? this._outputPoint : this._inputPoint;
    };

    return Connection;

})();