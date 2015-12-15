//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * @param {dudeGraph.Block} cgBlock - Reference to the related cgBlock.
 * @param {Object} data - JSON representation of this stream point
 * @param {Boolean} isOutput - Defined whether this point is an output or an input
 * @class
 * @extends {dudeGraph.Point}
 */
dudeGraph.Choice = function (cgBlock, data, isOutput) {
    dudeGraph.Point.call(this, cgBlock, _.merge(data, {
        "cgValueType": "Choice"
    }), isOutput, "Choice");
    Object.defineProperty(this, "choice", {
        get: function () {
            return this._cgValue.choice;
        }.bind(this),
        set: function (choice) {
            if (!this.validateChoice(choice)) {
                throw new Error("Choice `" + choice + "` is not in the possible choices");
            }
            this._cgValue.choice = choice;
        }.bind(this)
    });
    Object.defineProperty(this, "choices", {
        get: function () {
            return this._cgValue.choices;
        }.bind(this)
    });
    if (!this.validateChoice(this.cgValue.choice)) {
        throw new Error("Choice `" + this.cgValue.choice + "` is not in the possible choices");
    }
};

dudeGraph.Choice.prototype = _.create(dudeGraph.Point.prototype, {
    "constructor": dudeGraph.Choice,
    "className": "Choice"
});

/**
 * Returns a copy of this Choice
 * @param {dudeGraph.Block} cgBlock - The block on which the cloned choice will be attached to
 * @returns {dudeGraph.Choice}
 */
dudeGraph.Choice.prototype.clone = function (cgBlock) {
    return dudeGraph.Point.clone.call(this, cgBlock);
};

/**
 * Returns whether the given choice is in the possible choices
 * @param {Object} choice
 * @returns {Boolean}
 */
dudeGraph.Choice.prototype.validateChoice = function (choice) {
    return choice === null || _.contains(this.cgValue.choices, choice);
};