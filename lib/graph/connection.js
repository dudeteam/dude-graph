/**
 * Connection between an output point and an input point
 * @param {dudeGraph.Point} connectionOutputPoint
 * @param {dudeGraph.Point} connectionInputPoint
 * @class
 */
dudeGraph.Connection = function (connectionOutputPoint, connectionInputPoint) {
    /**
     * The output point connected to the input point
     * @type {dudeGraph.Point}
     * @private
     */
    this._connectionOutputPoint = connectionOutputPoint;
    Object.defineProperty(this, "connectionOutputPoint", {
        get: function () {
            return this._connectionOutputPoint;
        }.bind(this)
    });

    /**
     * The input point connected to the output point
     * @type {dudeGraph.Point}
     * @private
     */
    this._connectionInputPoint = connectionInputPoint;
    Object.defineProperty(this, "connectionInputPoint", {
        get: function () {
            return this._connectionInputPoint;
        }.bind(this)
    });
};

/**
 *
 */
dudeGraph.Connection.prototype.validate = function () {};
/**
 *
 * @param {dudeGraph.Point} point
 * @returns {dudeGraph.Point}
 */
dudeGraph.Connection.prototype.other = function (point) {};
/**
 *
 */
dudeGraph.Connection.prototype.remove = function () {};