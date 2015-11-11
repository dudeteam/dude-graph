/**
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.RenderBlock} renderBlock
 * @param {dudeGraph.Point} point
 * @param {Number} index
 * @constructor
 */
dudeGraph.RenderPoint = function (renderer, renderBlock, point, index) {
    /**
     * Reference on the renderer
     * @type {dudeGraph.Renderer}
     * @private
     */
    this._renderer = renderer;

    /**
     * The host renderBlock
     * @type {dudeGraph.RenderBlock}
     * @private
     */
    this._renderBlock = renderBlock;
    Object.defineProperty(this, "renderBlock", {
        get: function () {
            return this._renderBlock;
        }.bind(this)
    });

    /**
     * The point index in the renderBlock
     * @type {Number}
     * @private
     */
    this._index = index;
    Object.defineProperty(this, "index", {
        get: function () {
            return this._index;
        }.bind(this)
    });

    /**
     * The point
     * @type {dudeGraph.Point}
     * @private
     */
    this._point = point;
    Object.defineProperty(this, "point", {
        get: function () {
            return this._point;
        }.bind(this)
    });

    /**
     * The point position in the d3Block
     * @type {[Number, Number]}
     * @private
     */
    this._pointPosition = [0, 0];
    Object.defineProperty(this, "pointPosition", {
        get: function () {
            return this._pointPosition;
        }.bind(this)
    });

    /**
     * The point size in the d3Block
     * @type {[Number, Number]}
     * @private
     */
    this._pointSize = [0, 0];
    Object.defineProperty(this, "pointSize", {
        get: function () {
            return this._pointSize;
        }.bind(this)
    });

    /**
     * The point position in the d3Svg
     * @type {[Number, Number]}
     * @private
     */
    Object.defineProperty(this, "absolutePointPosition", {
        get: function () {
            var s = this._renderBlock.nodePosition;
            var v = this._pointPosition;
            return [
                s[0] + v[0],
                s[1] + v[1]
            ];
        }.bind(this)
    });

    /**
     * The d3Point that holds this renderPoint
     * @type {d3.selection}
     * @private
     */
    this._d3Point = null;
    Object.defineProperty(this, "d3Point", {
        get: function () {
            return this._d3Point;
        }.bind(this)
    });
};

/**
 * Creates the svg representation of this renderPoint
 * @param d3PointGroup
 */
dudeGraph.RenderPoint.prototype.create = function (d3PointGroup) {
    this._d3Point = d3PointGroup;
    this._d3Circle = d3PointGroup
        .append("svg:circle");
    this._d3Title = d3PointGroup
        .append("svg:text")
        .attr("text-anchor", this._point.isOutput ? "end" : "start")
        .attr("dominant-baseline", "middle");
    this.updateSize();
};

/**
 * Updates the svg representation of this renderPoint
 */
dudeGraph.RenderPoint.prototype.update = function () {
    var renderPoint = this;
    this._d3Circle
        .attr({
            "cx": this._pointPosition[0] + (this.point.isOutput ? -1 : 1) * this._renderer.config.point.radius / 2,
            "cy": this._pointPosition[1],
            "r": this._renderer.config.point.radius
        });
    this._d3Title
        .text(this._point.cgName)
        .attr({
            "x": this._pointPosition[0] + (this.point.isOutput ? -1 : 1) * this._renderer.config.point.padding,
            "y": this._pointPosition[1]
        });
    _.browserIf(["IE", "Edge"], function () {
        renderPoint._d3Title.attr("y",
            renderPoint._pointPosition[1] + renderPoint._renderer.measureText(renderPoint._d3Title)[1] / 4);
    });
};

/**
 * Removes the svg representation of this renderPoint
 */
dudeGraph.RenderPoint.prototype.remove = function () {

};

/**
 * Computes the renderPoint size
 */
dudeGraph.RenderPoint.prototype.updateSize = function () {
    var textBoundingBox = this._renderer.measureText(this._point.cgName);
    this._pointSize = [
        textBoundingBox[0] + this._renderer.config.point.padding * 2,
        this._renderer.config.point.height
    ];
};

/**
 * Computes the renderPoint position
 */
dudeGraph.RenderPoint.prototype.updatePosition = function () {
    if (this.point.isOutput) {
        this._pointPosition = [
            this._renderBlock.nodeSize[0] - this._renderer.config.point.padding,
            this._renderer.config.block.header + this._renderer.config.point.height * this._index
        ];
    } else {
        this._pointPosition = [
            this._renderer.config.point.padding,
            this._renderer.config.block.header + this._renderer.config.point.height * this._index
        ];
    }
};