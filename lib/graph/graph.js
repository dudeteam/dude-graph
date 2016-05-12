/**
 * The graph that contains and manages the blocks and the connections
 * @class
 * @extends {EventEmitter}
 */
dudeGraph.Graph = function () {
    /**
     * The graph value types and their converters and compatible value types
     * @type {Object<dudeGraph.Graph.graphValueTypeTypedef, dudeGraph.Graph.graphValueTypeInfoTypedef>}
     * @private
     */
    this._graphValueTypes = {
        "Stream": {
            "convert": function () {
                return undefined;
            },
            "typeCompatibles": []
        },
        "String": {
            "typeConvert": function (value) {
                if (_.isString(value)) {
                    return value;
                }
                if (_.isNumber(value) || _.isBoolean(value)) {
                    return _.toString(value);
                }
                return undefined;
            },
            "typeCompatibles": ["Text", "Number", "Boolean"]
        },
        "Text": {
            "typeConvert": function (value) {
                if (_.isString(value)) {
                    return value;
                }
                if (_.isNumber(value) || _.isBoolean(value)) {
                    return _.toString(value);
                }
                return undefined;
            },
            "typeCompatibles": ["String", "Number", "Boolean"]
        },
        "Number": {
            "typeConvert": function (value) {
                if (_.isNumber(value)) {
                    return value;
                }
                if (/^[-+]?[0-9]+(\.[0-9]+)?$/.test(value)) {
                    return _.toNumber(value);
                }
                if (value === "true" || value === true) {
                    return 1;
                }
                if (value === "false" || value === false) {
                    return 0;
                }
                return undefined;
            },
            "typeCompatibles": ["Boolean"]
        },
        "Boolean": {
            "typeConvert": function (value) {
                if (_.isBoolean(value)) {
                    return value;
                }
                if (value === 1 || value === "true") {
                    return true;
                }
                if (value === 0 || value === "false") {
                    return false;
                }
                return undefined;
            },
            "typeCompatibles": ["Number"]
        },
        "Object": {
            "typeConvert": function (value) {
                if (_.isObject(value)) {
                    return value;
                }
                return undefined;
            },
            "typeCompatibles": []
        },
        "Array": {
            "typeConvert": function (value) {
                if (_.isArray(value)) {
                    return value;
                }
                return undefined;
            },
            "typeCompatibles": []
        },
        "Resource": {
            "typeConvert": function (value) {
                if (_.isObject(value)) {
                    return value;
                }
                return undefined;
            },
            "typeCompatibles": []
        }
    };

    /**
     * The blocks in the graph
     * @type {Array<dudeGraph.Block>}
     * @private
     */
    this._graphBlocks = [];
    Object.defineProperty(this, "graphBlocks", {
        get: function () {
            return this._graphBlocks;
        }.bind(this)
    });

    /**
     * The connections in the graph
     * @type {Array<dudeGraph.Connection>}
     * @private
     */
    this._graphConnections = [];
    Object.defineProperty(this, "graphConnections", {
        get: function () {
            return this._graphConnections;
        }.bind(this)
    });

    /**
     * The variables in the graph
     * @type {Array<dudeGraph.Variable>}
     * @private
     */
    this._graphVariables = [];
    Object.defineProperty(this, "graphVariables", {
        get: function () {
            return this._graphVariables;
        }.bind(this)
    });

    /**
     * The models in the graph
     * @type {Array<dudeGraph.Graph.modelBlockTypedef>}
     * @private
     */
    this._graphModels = [];
    Object.defineProperty(this, "graphModels", {
        get: function () {
            return this._graphModels;
        }.bind(this),
        set: function (graphModels) {
            this._graphModels = graphModels;
        }.bind(this)
    });

    /**
     * Registered block types
     * @type {Object}
     * @private
     */
    this._graphBlockTypes = {
        "Block": dudeGraph.Block
    };
    Object.defineProperty(this, "graphBlockTypes", {
        get: function () {
            return this._graphBlockTypes;
        }.bind(this),
        set: function (_graphBlockTypes) {
            this._graphBlockTypes = _graphBlockTypes;
        }.bind(this)
    });

    /**
     * Registered point types
     * @type {Object}
     * @private
     */
    this._graphPointTypes = {
        "Point": dudeGraph.Point
    };
    Object.defineProperty(this, "graphPointTypes", {
        get: function () {
            return this._graphPointTypes;
        }.bind(this),
        set: function (graphPointTypes) {
            this._graphPointTypes = graphPointTypes;
        }.bind(this)
    });

    /**
     * Graph data
     * @type {Object}
     * @private
     */
    this._graphData = {};
    Object.defineProperty(this, "graphData", {
        get: function () {
            return this._graphData;
        }.bind(this)
    });

    /**
     * The graph last error
     * @type {Error}
     * @private
     */
    this._graphErrno = null;
    Object.defineProperty(this, "graphError", {
        get: function () {
            return this._graphErrno;
        }.bind(this),
        set: function (graphError) {
            this._graphErrno = graphError;
        }.bind(this)
    });

    /**
     * The graph fancy name
     * @type {String}
     */
    Object.defineProperty(this, "graphFancyName", {
        get: function () {
            return "Graph";
        }
    });

    /**
     * The random id generator
     * @type {Function}
     * @private
     */
    this._graphGenerateBlockId = dudeGraph.uuid();

    /**
     * Maps the blocks ids to their blocks
     * @type {Object<String, dudeGraph.Block>}
     * @private
     */
    this._graphBlocksIds = {};
};

