/**
 * @param {Boolean} pointOutput
 * @param {dudeGraph.Point.pointDataTypedef} pointData
 * @class
 * @extends {dudeGraph.Point}
 */
dudeGraph.Choice = function (pointOutput, pointData) {
    dudeGraph.Point.call(this, pointOutput, pointData);
    Object.defineProperty(this, "choice", {
        get: function () {
            return this.pointValue.choice;
        }.bind(this),
        set: function (choice) {
            if (!this.validateChoice(choice)) {
                throw new Error("Choice `" + choice + "` is not in the possible choices");
            }
            this.pointValue = {
                "choices": this.pointValue.choices,
                "choice": choice
            };
        }.bind(this)
    });
    Object.defineProperty(this, "choices", {
        get: function () {
            return this.pointValue.choices;
        }.bind(this)
    });
    if (!this.validateChoice(this.pointValue.choice)) {
        throw new Error("Choice `" + this.pointValue.choice + "` is not in the possible choices");
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
dudeGraph.Choice.prototype.emptyValue = function () {
    return this.pointValue === null || this.pointValue.choice === null;
};

/**
 * Returns whether the given choice is in the possible choices
 * @param {Object} choice
 * @returns {Boolean}
 */
dudeGraph.Choice.prototype.validateChoice = function (choice) {
    return choice === null || _.includes(this.pointValue.choices, choice);
};