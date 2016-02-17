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
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.Expression = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data);
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
    if (!(this.inputByName("format") instanceof dudeGraph.Point) || this.inputByName("format").cgValueType !== "String") {
        throw new Error("Expression `" + this.cgId + "` must have an input `format` of type `Point` of cgValueType `String`");
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
    var expression = this;
    if (cgPoint.cgName === "format") {
        var match = true;
        while (match) {
            match = TypeRegex.exec(cgValue);
            if (match) {
                if (expression.inputByName(match[1]) === null) {
                    var point = new dudeGraph.Point(expression, {"cgName": match[1], "cgValueType": match[2]}, false, "Point");
                    expression.addPoint(point);
                }
            }
        }
        var inputs = _.clone(expression.cgInputs);
        _.forEach(inputs, function (input) {
            if (input.cgName === "format") {
                return;
            }
            if (cgValue.indexOf("%(" + input.cgName + ":" + input.cgValueType + ")") === -1) {
                expression.removePoint(input);
            }
        });
    }
};

/**
 * An expression block with dynamic value points depending on the format
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.CalcExpression = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data);

    this._parser = new dudeGraph.ExpressionParser();
};

dudeGraph.CalcExpression.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.CalcExpression,
    "className": "CalcExpression"
});

/**
 * Validates the block content
 * Called when the graph adds this block
 * @override
 */
dudeGraph.CalcExpression.prototype.validate = function () {
    if (!(this.inputByName("format") instanceof dudeGraph.Point) || this.inputByName("format").cgValueType !== "String") {
        throw new Error("CalcExpression `" + this.cgId + "` must have an input `format` of type `Point` of cgValueType `String`");
    }
};

//noinspection JSUnusedLocalSymbols
/**
 * Called when the cgValue of a point changed
 * @param {dudeGraph.Point} cgPoint
 * @param {Object|null} cgValue
 * @param {Object|null} oldCgValue
 */
dudeGraph.CalcExpression.prototype.pointValueChanged = function (cgPoint, cgValue, oldCgValue) {
    var expression = this;
    if (cgPoint.cgName === "format") {
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
    }
};