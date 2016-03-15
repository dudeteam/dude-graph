/**
 * An expression block with dynamic value points depending on the format
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.ExpressionBlock = function (blockData) {
    dudeGraph.Block.call(this, blockData);
    this._formatPointName = "expression";
    this._parser = new dudeGraph.ExpressionParser();
};

dudeGraph.ExpressionBlock.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.ExpressionBlock,
    "className": "ExpressionBlock"
});

/**
 * Validates the block content
 * Called when the graph adds this block
 * @override
 */
dudeGraph.ExpressionBlock.prototype.validatePoints = function () {
    if (!(this.inputByName(this._formatPointName) instanceof dudeGraph.Point) || this.inputByName(this._formatPointName).pointValueType !== "String") {
        throw new Error("ExpressionBlock `" + this.blockId + "` must have an input `" + this._formatPointName + "` of type `Point` of pointValueType `String`");
    }
    this._validateExpression();
};

//noinspection JSUnusedLocalSymbols
/**
 * Called when the value of the point changed
 * @param {dudeGraph.Point} point
 * @param {Object|null} pointValue
 * @param {Object|null} oldPointValue
 */
dudeGraph.ExpressionBlock.prototype.pointValueChanged = function (point, pointValue, oldPointValue) {
    if (point.pointName === this._formatPointName) {
        this._validateExpression();
    }
};

/**
 * Validates and interprets the expression
 * @private
 */
dudeGraph.ExpressionBlock.prototype._validateExpression = function () {
    var expression = this;
    var expressionFormat = this.inputByName(this._formatPointName).pointValue;
    if (expressionFormat === "" || expressionFormat === null) {
        _.forEachRight(this.blockInputs, function (input) {
            if (input.pointName !== this._formatPointName) {
                expression.removePoint(input);
            }
        }.bind(this));
    } else {
        try {
            var data = this._parser.parse(expressionFormat);
            _.forEach(data.variables, function (variable) {
                if (expression.inputByName(variable) === null) {
                    var variablePoint = new dudeGraph.Point(false, {
                        "pointName": variable,
                        "pointValueType": "Number"
                    });
                    expression.addPoint(variablePoint);
                }
            }.bind(this));
            _.forEachRight(this.blockInputs, function (input) {
                if (input.pointName !== this._formatPointName && !_.includes(data.variables, input.pointName)) {
                    expression.removePoint(input);
                }
            }.bind(this));
        } catch (e) {
            console.warn(e.message);
            // TODO: use this error to display it in the block
        }
    }
};