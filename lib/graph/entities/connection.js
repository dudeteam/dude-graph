cg.Connection = (function () {

    /**
     * Represent a connection between 2 points of the graph.
     * @param firstPoint {cg.Point}
     * @param secondPoint {cg.Point}
     * @constructor
     */
    var Connection = pandora.class_("Connection", pandora.EventEmitter, function (firstPoint, secondPoint) {
        pandora.EventEmitter.call(this);

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

    });

    /**
     * Check whether the 2 connections are the same.
     * @param other {cg.Connection}
     * @returns {boolean}
     */
    Connection.prototype.equal = function (other) {
        return this._inputPoint === other._inputPoint && this._outputPoint === other._outputPoint;
    };

    /**
     * Return the point of the connection which is not the one given in parameter.
     * @param point {cg.Point}
     * @returns {cg.Point}
     */
    Connection.prototype.otherPoint = function (point) {
        return point === this._inputPoint ? this._outputPoint : this._inputPoint;
    };

    /**
     * Replace the point of the connection which is not the one given in parameter.
     * @param source {cg.Point}
     * @param target {cg.Point}
     */
    Connection.prototype.replacePoint = function (source, target) {
        if (target.isInput !== source.isInput) {
            this._graph.emit("error", new cg.GraphError("Cannot link " + (source.isInput ? "inputs" : "outputs") + " together"));
            return false;
        }
        if (this._inputPoint === source) {
            this._inputPoint = target;
        } else {
            this._outputPoint = target;
        }
        return true;
    };

    return Connection;

})();