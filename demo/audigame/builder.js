/**
 * Celestory Builder to create interactive audio stories
 * @param {dudeGraph.Graph} graph
 * @class
 */
var CelestoryBuilder = function (graph) {
    this._graph = graph;
};

/**
 * Builds the interactive audio story
 * @returns {Object}
 */
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
            build.blocks[block.blockId] = builder.buildvariable(block);
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
    return {
        "type": "Start",
        "text": this._connectedValue(start.inputByName("text"), false),
        "timer": this._connectedValue(start.inputByName("timer"), false),
        "sound": this._connectedValue(start.inputByName("sound"), false),
        "cover": this._connectedValue(start.inputByName("cover"), false),
        "first": this._connectedStream(start.outputByName("first"), true),
        "second": this._connectedStream(start.outputByName("second"), true),
        "timeout": this._connectedStream(start.outputByName("timeout"), false)
    };
};

/**
 * @param {dudeGraph.Block} step
 */
CelestoryBuilder.prototype.buildStep = function (step) {
    return {
        "type": "Step",
        "choice": this._connectedValue(step.inputByName("choice"), true),
        "text": this._connectedValue(step.inputByName("text"), false),
        "timer": this._connectedValue(step.inputByName("timer"), false),
        "sound": this._connectedValue(step.inputByName("sound"), false),
        "cover": this._connectedValue(step.inputByName("cover"), false),
        "first": this._connectedStream(step.outputByName("first"), true),
        "second": this._connectedStream(step.outputByName("second"), true),
        "timeout": this._connectedStream(step.outputByName("timeout"), false)
    };
};

/**
 * @param {dudeGraph.Block} end
 */
CelestoryBuilder.prototype.buildEnd = function (end) {
    return {
        "type": "End",
        "choice": this._connectedValue(end.inputByName("choice"), true),
        "text": this._connectedValue(end.inputByName("text"), false),
        "sound": this._connectedValue(end.inputByName("sound"), false),
        "cover": this._connectedValue(end.inputByName("cover"), false)
    };
};

/**
 * @param {dudeGraph.InstructionBlock} go
 */
CelestoryBuilder.prototype.buildGo = function (go) {
    return _.merge({
        "type": "Go",
        "out": this._connectedStream(go.outputByName("out"), true)
    });
};

/**
 * @param {dudeGraph.ConditionBlock} condition
 */
CelestoryBuilder.prototype.buildCondition = function (condition) {
    return {
        "type": "Condition",
        "test": this._connectedValue(condition.inputByName("test"), true),
        "true": this._connectedStream(condition.outputByName("true"), true),
        "false": this._connectedStream(condition.outputByName("false"), true)
    };
};

/**
 * @param {dudeGraph.ConditionBlock} repeat
 */
CelestoryBuilder.prototype.buildRepeat = function (repeat) {
    return {
        "type": "Repeat",
        "from": this._connectedValue(repeat.inputByName("from"), true),
        "to": this._connectedValue(repeat.inputByName("to"), true),
        "step": this._connectedValue(repeat.inputByName("step"), true),
        "iteration": this._connectedStream(repeat.outputByName("iteration"), true),
        "end": this._connectedStream(repeat.outputByName("end"), true),
        "index": 0
    };
};

/**
 * @param {dudeGraph.InstructionBlock} assign
 */
CelestoryBuilder.prototype.buildAssign = function (assign) {
    return _.merge({
        "type": "assign",
        "variable": this._connectedStream(assign.inputByName("variable"), true),
        "value": this._connectedValue(assign.inputByName("value"), true),
        "out": this._connectedStream(assign.outputByName("out"), true)
    });
};

/**
 * @param {dudeGraph.InstructionBlock} print
 */
CelestoryBuilder.prototype.buildPrint = function (print) {
    return {
        "type": "print",
        "message": this._connectedValue(print.inputByName("message"), true),
        "out": this._connectedStream(print.outputByName("out"), true)
    };
};

/**
 * @param {dudeGraph.VariableBlock} variable
 */
CelestoryBuilder.prototype.buildvariable = function (variable) {
    return {
        "type": "variable",
        "name": variable.blockName
    };
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
 * @param {dudeGraph.ExpressionBlock} expression
 */
CelestoryBuilder.prototype.buildexpression = function (expression) {
    // TODO: expression
    return {
        "type": "expression"
    };
};

/**
 * @param {dudeGraph.FormatBlock} random_range
 */
CelestoryBuilder.prototype.buildrandom_range = function (random_range) {
    var from = this._connectedValue(random_range.inputByName("from"), true);
    var to = this._connectedValue(random_range.inputByName("to"), true);
    if (from >= to) {
        throw new Error("`" + random_range.blockFancyName + "` `from` must be lower than `to`");
    }
    return {
        "type": "random_range",
        "from": from,
        "to": to
    };
};

/**
 * @param {dudeGraph.Point} point
 * @param {Boolean} [required=false]
 * @returns {Number|String|Boolean|Object}
 * @private
 */
CelestoryBuilder.prototype._connectedValue = function (point, required) {
    if (point.pointConnections.length > 0) {
        return this._connectedStream(point);
    }
    if (required && point.pointValue === null) {
        throw new Error("`" + point.pointFancyName + "` pointValue must be non null");
    }
    return point.pointValue;
};

/**
 * @param {dudeGraph.Point} point
 * @param {Boolean} [required=false]
 * @returns {Object<String, String>}
 * @private
 */
CelestoryBuilder.prototype._connectedStream = function (point, required) {
    var connection = point.pointConnections[0];
    if (typeof connection !== "undefined") {
        return {
            "blockId": point.pointOutput ? connection.connectionInputPoint.pointBlock.blockId : connection.connectionOutputPoint.pointBlock.blockId
        };
    }
    if (required) {
        throw new Error("`" + point.pointFancyName + "` must be connected");
    }
    return null;
};

/**
 * NodeJS export
 */
if (typeof module !== "undefined") {
    module.exports = CelestoryBuilder;
}