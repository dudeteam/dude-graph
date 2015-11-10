/**
 *
 * @param groupId
 * @constructor
 */
dudeGraph.RenderGroup = function (groupId) {
    dudeGraph.RenderNode.call(this, groupId);

    /**
     * The group children
     * @type {Array<dudeGraph.RenderNode>}
     * @private
     */
    this._childrenRenderNodes = [];
};

/**
 * @extends {dudeGraph.RenderNode}
 */
dudeGraph.RenderGroup.prototype = _.create(dudeGraph.RenderNode.prototype, {
    "constructor": dudeGraph.RenderGroup
});

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

/**
 * Creates the d3Block for this renderBlock
 * @param {d3.selection} d3GroupGroup
 */
dudeGraph.RenderGroup.prototype.create = function (d3GroupGroup) {
    dudeGraph.RenderNode.prototype.create.call(this, d3GroupGroup);
    this._rect = d3GroupGroup.append("svg:rect");
    this._title = d3GroupGroup.append("svg:text");
};

/**
 * Updates the d3Block for this renderBlock
 */
dudeGraph.RenderBlock.prototype.update = function () {
    this._title
        .text(this._nodeName);
    this._rect
        .attr({
            "width": this._nodeSize[0],
            "height": this._nodeSize[1]
        });
    this.move();
};

