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

    /**
     * The connection fancy name
     * @type {String}
     */
    Object.defineProperty(this, "connectionFancyName", {
        get: function () {
            return this._connectionOutputPoint.pointFancyName + " => " + this._connectionInputPoint.pointFancyName;
        }.bind(this)
    });

    this.initialize();
};

/**
 * Initializes the connection
 */
dudeGraph.Connection.prototype.initialize = function () {
    if (!this._connectionOutputPoint.pointOutput) {
        throw new Error("`" + this._connectionOutputPoint.pointFancyName + "` must be an output");
    }
    if (this._connectionInputPoint.pointOutput) {
        throw new Error("`" + this._connectionInputPoint.pointFancyName + "` must be an input");
    }
};

/**
 * Returns the other point in the connection
 * @param {dudeGraph.Point} point
 * @returns {dudeGraph.Point}
 */
dudeGraph.Connection.prototype.other = function (point) {
    switch (point) {
        case this._connectionOutputPoint:
            return this._connectionInputPoint;
        case this._connectionInputPoint:
            return this._connectionOutputPoint;
    }
    throw new Error("`" + this.connectionFancyName + "` has no point `" + point.pointFancyName + "`");
};

/**
 * Removes the connection between the two connected points
 */
dudeGraph.Connection.prototype.remove = function () {
    this._connectionOutputPoint.disconnect(this._connectionInputPoint);
};