/**
 * @param {dudeGraph.Variable.variableDataTypedef} variableData
 * @class
 * @extends {EventEmitter}
 */
dudeGraph.Variable = function (variableData) {
    /**
     * The parent graph
     * @type {dudeGraph.Graph}
     * @readonly
     * @private
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
     * @type {dudeGraph.Graph.graphValueTypeTypedef}
     * @readonly
     * @private
     */
    this._variableValueType = null;
    Object.defineProperty(this, "variableValueType", {
        get: function () {
            return this._variableValueType;
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
        }.bind(this),
        set: this.changeValue
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
            return "Variable (`" + this._variableName + "`)";
        }.bind(this)
    });

    this.initialize(variableData);
};

dudeGraph.Variable.prototype = _.create(EventEmitter.prototype, {
    "constructor": dudeGraph.Variable,
    "className": "Variable"
});

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
dudeGraph.Variable.prototype.added = function () {
    if (this._variableGraph.graphValueTypeByName(this._variableValueType) === null) {
        throw new Error("`" + this._variableGraph.graphFancyName + "` has no value type `" + this._variableValueType + "`");
    }
};

/**
 * Changes the variable value
 * @param {Object|null} value
 * @param {Boolean} [ignoreEmit=false]
 */
dudeGraph.Variable.prototype.changeValue = function (value, ignoreEmit) {
    var assignValue = this._variableGraph.convertValue(this._variableValueType, value);
    if (_.isUndefined(assignValue)) {
        throw new Error("`" + this.variableFancyName + "` " + value +
            "` is not compatible with type `" + this._variableValueType + "`");
    }
    var oldValue = this._variableValue;
    this._variableValue = assignValue;
    if (!ignoreEmit) {
        this.emit("value-change", assignValue, oldValue);
        this._variableGraph.emit("variable-value-change", this, assignValue, oldValue);
    }
};

/**
 * @typedef {Object} dudeGraph.Variable.variableDataTypedef
 * @property {String} variableName
 * @property {String} variableValueType
 * @property {*} [variableValue=undefined]
 * @property {dudeGraph.Block} [variableBlock=null]
 */