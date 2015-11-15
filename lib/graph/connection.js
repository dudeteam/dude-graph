//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Connection connects one output point to an input point
 * There can be only one connection for two given output/input points
 * @param {dudeGraph.Point} outputPoint
 * @param {dudeGraph.Point} inputPoint
 * @class
 */
dudeGraph.Connection = function (outputPoint, inputPoint) {

    /**
     * The output point where the connection begins
     * @type {dudeGraph.Point}
     * @private
     */
    Object.defineProperty(this, "cgOutputPoint", {
        get: function () {
            return this._cgOutputPoint;
        }.bind(this)
    });
    this._cgOutputPoint = outputPoint;
    if (!outputPoint.isOutput) {
        throw new Error("outputPoint is not an output");
    }

    /**
     * The input point where the connection ends
     * @type {dudeGraph.Point}
     * @private
     */
    Object.defineProperty(this, "cgInputPoint", {
        get: function () {
            return this._cgInputPoint;
        }.bind(this)
    });
    this._cgInputPoint = inputPoint;
    if (inputPoint.isOutput) {
        throw new Error("inputPoint is not an input");
    }

};

/**
 * Returns the other point
 * @param {dudeGraph.Point} cgPoint
 * returns {dudeGraph.Point}
 */
dudeGraph.Connection.prototype.otherPoint = function (cgPoint) {
    if (cgPoint === this._cgOutputPoint) {
        return this._cgInputPoint;
    } else if (cgPoint === this._cgInputPoint) {
        return this._cgOutputPoint;
    }
    throw new Error("Point `" + cgPoint.cgName + "` is not in this connection");
};

/**
 * Remove self from the connections
 */
dudeGraph.Connection.prototype.remove = function () {
    // TODO
};