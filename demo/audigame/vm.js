/**
 * CelestoryVM is a virtual machine for Celestory generated stories
 * @param {CelestoryVM.Blocks} blocks
 * @param {String} startBlockId
 * @param {CelestoryVM.Variables} variables
 * @class
 */
var CelestoryVM = function (blocks, startBlockId, variables) {
    /**
     * CelestoryVM blocks
     * @type {Array<CelestoryVM.Block>}
     * @private
     */
    this._blocks = blocks;

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
     * CelestoryVM current block (Start, Step or End)
     * @private
     */
    this._block = null;
    Object.defineProperty(this, "block", {
        get: function () {
            return this._block;
        }.bind(this)
    });

    /**
     * CelestoryVM current block ID (Start, Step or End)
     * @type {String}
     * @private
     */
    this._blockId = null;
    Object.defineProperty(this, "blockId", {
        get: function () {
            return this._blockId;
        }.bind(this),
        set: function (blockId) {
            var block = this._blocks[blockId];
            if (typeof block === "undefined") {
                throw new Error("No block for blockId");
            }
            this._block = block;
            this._blockId = blockId;

            if (block.type !== "End") {
                var vm = this;
                var blocks = JSON.parse(JSON.stringify(this._blocks));
                var variables = JSON.parse(JSON.stringify(this._variables));
                var resetState = function () {
                    vm._blocks = JSON.parse(JSON.stringify(blocks));
                    vm._variables = JSON.parse(JSON.stringify(variables));
                };
                this._first.blockId = this._evaluateStream(block.first.blockId);
                this._first.blocks = JSON.parse(JSON.stringify(this._blocks));
                this._first.variables = JSON.parse(JSON.stringify(this._variables));
                resetState();
                this._second.blockId = this._evaluateStream(block.second.blockId);
                this._second.blocks = JSON.parse(JSON.stringify(this._blocks));
                this._second.variables = JSON.parse(JSON.stringify(this._variables));
                resetState();
                this._timeout.blockId = this._evaluateStream(block.second.blockId);
                this._timeout.blocks = JSON.parse(JSON.stringify(this._blocks));
                this._timeout.variables = JSON.parse(JSON.stringify(this._variables));
                resetState();
            }

            this._computeState();
        }.bind(this)
    });

    /**
     * CelestoryVM current state (computed from current block)
     * @type {CelestoryVM.State}
     * @private
     */
    this._state = null;
    Object.defineProperty(this, "state", {
        get: function () {
            return this._state;
        }.bind(this)
    });

    /**
     * @type {CelestoryVM.Choice}
     * @private
     */
    this._first = {
        "variables": [],
        "blocks": [],
        "blockId": null
    };
    /**
     * @type {CelestoryVM.Choice}
     * @private
     */
    this._second = {
        "variables": [],
        "blocks": [],
        "blockId": null
    };
    /**
     * @type {CelestoryVM.Choice}
     * @private
     */
    this._timeout = {
        "variables": [],
        "blocks": [],
        "blockId": null
    };

    /**
     * Initialization of the Start block
     */
    this.blockId = startBlockId;
};

/**
 * Makes the first choice
 */
CelestoryVM.prototype.firstChoice = function () {
    this._sanityChecks();
    this._blocks = this._first.blocks;
    this._variables = this._first.variables;
    this.blockId = this._first.blockId;
};

/**
 * Makes the second choice
 */
CelestoryVM.prototype.secondChoice = function () {
    this._sanityChecks();
    this._blocks = this._second.blocks;
    this._variables = this._second.variables;
    this.blockId = this._second.blockId;
};

/**
 * Makes the timeout choice
 */
CelestoryVM.prototype.timeoutChoice = function () {
    this._sanityChecks();
    this._blocks = this._timeout.blocks;
    this._variables = this._timeout.variables;
    this.blockId = this._timeout.blockId;
};

/**
 * Ensures the story hasn't ended yet
 * @private
 */
CelestoryVM.prototype._sanityChecks = function () {
    if (this._block.type === "End") {
        throw new Error("Story ended");
    }
};

/**
 * Computes the current state
 * @private
 */
CelestoryVM.prototype._computeState = function () {
    var choice = this._evaluateValue(this._block.choice);
    var timer = this._evaluateValue(this._block.timer);
    var sound = this._evaluateValue(this._block.sound);
    var cover = this._evaluateValue(this._block.cover);
    this._state = {
        "type": this._block.type
    };
    if (typeof choice !== "undefined") {
        this._state.choice = choice;
    }
    if (typeof timer !== "undefined") {
        this._state.timer = timer;
    }
    if (typeof sound !== "undefined") {
        this._state.sound = sound;
    }
    if (typeof cover !== "undefined") {
        this._state.cover = cover;
    }
    if (this._block.type !== "End") {
        this._state.first = this._evaluateValue(this._blocks[this._first.blockId].choice);
        this._state.second = this._evaluateValue(this._blocks[this._second.blockId].choice);
    }
};

/**
 * Returns whether the direct value or the indirect value
 * @param {CelestoryVM.Value} value
 * @returns {CelestoryVM.Value}
 * @private
 */
