cg.Zoom = (function () {

    var dumpMatrix = function dumpMatrix(matrix) {
        return "matrix(" + matrix.a + "," + matrix.b + "," + matrix.c + "," + matrix.d + "," + matrix.e + "," + matrix.f + ")";
    };

    var getEventPoint = function (svg, event) {
        var point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        return point;
    };

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
        this._zoomTransform = this._rootElement.node.getCTM();
        this._config = {
            "step": 0.1,
            "minZoom": 0.3,
            "maxZoom": 4
        };
        this._paper.drag(
            function move(dx, dy, x, y, e) {
                var mousePosition = getEventPoint(this._paper.node, e).matrixTransform(this._rootElement.data("transform.originTransform"));
                this._zoomTransform = this._rootElement.data("transform.originTransform").inverse().translate(mousePosition.x - this._rootElement.data("transform.origin").x, mousePosition.y - this._rootElement.data("transform.origin").y);
                this._update();
            }.bind(this),
            function start(x, y, e) {
                var originTransform = this._rootElement.node.getCTM().inverse();
                this._rootElement.data("transform.originTransform", originTransform);
                this._rootElement.data("transform.origin", getEventPoint(this._paper.node, e).matrixTransform(originTransform));
            }.bind(this),
            function end(e) {

            }.bind(this)
        );
        cg.mouseWheel(this._paper.node, function (e, delta) {
            var scale = Math.pow(1 + 0.2, delta);
            var mousePosition = getEventPoint(this._paper.node, e);
            mousePosition = mousePosition.matrixTransform(this._rootElement.node.getCTM().inverse());
            var scaler = this._paper.node.createSVGMatrix().translate(mousePosition.x, mousePosition.y).scale(scale).translate(-mousePosition.x, -mousePosition.y);
            this._zoomTransform = this._rootElement.node.getCTM().multiply(scaler);
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
        this._rootElement.node.setAttribute("transform", dumpMatrix(this._zoomTransform));
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