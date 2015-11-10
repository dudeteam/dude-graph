/**
 *
 * @param {String} groupId
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
 * Creates the d3Group for this renderGroup
 * @param {d3.selection} d3Group
 */
dudeGraph.RenderGroup.prototype.create = function (d3Group) {
    dudeGraph.RenderNode.prototype.create.call(this, d3Group);
};
