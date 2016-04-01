/**
 * @param {dudeGraph.Variable.variableDataTypedef} variableData
 * @class
 */
dudeGraph.Variable = function (variableData) {
    /**
     * The parent graph
     * @type {dudeGraph.Graph}
     * @readonly
     * @protected
     */
    this._variableGraph = null;
    Object.defineProperty(this, "variableGraph", {
        set: function (variableGraph) {
            if (this._variableGraph !== null) {
                throw new Error("`" + this.variableFancyName + "` cannot redefine `variableGraph`");
            }
            this._variableGraph = variableGraph;
        }.bind(this),
        get: function () {
            return this._variableGraph;
        }.bind(this)
    });

    /**
     * The variable type
     * @type {String}
     * @readonly
     * @private
     */
    this._variableType = null;
    Object.defineProperty(this, "variableType", {
        get: function () {
            return this._variableType;
        }.bind(this)
    });

    /**
     * The variable name
     * @type {String}
     * @private
     */
    this._variableName = null;
    Object.defineProperty(this, "variableName", {
        get: function () {
            return this._variableName;
        }.bind(this)
    });

    /**
     * The variable value
     * @type {*}
     * @private
     */
    this._variableValue = null;
    Object.defineProperty(this, "variableValue", {
        get: function () {
            return this._variableValue;
        }.bind(this)
    });

    /**
     * The variable block
     * @type {dudeGraph.Block|null}
     * @private
     */
    this._variableBlock = null;
    Object.defineProperty(this, "variableBlock", {
        get: function () {
            return this._variableBlock;
        }.bind(this)
    });

    /**
     * The variable fancy name
     * @type {String}
     */
    Object.defineProperty(this, "variableFancyName", {
        get: function () {
            return this._variableName + " (" + this._variableType + ")";
        }.bind(this)
    });

    this.initialize(variableData);
};

/**
 * Initializes the variable
 * @param {dudeGraph.Variable.variableDataTypedef} variableData
 */
dudeGraph.Variable.prototype.initialize = function (variableData) {
    this._variableType = variableData.variableType;
    this._variableName = variableData.variableName;
    this._variableValue = variableData.variableValue;
    if (!_.isString(this._variableName)) {
        throw new Error("`" + this.variableFancyName + "` `variableName` must be a non-null String");
    }
};

/**
 * Called when the variable is added to a graph
 */
dudeGraph.Variable.prototype.validate = function () {
    if (!this._variableGraph.hasType(this._variableType)) {
        throw new Error("`" + this._variableGraph.graphFancyName + "` has no value type `" + this._variableType + "`");
    }
};

/**
 * @typedef {Object} dudeGraph.Variable.variableDataTypedef
 * @property {String} variableType
 * @property {String} variableName
 * @property {*} [variableValue=undefined]
 */