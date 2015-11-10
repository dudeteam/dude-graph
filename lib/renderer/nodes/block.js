/**
 *
 * @param blockId
 * @param cgBlock
 * @constructor
 */
dudeGraph.RenderBlock = function (blockId, cgBlock) {
    dudeGraph.RenderNode.call(this, blockId);

    /**
     * The dudeGraph.Block this renderBlock is linked to
     * @type {dudeGraph.Block}
     * @private
     */
    this._block = cgBlock;
    Object.defineProperty(this, "block", {
        get: function () {
            return this._block;
        }.bind(this)
    });

    /**
     *
     * @type {Array<dudeGraph.RenderPoint>}
     * @private
     */
    this._renderPoints = [];
    Object.defineProperty(this, "renderPoints", {
        get: function () {
            return this._renderPoints;
        }.bind(this),
        set: function (renderPoints) {
            this._renderPoints = renderPoints;
        }.bind(this)
    });

    /**
     *
     */
    Object.defineProperty(this, "d3Points", {
        get: function () {
            return this._points.selectAll(".dude-graph-point");
        }.bind(this)
    });
};

/**
 * @extends {dudeGraph.RenderNode}
 */
dudeGraph.RenderBlock.prototype = _.create(dudeGraph.RenderNode.prototype, {
    "constructor": dudeGraph.RenderBlock
});

/**
 * Creates the d3Block for this renderBlock
 * @param {d3.selection} d3BlockGroup
 */
dudeGraph.RenderBlock.prototype.create = function (d3BlockGroup) {
    dudeGraph.RenderNode.prototype.create.call(this, d3BlockGroup);
    this._rect = d3BlockGroup.append("svg:rect");
    this._title = d3BlockGroup.append("svg:text");
    this._points = d3BlockGroup
        .append("svg:g")
        .classed("dude-graph-points", true);
    this.d3Points
        .data(this.renderPoints, function (renderPoint) {
            return renderPoint.point.cgName;
        })
        .enter()
        .append("g")
        .classed("dude-graph-point", true)
        .each(function (renderPoint) {
            renderPoint.create(d3.select(this));
        });
};

/**
 * Updates the d3Block for this renderBlock
 */
dudeGraph.RenderBlock.prototype.update = function () {
    this._title
        .text(this._nodeName);
    this._rect
        .attr({
            "x": 0,
            "y": 0,
            "width": this._nodeSize[0],
            "height": this._nodeSize[1]
        });
    this.d3Points
        .each(function (renderPoint) {
            renderPoint.update();
        });
    this.move();
};