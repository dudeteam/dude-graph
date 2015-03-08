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
        Object.defineProperty(this, "zoom", {
           get: function() { return this._zoom;}.bind(this)
        });

        /**
         * Pan value
         * @type {cg.Vec2}
         * @private
         */
        this._pan = new cg.Vec2();
        Object.defineProperty(this, "pan", {
            get: function() { return this._pan;}.bind(this)
        });

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

    }

    /**
     * Initialize zoom events.
     */
    Zoom.prototype.initialize = function () {
        this._config = {
            "min-zoom": 0.3,
            "max-zoom": 4
        };
        this._update();
        this._paper.drag(
            function move(dx, dy) {
                var ddx = dx - this._paper.data('cg.origin.delta').x;
                var ddy = dy - this._paper.data('cg.origin.delta').y;
                this._paper.data('cg.origin.delta').copy(new cg.Vec2(dx, dy));
                this._pan.add(new cg.Vec2(ddx, ddy));
                this._update();
            }.bind(this),
            function start(x, y, e) {
                cg.preventCallback(e);
                this._paper.data('cg.origin.delta', new cg.Vec2());
            }.bind(this),
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
        if (this._zoom + x <= this._config["min-zoom"] || this._zoom + x >= this._config["max-zoom"]) {
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