dudeGraph.Graph.prototype = _.create(EventEmitter.prototype, {
    "constructor": dudeGraph.Graph,
    "className": "Graph"
});

/**
 * Adds the type to the graph
 * @param {dudeGraph.Graph.graphValueTypeInfoTypedef} graphTypeInfo
 */
dudeGraph.Graph.prototype.addGraphValueType = function (graphTypeInfo) {
    if (this.graphValueTypeByName(graphTypeInfo.typeName) !== null) {
        throw new Error("`" + this.graphFancyName + "` cannot redefine value type`" + graphTypeInfo.typeName + "`");
    }
    this._graphValueTypes[graphTypeInfo.typeName] = graphTypeInfo;
};
//noinspection JSUnusedGlobalSymbols
/**
 * Removes the type from the graph
 * @param {dudeGraph.Graph.graphValueTypeTypedef} typeName
 */
dudeGraph.Graph.prototype.removeGraphValueType = function (typeName) {
    throw new Error("`" + this.graphFancyName + "` removeGraphValueType(`" + typeName + "`) not implemented");
};
/**
 * Returns the graphTypeInfo for the given typeName, or null
 * @param {dudeGraph.Graph.graphValueTypeTypedef} typeName
 * @returns {dudeGraph.Graph.graphValueTypeInfoTypedef|null}
 */
dudeGraph.Graph.prototype.graphValueTypeByName = function (typeName) {
    return this._graphValueTypes[typeName] || null;
};

/**
 * Converts the given value to the given type if possible or returns undefined
 * @param {dudeGraph.Graph.graphValueTypeTypedef} valueType
 * @param {Object|null} value
 * @returns {*|undefined}
 */
dudeGraph.Graph.prototype.convertValue = function (valueType, value) {
    if (value === null) {
        return null;
    }
    var graphTypeInfo = this.graphValueTypeByName(valueType);
    if (graphTypeInfo === null) {
        throw new Error("`" + this.graphFancyName + "` has no graphValueType `" + valueType + "`");
    }
    if (_.isUndefined(graphTypeInfo.typeConvert)) {
        throw new Error("`" + this.graphFancyName + "` has no graphValueType `" + valueType + "` converter");
    }
    return graphTypeInfo.typeConvert(value);
};
/**
 * Returns whether the connection can be converted from inputPoint to outputPoint
 * @param {dudeGraph.Point|dudeGraph.Graph.modelPointTypedef} outputPoint
 * @param {dudeGraph.Point|dudeGraph.Graph.modelPointTypedef} inputPoint
 * @returns {Boolean}
 */
