//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * The expression RegExp "%(name:Type)"
 * @type {RegExp}
 */
var TypeRegex = /%\((\w+):(String|Number|Boolean)\)/g;

/**
 * An expression block with dynamic value points depending on the format
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Format = function (blockData) {
    dudeGraph.Block.call(this, blockData);
};

dudeGraph.Format.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Format,
    "className": "Format"
});

/**
 * Validates the block content
 * Called when the graph adds this block
 * @override
 */
dudeGraph.Format.prototype.validatePoints = function () {
    if (!(this.inputByName("format") instanceof dudeGraph.Point) || this.inputByName("format").pointValueType !== "String") {
        throw new Error("Format `" + this.blockId + "` must have an input `format` of type `Point` of pointValueType `String`");
    }
};

//noinspection JSUnusedLocalSymbols
/**
 * Called when the value of the point changed
 * @param {dudeGraph.Point} point
 * @param {Object|null} pointValue
 * @param {Object|null} oldPointValue
 */
dudeGraph.Format.prototype.pointValueChanged = function (point, pointValue, oldPointValue) {
    console.log("kandoo");
    var expression = this;
    if (point.pointName === "format") {
        console.log("ccc", pointValue);
        var match = true;
        while (match) {
            match = TypeRegex.exec(pointValue);
            if (match) {
                if (expression.inputByName(match[1]) === null) {
                    var variablePoint = new dudeGraph.Point(false, {
                            "pointName": match[1],
                            "pointValueType": match[2]
                        });
                    expression.addPoint(variablePoint);
                }
            }
        }
        var inputs = _.clone(expression.blockInputs);
        _.forEach(inputs, function (input) {
            if (input.pointName === "format") {
                return;
            }
            if (pointValue.indexOf("%(" + input.pointName + ":" + input.pointValueType + ")") === -1) {
                expression.removePoint(input);
            }
        });
    }
};