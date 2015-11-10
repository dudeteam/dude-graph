/**
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.Block} block
 * @param {String} blockId
 * @extends {dudeGraph.RenderBlock}
 * @constructor
 */
dudeGraph.RenderVariable = function (renderer, block, blockId) {
    dudeGraph.RenderBlock.call(this, renderer, block, blockId);
};

/**
 * RenderVariable factory
 * @param {dudeGraph.Renderer} renderer
 * @param {Object} renderBlockData
 */
dudeGraph.RenderVariable.buildRenderBlock = function (renderer, renderBlockData) {
    return dudeGraph.RenderBlock.buildRenderBlock.call(this, renderer, renderBlockData);
};

/**
 * @extends {dudeGraph.RenderBlock}
 */
dudeGraph.RenderVariable.prototype = _.create(dudeGraph.RenderBlock.prototype, {
    "constructor": dudeGraph.RenderBlock
});