/**
 *
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.RenderBlock} renderBlock
 * @param {dudeGraph.RenderPoint} point
 * @class
 * @extends {dudeGraph.RenderPoint}
 */
dudeGraph.RenderPointVariable = function (renderer, renderBlock, point) {
    dudeGraph.RenderPoint.call(this, renderer, renderBlock, point);
};

dudeGraph.RenderPointVariable.prototype = _.create(dudeGraph.RenderPoint.prototype, {
    "constructor": dudeGraph.RenderPointVariable
});

/**
 * Creates the svg representation of this renderPoint
 * @param {d3.selection} d3PointGroup
 */
dudeGraph.RenderPointVariable.prototype.create = function (d3PointGroup) {
    dudeGraph.RenderPoint.prototype.create.call(this, d3PointGroup);
    this._d3Title.text("");
};

/**
 * Updates the svg representation of this renderPoint
 */
dudeGraph.RenderPointVariable.prototype.update = function () {
    var pointColor = this._renderer.config.typeColors[this.point.pointValueType] || this._renderer.config.defaultColor;
    this._d3Point.attr("transform", "translate(" + this.pointPosition + ")");
    this._d3Circle
        .attr({
            "stroke": pointColor,
            "fill": this.empty() ? "transparent" : pointColor
        });
};

/**
 * Computes the renderPoint size
 */
dudeGraph.RenderPointVariable.prototype.computeSize = function () {
    this._pointSize = [
        90 + this._renderer.config.point.padding * 2,
        this._renderer.config.point.height
    ];
};

/**
 * Computes the renderPoint position
 */
dudeGraph.RenderPointVariable.prototype.computePosition = function () {
    this._pointPosition = [
        this._renderBlock.nodeSize[0] - this._renderer.config.point.padding,
        this._renderBlock.nodeSize[1] / 2
    ];
};

/**
 * RenderPoint factory
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.RenderBlock} renderBlock
 * @param {Object} renderPointData
 * @param {dudeGraph.Point} renderPointData.point
 * @param {Object} renderPointData.renderPoint
 * @param {Boolean} [renderPointData.renderPoint.hidden=false]
 * @returns {dudeGraph.RenderPoint}
 */
dudeGraph.RenderPointVariable.buildRenderPoint = function (renderer, renderBlock, renderPointData) {
    return dudeGraph.RenderPoint.buildRenderPoint.call(this, renderer, renderBlock, renderPointData);
};