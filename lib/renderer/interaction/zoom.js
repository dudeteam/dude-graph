/**
 * Creates zoom and pan
 * @private
 */
dudeGraph.Renderer.prototype._createZoomBehavior = function () {
    var renderer = this;
    this._zoomBehavior = d3.behavior.zoom()
        .scaleExtent([this._config.zoom.min, this._config.zoom.max])
        .on("zoom", function () {
            if (d3.event.sourceEvent) {
                dudeGraph.preventD3Default();
            }
            renderer._d3Root.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            renderer._zoom.translate = d3.event.translate;
            renderer._zoom.scale = d3.event.scale;
        }.bind(this));
    this._d3Svg.call(this._zoomBehavior);
    this._updateZoom();
};

/**
 * Updates the zoom and pan location
 * @private
 */
dudeGraph.Renderer.prototype._updateZoom = function () {
    this._d3Svg
        .transition()
        .duration(this._config.zoom.transitionSpeed)
        .call(this._zoomBehavior.translate(this._zoom.translate).scale(this._zoom.scale).event);
};

/**
 * Zoom to best fit the given bounding box
 * @param {Object} boundingBox
 * @param {Number} boundingBox.x
 * @param {Number} boundingBox.y
 * @param {Number} boundingBox.width
 * @param {Number} boundingBox.height
 * @private
 */
dudeGraph.Renderer.prototype._zoomToBoundingBox = function (boundingBox) {
    var svgBBox = this._d3Svg.node().getBoundingClientRect();
    var scaleExtent = this._zoomBehavior.scaleExtent();
    var dx = boundingBox.width - boundingBox.x;
    var dy = boundingBox.height - boundingBox.y;
    var x = (boundingBox.x + boundingBox.width) / 2;
    var y = (boundingBox.y + boundingBox.height) / 2;
    var scale = dudeGraph.clamp(0.9 / Math.max(dx / svgBBox.width, dy / svgBBox.height), scaleExtent[0], scaleExtent[1]);
    var translate = [svgBBox.width / 2 - scale * x, svgBBox.height / 2 - scale * y];
    this._zoom.scale = scale;
    this._zoom.translate = translate;
    this._updateZoom();
};

/**
 * Zooms to best fit the given renderNodes
 * @param {Array<dudeGraph.RenderNode>} renderNodes
 */
dudeGraph.Renderer.prototype.zoomToFitRenderNodes = function (renderNodes) {
    if (!_.isEmpty(renderNodes)) {
        var boundingRect = this.renderNodesBoundingRect(renderNodes);
        this._zoomToBoundingBox({
            "x": boundingRect[0][0] - this._config.zoom.margin[0] / 2,
            "y": boundingRect[0][1] - this._config.zoom.margin[1] / 2,
            "width": boundingRect[1][0] + this._config.zoom.margin[0],
            "height": boundingRect[1][1] + this._config.zoom.margin[1]
        });
    }
};

/**
 * Pan to best fit the given renderNodes
 * @param {Array<dudeGraph.RenderNode>} renderNodes
 */
dudeGraph.Renderer.prototype.panToFitRenderNodes = function (renderNodes) {
    var saveScaleExtent = this._zoomBehavior.scaleExtent();
    this._zoomBehavior.scaleExtent([1, 1]);
    this.zoomToFitRenderNodes(renderNodes);
    this._zoomBehavior.scaleExtent(saveScaleExtent);
};

/**
 * Zooms to best fit all renderNodes
 */
dudeGraph.Renderer.prototype.zoomToFit = function () {
    this.zoomToFitRenderNodes(this._renderBlocks.concat(this._renderGroups));
};

/**
 * Zooms to best fit the selected renderNodes
 */
dudeGraph.Renderer.prototype.zoomToFitSelection = function () {
    this.zoomToFitRenderNodes(this._selectedRenderNodes);
};

/**
 * Resets the zoom to zero
 */
dudeGraph.Renderer.prototype.zoomReset = function () {
    this._zoom.translate = [0, 0];
    this._zoom.scale = 1;
    this._updateZoom();
};