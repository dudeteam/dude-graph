/**
 * Celestory Builder to create interactive audio stories
 * @param {dudeGraph.Graph} graph
 * @class
 */
var CelestoryBuilder = function (graph) {
    this._graph = graph;
};

CelestoryBuilder.prototype.build = function () {
    var builder = this;
    var build = {
        "startId": null,
        "variables": {},
        "blocks": {}
    };
    var starts = this._graph.blocksByType("Start");
    if (starts.length === 0) {
        throw new Error("Story must have one `Start`");
    }
    if (starts.length > 1) {
        throw new Error("Story must have only one `Start` block");
    }
    var start = starts[0];
    build.startId = start.blockId;
    _.forEach(this._graph.graphBlocks, function (block) {
        if (block instanceof dudeGraph.VariableBlock) {
            build.blocks[block.blockId] = builder.buildVariable(block);
        } else {
            var blockName = block.blockName;
            var blockSaver = builder["build" + blockName];
            if (_.isUndefined(blockSaver)) {
                throw new Error("build" + blockName + "() is not overloaded");
            }
            build.blocks[block.blockId] = blockSaver.call(builder, block);
        }
    });
    _.forEach(this._graph.graphVariables, function (variable) {
        build.variables[variable.variableName] = variable.variableValue;
    });
    return build;
};

/**
 * @param {dudeGraph.Block} start
 */
CelestoryBuilder.prototype.buildStart = function (start) {
    var startValues = this._connectedValues(start);
    var startStreams = this._connectedStreams(start);
    return _.merge({
        "type": "Start"
    }, startValues, startStreams);
};

/**
 * @param {dudeGraph.Block} step
 */
CelestoryBuilder.prototype.buildStep = function (step) {
    var stepValues = this._connectedValues(step);
    var stepStreams = this._connectedStreams(step);
    return _.merge({
        "type": "Step"
    }, stepValues, stepStreams);
};

/**
 * @param {dudeGraph.Block} end
 */
CelestoryBuilder.prototype.buildEnd = function (end) {
    var endValues = this._connectedValues(end);
    return _.merge({
        "type": "End"
    }, endValues);
};

/**
 * @param {dudeGraph.ConditionBlock} condition
 */
CelestoryBuilder.prototype.buildCondition = function (condition) {
    return {
        "type": "Condition",
        "test": this._connectedValue(condition.inputByName("test")),
        "true": this._connectedStream(condition.outputByName("true")),
        "false": this._connectedStream(condition.outputByName("false"))
    };
};

/**
 * @param {dudeGraph.VariableBlock} variable
 */
CelestoryBuilder.prototype.buildVariable = function (variable) {
    return {
        "type": "Variable",
        "name": variable.blockName
    };
};

/**
 * @param {dudeGraph.InstructionBlock} assign
 */
CelestoryBuilder.prototype.buildgo = function (assign) {
    return _.merge({
        "type": "go",
        "out": this._connectedStream(assign.outputByName("out"))
    });
};

/**
 * @param {dudeGraph.InstructionBlock} assign
 */
CelestoryBuilder.prototype.buildassign = function (assign) {
    return _.merge({
        "type": "assign",
        "variable": this._connectedStream(assign.inputByName("variable")),
        "value": this._connectedValue(assign.inputByName("value")),
        "out": this._connectedStream(assign.outputByName("out"))
    });
};

/**
 * @param {dudeGraph.FormatBlock} format
 */
CelestoryBuilder.prototype.buildformat = function (format) {
    // TODO: format
    return {
        "type": "format"
    };
};

/**
 * @param {dudeGraph.FormatBlock} random_range
 */
CelestoryBuilder.prototype.buildrandom_range = function (random_range) {
    return random_range.blockName;
};

/**
 * @param {dudeGraph.Block} block
 * @returns {Object}
 * @private
 */
CelestoryBuilder.prototype._connectedValues = function (block) {
    var blockData = {
        "sound": this._connectedValue(block.inputByName("sound")),
        "cover": this._connectedValue(block.inputByName("cover"))
    };
    try {
        blockData.choice = this._connectedValue(block.inputByName("choice"));
    } catch (e) {
    }
    try {
        blockData.text = this._connectedValue(block.inputByName("text"));
    } catch (e) {
    }
    try {
        blockData.timer = this._connectedValue(block.inputByName("timer"));
    } catch (e) {
    }
    return blockData;
};

/**
 * @param {dudeGraph.Point} point
 * @returns {Number|String|Boolean|Object}
 * @private
 */
CelestoryBuilder.prototype._connectedValue = function (point) {
    if (point === null) {
        throw new Error("`" + point.pointFancyName + "` must be non null");
    }
    if (point.pointConnections.length > 0) {
        return this._connectedStream(point);
    }
    return point.pointValue;
};

/**
 * @param {dudeGraph.Block} block
 * @returns {Object}
 * @private
 */
CelestoryBuilder.prototype._connectedStreams = function (block) {
    var blockData = {
        "first": this._connectedStream(block.outputByName("first")),
        "second": this._connectedStream(block.outputByName("second"))
    };
    try {
        blockData.timeout = this._connectedStream(block.outputByName("timeout"));
    } catch (e) {
    }
    return blockData;
};

/**
 * @param {dudeGraph.Point} point
 * @returns {Object<String, String>}
 * @private
 */
CelestoryBuilder.prototype._connectedStream = function (point) {
    var connection = point.pointConnections[0];
    if (typeof connection !== "undefined") {
        return {
            "blockId": point.pointOutput ? connection.connectionInputPoint.pointBlock.blockId : connection.connectionOutputPoint.pointBlock.blockId
        };
    }
    throw new Error("`" + point.pointFancyName + "` must be connected");
};

/**
 * NodeJS export
 */
if (typeof module !== "undefined") {
    module.exports = CelestoryBuilder;
}