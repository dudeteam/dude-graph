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
     * The variable name
     * @type {String}
     * @private
     */
    this._variableName = null;
    Object.defineProperty(this, "variableName", {
        get: function () {
            return this._variableName;
        }.bind(this),
        set: function () {
            throw new Error("not yet implemented");
        }
    });

    /**
     * The variable value type
     * @type {String}
     * @readonly
     * @private
     */
    this._variableValueType = null;
    Object.defineProperty(this, "variableValueType", {
        get: function () {
            return this._variableValueType;
        }.bind(this),
        set: function () {
            throw new Error("not yet implemented");
        }
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
        }.bind(this),
        set: function () {
            throw new Error("not yet implemented");
        }
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
        }.bind(this),
        set: function (block) {
            this._variableBlock = block;
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
    this._variableName = variableData.variableName;
    this._variableValueType = variableData.variableValueType;
    this._variableValue = variableData.variableValue;
    this._variableBlock = variableData.variableBlock || null;
    if (!_.isString(this._variableName)) {
        throw new Error("`" + this.variableFancyName + "` `variableName` must be a non-null String");
    }
    if (this._variableBlock !== null && !(this._variableBlock instanceof dudeGraph.VariableBlock)) {
        throw new Error("`" + this.variableFancyName + "` `variableBlock` must be of type `dudeGraph.VariableBlock`");
    }
};

/**
 * Called when the variable is added to a graph
 */
dudeGraph.Variable.prototype.validate = function () {
    if (!this._variableGraph.hasType(this._variableValueType)) {
        throw new Error("`" + this._variableGraph.graphFancyName + "` has no value type `" + this._variableType + "`");
    }
};

/**
 * @typedef {Object} dudeGraph.Variable.variableDataTypedef
 * @property {String} variableName
 * @property {String} variableValueType
 * @property {*} [variableValue=undefined]
 * @property {dudeGraph.Block} [variableBlock=null]
 */