dudeGraph.Graph.prototype.convertConnection = function (outputPoint, inputPoint) {
    var graphInputType = this.graphValueTypeByName(inputPoint.pointValueType);

    if (graphInputType === null) {
        throw new Error("`" + this.graphFancyName + "` cannot find compatible type to convert connection from `" +
            outputPoint.pointValueType + "` to `" + inputPoint.pointValueType + "`");
    }

    if (typeof outputPoint.pointOutput !== "undefined" && !outputPoint.pointOutput) {
        this.errno(Error("`" + outputPoint.pointFancyName + "` is not an output"));
        return false;
    }
    if (typeof inputPoint.pointOutput !== "undefined" && inputPoint.pointOutput) {
        this.errno(Error("`" + inputPoint.pointFancyName + "` is not an input"));
        return false;
    }

    if (typeof outputPoint.pointValue !== "undefined" && outputPoint.pointValue !== null) {
        this.errno(new Error("`" + outputPoint.pointFancyName + "` have a non-null `pointValue` and cannot be connected"));
        return false;
    }
    if (typeof inputPoint.pointValue !== "undefined" && inputPoint.pointValue !== null) {
        this.errno(new Error("`" + inputPoint.pointFancyName + "` have a non-null `pointValue` and cannot be connected"));
        return false;
    }

    if (typeof outputPoint.hasPolicy !== "undefined" && outputPoint.hasPolicy(dudeGraph.PointPolicy.SINGLE_CONNECTION) && !outputPoint.emptyConnection()) {
        this.errno(new Error("`" + outputPoint.pointFancyName + "` cannot have multiple connections"));
        return false;
    }
    if (typeof inputPoint.hasPolicy !== "undefined" && inputPoint.hasPolicy(dudeGraph.PointPolicy.SINGLE_CONNECTION) && !inputPoint.emptyConnection()) {
        this.errno(new Error("`" + inputPoint.pointFancyName + "` cannot have multiple connections"));
        return false;
    }

    if (typeof outputPoint.hasPolicy !== "undefined" && !outputPoint.hasPolicy(dudeGraph.PointPolicy.SINGLE_CONNECTION) && !outputPoint.hasPolicy(dudeGraph.PointPolicy.MULTIPLE_CONNECTIONS)) {
        this.errno(new Error("`" + outputPoint.pointFancyName + "` cannot have connections"));
        return false;
    }
    if (typeof inputPoint.hasPolicy !== "undefined" && !inputPoint.hasPolicy(dudeGraph.PointPolicy.SINGLE_CONNECTION) &&  !inputPoint.hasPolicy(dudeGraph.PointPolicy.MULTIPLE_CONNECTIONS)) {
        this.errno(new Error("`" + inputPoint.pointFancyName + "` cannot have connections"));
        return false;
    }

    if (outputPoint.pointValueType === inputPoint.pointValueType) {
        return true;
    }

    if (typeof outputPoint.hasPolicy !== "undefined" && !outputPoint.hasPolicy(dudeGraph.PointPolicy.CONVERSION)) {
        this.errno(new Error("`" + outputPoint.pointFancyName + "` cannot be converted"));
        return false;
    }
    if (typeof inputPoint.hasPolicy !== "undefined" && !inputPoint.hasPolicy(dudeGraph.PointPolicy.CONVERSION)) {
        this.errno(new Error("`" + inputPoint.pointFancyName + "` cannot be converted"));
        return false;
    }

    if (!_.includes(graphInputType.typeCompatibles, outputPoint.pointValueType)) {
        this.errno(new Error("`" + inputPoint.pointValueType + "` is not compatible with `" + outputPoint.pointValueType + "`"));
        return false;
    }

    var previousErrno = this._graphErrno;
    if (typeof outputPoint.acceptConnect != "undefined" && !outputPoint.acceptConnect(inputPoint)) {
        if (this._graphErrno !== null && this._graphErrno !== previousErrno) {
            this.errno(new Error("`" + outputPoint.pointFancyName + "` cannot accept to connect to `" + inputPoint.pointFancyName + "`: " + this._graphErrno.message));
        } else {
            this.errno(new Error("`" + outputPoint.pointFancyName + "` cannot accept to connect to `" + inputPoint.pointFancyName + "`"));
        }
        return false;
    }
    previousErrno = this._graphErrno;
    if (typeof inputPoint.acceptConnect !== "undefined" && !inputPoint.acceptConnect(outputPoint)) {
        if (this._graphErrno !== null && this._graphErrno !== previousErrno) {
            this.errno(new Error("`" + outputPoint.pointFancyName + "` cannot accept to connect to `" + inputPoint.pointFancyName + "`: " + this._graphErrno.message));
        } else {
            this.errno(new Error("`" + outputPoint.pointFancyName + "` cannot accept to connect to `" + inputPoint.pointFancyName + "`"));
        }
        return false;
    }

    return true;
};

