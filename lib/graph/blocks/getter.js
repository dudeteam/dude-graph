/**
 * This block represents a simple Getter that takes some inputs and returns one or zero output.
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.GetterBlock = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.GetterBlock.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.GetterBlock,
    "className": "GetterBlock"
});