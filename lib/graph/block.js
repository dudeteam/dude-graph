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
 *
 * @param {dudeGraph.Point} point
 * @param {Number|undefined} [position=undefined]
 */
dudeGraph.Block.prototype.addPoint = function (point, position) {};
/**
 *
 * @param {dudeGraph.Point} point
 */
dudeGraph.Block.prototype.removePoint = function (point) {};

/**
 *
 * @param {String} pointName
 * @returns {dudeGraph.Point}
 */
dudeGraph.Block.prototype.inputByName = function (pointName) {};
/**
 *
 * @param {String} pointName
 * @returns {dudeGraph.Point}
 */
dudeGraph.Block.prototype.outputByName = function (pointName) {};

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