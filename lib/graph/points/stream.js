dudeGraph.Stream = (function () {

    /**
     * A stream
     * @type {Function}
     */
    var Stream = pandora.class_("Stream", dudeGraph.Point, function (cgBlock, data, isOutput) {
        dudeGraph.Point.call(this, cgBlock, {
            cgName: data.cgName,
            cgValueType: "Stream"
        }, isOutput, "Stream");
        this._singleConnection = true;
        Object.defineProperty(this, "cgValue", {
            get: function () {
                throw new Error("Stream has no `cgValue`.");
            }.bind(this),
            set: function () {
                throw new Error("Stream has no `cgValue`.");
            }.bind(this)
        });
    });

    /**
     * Returns a copy of this Stream
     * @param {dudeGraph.Block} cgBlock - The block on which the cloned stream will be attached to
     * @returns {*}
     */
    Stream.prototype.clone = function (cgBlock) {
        return new dudeGraph.Stream(cgBlock, this._cgName, this._isOutput);
    };

    return Stream;

})();