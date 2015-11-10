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
    Object.defineProperty(this, "pointPosition", {
        get: function () {
            if (this.point.isOutput) {
                return [
                    this._renderBlock.nodeSize[0] - this._renderer.config.block.padding,
                    this._renderer.config.block.header + this._renderer.config.point.height * this._index
                ];
            } else {
                return [
                    this._renderer.config.block.padding,
                    this._renderer.config.block.header + this._renderer.config.point.height * this._index
                ];
            }
        }.bind(this)
    });

    /**
     * The point size in the d3Block
     * @type {[Number, Number]}
     * @private
     */
    Object.defineProperty(this, "pointSize", {
        get: function () {
            var textBoundingBox = this._renderer.textBoundingBox(this._point.cgName);
            return [
                textBoundingBox[0] + this._renderer.config.point.radius + this._renderer.config.point.padding,
                textBoundingBox[1]
            ];
        }.bind(this)
    });

    /**
     * The d3Point that holds this renderPoint
     * @type {d3.selection}
     * @private
     */
    this._d3PointGroup = null;
    Object.defineProperty(this, "d3PointGroup", {
        get: function () {
            return this._d3PointGroup;
        }.bind(this)
    });
};

/**
 * Creates the svg representation of this renderPoint
 * @param d3PointGroup
 */
dudeGraph.RenderPoint.prototype.create = function (d3PointGroup) {
    this._d3PointGroup = d3PointGroup;
    this._d3Circle = d3PointGroup
        .append("svg:circle");
    this._d3Text = d3PointGroup
        .append("svg:text")
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", this._point.isOutput ? "end" : "start");
};

/**
 * Updates the svg representation of this renderPoint
 */
dudeGraph.RenderPoint.prototype.update = function () {
    var position = this.pointPosition;
    this._d3Circle
        .attr({
            "cx": position[0],
            "cy": position[1],
            "r": this._renderer.config.point.radius
        });
    this._d3Text
        .text(this._point.cgName)
        .attr({
            "x": position[0],
            "y": position[1]
        }).attr("transform", function (renderPoint) {
        if (renderPoint._point.isOutput) {
            return "translate(" + [-renderPoint._renderer.config.point.radius * 2 - renderPoint._renderer.config.point.padding] + ")";
        } else {
            return "translate(" + [renderPoint._renderer.config.point.radius * 2 + renderPoint._renderer.config.point.padding] + ")";
        }
    });
};

/**
 * Removes the svg representation of this renderPoint
 */
dudeGraph.RenderPoint.prototype.remove = function () {

};