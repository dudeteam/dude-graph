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
        this._pan = new cg.Vec2();

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
        var self = this;
        this._update();
        this._paper.drag(
            function move(dx, dy) {
                var ddx = dx - this.data('cg.origin.dx');
                var ddy = dy - this.data('cg.origin.dy');
                this.data('cg.origin.dx', dx);
                this.data('cg.origin.dy', dy);
                self._pan.x += ddx;
                self._pan.y += ddy;
                self._update();
            },
            function start(x, y, e) {
                cg.preventCallback(e);
                this.data('cg.origin.dx', 0);
                this.data('cg.origin.dy', 0);
            },
            cg.defaultCallback()
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
        this._paper.background.update(this._zoom, this._pan);
        this._rootElement.transform("S" + this._zoom + "T" + this._pan.toArray());
    };

    /**
     * Add the zoom value.
     * @param x
     */
    Zoom.prototype.add = function (x) {
        if (this._zoom + x <= 0.1) {
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