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
         * The root group element.
         * @type {Object}
         * @private
         */
        this._rootElement = rootElement;

        /**
         * The zoom configuration.
         * @type {null}
         * @private
         */
        this._config = null;

        /**
         * The matrix transform of the pan/zoom.
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
        pandora.mouseWheel(this._paper.node, function (e, delta) {
            pandora.preventCallback(e);
            var scaleFactor = Math.pow(1 + this._config.step, delta);
            var nextZoom = this._zoomTransform.a * scaleFactor;
            if (nextZoom > this._config.maxZoom || nextZoom < this._config.minZoom) {
                return;
            }
            var mousePosition = this._renderer._positionToSvg(e.clientX, e.clientY);
            this._zoomTransform.translate(mousePosition.x, mousePosition.y).scale(scaleFactor).translate(-mousePosition.x, -mousePosition.y);
            this._update();
        }.bind(this));
        this._update();
    };

    /**
     * Pan to the coordinates.
     * @param pan {pandora.Vec2}
     * @param applyZoomCoefficient {Boolean?}
     */
    Zoom.prototype.translatePan = function(pan, applyZoomCoefficient) {
        this._zoomTransform.translate(pan.x / (applyZoomCoefficient ? this._zoomTransform.a : 1), pan.y / (applyZoomCoefficient ? this._zoomTransform.a : 1));
        this._update();
    };

    /**
     * Offset the value per zoom
     * @param {Number} x
     * @returns {Number}
     */
    Zoom.prototype.get = function (x) {
        return x / this._zoomTransform.a;
    };

    /**
     * Update the zoom.
     * @private
     */
    Zoom.prototype._update = function () {
        this._renderer._grid.update(this._zoomTransform);
        this._rootElement.node.setAttribute("transform", this._zoomTransform.toString());
    };

    return Zoom;

})();