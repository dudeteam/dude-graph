/**
 * An expression block with dynamic value points depending on the format
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.ExpressionBlock = function (blockData) {
    dudeGraph.Block.call(this, blockData);

    /**
     * The expression point name
     * @type {String}
     * @private
     */
    this._expressionPointName = "expression";

    /**
     * The expression parser
     * @type {dudeGraph.ExpressionParser}
     * @private
     */
    this._expressionParser = new dudeGraph.ExpressionParser();

    /**
     * The expression parsing result
     * @type {Object}
     * @private
     */
    this._expressionData = null;
    Object.defineProperty(this, "expressionData", {
        get: function () {
            return this._expressionData;
        }.bind(this)
    });
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
    dudeGraph.Block.prototype.validatePoints.call(this);
    if (!(this.inputByName(this._expressionPointName) instanceof dudeGraph.Point) || this.inputByName(this._expressionPointName).pointValueType !== "String") {
        throw new Error("ExpressionBlock `" + this.blockId + "` must have an input `" + this._expressionPointName + "` of type `Point` of pointValueType `String`");
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
    if (point.pointName === this._expressionPointName) {
        this._validateExpression();
    }
};

/**
 * Validates and interprets the expression
 * @private
 */
dudeGraph.ExpressionBlock.prototype._validateExpression = function () {
    var expression = this;
    var expressionFormat = this.inputByName(this._expressionPointName).pointValue;
    if (expressionFormat === "" || expressionFormat === null) {
        _.forEachRight(this.blockInputs, function (input) {
            if (input.pointName !== this._expressionPointName) {
                expression.removePoint(input);
            }
        }.bind(this));
    } else {
        try {
            this._expressionData = this._expressionParser.parse(expressionFormat);
            _.forEach(this._expressionData.variables, function (variable) {
                if (expression.inputByName(variable) === null) {
                    var variablePoint = new dudeGraph.Point(false, {
                        "pointName": variable,
                        "pointValueType": "Number"
                    });
                    expression.addPoint(variablePoint);
                }
            }.bind(this));
            _.forEachRight(this.blockInputs, function (input) {
                if (input.pointName !== this._expressionPointName && !_.includes(this._expressionData.variables, input.pointName)) {
                    expression.removePoint(input);
                }
            }.bind(this));
        } catch (e) {
            console.warn(e.message);
            // TODO: use this error to display it in the block
        }
    }
};