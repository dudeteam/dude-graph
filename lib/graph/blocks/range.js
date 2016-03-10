/**
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Range = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.Range.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Range,
    "className": "Range"
});