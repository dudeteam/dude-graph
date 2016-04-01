/**
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.VariableBlock = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.VariableBlock.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.VariableBlock,
    "className": "VariableBlock"
});

/**
 * Called when the block is added to a graph
 */
dudeGraph.VariableBlock.prototype.validate = function () {
    dudeGraph.Block.prototype.validate.call(this);
    var graphVariable = this._blockGraph.variableByName(this._blockName);
    if (graphVariable === null) {
        throw new Error("VariableBlock `" + this.blockFancyName + "` must be linked to a graph variable");
    }
    if (graphVariable.variableBlock !== null && graphVariable.variableBlock !== this) {
        throw new Error("`" + graphVariable.variableFancyName + "` cannot redefine variableBlock");
    }
    // TODO: check valueType and name
    graphVariable.variableBlock = this;
};

/**
 * Called when the basic points are created
 * @override
 */
dudeGraph.VariableBlock.prototype.validatePoints = function () {
    if (!(this.outputByName("value") instanceof dudeGraph.Point)) {
        throw new Error("VariableBlock `" + this.blockFancyName + "` must have an output `value` of type `Point`");
    }
};