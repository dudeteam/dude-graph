/**
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.VariableBlock = function (blockData) {
    dudeGraph.Block.call(this, blockData);

    /**
     * The linked graph variable
     * @type {dudeGraph.Variable}
     * @private
     */
    this._graphVariable = null;
};

dudeGraph.VariableBlock.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.VariableBlock,
    "className": "VariableBlock"
});

/**
 * Called when the block is added to a graph
 * @override
 */
dudeGraph.VariableBlock.prototype.validate = function () {
    dudeGraph.Block.prototype.validate.call(this);
    this._graphVariable = this._blockGraph.variableByName(this._blockName);
    if (this._graphVariable === null) {
        throw new Error("VariableBlock `" + this.blockFancyName + "` must be linked to a graph variable");
    }
    if (this._graphVariable.variableBlock !== null && this._graphVariable.variableBlock !== this) {
        throw new Error("`" + this._graphVariable.variableFancyName + "` cannot redefine variableBlock");
    }
    this._graphVariable.variableBlock = this;
};

/**
 * Called when the basic points are created
 * @override
 */
dudeGraph.VariableBlock.prototype.validatePoints = function () {
    if (!(this.outputByName("value") instanceof dudeGraph.Point)) {
        throw new Error("VariableBlock `" + this.blockFancyName + "` must have an output `value` of type `Point`");
    }
    if (this._graphVariable.variableValueType !== this.outputByName("value").pointValueType) {
        throw new Error("VariableBlock `" + this.blockFancyName + "` must be of value type `" + this._graphVariable.variableValueType + "`");
    }
};

/**
 * Called when the block is removed from the graph
 * @override
 */
dudeGraph.VariableBlock.prototype.removed = function () {
    this._graphVariable.variableBlock = null;
};