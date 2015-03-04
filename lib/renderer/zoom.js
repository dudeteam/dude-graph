cg.Zoom = (function () {

    /**
     *
     * @param {Object} paper
     * @param {Object} rootElement
     * @constructor
     */
    function Zoom(paper, rootElement) {

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

        this._rootElement = rootElement;

        this._initialize(paper);
    }

    /**
     *
     * @param {Object} paper
     */
    Zoom.prototype._initialize = function (paper) {
        this._update();
        paper.drag(
            function move(dx, dy) {
                this._rootElement.transform(this._rootElement.data("originTransform") + (this._rootElement.data("originTransform") ? "T" : "t") + [dx, dy]);
            }.bind(this),
            function start() {
                this._rootElement.data("originTransform", this._rootElement.transform().local);
            }.bind(this),
            cg.defaultCallback
        );
    };

    Zoom.prototype._update = function () {
        this._rootElement.transform("S" + this._zoom + "T" + this._pan);
    };

    /**
     * Add the zoom value.
     * @param x
     */
    Zoom.prototype.add = function (x) {
        if (this._zoom - x <= 0) {
            return;
        }
        this._zoom += x;
        this._update();
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