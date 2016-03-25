/**
 * Builds a computable graph
 * @param {dudeGraph.Graph} graph
 * @class
 */
var CelestoryBuilder = function (graph) {
    var builder = this;
    var blocks = [];
    _.forEach(graph.graphBlocks, function (block) {
        if (block instanceof dudeGraph.VariableBlock) {
            builder.buildVariable(block);
        } else {
            var blockName = block.blockName;
            var blockSaver = builder["build" + blockName];
            if (_.isUndefined(blockSaver)) {
                throw new Error("build" + blockName + "() is not overloaded");
            }
            blocks[block.blockId] = blockSaver.call(builder, block);
        }
    });
};

/**
 *
 * @param {dudeGraph.Point} point
 * @returns {dudeGraph.Block|null}
 */
CelestoryBuilder.prototype.getConnectedBlock = function (point) {
    var connectedBlock = point.pointConnections[0];
    return connectedBlock ? connectedBlock.connectionOutputBlock : null;
};

/**
 * @param {dudeGraph.Block} start
 */
CelestoryBuilder.prototype.buildStart = function (start) {
    var first = start.outputByName("first");
    var second = start.outputByName("second");
    var timeout = start.outputByName("timeout");
    var firstTo = this.getConnectedBlock(first);
    var secondTo = this.getConnectedBlock(second);
    var timeoutTo = this.getConnectedBlock(timeout);
    if (firstTo === null || secondTo === null) {
        throw new Error("`" + start.blockName + "`: first and second must be connected");
    }
    return start.blockName;
};

/**
 * @param {dudeGraph.Block} step
 */
CelestoryBuilder.prototype.buildStep = function (step) {
    return step.blockName;
};

/**
 * @param {dudeGraph.Block} end
 */
CelestoryBuilder.prototype.buildEnd = function (end) {
    return end.blockName;
};


/**
 * @param {dudeGraph.VariableBlock} variable
 */
CelestoryBuilder.prototype.buildVariable = function (variable) {
    return variable.blockName;
};

/**
 * @param {dudeGraph.InstructionBlock} assign
 */
CelestoryBuilder.prototype.buildassign = function (assign) {
    return assign.blockName;
};