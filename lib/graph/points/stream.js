cg.Stream = (function () {

    /**
     * A stream
     * @type {Function}
     */
    var Stream = pandora.class_("Stream", cg.Point, function (cgBlock, cgName, isOutput) {
        cg.Point.call(this, cgBlock, cgName, isOutput);
        this._cgMaxConnections = 1;
        this._cgValue = null;
        this._cgValueType = null;
        this._cgValueTypesAllowed = [];
    });

    /**
     * Returns a copy of this Stream
     * @param cgBlock {cg.Block} The block on which the cloned stream will be attached to
     * @returns {*}
     */
    Stream.prototype.clone = function (cgBlock) {
        return new cg.Stream(cgBlock, this._cgName, this._isOutput);
    };

    return Stream;

})();