/**
 * This block represents a simple Getter that takes some inputs and returns one or zero output.
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Getter = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.Getter.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Getter,
    "className": "Getter"
});