/**
 * @param {CelestoryVM.Block} start
 * @param {CelestoryVM.Variables} variables
 * @class
 */
var CelestoryVM = function (start, variables) {
    /**
     * CelestoryVM current state
     * @type {CelestoryVM.State}
     * @private
     */
    this._state = {};
    Object.defineProperty(this, "state", {
        get: function () {
            return this._state;
        }.bind(this)
    });

    /**
     * CelestoryVM current variables
     * @type {CelestoryVM.Variables}
     * @private
     */
    this._variables = variables;
    Object.defineProperty(this, "variables", {
        get: function () {
            return this._variables;
        }.bind(this),
        set: function (variables) {
            this._variables = variables;
        }.bind(this)
    });

    /**
     * CelestoryVM current block
     * @type {CelestoryVM.Block}
     * @private
     */
    this._block = null;
    Object.defineProperty(this, "block", {
        get: function () {
            return this._block;
        }.bind(this),
        set: function (block) {
            this._block = block;
            if (block.type !== "End") {
                var variables = JSON.parse(JSON.stringify(this._variables));
                this._first.block = (block.first).call(this);
                this._first.variables = JSON.parse(JSON.stringify(this._variables));
                this._variables = JSON.parse(JSON.stringify(variables));
                this._second.block = (block.second).call(this);
                this._second.variables = JSON.parse(JSON.stringify(this._variables));
                this._variables = JSON.parse(JSON.stringify(variables));
                this._timeout.block = (block.timeout || block.first).call(this);
                this._timeout.variables = JSON.parse(JSON.stringify(this._variables));
                this._variables = JSON.parse(JSON.stringify(variables));
            }
            this._computeState();
        }.bind(this)
    });

    /**
     * @type {CelestoryVM.Choice}
     * @private
     */
    this._first = {
        "variables": [],
        "block": null
    };
    /**
     * @type {CelestoryVM.Choice}
     * @private
     */
    this._second = {
        "variables": [],
        "block": null
    };
    /**
     * @type {CelestoryVM.Choice}
     * @private
     */
    this._timeout = {
        "variables": [],
        "block": null
    };

    /**
     * Initialization of the start block
     */
    this.block = start;
};

/**
 * Clones the variables
 * @param {CelestoryVM.Variables} variables
 * @private
 */
CelestoryVM.prototype._cloneVariables = function (variables) {
    var target = {};
    for (var i in variables) {
        if (variables.hasOwnProperty(i)) {
            target[i] = variables[i];
        }
    }
    return target;
};

/**
 * Computes the current block state state
 * @private
 */
CelestoryVM.prototype._computeState = function () {
    var type = this._block.type;
    var choice = this._block.choice ? this._block.choice.call(this) : null;
    var timer = this._block.timer ? this._block.timer.call(this) : null;
    var sound = this._block.sound ? this._block.sound.call(this) : null;
    var cover = this._block.cover ? this._block.cover.call(this) : null;
    this._state = {
        "type": type
    };
    if (choice !== null) {
        this._state.choice = choice;
    }
    if (timer !== null) {
        this._state.timer = timer;
    }
    if (sound !== null) {
        this._state.sound = sound;
    }
    if (cover !== null) {
        this._state.cover = cover;
    }
    if (type !== "End") {
        this._state.first = this._first.block.choice.call(this);
        this._state.second = this._second.block.choice.call(this);
    }
};

/**
 * Evaluates the given block
 * @param {Object} block
 * @returns {Object}
 */
CelestoryVM.prototype.evaluate = function (block) {
    var blockType = block.type;
    switch (blockType) {
        case "Start":
        case "Step":
        case "End":
            return block;
        default:
            return block.evaluate.call(this);
    }
};

/**
 * Ensures the story haven't ended yet
 * @private
 */
CelestoryVM.prototype._sanityChecks = function () {
    if (this._block.type === "End") {
        throw new Error("Story finished");
    }
};

/**
 * Makes the first choice
 */
CelestoryVM.prototype.firstChoice = function () {
    this._sanityChecks();
    this.block = this._first.block;
    this.variables = this._first.variables;
};

/**
 * Makes the second choice
 */
CelestoryVM.prototype.secondChoice = function () {
    this._sanityChecks();
    this.block = this._second.block;
    this.variables = this._second.variables;
};

/**
 * Makes the timeout choice
 */
CelestoryVM.prototype.timeoutChoice = function () {
    this._sanityChecks();
    this.block = this._timeout.block;
    this.variables = this._timeout.variables;
};

/**
 * @typedef {Object<String, *>} CelestoryVM.Variables
 */

/**
 * @typedef {Object} CelestoryVM.State
 * @property {String} type
 * @property {String} [choice=undefined] - choice is undefined if the state is a Start
 * @property {String} [timer=undefined] - timer is undefined if the state is an Ending
 * @property {String} sound
 * @property {String} cover
 * @property {String} [first=undefined] - first is undefined if the state is an Ending
 * @property {String} [second=undefined] - second is undefined if the state is an Ending
 */


