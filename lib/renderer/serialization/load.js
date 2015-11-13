/**
 * Loads the renderer from data
 * @param {Object} data
 * @param {Array<Object>} data.blocks
 * @param {Array<Object>} data.groups
 * @param {Array<Object>} data.connections
 * @param {Object} data.config.zoom
 */
dudeGraph.Renderer.prototype.load = function (data) {
    var renderer = this;
    _.forEach(data.blocks, function (renderBlockData) {
        renderer.createRenderBlock(renderBlockData);
    });
    _.forEach(data.groups, function (renderGroupData) {
        renderer._createRenderGroup(renderGroupData);
    });
    _.forEach(data.connections, function (renderConnectionData) {
        renderer.createRendererConnection(renderConnectionData);
    });
    _.forEach(data.blocks, function (renderBlockData) {
        var renderBlock = renderer.renderBlockById(renderBlockData.id);
        if (renderBlockData.parent) {
            var renderGroupParent = renderer.renderGroupById(renderBlockData.parent);
            if (renderGroupParent === null) {
                throw new Error("Cannot find renderBlock `" + renderBlock.nodeFancyName + "` parent id `" + renderBlockData.parent + "`");
            }
            renderBlock.nodeParent = renderGroupParent;
        }
    });
    _.forEach(data.groups, function (renderGroupData) {
        var renderGroup = renderer.renderGroupById(renderGroupData.id);
        if (renderGroupData.parent) {
            var renderGroupParent = renderer.renderGroupById(renderGroupData.parent);
            if (renderGroupParent === null) {
                throw new Error("Cannot find renderGroup `" + renderGroup.nodeFancyName + "` parent id `" + renderGroupData.parent + "`");
            }
            renderGroup.nodeParent = renderGroupParent;
        }
    });
    this._zoom = _.defaultsDeep(data.config.zoom, dudeGraph.Renderer.defaultZoom);
    this.createD3Blocks();
    this.createD3Groups();
    this.createD3Connections();
};