/**
 * Loads the renderer from data
 * @param {Object} data
 */
dudeGraph.Renderer.prototype.load = function (data) {
    var renderer = this;
    _.forEach(data.blocks, function (renderBlockData) {
        renderer._createRenderBlock(renderBlockData);
    });
    _.forEach(data.groups, function (renderGroupData) {
        renderer._createRenderGroup(renderGroupData);
    });
    this._createD3Blocks();
    this._createD3Groups();
    this._loadRenderNodeParents(data);
};

/**
 * Assigns renderGroup parents
 * @param {Object?} data
 * @private
 */
dudeGraph.Renderer.prototype._loadRenderNodeParents = function (data) {
    var renderer = this;
    _.forEach(data.blocks, function (renderBlockData) {
        var renderBlock = renderer._getRenderBlockById(renderBlockData.id);
        if (renderBlockData.parent) {
            var renderGroupParent = renderer._getRenderGroupById(renderBlockData.parent);
            if (renderGroupParent === null) {
                throw new Error("Cannot find renderBlock parent id `" + renderBlockData.parent + "`");
            }
            renderBlock.nodeParent = renderGroupParent;
        }
    });
    _.forEach(data.groups, function (renderGroupData) {
        var renderGroup = renderer._getRenderGroupById(renderGroupData.id);
        if (renderGroupData.parent) {
            var renderGroupParent = renderer._getRenderGroupById(renderGroupData.parent);
            if (renderGroupParent === null) {
                throw new Error("Cannot find renderGroup parent id `" + renderGroupData.parent + "`");
            }
            renderGroup.nodeParent = renderGroupParent;
        }
    });
};