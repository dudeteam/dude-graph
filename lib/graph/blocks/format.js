/**
 * The expression RegExp "Hello {{name}}"
 * @type {RegExp}
 */
var TypeRegex = /\{\{(\w+)}}/g;

/**
 * An expression block with dynamic value points depending on the format
 * @param {dudeGraph.Block.blockDataTypedef} [blockData={}]
 * @class
 * @extends {dudeGraph.Block}
 */
dudeGraph.FormatBlock = function (blockData) {
    dudeGraph.Block.call(this, blockData);

    /**
     * The format point name
     * @type {String}
     * @private
     */
    this._formatPointName = "format";
};

dudeGraph.FormatBlock.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.FormatBlock,
    "className": "FormatBlock"
});

/**
 * Validates the block content
 * Called when the graph adds this block
 * @override
 */
dudeGraph.FormatBlock.prototype.validatePoints = function () {
    dudeGraph.Block.prototype.validatePoints.call(this);
    if (!(this.inputByName(this._formatPointName) instanceof dudeGraph.Point) || this.inputByName(this._formatPointName).pointValueType !== "String") {
        throw new Error("FormatBlock `" + this.blockId + "` must have an input `" + this._formatPointName + "` of type `Point` of pointValueType `String`");
    }
    this._validateFormat();
};

//noinspection JSUnusedLocalSymbols
/**
 * Called when the value of the point changed
 * @param {dudeGraph.Point} point
 * @param {Object|null} pointValue
 * @param {Object|null} oldPointValue
 */
dudeGraph.FormatBlock.prototype.pointValueChanged = function (point, pointValue, oldPointValue) {
    if (point.pointName === this._formatPointName) {
        this._validateFormat();
    }
};

/**
 * Validates and interprets the format
 * @private
 */
dudeGraph.FormatBlock.prototype._validateFormat = function () {
    var format = this;
    var formatFormat = this.inputByName(this._formatPointName).pointValue;
    var match = true;
    while (match) {
        match = TypeRegex.exec(formatFormat);
        if (match) {
            if (format.inputByName(match[1]) === null) {
                var variablePoint = new dudeGraph.Point(false, {
                    "pointName": match[1],
                    "pointValueType": "String"
                });
                format.addPoint(variablePoint);
            }
        }
    }
    var inputs = _.clone(format.blockInputs);
    _.forEachRight(inputs, function (input) {
        if (input.pointName === format._formatPointName) {
            return;
        }
        if (formatFormat.indexOf("{{" + input.pointName + "}}") === -1) {
            format.removePoint(input);
        }
    });
};