/**
 * Adds a block to the graph
 * @param {dudeGraph.Block} block
 */
dudeGraph.Graph.prototype.addBlock = function (block) {
    if (block.blockGraph !== null) {
        throw new Error("`" + block.blockFancyName + "` cannot redefine `blockGraph`");
    }
    if (block.blockId !== null && !_.isUndefined(this._graphBlocksIds[block.blockId])) {
        throw new Error("`" + this.graphFancyName + "` cannot redefine id `" + block.blockId + "`");
    }
    block.blockGraph = this;
    if (block.blockId === null) {
        block.blockId = this.nextBlockId();
    }
    block.added();
    this._graphBlocks.push(block);
    this._graphBlocksIds[block.blockId] = block;
    this.emit("block-add", block);
};
/**
 * Removes the given block from the graph
 * @param {dudeGraph.Block} block
 */
dudeGraph.Graph.prototype.removeBlock = function (block) {
    if (block.blockGraph !== this || !_.includes(this._graphBlocks, block)) {
        throw new Error("`" + this.graphFancyName + "` has no block `" + block.blockFancyName + "`");
    }
    block.removeAllPoints();
    block.removed();
    _.pull(this._graphBlocks, block);
    delete this._graphBlocksIds[block.blockId];
    this.emit("block-remove", block);
};
/**
 * Returns the block found by the given blockId
 * @param {String} blockId
 * @returns {dudeGraph.Block|null}
 */
dudeGraph.Graph.prototype.blockById = function (blockId) {
    return this._graphBlocksIds[blockId] || null;
};
/**
 * Returns the blocks having the given name
 * @param {String} blockName
 * @returns {Array<dudeGraph.Block>}
 */
dudeGraph.Graph.prototype.blocksByName = function (blockName) {
    return _.filter(this._graphBlocks, function (block) {
        return block.blockName === blockName;
    });
};
/**
 * Returns the blocks having the given type
 * @param {dudeGraph.Block|String} blockType
 * @returns {Array<dudeGraph.Block>}
 */
dudeGraph.Graph.prototype.blocksByType = function (blockType) {
    return _.filter(this._graphBlocks, function (block) {
        return block.className === blockType || _.isFunction(blockType) && block instanceof blockType;
    });
};
/**
 * Returns the next available blockId
 * @returns {String}
 */
dudeGraph.Graph.prototype.nextBlockId = function () {
    return this._graphGenerateBlockId();
};

/**
 * Connects the given outputPoint to the given inputPoint
 * This method should never be called directly, prefer point.connect or block.connectTo
 * @param {dudeGraph.Point} outputPoint
 * @param {dudeGraph.Point} inputPoint
 * @returns {dudeGraph.Connection}
 */
dudeGraph.Graph.prototype.connectPoints = function (outputPoint, inputPoint) {
    if (outputPoint === inputPoint) {
        throw new Error("`" + this.graphFancyName + "` cannot connect `" + outputPoint.pointFancyName + "` to itself");
    }
    if (!outputPoint.pointOutput) {
        throw new Error("`" + outputPoint.pointFancyName + "` is not an output");
    }
    if (inputPoint.pointOutput) {
        throw new Error("`" + outputPoint.pointFancyName + "` is not an input");
    }
    if (!this.convertConnection(outputPoint, inputPoint)) {
        var connectionError = this._graphErrno || {};
        if (outputPoint.pointTemplate !== null || inputPoint.pointTemplate !== null) {
            try {
                outputPoint.pointBlock.updateTemplate(outputPoint.pointTemplate, inputPoint.pointValueType);
            } catch (ex) {
                if (inputPoint.pointTemplate !== null) {
                    inputPoint.pointBlock.updateTemplate(inputPoint.pointTemplate, outputPoint.pointValueType);
                }
            }
        } else {
            throw new Error("`" + this.graphFancyName + "` cannot connect `" +
                outputPoint.pointFancyName + "` to `" + inputPoint.pointFancyName + ": " + connectionError.message);
        }
    }
    _.forEach(this._graphConnections, function (connection) {
        if (connection.connectionOutputPoint === outputPoint && connection.connectionInputPoint === inputPoint) {
            throw new Error("`" + connection.connectionFancyName + "` already exists");
        }
    });
    var connection = new dudeGraph.Connection(outputPoint, inputPoint);
    outputPoint.addConnection(connection);
    try {
        inputPoint.addConnection(connection);
    } catch (e) {
        outputPoint.removeConnection(connection);
        throw e;
    }
    this._graphConnections.push(connection);
    outputPoint.pointBlock.pointConnected(outputPoint, inputPoint);
    inputPoint.pointBlock.pointConnected(inputPoint, outputPoint);
    outputPoint.emit("connect", connection);
    inputPoint.emit("connect", connection);
    this.emit("point-connect", outputPoint, connection);
    this.emit("point-connect", inputPoint, connection);
    return connection;
};
/**
 * Disconnects the given outputPoint from the given inputPoint
 * This method should never be called directly, prefer point.disconnect or block.disconnectFrom
 * @param {dudeGraph.Point} outputPoint
 * @param {dudeGraph.Point} inputPoint
 */
