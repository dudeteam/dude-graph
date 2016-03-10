/**
 * This block represents a simple function that takes some inputs and returns one or zero output.
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Function = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.Function.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Function,
    "className": "Function"
});