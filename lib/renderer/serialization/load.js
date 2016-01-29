/**
 * Loads the renderer from data
 * @param {Object} data
 * @param {Array<Object>} [data.blocks]
 * @param {Array<Object>} [data.groups]
 * @param {Array<Object>} [data.connections]
 * @param {{translate: Array<Number>, scale: Number}} [data.zoom]
 * @param {{translate: Array<Number>, scale: Number}} [data.config.zoom]
 */
dudeGraph.Renderer.prototype.load = function (data) {
    var renderer = this;
    _.forEach(data.blocks, function (renderBlockData) {
        var renderBlock = renderer.createRenderBlock(renderBlockData);
        var createRenderPoint = function (point, index) {
            var renderPointCustomData = renderBlockData[point.isOutput ? "outputs": "inputs"];
            renderPointCustomData = renderPointCustomData && renderPointCustomData[point.cgName];
            renderer.createRenderPoint({
                "renderBlock": renderBlock,
                "renderPoint": renderPointCustomData,
                "point": point,
                "index": index
            });
        };
        _.forEach(renderBlock.block.cgOutputs, createRenderPoint);
        _.forEach(renderBlock.block.cgInputs, createRenderPoint);
    });
    _.forEach(data.groups, function (renderGroupData) {
        renderer.createRenderGroup(renderGroupData);
    });
    _.forEach(data.connections, function (renderConnectionData) {
        renderer.createRenderConnection(renderConnectionData);
    });
    _.forEach(data.blocks, function (renderBlockData) {
        var renderBlock = renderer.renderBlockById(renderBlockData.id);
        if (renderBlockData.parent) {
            var renderGroupParent = renderer.renderGroupById(renderBlockData.parent);
            if (renderGroupParent === null) {
                throw new Error("Cannot find renderBlock `" + renderBlock.nodeFancyName + "` parent id `" + renderBlockData.parent + "`");
            }
            renderBlock.renderGroupParent = renderGroupParent;
        }
    });
    this._zoom = _.defaultsDeep(data.zoom || (data.config && data.config.zoom) || {}, dudeGraph.Renderer.defaultZoom);
    this._updateZoom();
    this.createD3Blocks();
    this.createD3Groups();
    this.createD3Connections();
};