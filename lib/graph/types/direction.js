cg.Direction = (function() {

    /**
     * The class direction represents a directional connection from a block point to another block point
     * A connection is the gathering of two points pointing to the same blocks/points
     * @constructor
     */
    var Direction = pandora.class_("Direction", function(toBlock, toPoint) {

        /**
         * The block
         * @type {cg.Block}
         * @private
         */
        this._toBlock = toBlock;
        Object.defineProperty(this, "toBlock", {
            get: function() { return this._toBlock; }.bind(this)
        });

        /**
         * The point name
         * @type {String}
         * @private
         */
        this._toPoint = toPoint;
        Object.defineProperty(this, "toPoint", {
            get: function() { return this._toPoint; }.bind(this)
        });

    });

    return Direction;

})();