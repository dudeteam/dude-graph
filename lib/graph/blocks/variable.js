/**
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Variable = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.Variable.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Variable,
    "className": "Variable"
});

/**
 * Called when the basic points are created
 * @override
 */
dudeGraph.Variable.prototype.validatePoints = function () {
    if (!(this.outputByName("value") instanceof dudeGraph.Point)) {
        throw new Error("Variable `" + this.blockFancyName + "` must have an output `value` of type `Point`");
    }
};