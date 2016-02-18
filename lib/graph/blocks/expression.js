//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * An expression block with dynamic value points depending on the format
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Expression = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data);

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
dudeGraph.Expression.prototype.validate = function () {
    if (!(this.inputByName("expression") instanceof dudeGraph.Point) || this.inputByName("expression").cgValueType !== "String") {
        throw new Error("Expression `" + this.cgId + "` must have an input `expression` of type `Point` of cgValueType `String`");
    }
};

//noinspection JSUnusedLocalSymbols
/**
 * Called when the cgValue of a point changed
 * @param {dudeGraph.Point} cgPoint
 * @param {Object|null} cgValue
 * @param {Object|null} oldCgValue
 */
dudeGraph.Expression.prototype.pointValueChanged = function (cgPoint, cgValue, oldCgValue) {
    if (cgPoint.cgName === "expression") {
        var expression = this;
        try {
            var data = this._parser.parse(cgValue);
            _.forEach(data.variables, function (variable) {
                if (expression.inputByName(variable) === null) {
                    var point = new dudeGraph.Point(expression, {
                        "cgName": variable,
                        "cgValueType": "Number"
                    }, false, "Point");
                    //console.log("add ", variable);
                    expression.addPoint(point);
                }
            });
            _.forEach(this.cgInputs, function (input) {
                if (input.cgName !== "format" && data.variables.indexOf(input.cgName) === -1) {
                    //console.log("remove ", input.cgName);
                    expression.removePoint(input);
                }
            });
        } catch (e) {
            console.log(e.message);
            // TODO: use this error to display it in the block
        }
    }
};
