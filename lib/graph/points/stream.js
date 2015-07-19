cg.Stream = (function () {

    /**
     * A stream
     * @type {Function}
     */
    var Stream = pandora.class_("Stream", cg.Point, function (cgBlock, cgName, isOutput) {
        cg.Point.call(cgBlock, cgName, isOutput);

        /**
         * A stream in
         */
        (function Initialization() {
            if (!isOutput) {
                this._cgMaxConnections = 1;
            }
        })();
    });

    return Stream;

})();