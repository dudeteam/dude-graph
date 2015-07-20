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

    return Stream;

})();