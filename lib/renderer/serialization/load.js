/**
 * Loads the renderer from data
 * @param {Object} data
 * @param {Array<Object>} data.blocks
 * @param {Array<Object>} data.groups
 * @param {Array<Object>} data.connections
 */
dudeGraph.Renderer.prototype.load = function (data) {
    var renderer = this;
    _.forEach(data.blocks, function (renderBlockData) {
        renderer.createRenderBlock(renderBlockData);
    });
    _.forEach(data.groups, function (renderGroupData) {
        renderer._createRenderGroup(renderGroupData);
    });
    _.forEach(data.blocks, function (renderBlockData) {
        var renderBlock = renderer.getRenderBlockById(renderBlockData.id);
        if (renderBlockData.parent) {
            var renderGroupParent = renderer.getRenderGroupById(renderBlockData.parent);
            if (renderGroupParent === null) {
                throw new Error("Cannot find renderBlock `" + renderBlock.nodeFancyName + "` parent id `" + renderBlockData.parent + "`");
            }
            renderBlock.nodeParent = renderGroupParent;
        }
    });
    _.forEach(data.groups, function (renderGroupData) {
        var renderGroup = renderer.getRenderGroupById(renderGroupData.id);
        if (renderGroupData.parent) {
            var renderGroupParent = renderer.getRenderGroupById(renderGroupData.parent);
            if (renderGroupParent === null) {
                throw new Error("Cannot find renderGroup `" + renderGroup.nodeFancyName + "` parent id `" + renderGroupData.parent + "`");
            }
            renderGroup.nodeParent = renderGroupParent;
        }
    });
    this._createD3Blocks();
    this._createD3Groups();
};