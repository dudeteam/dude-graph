/**
 * TODO: Find nice explanation
 * @param {Object} blockData
 * @param {String|null} [blockData.blockId=null]
 * @param {String} [blockData.blockName=this.className]
 * @param {Object<String, Array<String>>} [blockData.blockTemplates=null]
 * @class
 * @extends {EventEmitter}
 */
dudeGraph.Block = function (blockData) {
    /**
     * The parent graph
     * @type {dudeGraph.Graph}
     * @readonly
     * @protected
     */
    this._blockGraph = null;
    Object.defineProperty(this, "blockGraph", {
        set: function (blockGraph) {
            if (this._blockGraph !== null) {
                throw new Error("`" + this.blockFancyName + "` cannot redefine `blockGraph`");
            }
            this._blockGraph = blockGraph;
        }.bind(this),
        get: function () {
            return this._blockGraph;
        }.bind(this)
    });

    /**
     * The block type
     * @type {String}
     * @readonly
     * @protected
     */
    this._blockType = this.className;
    Object.defineProperty(this, "blockType", {
        get: function () {
            return this._blockId;
        }.bind(this)
    });

    /**
     * The block unique identifier in the graph
     * @type {String}
     * @protected
     */
    this._blockId = null;
    Object.defineProperty(this, "blockId", {
        set: function (blockId) {
            if (this._blockId !== null) {
                throw new Error("`" + this.blockFancyName + "` cannot redefine `blockId`");
            }
            this._blockId = blockId;
        }.bind(this),
        get: function () {
            return this._blockId;
        }.bind(this)
    });

    /**
     * The block name
     * @type {String}
     * @protected
     */
    this._blockName = null;
    Object.defineProperty(this, "blockName", {
        get: function () {
            return this._blockName;
        }.bind(this)
    });

    /**
     * Map the template names to the types they can be templated to
     * @type {Object<String, Array<String>>}
     * @protected
     */
    this._blockTemplates = {};
    Object.defineProperty(this, "blockTemplates", {
        get: function () {
            return this._blockTemplates;
        }.bind(this)
    });

    /**
     * The block input points
     * @type {Array<dudeGraph.Point>}
     * @protected
     */
    this._blockInputPoints = [];
    Object.defineProperty(this, "blockInputPoints", {
        get: function () {
            return this._blockInputPoints;
        }.bind(this)
    });

    /**
     * The block output points
     * @type {Array<dudeGraph.Point>}
     * @protected
     */
    this._blockOutputPoints = [];
    Object.defineProperty(this, "blockOutputPoints", {
        get: function () {
            return this._blockOutputPoints;
        }.bind(this)
    });

    /**
     * The block fancy name
     * @type {String}
     */
    Object.defineProperty(this, "blockFancyName", {
        get: function () {
            return this._blockName + " (" + this._blockId + ")";
        }.bind(this)
    });

    this.initialize(blockData);
};

dudeGraph.Block.prototype = _.create(EventEmitter.prototype, {
    "constructor": dudeGraph.Block,
    "className": "Block"
});

/**
 * Initializes the block
 * @param {Object} blockData
 * @param {String|null} [blockData.blockId=null]
 * @param {String} [blockData.blockName=this.className]
 * @param {Object<String, Array<String>>} [blockData.blockTemplates=null]
 */
dudeGraph.Block.prototype.initialize = function (blockData) {
    this._blockId = blockData.blockId || null;
    this._blockName = blockData.blockName || this.className;
    this._blockTemplates = blockData.blockTemplates || null;
};

/**
 *
 */
dudeGraph.Block.prototype.validate = function () {};

/**
 * Adds a point to the block
 * @param {dudeGraph.Point} point
 * @param {Number|undefined} [position=undefined] - The position to insert the block (undefined = end)
 */
dudeGraph.Block.prototype.addPoint = function (point, position) {
    if (this._blockGraph === null) {
        throw new Error("`" + this.blockFancyName + "` cannot be updated when not bound to a graph");
    }
    if (point.pointOutput && this.outputByName(point.pointName) !== null) {
        throw new Error("`" + this.blockFancyName + "` already has an output named `" + point.pointName + "`");
    }
    if (!point.pointOutput && this.inputByName(point.pointName) !== null) {
        throw new Error("`" + this.blockFancyName + "` already has an input named `" + point.pointName + "`");
    }
    point.pointBlock = this;
    point.validate();
    if (_.isUndefined(position)) {
        position = point.pointOutput ? this._blockOutputPoints.length : this._blockInputPoints.length;
    }
    if (point.pointOutput) {
        this._blockOutputPoints.splice(position, 0, point);
    } else {
        this._blockInputPoints.splice(position, 0, point);
    }
    this._blockGraph.emit("block-point-add", this, point);
};
/**
 *
 * @param {dudeGraph.Point} point
 */
dudeGraph.Block.prototype.removePoint = function (point) {};
/**
 *
 */
dudeGraph.Block.prototype.removeAllPoints = function () {};

/**
 * Returns the input point found by the given pointName or null
 * @param {String} pointName
 * @returns {dudeGraph.Point|null}
 */
dudeGraph.Block.prototype.inputByName = function (pointName) {
    return _.find(this._blockInputPoints, function (point) {
            return point.pointName === pointName;
        }) || null;
};
/**
 * Returns the output point found by the given pointName or null
 * @param {String} pointName
 * @returns {dudeGraph.Point|null}
 */
dudeGraph.Block.prototype.outputByName = function (pointName) {
    return _.find(this._blockOutputPoints, function (point) {
            return point.pointName === pointName;
        }) || null;
};

/**
 *
 * @param {dudeGraph.Point} point
 * @param {Object} pointValue
 * @param {Object} oldPointValue
 */
dudeGraph.Block.prototype.pointValueChanged = function (point, pointValue, oldPointValue) {};

/**
 * @returns {dudeGraph.Block}
 */
dudeGraph.Block.prototype.clone = function () {};