dudeGraph.Graph.prototype.disconnectPoints = function (outputPoint, inputPoint) {
    var connectionFound = _.find(this._graphConnections, function (connection) {
            return connection.connectionOutputPoint === outputPoint && connection.connectionInputPoint === inputPoint;
        }) || null;
    if (connectionFound === null) {
        throw new Error("`" + this.graphFancyName + "` cannot find a connection between `" +
            outputPoint.pointFancyName + "` and `" + inputPoint.pointFancyName + "`");
    }
    outputPoint.removeConnection(connectionFound);
    inputPoint.removeConnection(connectionFound);
    _.pull(this._graphConnections, connectionFound);
    outputPoint.pointBlock.pointDisconnected(outputPoint, inputPoint);
    inputPoint.pointBlock.pointDisconnected(inputPoint, outputPoint);
    outputPoint.emit("disconnect", connectionFound);
    inputPoint.emit("disconnect", connectionFound);
    this.emit("point-disconnect", outputPoint, connectionFound);
    this.emit("point-disconnect", inputPoint, connectionFound);
};

/**
 * @param {dudeGraph.Variable} variable
 */
dudeGraph.Graph.prototype.addVariable = function (variable) {
    if (variable.variableGraph !== null) {
        throw new Error("`" + variable.variableFancyName + "` cannot redefine `variableGraph`");
    }
    if (this.variableByName(variable.variableName) !== null) {
        throw new Error("`" + this.graphFancyName + "` cannot redefine variable name `" + variable.variableName + "`");
    }
    variable.variableGraph = this;
    variable.added();
    this._graphVariables.push(variable);
    this.emit("variable-add", variable);
};
/**
 * @param {dudeGraph.Variable} variable
 */
dudeGraph.Graph.prototype.removeVariable = function (variable) {
    if (variable.variableGraph !== this || !_.includes(this._graphVariables, variable)) {
        throw new Error("`" + this.graphFancyName + "` has no variable `" + variable.variableFancyName + "`");
    }
    if (variable.variableBlock !== null) {
        this.removeBlock(variable.variableBlock);
    }
    _.pull(this._graphVariables, variable);
    this.emit("variable-remove", variable);
};
/**
 * @param {String} variableName
 * @returns {dudeGraph.Variable|null}
 */
dudeGraph.Graph.prototype.variableByName = function (variableName) {
    return _.find(this._graphVariables, function (variable) {
            return variable.variableName === variableName;
        }) || null;
};

/**
 * Registers a custom block type
 * @param {String} blockType
 * @param {dudeGraph.Block} blockConstructor
 */
dudeGraph.Graph.prototype.registerCustomBlock = function (blockType, blockConstructor) {
    this._graphBlockTypes[blockType] = blockConstructor;
};
/**
 * Registers a custom point type
 * @param {String} pointType
 * @param {dudeGraph.Point} pointConstructor
 */
dudeGraph.Graph.prototype.registerCustomPoint = function (pointType, pointConstructor) {
    this._graphPointTypes[pointType] = pointConstructor;
};
/**
 * Returns the custom block constructor for the given blockType
 * @param {String} blockType
 * @returns {dudeGraph.Block|null}
 */
dudeGraph.Graph.prototype.customBlockByType = function (blockType) {
    return this._graphBlockTypes[blockType] || null;
};
/**
 * Returns the custom point constructor for the given pointType
 * @param {String} pointType
 * @returns {dudeGraph.Point|null}
 */
