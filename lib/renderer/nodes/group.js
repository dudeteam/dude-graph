/**
 * @param {dudeGraph.Renderer} renderer
 * @param {String} groupId
 * @class
 * @extends {dudeGraph.RenderNode}
 */
dudeGraph.RenderGroup = function (renderer, groupId) {
    dudeGraph.RenderNode.call(this, renderer, groupId);

    /**
     * The renderBlocks children
     * @type {Array<dudeGraph.RenderBlock>}
     * @private
     */
    this._renderBlocksChildren = [];
    Object.defineProperty(this, "renderBlocksChildren", {
        get: function () {
            return this._renderBlocksChildren;
        }.bind(this)
    });
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
    this._d3Rect = d3Group.append("svg:rect")
        .attr("rx", this._renderer.config.group.borderRadius)
        .attr("ry", this._renderer.config.group.borderRadius);
    this._d3Title = d3Group.append("svg:text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "text-before-edge");
    this.update();
    this.computePosition();
    this.computeSize();
    this.move();
};

/**
 * Updates the svg representation of this renderGroup
 * @override
 */
dudeGraph.RenderGroup.prototype.update = function () {
    dudeGraph.RenderNode.prototype.update.call(this);
    var renderGroup = this;
    this._d3Rect
        .attr({
            "width": this._nodeSize[0],
            "height": this._nodeSize[1]
        });
    this._d3Title
        .text(this._nodeName)
        .attr({
            "x": this._nodeSize[0] / 2,
            "y": renderGroup._renderer.config.group.padding
        });
    _.browserIf(["IE", "Edge"], function () {
        renderGroup._d3Title.attr("y",
            renderGroup._renderer.config.group.padding + renderGroup._renderer.measureText(renderGroup._d3Title)[1] / 2);
    });
};

/**
 * Called when the renderGroup should compute its new size
 * @override
 */
dudeGraph.RenderGroup.prototype.computeSize = function () {
    var contentBoundingBox = this._renderer.renderNodesBoundingRect(this._renderBlocksChildren, true);
    if (contentBoundingBox !== null) {
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
 * Called when the renderGroup should compute its new position
 * @override
 */
dudeGraph.RenderGroup.prototype.computePosition = function () {
    var contentBoundingBox = this._renderer.renderNodesBoundingRect(this._renderBlocksChildren, true);
    if (contentBoundingBox !== null) {
        this._nodePosition = [
            contentBoundingBox[0][0] - this._renderer.config.group.padding,
            contentBoundingBox[0][1] - this._renderer.config.group.padding - this._renderer.config.group.header
        ];
    }
};

/**
 * Adds the renderBlock as a child
 * @param {dudeGraph.RenderBlock} renderBlock
 */
dudeGraph.RenderGroup.prototype.addChild = function (renderBlock) {
    var renderNodeChildFound = _.find(this._renderBlocksChildren, renderBlock);
    if (!_.isUndefined(renderNodeChildFound)) {
        throw new Error("`" + renderBlock.nodeFancyName + "` is already a child of `" + this.nodeFancyName + "`");
    }
    this._renderBlocksChildren.push(renderBlock);
};

/**
 * Removes the child renderBlock
 * @param {dudeGraph.RenderBlock} renderBlock
 */
dudeGraph.RenderGroup.prototype.removeChild = function (renderBlock) {
    var renderNodeChildFound = _.find(this._renderBlocksChildren, renderBlock);
    if (_.isUndefined(renderNodeChildFound)) {
        throw new Error("`" + renderBlock.nodeFancyName + "` is not a child of `" + this.nodeFancyName + "`");
    }
    _.pull(this._renderBlocksChildren, renderBlock);
};

/**
 * Removes all the children renderBlocks
 */
dudeGraph.RenderGroup.prototype.removeAllChildren = function () {
    var children = _.clone(this._renderBlocksChildren);
    _.forEach(children, function (renderBlockChild) {
        renderBlockChild.renderGroupParent = null;
    });
};

/**
 * RenderGroup factory
 * @param {dudeGraph.Renderer} renderer
 * @param {Object} renderGroupData
 */
dudeGraph.RenderGroup.buildRenderGroup = function (renderer, renderGroupData) {
    var renderGroup = new this(renderer, renderGroupData.id);
    renderGroup.nodeName = renderGroupData.description || "";
    renderGroup.nodePosition = renderGroupData.position || [0, 0];
    renderGroup.nodeSize = renderGroupData.size || [0, 0];
    return renderGroup;
};