CelestoryVM.prototype._evaluateValue = function (value) {
    if (typeof value === "object") {
        var block = this._blocks[value.blockId];
        if (typeof block !== "undefined") {
            switch (block.type) {
                case "Variable":
                    return this._variables[block.name];
                case "format":
                    // TODO: format
                    return "format";
                default:
                    throw new Error("Cannot evaluate value for type `" + block.type + "`");
            }
        }
    }
    return value;
};

/**
 * Evaluates the block and returns the next block encountered on the stream (Step or End)
 * @param {Object} blockId
 * @private
 */
CelestoryVM.prototype._evaluateStream = function (blockId) {
    var block = this._blocks[blockId];
    switch (block.type) {
        case "Start":
        case "Step":
        case "End":
            return blockId;
        case "Condition":
            var test = this._evaluateValue(block.test);
            if (test) {
                return this._evaluateStream(block.true.blockId);
            }
            return this._evaluateStream(block.false.blockId);
        case "assign":
            this._variables[this._blocks[block.variable.blockId].name] = this._evaluateValue(block.value);
            return this._evaluateStream(block.out.blockId);
        default:
            throw new Error("Cannot evaluate stream for type `" + block.type + "`");
    }
};

/**
 * @typedef {Object<String, *>} CelestoryVM.Variables
 */

/**
 * @typedef {*} CelestoryVM.Value
 * @property {String} [blockId=undefined]
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
 * @property {String} [first=undefined] - will be filled to the blockId if block is a Start, Step or End
 * @property {String} [second=undefined] - will be filled to the blockId if block is a Start, Step or End
 * @property {String} [timeout=undefined] - will be filled to the blockId if block is a Start, Step or End
 * @property {String} [out=undefined] - will be filled to the blockId if block is neither a Start, Step or End
 */

/**
 * @typedef {Object<String, CelestoryVM.Block>} CelestoryVM.Blocks
 * /

/**
 * @typedef {Object} CelestoryVM.Choice
 * @property {CelestoryVM.Variables} variables
 * @property {Array<CelestoryVM.Block>} blocks
 * @property {String} blockId
 */

//noinspection SpellCheckingInspection
/**
 * @type {CelestoryVM.Blocks}
 */
var blocks = {
    "fef8-9fad-987c-ea0d-aeac-db6043d6739b": {
        "type": "Variable",
        "name": "has_key"
    },
    "2e49-1e75-0881-3719-7dfa-5f19b8c70641": {
        "type": "Start",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "timer": 32,
        "first": {
            "blockId": "2e49-c40a-9957-1421-155f-13d1c0244864"
        },
        "second": {
            "blockId": "183c-5ff3-46f5-c907-88f0-d0f220aa882b"
        }
    },
    "2e49-c40a-9957-1421-155f-13d1c0244864": {
        "type": "Step",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "Step me",
        "timer": 0,
        "first": {
            "blockId": "183c-5dbc-43da-a448-b6c6-53de21c625fc"
        },
        "second": {
            "blockId": "183c-4075-c017-da86-d7f8-54e80ba317c9"
        },
        "timeout": {
            "blockId": "183c-4075-c017-da86-d7f8-54e80ba317c9"
        }
    },
    "183c-5ff3-46f5-c907-88f0-d0f220aa882b": {
        "type": "Condition",
        "test": {
            "blockId": "fef8-9fad-987c-ea0d-aeac-db6043d6739b"
        },
        "true": {
            "blockId": "183c-e17e-b87d-755b-fe62-2bcbb963750e"
        },
        "false": {
            "blockId": "183c-4075-c017-da86-d7f8-54e80ba317c9"
        }
    },
    "183c-5dbc-43da-a448-b6c6-53de21c625fc": {
        "type": "End",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": {
            "blockId": "183c-652d-6a1f-aaf4-7720-699b91d74f26"
        }
    },
    "183c-4075-c017-da86-d7f8-54e80ba317c9": {
        "type": "End",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "End 2"
    },
    "183c-80dd-add5-af55-5dde-fe9ec79963ab": {
        "type": "End",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "End 3"
    },
    "183c-e17e-b87d-755b-fe62-2bcbb963750e": {
        "type": "assign",
        "variable": {
            "blockId": "183c-3777-36b1-7860-7714-e1262b4826da"
        },
        "value": 21,
        "out": {
            "blockId": "a479-655e-ceed-d222-1e35-ef8522c741f4"
        }
    },
    "183c-3777-36b1-7860-7714-e1262b4826da": {
        "type": "Variable",
        "name": "nb_coins"
    },
    "183c-652d-6a1f-aaf4-7720-699b91d74f26": {
        "type": "format",
        "value": "format_string"
    },
    "a479-556b-a8d8-0b52-c29a-0bd111b654fa": {
        "type": "End",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "End 4"
    },
    "a479-655e-ceed-d222-1e35-ef8522c741f4": {
        "type": "Step",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "Step 2 me",
        "timer": 0,
        "first": {
            "blockId": "183c-80dd-add5-af55-5dde-fe9ec79963ab"
        },
        "second": {
            "blockId": "a479-556b-a8d8-0b52-c29a-0bd111b654fa"
        }
    }
};

const CVM = new CelestoryVM(blocks, "2e49-1e75-0881-3719-7dfa-5f19b8c70641", {
    "has_key": false,
    "nb_coins": 32
});
if (typeof module !== "undefined") {
    module.exports = CVM;
}