/**
 * @typedef {Object} CelestoryVM.Block
 * @property {String} type
 * @property {CelestoryVM.Value} [choice=undefined] - choice is undefined if the state is a Start
 * @property {CelestoryVM.Value} [timer=undefined] - timer is undefined if the state is an Ending
 * @property {CelestoryVM.Value} sound
 * @property {CelestoryVM.Value} cover
 * @property {CelestoryVM.Evaluate} first
 * @property {CelestoryVM.Evaluate} second
 * @property {CelestoryVM.Evaluate} [timeout=first|second] - if no timeout is specified, timeout will be randomly set to
 * either first or second
 */

/**
 * @typedef {Function} CelestoryVM.Evaluate
 * @returns {CelestoryVM.Block}
 */

/**
 * @typedef {Function} CelestoryVM.Value
 * @returns {*}
 */

/**
 * @typedef {Object} CelestoryVM.Choice
 * @property {CelestoryVM.Variables} variables
 * @property {CelestoryVM.Block} block
 */

//////////////////////////////////////////////////////////////////////
// Generated Celestory VM                                           //
//                                                                  //
// Graph: https://i.gyazo.com/cde73374368a35c77c62b6494d122be4.png  //
//////////////////////////////////////////////////////////////////////

var blocks = {
    "4f77-73ff-91ea-43e9-1bd7-fd58b71a8433": {
        "type": "Start",
        "timer": function () {
            return 0;
        },
        "sound": function () {
            return "start.ogg";
        },
        "cover": function () {
            return "start.png";
        },
        "first": function () {
            return this.evaluate(blocks["4f77-92c9-52a6-8dd8-e08c-5f2e0ed58dca"]);
        },
        "second": function () {
            return this.evaluate(blocks["02d5-fe8f-ee3b-26d4-c858-5f7883d416d4"]);
        }
    },
    "4f77-92c9-52a6-8dd8-e08c-5f2e0ed58dca": {
        "type": "Step",
        "choice": function () {
            return "Leave key";
        },
        "timer": function () {
            return 0;
        },
        "sound": function () {
            return "leave_key.ogg";
        },
        "cover": function () {
            return "leave_key.png";
        },
        "first": function () {
            return this.evaluate(blocks["4f77-b362-cbfe-7fe1-756a-9633b789a0c4"]);
        },
        "second": function () {
            return this.evaluate(blocks["02d5-4e68-3903-0a2e-f99f-07935cf7f3aa"]);
        }
    },
    "02d5-e284-fa65-9da3-f7ea-1358c08b4870": {
        "type": "Step",
        "choice": function () {
            return "Take key";
        },
        "timer": function () {
            return 0;
        },
        "sound": function () {
            return "take_key.ogg";
        },
        "cover": function () {
            return "take_key.png";
        },
        "first": function () {
            return this.evaluate(blocks["4f77-b362-cbfe-7fe1-756a-9633b789a0c4"]);
        },
        "second": function () {
            return this.evaluate(blocks["02d5-4e68-3903-0a2e-f99f-07935cf7f3aa"]);
        },
        "timeout": function () {
            return this.evaluate(blocks["d397-632d-18ec-a26f-3afb-a80e3af78a87"]);
        }
    },
    "4f77-b362-cbfe-7fe1-756a-9633b789a0c4": {
        "type": "End",
        "choice": function () {
            return "Kill Sarah";
        },
        "sound": function () {
            return "kill_sarah.ogg";
        },
        "cover": function () {
            return "kill_sarah.png";
        }
    },
    "02d5-4e68-3903-0a2e-f99f-07935cf7f3aa": {
        "type": "End",
        "choice": function () {
            return "Spare Sarah";
        },
        "sound": function () {
            return "spare_sarah.ogg";
        },
        "cover": function () {
            return "spare_sarah.png";
        }
    },
    "d397-632d-18ec-a26f-3afb-a80e3af78a87": {
        "type": "End",
        "choice": function () {
            return "Leave with money";
        },
        "sound": function () {
            return "leave_money.ogg";
        },
        "cover": function () {
            return "leave_money.png";
        }
    },
    "02d5-fe8f-ee3b-26d4-c858-5f7883d416d4": {
        "type": "assign",
        "evaluate": function () {
            this._variables["has_key"] = 1;
            return this.evaluate(blocks["02d5-e284-fa65-9da3-f7ea-1358c08b4870"]);
        }
    }
};

var CVM = new CelestoryVM(blocks["4f77-73ff-91ea-43e9-1bd7-fd58b71a8433"], {
    "has_key": false,
    "nb_coins": 0
});
if (typeof module !== "undefined") {
    module.exports = CVM;
}