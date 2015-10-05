cg.Graph = (function () {

    /**
     * Represents the graph whom holds the entities
     * @extends {pandora.EventEmitter}
     * @constructor
     */
    var Graph = pandora.class_("Graph", pandora.EventEmitter, function (data, models) {
        pandora.EventEmitter.call(this);

        /**
         * Loader
         * @type {cg.JSONLoader}
         */
        this.loader = new cg.JSONLoader(this, data, models);

        /**
         * All existing types for this graph instance, the key being the type name and the value being an array
         * of all possible conversions.
         * @type {Object<String, Array>}
         */
        this._cgTypes = {
            "Stream": ["Stream"],
            "Array": ["Array"],
            "String": ["String"],
            "Number": ["Number", "Boolean"],
            "Boolean": ["Boolean", "Number"],
            "Vec2": ["Vec2"],
            "Vec3": ["Vec3"],
            "Vec4": ["Vec4"],
            "Color": ["Color", "Vec4"],
            "Texture2D": ["Texture2D"],
            "Entity": ["Entity"]
        };

        /**
         * All validators attached to types.
         */
        this._validators = {
            "Array": function (value) {
                return pandora.typename(value) === "Array";
            },
            "String": function (value) {
                return pandora.typename(value) === "String";
            },
            "Number": function (value) {
                return pandora.typename(value) === "Number" || /^[0-9]+(\.[0-9]+)?$/.test(value);
            },
            "Boolean": function (value) {
                return pandora.typename(value) === "Boolean" || /^(true|false)/.test(value);
            }
        };

        /**
         * Collection of blocks in the graph
         * @type {Array<cg.Block>}
         * @private
         */
        this._cgBlocks = [];
        Object.defineProperty(this, "cgBlocks", {
            get: function () {
                return this._cgBlocks;
            }.bind(this)
        });

        /**
         * Map to access a block by its id
         * @type {Object} {"42": {cg.Block}}
         * @private
         */
        this._cgBlocksIds = {};
        Object.defineProperty(this, "cgBlocksIds", {
            get: function () {
                return this._cgBlocksIds;
            }.bind(this)
        });

        /**
         * Connections between blocks points
         * @type {Array<cg.Connection>}
         * @private
         */
        this._cgConnections = [];
        Object.defineProperty(this, "cgConnections", {
            get: function () {
                return this._cgConnections;
            }.bind(this)
        });
    });

    /**
     * Add a validator predicate for the given `type`
     * @param {String} type - The type on which this validator will be applied
     * @param {Function} fn - A function which takes a value in parameter and returns true if it can be assigned
     */
    Graph.prototype.addValidator = function (type, fn) {
        this._validators[type] = fn;
    };

    /**
     * Checks whether the first type can be converted into the second one.
     * @param {String} firstType
     * @param {String} secondType
     * @returns {Boolean}
     */
    Graph.prototype.canConvert = function (firstType, secondType) {
        return firstType === secondType || (this._cgTypes[firstType] &&
            this._cgTypes[firstType].indexOf(secondType) !== -1);
    };

    /**
     * Checks whether the given `value` is assignable to the given `type`.
     * @param {*} value - A value to check.
     * @param {String} type - The type that the value should have
     */
    Graph.prototype.canAssign = function (value, type) {
        return value === null || (this._validators[type] && this._validators[type](value));
    };

    /**
     * Tries to update the blocks types from templates parameters to match the `point` type with the given `type`.
     * @param point - The point on which the connection will be created
     * @param type - The type of the connection that we try to attach
     * @returns {boolean}
     */
    Graph.prototype.updateTemplate = function (point, type) {
        return point.cgBlock.updateTemplate(point, type);
    };

    /**
     * Adds a block to the graph
     * @param {cg.Block} cgBlock - cgBlock to add to the graph
     * @param {Boolean} quiet - Whether the event should be emitted
     * @emit "cg-block-create" {cg.Block}
     * @return {cg.Block}
     */
    Graph.prototype.addBlock = function (cgBlock, quiet) {
        var cgBlockId = cgBlock.cgId;
        if (cgBlock.cgGraph !== this) {
            throw new Error("This block does not belong to this graph");
        }
        if (cgBlockId === null || cgBlockId === undefined) {
            throw new Error("Block id is null");
        }
        if (this._cgBlocksIds[cgBlockId]) {
            throw new Error("Block with id `" + cgBlockId + "` already exists");
        }
        this._cgBlocks.push(cgBlock);
        this._cgBlocksIds[cgBlockId] = cgBlock;
        if (!quiet) {
            this.emit("cg-block-create", cgBlock);
        }
        return cgBlock;
    };

    /**
     * Removes a block from the graph
     * @param {cg.Block} cgBlock
     */
    Graph.prototype.removeBlock = function (cgBlock) {
        var blockFoundIndex = this._cgBlocks.indexOf(cgBlock);
        if (blockFoundIndex === -1 || cgBlock.cgGraph !== this) {
            throw new Error("This block does not belong to this graph");
        }
        var cgBlockPoints = cgBlock.cgOutputs.concat(cgBlock.cgInputs);
        _.forEach(cgBlockPoints, function (cgBlockPoint) {
            this.disconnectPoint(cgBlockPoint);
        }.bind(this));
        this._cgBlocks.splice(blockFoundIndex, 1);
        delete this._cgBlocksIds[cgBlock.cgId];
        this.emit("cg-block-remove", cgBlock);
    };

    /**
     * Creates a connection between two cgPoints
     * @param {cg.Point} cgOutputPoint
     * @param {cg.Point} cgInputPoint
     * @emit "cg-connection-create" {cg.Connection}
     * @returns {cg.Connection|null}
     */
    Graph.prototype._connectPoints = function (cgOutputPoint, cgInputPoint) {
        if (this.connectionByPoints(cgOutputPoint, cgInputPoint) !== null) {
            throw new Error("Connection already exists between these two points: `" +
                    cgOutputPoint.cgName + "` and `" + cgInputPoint.cgName + "`");
        }
        if (cgOutputPoint.isOutput === cgInputPoint.isOutput) {
            throw new Error("Cannot connect either two inputs or two outputs: `" +
                    cgOutputPoint.cgName + "` and `" + cgInputPoint.cgName + "`");
        }
        if (!(cgOutputPoint.acceptConnect(cgInputPoint) && cgInputPoint.acceptConnect(cgOutputPoint))) {
            throw new Error("Cannot connect `" +
                    cgOutputPoint.cgName + "` and `" + cgInputPoint.cgName + "`");
        }
        if (!this.canConvert(cgOutputPoint.cgValueType, cgInputPoint.cgValueType) &&
            !this.updateTemplate(cgInputPoint, cgOutputPoint.cgValueType)) {
            throw new Error("Cannot connect two points of different value types: `" +
                    cgOutputPoint.cgValueType + "` and `" + cgInputPoint.cgValueType + "`");
        }
        var cgConnection = new cg.Connection(cgOutputPoint, cgInputPoint);
        this._cgConnections.push(cgConnection);
        cgOutputPoint._cgConnections.push(cgConnection);
        cgInputPoint._cgConnections.push(cgConnection);
        this.emit("cg-connection-create", cgConnection);
        return cgConnection;
    };

    /**
     * Removes a connection between two connected cgPoints
     * @param {cg.Point} cgOutputPoint
     * @param {cg.Point} cgInputPoint
     * @emit "cg-connection-create" {cg.Connection}
     * @returns {cg.Connection}
     */
    Graph.prototype._disconnectPoints = function (cgOutputPoint, cgInputPoint) {
        var cgConnection = this.connectionByPoints(cgOutputPoint, cgInputPoint);
        if (cgConnection === null) {
            throw new Error("No connections between these two points: `" +
                    cgOutputPoint.cgName + "` and `" + cgInputPoint.cgName + "`");
        }
        this._cgConnections.splice(this._cgConnections.indexOf(cgConnection), 1);
        cgOutputPoint._cgConnections.splice(cgOutputPoint._cgConnections.indexOf(cgConnection), 1);
        cgInputPoint._cgConnections.splice(cgInputPoint._cgConnections.indexOf(cgConnection), 1);
        this.emit("cg-connection-remove", cgConnection);
        return cgConnection;
    };

    /**
     * Disconnect all connections from this point
     * @param {cg.Point} cgPoint
     */
    Graph.prototype.disconnectPoint = function (cgPoint) {
        var cgPointConnections = cgPoint.cgConnections;
        _.forEach(cgPointConnections, function (cgConnection) {
            this.disconnectPoints(cgConnection.cgOutputPoint, cgConnection.cgInputPoint);
        }.bind(this));
    };

    /**
     * Returns a block by it's unique id
     * @param {String} cgBlockId
     * @return {cg.Block}
     */
    Graph.prototype.blockById = function (cgBlockId) {
        var cgBlock = this._cgBlocksIds[cgBlockId];
        if (!cgBlock) {
            throw new Error("Block not found for id `" + cgBlockId + "`");
        }
        return cgBlock;
    };

    /**
     * Returns the first block with the given name.
     * @param {String} cgBlockName
     * @returns {cg.Block}
     */
    Graph.prototype.blockByName = function (cgBlockName) {
        var block = null;
        _.forEach(this.cgBlocks, function (cgBlock) {
            if (cgBlock.cgName === cgBlockName) {
                block = cgBlock;
            }
        });
        return block;
    };

    /**
     * Returns an array of blocks which have the given type.
     * @param {String} cgBlockType
     * @returns {Array<cg.Block>}
     */
    Graph.prototype.blocksByType = function (cgBlockType) {
        var blocks = [];
        _.forEach(this.cgBlocks, function (cgBlock) {
            if (pandora.typename(cgBlock) === cgBlockType) {
                blocks.push(cgBlock);
            }
        });
        return blocks;
    };

    /**
     * Returns the next unique block id
     * @returns {String}
     */
    Graph.prototype.nextBlockId = function () {
        return cg.UUID.generate();
    };

    /**
     * Returns the list of connections for every points in the given block
     * @param {cg.Block} cgBlock
     * @returns {Array<cg.Connection>}
     */
    Graph.prototype.connectionsByBlock = function (cgBlock) {
        var cgConnections = [];
        _.forEach(this._cgConnections, function (cgConnection) {
            if (cgConnection.cgOutputPoint.cgBlock === cgBlock || cgConnection.cgInputPoint.cgBlock === cgBlock) {
                cgConnections.push(cgConnection);
            }
        });
        return cgConnections;
    };

    /**
     * Returns a connection between two points
     * @param {cg.Point} cgOutputPoint
     * @param {cg.Point} cgInputPoint
     * @returns {cg.Connection|null}
     */
    Graph.prototype.connectionByPoints = function (cgOutputPoint, cgInputPoint) {
        return pandora.findIf(this._cgConnections, function (cgConnection) {
            return cgConnection.cgOutputPoint === cgOutputPoint && cgConnection.cgInputPoint === cgInputPoint;
        });
    };

    /**
     * Returns the list of connections for a given point
     * @param {cg.Point} cgPoint
     * @returns {Array<cg.Connection>}
     */
    Graph.prototype.connectionsByPoint = function (cgPoint) {
        var cgConnections = [];
        _.forEach(this._cgConnections, function (cgConnection) {
            if (cgConnection.cgOutputPoint === cgPoint || cgConnection.cgInputPoint === cgPoint) {
                cgConnections.push(cgConnection);
            }
        });
        return cgConnections;
    };

    /**
     * Clone all the given blocks
     * If connections exist between the cloned blocks, this method will try to recreate them
     * Connections from/to a cloned block to/from a non cloned block won't be duplicated
     * @param {Array<cg.Block>} cgBlocks
     * @returns {Array<cg.Block>} the cloned blocks
     */
    Graph.prototype.cloneBlocks = function (cgBlocks) {
        var cgCorrespondingBlocks = [];
        var cgClonedBlocks = [];
        var cgConnectionsToClone = [];
        _.forEach(cgBlocks, function (cgBlock) {
            var cgConnections = this.connectionsByBlock(cgBlock);
            var cgClonedBlock = cgBlock.clone(this);
            this.addBlock(cgClonedBlock);
            cgClonedBlocks.push(cgClonedBlock);
            cgCorrespondingBlocks[cgBlock.cgId] = cgClonedBlock;
            _.forEach(cgConnections, function (cgConnection) {
                if (cgConnectionsToClone.indexOf(cgConnection) === -1 &&
                    cgBlocks.indexOf(cgConnection.cgOutputPoint.cgBlock) !== -1 &&
                    cgBlocks.indexOf(cgConnection.cgInputPoint.cgBlock) !== -1) {
                    cgConnectionsToClone.push(cgConnection);
                }
            });
        }.bind(this));
        _.forEach(cgConnectionsToClone, function (cgConnectionToClone) {
            try {
                cgCorrespondingBlocks[cgConnectionToClone.cgOutputPoint.cgBlock.cgId]
                        .outputByName(cgConnectionToClone.cgOutputPoint.cgName)
                    .connect(cgCorrespondingBlocks[cgConnectionToClone.cgInputPoint.cgBlock.cgId]
                        .inputByName(cgConnectionToClone.cgInputPoint.cgName));
            } catch (exception) {
                throw new Error("Connection duplication silenced exception: " + exception);
            }
        });
        return cgClonedBlocks;
    };

    return Graph;

})();