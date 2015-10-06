dudeGraph.Connection = (function () {

    /**
     * Connection connects one output point to an input point
     * There can be only one connection for two given output/input points
     * @constructor
     */
    var Connection = pandora.class_("Connection", function (cgOutputPoint, cgInputPoint) {
        /**
         * Check if the points are correct
         */
        (function Initialization() {
            if (!cgOutputPoint.isOutput) {
                throw new Error("cgOutputPoint is not an output");
            }
            if (cgInputPoint.isOutput) {
                throw new Error("cgInputPoint is not an input");
            }
        })();

        /**
         * The output point where the connection begins
         * @type {dudeGraph.Point}
         * @private
         */
        this._cgOutputPoint = cgOutputPoint;
        Object.defineProperty(this, "cgOutputPoint", {
            get: function () {
                return this._cgOutputPoint;
            }.bind(this)
        });

        /**
         * The input point where the connection ends
         * @type {dudeGraph.Point}
         * @private
         */
        this._cgInputPoint = cgInputPoint;
        Object.defineProperty(this, "cgInputPoint", {
            get: function () {
                return this._cgInputPoint;
            }.bind(this)
        });

    });

    /**
     * Returns the other point
     * @param {dudeGraph.Point} cgPoint
     * returns {dudeGraph.Point}
     */
    Connection.prototype.otherPoint = function (cgPoint) {
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
    Connection.prototype.remove = function () {
        // TODO
    };

    return Connection;

})();