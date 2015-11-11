/**
 * @param {dudeGraph.Renderer} renderer
 * @param {String} groupId
 * @extends {dudeGraph.RenderNode}
 * @constructor
 */
dudeGraph.RenderGroup = function (renderer, groupId) {
    dudeGraph.RenderNode.call(this, renderer, groupId);

    /**
     * The group children
     * @type {Array<dudeGraph.RenderNode>}
     * @private
     */
    this._childrenRenderNodes = [];
};

/**
 * RenderGroup factory
 * @param {dudeGraph.Renderer} renderer
 * @param {Object} renderGroupData
 */
dudeGraph.RenderGroup.buildRenderGroup = function (renderer, renderGroupData) {
    var renderGroup = new dudeGraph.RenderGroup(renderer, renderGroupData.id);
    renderGroup.nodeName = renderGroupData.description || "";
    renderGroup.nodePosition = renderGroupData.position || [0, 0];
    renderGroup.nodeSize = renderGroupData.size || [0, 0];
    return renderGroup;
};

/**
 * @extends {dudeGraph.RenderNode}
 */
dudeGraph.RenderGroup.prototype = _.create(dudeGraph.RenderNode.prototype, {
    "constructor": dudeGraph.RenderGroup
});

/**
 * Creates the svg representation of this renderGroup
 * @param {d3.selection} d3Group
 * @override
 */
dudeGraph.RenderGroup.prototype.create = function (d3Group) {
    dudeGraph.RenderNode.prototype.create.call(this, d3Group);
    this._d3Rect = d3Group.append("svg:rect");
    this._d3Title = d3Group.append("svg:text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "text-before-edge");
    this.update();
    this.updatePositionSize();
};

/**
 * Updates the svg representation of this renderGroup
 * @override
 */
dudeGraph.RenderGroup.prototype.update = function () {
    var renderGroup = this;
    this._d3Rect
        .attr({
            "x": this._nodePosition[0],
            "y": this._nodePosition[1],
            "width": this._nodeSize[0],
            "height": this._nodeSize[1]
        });
    this._d3Title
        .text(this._nodeName)
        .attr({
            "x": this._nodePosition[0] + this._nodeSize[0] / 2,
            "y": this._nodePosition[1] + renderGroup._renderer.config.group.padding
        });
    _.browserIf(["IE", "Edge"], function () {
        renderGroup._d3Title.attr("y",
            renderGroup._renderer.config.group.padding +
            renderGroup._renderer.measureText(renderGroup._d3Title)[1] / 2);
    });
};

/**
 * Updates the position and size of the renderGroup
 */
dudeGraph.RenderGroup.prototype.updatePositionSize = function () {
    var contentBoundingBox = this._renderer.renderNodesBoundingRect(this._childrenRenderNodes, true);
    if (contentBoundingBox !== null) {
        this._nodePosition = [
            contentBoundingBox[0][0] - this._renderer.config.group.padding,
            contentBoundingBox[0][1] - this._renderer.config.group.padding - this._renderer.config.group.header
        ];
        this._nodeSize = [
            contentBoundingBox[1][0] - contentBoundingBox[0][0] + this._renderer.config.group.padding * 2,
            contentBoundingBox[1][1] - contentBoundingBox[0][1] + this._renderer.config.group.padding * 2 + this._renderer.config.group.header
        ];
    }
    this._nodeSize = [
        Math.max(this._nodeSize[0], this._renderer.config.group.minSize[0] + this._renderer.config.group.padding * 2),
        Math.max(this._nodeSize[1], this._renderer.config.group.minSize[1] + this._renderer.config.group.padding * 2 + this._renderer.config.group.header)
    ];
    this._nodeSize[0] = Math.max(this._nodeSize[0], this._renderer.measureText(this._d3Title)[0] + this._renderer.config.group.padding * 2);
};

/**
 * Adds the render node as child
 * @param {dudeGraph.RenderNode} renderNode
 */
dudeGraph.RenderGroup.prototype.addChildRenderNode = function (renderNode) {
    var renderNodeChildFound = _.find(this._childrenRenderNodes, renderNode);
    if (!_.isUndefined(renderNodeChildFound)) {
        throw new Error("`" + renderNode.nodeFancyName + "` is already a child of `" + this.nodeFancyName + "`");
    }
    this._childrenRenderNodes.push(renderNode);
};

/**
 * Removes the render node from children
 * @param {dudeGraph.RenderNode} renderNode
 */
dudeGraph.RenderGroup.prototype.removeChildRenderNode = function (renderNode) {
    var renderNodeChildFound = _.find(this._childrenRenderNodes, renderNode);
    if (_.isUndefined(renderNodeChildFound)) {
        throw new Error("`" + renderNode.nodeFancyName + "` is not a child of `" + this.nodeFancyName + "`");
    }
    _.pull(this._childrenRenderNodes, renderNode);
};