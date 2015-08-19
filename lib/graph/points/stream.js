cg.Stream = (function () {

    /**
     * A stream
     * @type {Function}
     */
    var Stream = pandora.class_("Stream", cg.Point, function (cgBlock, data, isOutput) {
        cg.Point.call(this, cgBlock, {
            cgName: data.cgName,
            cgValueType: "Stream"
        }, isOutput);
        this._cgMaxConnections = 1;
        Object.defineProperty(this, "cgValue", {
            get: function () {
                throw new cg.GraphError("Stream has no `cgValue`.");
            }.bind(this),
            set: function () {
                throw new cg.GraphError("Stream has no `cgValue`.");
            }.bind(this)
        });
    });

    /**
     * Returns a copy of this Stream
     * @param {cg.Block} cgBlock - The block on which the cloned stream will be attached to
     * @returns {*}
     */
    Stream.prototype.clone = function (cgBlock) {
        return new cg.Stream(cgBlock, this._cgName, this._isOutput);
    };

    return Stream;

})();