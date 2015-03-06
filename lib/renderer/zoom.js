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
         * Zoom value
         * @type {Number}
         * @private
         */
        this._zoom = 1;

        /**
         * Pan value
         * @type {Number[]}
         * @private
         */
        this._pan = [0, 0];

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

    }

    Zoom.prototype.__proto__ = {
      get zoom() { return this._zoom; },
      get pan() { return this._pan; }
    };

    /**
     * Initialize zoom events.
     */
    Zoom.prototype.initialize = function () {
        this._update();
        this._paper.drag(
            function move(dx, dy, x, y) {
                this._rootElement.transform(this._rootElement.data("originTransform") + (this._rootElement.data("originTransform") ? "T" : "t") + [dx, dy]);
                this._pan = [this._paper.getBBox().x, this._paper.getBBox().y];
            }.bind(this),
            function start() {
                this._rootElement.data("originTransform", this._rootElement.transform().local);
            }.bind(this),
            cg.defaultCallback
        );

        cg.mouseWheel(this._paper.node, function (direction) {
            this.add(0.1 * direction);
        }.bind(this));
    };

    /**
     * Update the zoom and pan.
     * @private
     */
    Zoom.prototype._update = function () {
        this._rootElement.transform("S" + this._zoom + "T" + this._pan);
    };

    /**
     * Add the zoom value.
     * @param x
     */
    Zoom.prototype.add = function (x) {
        if (this._zoom + x <= 0) {
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