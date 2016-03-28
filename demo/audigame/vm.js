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
        this._state.first = this._blocks[this._first.blockId].choice;
        this._state.second = this._blocks[this._second.blockId].choice;
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
        // TODO: handle indirect value
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
        case "assign":
            this._variables[this._blocks[block.variable.blockId].name] = this._evaluateValue(block.value);
            return this._evaluateStream(block.out.blockId);
        default:
            throw new Error("Cannot evaluate type `" + block.type + "`");
    }
};

/**
 * @typedef {Object<String, *>} CelestoryVM.Variables
 */

/**
 * @typedef {*} CelestoryVM.Value
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
    "4f77-73ff-91ea-43e9-1bd7-fd58b71a8433": {
        "type": "Start",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "timer": 0,
        "first": {
            "blockId": "4f77-92c9-52a6-8dd8-e08c-5f2e0ed58dca"
        },
        "second": {
            "blockId": "02d5-fe8f-ee3b-26d4-c858-5f7883d416d4"
        }
    },
    "4f77-92c9-52a6-8dd8-e08c-5f2e0ed58dca": {
        "type": "Step",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "Leave Key",
        "timer": 0,
        "first": {
            "blockId": "4f77-b362-cbfe-7fe1-756a-9633b789a0c4"
        },
        "second": {
            "blockId": "02d5-4e68-3903-0a2e-f99f-07935cf7f3aa"
        }
    },
    "4f77-b362-cbfe-7fe1-756a-9633b789a0c4": {
        "type": "End",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "Kill Sarah"
    },
    "3457-2a45-5dcd-fdae-44fd-b392e334ad5e": {
        "type": "Variable",
        "name": "has_key"
    },
    "02d5-fe8f-ee3b-26d4-c858-5f7883d416d4": {
        "type": "assign",
        "variable": {
            "blockId": "3457-2a45-5dcd-fdae-44fd-b392e334ad5e"
        },
        "value": 1,
        "out": {
            "blockId": "02d5-e284-fa65-9da3-f7ea-1358c08b4870"
        }
    },
    "02d5-4e68-3903-0a2e-f99f-07935cf7f3aa": {
        "type": "End",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "Spare Sarah"
    },
    "02d5-e284-fa65-9da3-f7ea-1358c08b4870": {
        "type": "Step",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "Take Key",
        "timer": 0,
        "first": {
            "blockId": "4f77-b362-cbfe-7fe1-756a-9633b789a0c4"
        },
        "second": {
            "blockId": "02d5-4e68-3903-0a2e-f99f-07935cf7f3aa"
        },
        "timeout": {
            "blockId": "d397-632d-18ec-a26f-3afb-a80e3af78a87"
        }
    },
    "d397-632d-18ec-a26f-3afb-a80e3af78a87": {
        "type": "End",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": null
    }
};

const CVM = new CelestoryVM(blocks, "4f77-73ff-91ea-43e9-1bd7-fd58b71a8433", {
    "has_key": false,
    "nb_coins": 32
});
if (typeof module !== "undefined") {
    module.exports = CVM;
}