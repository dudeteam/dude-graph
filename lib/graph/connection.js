cg.Connection = (function () {

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
                throw new cg.GraphError("Connection() cgOutputPoint is not an output");
            }
            if (cgInputPoint.isOutput) {
                throw new cg.GraphError("Connection() cgInputPoint is not an input");
            }
        })();

        /**
         * The output point where the connection begins
         * @type {cg.Point}
         * @private
         */
        this._cgOutputPoint = cgOutputPoint;
        Object.defineProperty(this, "cgOutputPoint", {
            configurable: true,
            get: function () {
                return this._cgOutputPoint;
            }.bind(this)
        });

        /**
         * The input point where the connection ends
         * @type {cg.Point}
         * @private
         */
        this._cgInputPoint = cgInputPoint;
        Object.defineProperty(this, "cgInputPoint", {
            configurable: true,
            get: function () {
                return this._cgInputPoint;
            }.bind(this)
        });

    });

    return Connection;

})();