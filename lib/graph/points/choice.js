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
    }), isOutput);
    Object.defineProperty(this, "choice", {
        get: function () {
            return this._cgValue.choice;
        }.bind(this),
        set: function (choice) {
            if (!this.validateChoice(choice)) {
                throw new Error("Choice `" + choice + "` is not in the possible choices");
            }
            this.cgValue = {
                "choices": this._cgValue.choices,
                "choice": choice
            };
        }.bind(this)
    });
    Object.defineProperty(this, "choices", {
        get: function () {
            return this._cgValue.choices;
        }.bind(this)
    });
    if (!this.validateChoice(this._cgValue.choice)) {
        throw new Error("Choice `" + this._cgValue.choice + "` is not in the possible choices");
    }
};

dudeGraph.Choice.prototype = _.create(dudeGraph.Point.prototype, {
    "constructor": dudeGraph.Choice,
    "className": "Choice"
});

/**
 * Returns whether this Choice is empty
 * @returns {Boolean}
 * @override
 */
dudeGraph.Choice.prototype.empty = function () {
    return this._cgValue === null || this._cgValue.choice === null;
};

/**
 * Returns whether the given choice is in the possible choices
 * @param {Object} choice
 * @returns {Boolean}
 */
dudeGraph.Choice.prototype.validateChoice = function (choice) {
    return choice === null || _.contains(this.cgValue.choices, choice);
};