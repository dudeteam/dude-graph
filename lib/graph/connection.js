cg.Connection = (function () {

    /**
     *
     * @constructor
     */
    var Connection = pandora.class_("Connection", function (cgInputPoint, cgOutputPoint) {
        /**
         *
         * @type {cg.Point}
         * @private
         */
        this._cgInputPoint = cgInputPoint;
        Object.defineProperty(this, "cgInputPoint", {
            get: function () {
                return this._cgInputPoint;
            }.bind(this)
        });

        /**
         *
         * @type {cg.Point}
         * @private
         */
        this._cgOutputPoint = cgOutputPoint;
        Object.defineProperty(this, "cgOutputPoint", {
            get: function () {
                return this._cgOutputPoint;
            }.bind(this)
        });
    });

    return Connection;

})();