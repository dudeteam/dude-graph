cg.Connection = (function () {

    /**
     *
     * @extends {pandora.EventEmitter}
     * @constructor
     */
    var Connection = pandora.class_("Connection", pandora.EventEmitter, function (cgInputPoint, cgOutputPoint) {
        pandora.EventEmitter.call(this);

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