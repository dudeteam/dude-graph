/**
 * Block is a node in the graph, it can be connected to other blocks by points connections
 * @param {dudeGraph.Block.blockData} [blockData={}]
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
            return this._blockType;
        }.bind(this)
    });

    /**
     * The block unique identifier in the graph
     * @type {String}
     * @readonly
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
     * @readonly
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
     * @type {Object<String, {templates: Array<String>, valueType: String}>}
     * @readonly
     * @protected
     */
    this._blockTemplates = {};
    Object.defineProperty(this, "blockTemplates", {
        get: function () {
            return this._blockTemplates;
        }.bind(this)
    });

    /**
     * The block output points
     * @type {Array<dudeGraph.Point>}
     * @protected
     */
    this._blockOutputs = [];
    Object.defineProperty(this, "blockOutputs", {
        get: function () {
            return this._blockOutputs;
        }.bind(this)
    });

    /**
     * The block input points
     * @type {Array<dudeGraph.Point>}
     * @protected
     */
    this._blockInputs = [];
    Object.defineProperty(this, "blockInputs", {
        get: function () {
            return this._blockInputs;
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

    this.initialize(blockData || {});
};

dudeGraph.Block.prototype = _.create(EventEmitter.prototype, {
    "constructor": dudeGraph.Block,
    "className": "Block"
});

/**
 * Initializes the block
 * @param {dudeGraph.Block.blockData} [blockData={}]
 */
dudeGraph.Block.prototype.initialize = function (blockData) {
    this._blockId = blockData.blockId || null;
    this._blockName = blockData.blockName || this.className;
    this._blockTemplates = blockData.blockTemplates || {};
};

/**
 * Called when the block is added to a graph
 */
dudeGraph.Block.prototype.validate = function () {
    var block = this;
    _.forOwn(this._blockTemplates, function (template, templateName) {
        block.updateTemplate(templateName, template.valueType, true);
    });
};
/**
 * Called when the basic points are created
 */
dudeGraph.Block.prototype.validatePoints = function () {};
/**
 * Called when the value of the point changed
 * @param {dudeGraph.Point} point
 * @param {Object|null} pointValue
 * @param {Object|null} oldPointValue
 */
dudeGraph.Block.prototype.pointValueChanged = function (point, pointValue, oldPointValue) {};

/**
 * Returns the template corresponding to the templateName
 * @param {String} templateName
 * @returns {dudeGraph.Graph~template|null}
 */
dudeGraph.Block.prototype.template = function (templateName) {
    if (this._blockGraph === null) {
        throw new Error("`" + this.blockFancyName + "` cannot manipulate templates when not bound to a graph");
    }
    return this._blockTemplates[templateName] || null;
};
/**
 * Returns whether the template corresponding to the templateName has the given valueType in its templates
 * @param {String} templateName
 * @param {String} valueType
 * @returns {Boolean}
 * @throws {Error} No template found for templateName
 * @deprecated
 */
dudeGraph.Block.prototype.hasTemplateType = function (templateName, valueType) {
    var template = this.template(templateName);
    if (template === null) {
        throw new Error("`" + this.blockFancyName + "` has no template `" + templateName + "`");
    }
    return _.includes(template.templates, valueType);
};
/**
 * Updates the given template corresponding to the given templateName
 * @param {String} templateName
 * @param {String} valueType
 * @param {Boolean} [ignoreEmit=false]
 */
dudeGraph.Block.prototype.updateTemplate = function (templateName, valueType, ignoreEmit) {
    if (this._blockGraph === null) {
        throw new Error("`" + this.blockFancyName + "` cannot manipulate templates when not bound to a graph");
    }
    if (!this._blockGraph.hasType(valueType)) {
        throw new Error("`" + this.graphFancyName + "` has no value type `" + valueType + "`");
    }
    var template = this.template(templateName);
    if (template === null) {
        throw new Error("`" + this.blockFancyName + "` has no template `" + templateName + "`");
    }
    if (!_.includes(template.templates, valueType)) {
        throw new Error("`" + this.blockFancyName + "` has no value type " + valueType +
            "` is its templates: ` " + template.templates.join(", ") + "`");
    }
    if (template.valueType === valueType) {
        return; // Already the same type
    }
    var oldValueType = template.valueType;
    var outputValueSaves = _.map(this._blockOutputs, function (point) {
        if (point.pointTemplate === templateName) {
            return point.pointValue;
        }
    });
    var inputValueSaves = _.map(this._blockInputs, function (point) {
        if (point.pointTemplate === templateName) {
            return point.pointValue;
        }
    });
    try {
        _.forEach(this._blockOutputs, function (point) {
            if (point.pointTemplate === templateName) {
                point.changeValueType(valueType, ignoreEmit);
            }
        });
        _.forEach(this._blockInputs, function (point) {
            if (point.pointTemplate === templateName) {
                point.changeValueType(valueType, ignoreEmit);
            }
        });
    } catch (exception) {
        _.forEach(this._blockOutputs, function (point, i) {
            if (point.pointTemplate === templateName) {
                point.changeValue(null);
                point.changeValueType(oldValueType, true);
                point.changeValue(outputValueSaves[i]);
            }
        });
        _.forEach(this._blockInputs, function (point, i) {
            if (point.pointTemplate === templateName) {
                point.changeValue(null);
                point.changeValueType(oldValueType, true);
                point.changeValue(inputValueSaves[i]);
            }
        });
        throw exception;
    }
    template.valueType = valueType;
    if (!ignoreEmit) {
        this._blockGraph.emit("block-template-update", templateName, template);
    }
};

/**
 * Adds a point to the block
 * @param {dudeGraph.Point} point
 * @param {Number|undefined} [position=undefined] - The position to insert the block (undefined = end)
 */
dudeGraph.Block.prototype.addPoint = function (point, position) {
    if (this._blockGraph === null) {
        throw new Error("`" + this.blockFancyName + "` cannot add point when not bound to a graph");
    }
    if (point.pointOutput && this.outputByName(point.pointName) !== null) {
        throw new Error("`" + this.blockFancyName + "` cannot redefine `" + point.pointName + "`");
    }
    if (!point.pointOutput && this.inputByName(point.pointName) !== null) {
        throw new Error("`" + this.blockFancyName + "` cannot redefine `" + point.pointName + "`");
    }
    point.pointBlock = this;
    point.validate();
    if (_.isUndefined(position)) {
        position = point.pointOutput ? this._blockOutputs.length : this._blockInputs.length;
    }
    if (point.pointOutput) {
        this._blockOutputs.splice(position, 0, point);
    } else {
        this._blockInputs.splice(position, 0, point);
    }
    this.emit("point-add", point);
    this._blockGraph.emit("block-point-add", this, point);
};
/**
 * Removes the block point and all its connections
 * @param {dudeGraph.Point} point
 */
dudeGraph.Block.prototype.removePoint = function (point) {
    if (point.pointOutput && this.outputByName(point.pointName) === null) {
        throw new Error("`" + this.blockFancyName + "` has not output `" + point.pointName + "`");
    }
    if (!point.pointOutput && this.inputByName(point.pointName) === null) {
        throw new Error("`" + this.blockFancyName + "` has no input `" + point.pointName + "`");
    }
    point.disconnectAll();
    point.pointBlock = null;
    if (point.pointOutput) {
        _.pull(this._blockOutputs, point);
    }
    if (!point.pointOutput) {
        _.pull(this._blockInputs, point);
    }
    this.emit("point-remove", point);
    this._blockGraph.emit("block-point-remove", this, point);
};
/**
 * Removes all the block points and their connections
 */
dudeGraph.Block.prototype.removeAllPoints = function () {
    var block = this;
    _.forEachRight(this._blockOutputs, function (point) {
        block.removePoint(point);
    });
    _.forEachRight(this._blockInputs, function (point) {
        block.removePoint(point);
    });
};

/**
 * Connects the block point to the other point
 * @param {dudeGraph.Point} blockPoint
 * @param {dudeGraph.Point} otherPoint
 * @returns {dudeGraph.Connection}
 */
dudeGraph.Block.prototype.connectPointTo = function (blockPoint, otherPoint) {
    if (blockPoint.pointOutput && _.isUndefined(_.find(this._blockOutputs, blockPoint))) {
        throw new Error("`" + this.blockFancyName + "` has no output `" + blockPoint.pointFancyName + "`");
    }
    if (!blockPoint.pointOutput && _.isUndefined(_.find(this._blockInputs, blockPoint))) {
        throw new Error("`" + this.blockFancyName + "` has no input `" + blockPoint.pointFancyName + "`");
    }
    if (blockPoint.pointOutput) {
        return this._blockGraph.connectPoints(blockPoint, otherPoint);
    } else {
        return this._blockGraph.connectPoints(otherPoint, blockPoint);
    }
};
/**
 * Disconnects the block point from the other point
 * @param {dudeGraph.Point} blockPoint
 * @param {dudeGraph.Point} otherPoint
 * @returns {dudeGraph.Connection}
 */
dudeGraph.Block.prototype.disconnectPointFrom = function (blockPoint, otherPoint) {
    if (blockPoint.pointOutput && _.isUndefined(_.find(this._blockOutputs, blockPoint))) {
        throw new Error("`" + this.blockFancyName + "` has no output `" + blockPoint.pointFancyName + "`");
    }
    if (!blockPoint.pointOutput && _.isUndefined(_.find(this._blockInputs, blockPoint))) {
        throw new Error("`" + this.blockFancyName + "` has no input `" + blockPoint.pointFancyName + "`");
    }
    if (blockPoint.pointOutput) {
        return this._blockGraph.disconnectPoints(blockPoint, otherPoint);
    } else {
        return this._blockGraph.disconnectPoints(otherPoint, blockPoint);
    }
};

/**
 * Returns the input point found by the given pointName or null
 * @param {String} pointName
 * @returns {dudeGraph.Point|null}
 */
dudeGraph.Block.prototype.inputByName = function (pointName) {
    return _.find(this._blockInputs, function (point) {
            return point.pointName === pointName;
        }) || null;
};
/**
 * Returns the output point found by the given pointName or null
 * @param {String} pointName
 * @returns {dudeGraph.Point|null}
 */
dudeGraph.Block.prototype.outputByName = function (pointName) {
    return _.find(this._blockOutputs, function (point) {
            return point.pointName === pointName;
        }) || null;
};

/**
 * Clones this block and its points
 * @returns {dudeGraph.Block}
 */
dudeGraph.Block.prototype.clone = function () {};

/**
 * @typedef {Object} dudeGraph.Graph.template
 * @property {String} valueType
 * @property {Array<String>} templates
 */

/**
 * @typedef {Object} dudeGraph.Block.blockData
 * @property {String|null} [blockId=null]
 * @property {String} [blockName=this.className]
 * @property {Object<String, dudeGraph.Graph.template>} [blockTemplates={}]
 */