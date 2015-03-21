cg.Renderer.Point = (function () {

    /**
     * Represent a point which is created at the cursor position, used to create connections.
     * @param sourcePoint {cg.Point}
     * @param position {pandora.Vec2}
     * @constructor
     */
    return pandora.class_("Point", pandora.EventEmitter, function (sourcePoint, position) {
        pandora.EventEmitter.call(this);

        /**
         * Point type.
         * @type {Number}
         * @private
         */
        this._type = sourcePoint.type;
        Object.defineProperty(this, "type", {
            get: function () { return this._type; }.bind(this)
        });

        /**
         * Point position.
         * @type {pandora.Vec2}
         * @private
         */
        this._position = position;
        Object.defineProperty(this, "position", {
            get: function () { return this._position; }.bind(this)
        });

        /**
         * Point is input.
         * @type {boolean}
         * @private
         */
        this._isInput = !sourcePoint.isInput;
        Object.defineProperty(this, "isInput", {
            get: function () { return this._isInput; }.bind(this)
        });

        /**
         * Point source point.
         * @type {cg.Point}
         * @private
         */
        this._sourcePoint = sourcePoint;
        Object.defineProperty(this, "sourcePoint", {
            get: function () { return this._sourcePoint; }.bind(this)
        });
    });

})();