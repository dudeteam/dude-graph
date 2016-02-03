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
    if (cgPoint.cgName === "format") {
        if (this.inputByName("number") === null && cgPoint.cgValue.indexOf("%d") !== -1) {
            this.addPoint(new dudeGraph.Point(this, {"cgName": "number", "cgValueType": "Number"}, false, null));
        }
        if (this.inputByName("string") === null && cgPoint.cgValue.indexOf("%s") !== -1) {
            this.addPoint(new dudeGraph.Point(this, {"cgName": "string", "cgValueType": "String"}, false, null));
        }
    }
};