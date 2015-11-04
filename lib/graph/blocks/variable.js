//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * @extends {dudeGraph.Block}
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object} data
 * @constructor
 */
dudeGraph.Variable = function (cgGraph, data) {
    dudeGraph.Block.call(this, cgGraph, data, "Variable");

    /**
     * The type of this variable, the block will return a point of this type.
     * @type {String}
     * @private
     */
    Object.defineProperty(this, "cgValueType", {
        get: function () {
            return this._cgValueType;
        }.bind(this)
    });
    this._cgValueType = data.cgValueType;

    /**
     * The current value of the Variable.
     * @type {*}
     * @private
     */
    Object.defineProperty(this, "cgValue", {
        get: function () {
            return this._cgValue;
        }.bind(this),
        set: function (value) {
            this._cgValue = value;
            this.cgOutputs[0].cgValue = value;
        }.bind(this)
    });
    this._cgValue = data.cgValue;
};

/**
 * @extends {dudeGraph.Block}
 */
dudeGraph.Variable.prototype = _.create(dudeGraph.Block.prototype, {
    "constructor": dudeGraph.Variable
});

/**
 * Validates the block content
 * Called when the graph adds this block
 */
dudeGraph.Variable.prototype.validate = function () {
    if (!(this.outputByName("value") instanceof dudeGraph.Point)) {
        throw new Error("Variable `" + this.cgId + "` must have an output `value` of type `Point`");
    }
};