dudeGraph.Graph.prototype.customPointByType = function (pointType) {
    return this._graphPointTypes[pointType] || null;
};

/**
 * Returns variables as models
 * @returns {Array<dudeGraph.Graph.modelBlockTypedef>}
 */
dudeGraph.Graph.prototype.variableModels = function () {
    return _.map(this._graphVariables, function (graphVariable) {
        return {
            "item": {
                "name": graphVariable.variableName + " (" + graphVariable.variableValue + ")",
                "icon": "fa fa-tag",
                "data": {
                    "blockType": "VariableBlock",
                    "blockName": graphVariable.variableName,
                    "blockInputs": [],
                    "blockOutputs": [
                        {
                            "pointType": "Point",
                            "pointValueType": graphVariable.variableValueType,
                            "pointName": "value",
                            "pointSingleConnection": false
                        }
                    ]
                }
            }
        };
    });
};
/**
 * Queries the suitable blocks from models to create for the given point
 * @param {dudeGraph.Point} point
 * @returns {Array<dudeGraph.Graph.modelBlockTypedef>}
 */
dudeGraph.Graph.prototype.queryModels = function (point) {
    var graph = this;
    var eligibleModels = [];
    var recursiveQuery = function (recursiveModels) {
        _.forEach(recursiveModels, function (model) {
            if (!_.isUndefined(model.item)) {
                var modelPoints = point.pointOutput ? model.item.data.blockInputs : model.item.data.blockOutputs;
                var eligibleModelPoints = _.filter(modelPoints, function (modelPoint) {
                    return (point.pointOutput && graph.convertConnection(point, modelPoint)) ||
                        (!point.pointOutput && graph.convertConnection(modelPoint, point));
                });
                if (!_.isEmpty(eligibleModelPoints)) {
                    _.forEach(eligibleModelPoints, function (eligibleModelPoint) {
                        eligibleModels.push(_.defaultsDeep({
                            "item": {
                                "name": model.item.name + " (" + eligibleModelPoint.pointName + ")",
                                "data": {
                                    "modelPointName": eligibleModelPoint.pointName
                                }
                            }
                        }, model));
                    });
                }
            } else if (!_.isUndefined(model.group)) {
                recursiveQuery(model.group.items);
            }
        });
    };
    recursiveQuery(this._graphModels);
    recursiveQuery(this.variableModels());
    return eligibleModels;
};

/**
 * Sets errno to the given value
 * @param {Error} errno
 */
dudeGraph.Graph.prototype.errno = function (errno) {
    this._graphErrno = errno;
};

/**
 * @typedef {String} dudeGraph.Graph.graphValueTypeTypedef
 */

/**
 * @typedef {Object} dudeGraph.Graph.graphValueTypeInfoTypedef
 * @property {String} typeName
 * @property {dudeGraph.Graph.convertTypeCallback} typeConvert
 * @property {Array<String>} [typeCompatibles=[]]
 */

/**
 * @typedef {Object} dudeGraph.Graph.modelPointTypedef
 * @property {String} pointType
 * @property {String} pointName
 * @property {String} pointValueType
 * @property {*|null} pointValue
 * @property {Number} [pointPolicy=0]
 */

/**
 * @typedef {Object} dudeGraph.Graph.modelTemplateTypedef
 * @property {String} valueType
 * @property {Array<String>} templates
 */

/**
 * @typedef {Object} dudeGraph.Graph.modelBlockTypedef
 * @property {Object} item
 * @property {String} item.name
 * @property {String} item.icon
 * @property {Object} item.data
 * @property {String} item.data.blockType
 * @property {String} item.data.blockName
 * @property {String} [item.data.modelPointName] - Filled for autocomplete purpose
 * @property {dudeGraph.Graph.modelTemplateTypedef} [item.data.blockTemplate]
 * @property {Array<dudeGraph.Graph.modelPointTypedef>} item.data.blockInputs
 * @property {Array<dudeGraph.Graph.modelPointTypedef>} item.data.blockOutputs
 */

/**
 * Callback to convert the given value to valueType, or undefined on conversion failure
 * @callback dudeGraph.Graph.convertTypeCallback
 * @param {*|null} value
 * @returns {*|undefined}
 */