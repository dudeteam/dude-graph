cg.Zoom = (function () {

    function Zoom() {

        /**
         *
         * @type {Number}
         * @private
         */
        this._zoom = 1;

        /**
         *
         * @type {Number[]}
         * @private
         */
        this._pan = [0, 0];

    }

    Zoom.prototype.initialize = function (paper, rootElement) {
        rootElement.transform("S" + this._zoom + "T" + this._pan);
        paper.drag(
            function move(dx, dy) {
                rootElement.transform(rootElement.data('originTransform') + (rootElement.data('originTransform') ? "T" : "t") + [dx, dy]);
            },
            function start() {
                rootElement.data('originTransform', rootElement.transform().local);
            },
            cg.defaultCallback
        );
    };

    /**
     * Offset the value per zoom
     * @param {Number} x
     * @returns {Number}
     */
    Zoom.prototype.get = function (x) {
        return x / this._zoom;
    };

    return Zoom;

})();