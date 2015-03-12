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
            "step": 0.2,
            "minZoom": 0.3,
            "maxZoom": 4
        };
        this._paper.drag(
            function move(dx, dy) {
                var ddx = dx - this._rootElement.data('cg.origin.delta').x;
                var ddy = dy - this._rootElement.data('cg.origin.delta').y;
                this._rootElement.data('cg.origin.delta').assign(dx, dy);
                this._zoomTransform.translate(this.get(ddx), this.get(ddy));
                this._update();
            }.bind(this),
            function start(x, y, e) {
                pandora.preventCallback(e);
                this._rootElement.data('cg.origin.delta', new pandora.Vec2());
            }.bind(this),
            function end() {
                this._rootElement.data('cg.origin.delta', null);
            }.bind(this)
        );
        pandora.mouseWheel(this._paper.node, function (e, delta) {
            pandora.preventCallback(e);
            var scaleFactor = Math.pow(1 + this._config.step, delta);
            var nextZoom = this._zoomTransform.a * scaleFactor;
            if (nextZoom > this._config.maxZoom || nextZoom < this._config.minZoom) {
                return;
            }
            this._zoomTransform.translate(this._renderer._mousePosition.x, this._renderer._mousePosition.y).scale(scaleFactor).translate(-this._renderer._mousePosition.x, -this._renderer._mousePosition.y);
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