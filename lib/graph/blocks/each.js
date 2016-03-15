/**
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.EachBlock = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.EachBlock.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.EachBlock,
    "className": "EachBlock"
});