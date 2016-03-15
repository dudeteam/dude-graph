/**
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.RangeBlock = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.RangeBlock.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.RangeBlock,
    "className": "RangeBlock"
});