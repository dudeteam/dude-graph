cg.Zoom = (function () {

    /**
     * @param {cg.Renderer} renderer
     * @param {Object} paper
     * @param {Object} rootElement
     * @constructor
     */
    function Zoom(renderer, paper, rootElement) {

        /**
         * Renderer
         * @type {cg.Renderer}
         * @private
         */
        this._renderer = renderer;

        /**
         * The SVG paper on which the zoom is created.
         * @type {Object}
         * @private
         */
        this._paper = paper;

        /**
         *
         * @type {Object}
         * @private
         */
        this._rootElement = rootElement;

        /**
         *
         * @type {null}
         * @private
         */
        this._config = null;

        /**
         *
         * @type {SVGMatrix}
         * @private
         */
        this._zoomTransform = null;
    }

    /**
     * Initialize zoom events.
     */
    Zoom.prototype.initialize = function () {
        this._zoomTransform = new Snap.Matrix();
        this._config = {
            "step": 0.1,
            "minZoom": 0.3,
            "maxZoom": 4
        };
        this._paper.drag(
            function move(dx, dy, x, y, e) {
                var ddx = dx - this._rootElement.data('cg.origin.delta').x;
                var ddy = dy - this._rootElement.data('cg.origin.delta').y;
                this._rootElement.data('cg.origin.delta').copy(new cg.Vec2(dx, dy));
                this._zoomTransform.translate(this.get(ddx), this.get(ddy));
                this._update();
            }.bind(this),
            function start(x, y, e) {
                this._rootElement.data('cg.origin.delta', new cg.Vec2());
            }.bind(this),
            function end(e) {

            }.bind(this)
        );
        cg.mouseWheel(this._paper.node, function (e, delta, direction) {
            this._zoomTransform.translate(this._renderer._mousePosition.x, this._renderer._mousePosition.y).scale(Math.pow(1 + this._config.step, delta)).translate(-this._renderer._mousePosition.x, -this._renderer._mousePosition.y);
            this._update();
        }.bind(this));
        this._update();
    };

    /**
     *
     * @private
     */
    Zoom.prototype._update = function () {
        this._renderer._grid.update(this._zoomTransform);
        this._rootElement.node.setAttribute("transform", this._zoomTransform.toString());
    };

    /**
     * Offset the value per zoom
     * @param {Number} x
     * @returns {Number}
     */
    Zoom.prototype.get = function (x) {
        return x / this._zoomTransform.a;
    };

    return Zoom;

})();