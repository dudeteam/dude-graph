/**
 * This block represents a simple function that takes some inputs and returns one or zero output.
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.FunctionBlock = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.FunctionBlock.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.FunctionBlock,
    "className": "FunctionBlock"
});