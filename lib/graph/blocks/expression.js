//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * An expression block with dynamic value points depending on the format
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Expression = function (blockData) {
    dudeGraph.Block.call(this, blockData);
    this._parser = new dudeGraph.ExpressionParser();
};

dudeGraph.Expression.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Expression,
    "className": "Expression"
});

/**
 * Validates the block content
 * Called when the graph adds this block
 * @override
 */
dudeGraph.Expression.prototype.validatePoint = function () {
    if (!(this.inputByName("expression") instanceof dudeGraph.Point) || this.inputByName("expression").pointValueType !== "String") {
        throw new Error("Expression `" + this.blockId + "` must have an input `expression` of type `Point` of pointValueType `String`");
    }
};

//noinspection JSUnusedLocalSymbols
/**
 * Called when the value of the point changed
 * @param {dudeGraph.Point} point
 * @param {Object|null} pointValue
 * @param {Object|null} oldPointValue
 */
dudeGraph.Expression.prototype.pointValueChanged = function (point, pointValue, oldPointValue) {
    if (point.pointName === "expression") {
        var expression = this;
        try {
            var data = this._parser.parse(pointValue);
            _.forEach(data.variables, function (variable) {
                if (expression.inputByName(variable) === null) {
                    var variablePoint = new dudeGraph.Point(false, {
                        "pointName": variable,
                        "pointValueType": "Number"
                    });
                    //console.log("add ", variable);
                    expression.addPoint(variablePoint);
                }
            });
            _.forEach(this.blockInputs, function (input) {
                if (input.pointName !== "format" && data.variables.indexOf(input.pointName) === -1) {
                    //console.log("remove ", input.pointName);
                    expression.removePoint(input);
                }
            });
        } catch (e) {
            console.log(e.message);
            // TODO: use this error to display it in the block
        }
    }
};
