/**
 * @extends {dudeGraph.RenderBlock}
 * @constructor
 */
dudeGraph.RenderVariable = function (cgBlock, blockId) {
    dudeGraph.RenderBlock.call(this, cgBlock, blockId);
};

/**
 * @extends {dudeGraph.RenderBlock}
 */
dudeGraph.RenderVariable.prototype = _.create(dudeGraph.RenderBlock.prototype, {
    "constructor": dudeGraph.RenderBlock
});