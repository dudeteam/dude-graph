dudeGraph.Block = (function () {

    /**
     * Block is the base class for all codegraph nodes
     * A Block has a list of inputs and outputs points
     * @param {dudeGraph.Graph} cgGraph See Getter definition
     * @param {{cgId: Number, cgTemplates: Object}} data See getter definition
     * @param {String} blockType See getter definition
     * @constructor
     */
    var Block = pandora.class_("Block", function (cgGraph, data, blockType) {
        data = data || {};

        /**
         * Check the reference to the graph
         */
        (function Initialization() {
            if (!cgGraph) {
                throw new Error("Block() Cannot create a Block without a graph");
            }
        })();

        /**
         * Reference to the graph
         * @type {dudeGraph.Graph}
         * @private
         */
        this._cgGraph = cgGraph;
        Object.defineProperty(this, "cgGraph", {
            get: function () {
                return this._cgGraph;
            }.bind(this)
        });

        /**
         * The type of this block defined as a string, "Block" by default.
         * @type {String}
         * @private
         */
        this._blockType = blockType || "Block";
        Object.defineProperty(this, "blockType", {
            get: function () {
                return this._blockType;
            }.bind(this)
        });

        /**
         * Unique id of this block
         * @type {String}
         * @private
         */
        this._cgId = data.cgId || cgGraph.nextBlockId();
        Object.defineProperty(this, "cgId", {
            get: function () {
                return this._cgId;
            }.bind(this)
        });

        /**
         * Block fancy name
         * @type {String}
         * @emit "cg-block-name-changed" {dudeGraph.Block} {String} {String}
         * @private
         */
        this._cgName = data.cgName || data.cgModel || pandora.typename(this);
        Object.defineProperty(this, "cgName", {
            get: function () {
                return this._cgName;
            }.bind(this),
            set: function (cgName) {
                var oldCgName = this._cgName;
                this._cgName = cgName;
                this._cgGraph.emit("cg-block-name-change", this, oldCgName, cgName);
            }.bind(this)
        });

        /**
         * Template types that can be used on this block points. Each template type contains a list of possibly
         * applicable types.
         * @type {Object<String, Array>}
         * @private
         */
        this._cgTemplates = data.cgTemplates || {};
        Object.defineProperty(this, "cgTemplates", {
            get: function () {
                return this._cgTemplates;
            }.bind(this)
        });

        /**
         * Input points
         * @type {Array<dudeGraph.Point>}
         * @private
         */
        this._cgInputs = [];
        Object.defineProperty(this, "cgInputs", {
            get: function () {
                return this._cgInputs;
            }.bind(this)
        });

        /**
         * Output points
         * @type {Array<dudeGraph.Point>}
         * @private
         */
        this._cgOutputs = [];
        Object.defineProperty(this, "cgOutputs", {
            get: function () {
                return this._cgOutputs;
            }.bind(this)
        });

        cgGraph.loader.loadPoints(this, data);
    });

    /**
     * Block factory
     * @param {dudeGraph.Graph} cgGraph
     * @param {Object} data
     */
    Block.buildBlock = function (cgGraph, data) {
        return new Block(cgGraph, data);
    };

    /**
     * Adds an input or an output point
     * @param {dudeGraph.Point} cgPoint
     * @emit "cg-point-create" {dudeGraph.Block} {dudeGraph.Point}
     * @return {dudeGraph.Point}
     */
    Block.prototype.addPoint = function (cgPoint) {
        if (cgPoint.cgBlock !== this) {
            throw new Error("Point `" + cgPoint.cgName + "` is not bound to this block `" + this._cgId + "`");
        }
        if (cgPoint.isOutput && this.outputByName(cgPoint.cgName) || !cgPoint.isOutput && this.inputByName(cgPoint.cgName)) {
            throw new Error("Block `" + this._cgId + "` has already an " +
                    (cgPoint.isOutput ? "output" : "input") + ": `" + cgPoint.cgName + "`");
        }
        if (cgPoint.isOutput) {
            this._cgOutputs.push(cgPoint);
        } else {
            this._cgInputs.push(cgPoint);
        }
        this._cgGraph.emit("cg-point-create", this, cgPoint);
        return cgPoint;
    };

    /**
     * Returns whether this block contains the specified output
     * @param {String} cgOutputName
     * @return {dudeGraph.Point|null}
     */
    Block.prototype.outputByName = function (cgOutputName) {
        return _.find(this._cgOutputs, function (cgOutput) {
            return cgOutput.cgName === cgOutputName;
        });
    };

    /**
     * Returns whether this block contains the specified input
     * @param {String} cgInputName
     * @return {dudeGraph.Point|null}
     */
    Block.prototype.inputByName = function (cgInputName) {
        return _.find(this._cgInputs, function (cgInput) {
            return cgInput.cgName === cgInputName;
        });
    };

    /**
     * Tries to update the blocks types from templates parameters to match the `point` type with the given `type`.
     * @param {dudeGraph.Point} cgPoint - The point on which the connection will be created
     * @param {String} type - The type of the connection that we try to attach
     * @returns {boolean}
     */
    Block.prototype.updateTemplate = function (cgPoint, type) {
        if (cgPoint.cgTemplate === null || !this.cgTemplates[cgPoint.cgTemplate] ||
            this.cgTemplates[cgPoint.cgTemplate].indexOf(type) === -1) {
            return false;
        }
        cgPoint.cgValueType = type;
        var failToInfer = false;
        var updateValueType = function (currentPoint) {
            if (failToInfer) {
                return true;
            }
            if (currentPoint.cgTemplate === cgPoint.cgTemplate) {
                if (cgPoint.cgConnections.length === 0) {
                    currentPoint.cgValueType = type;
                } else {
                    failToInfer = true;
                    return true;
                }
            }
        };
        _.forEach(this._cgInputs, updateValueType.bind(this));
        _.forEach(this._cgOutputs, updateValueType.bind(this));
        return !failToInfer;
    };

    /**
     * Returns a copy of this block
     * @param {dudeGraph.Graph} cgGraph - The graph on which the cloned block will be attached to
     * @return {dudeGraph.Block}
     */
    Block.prototype.clone = function (cgGraph) {
        if (pandora.typename(this) !== "Block") {
            throw new pandora.Exception("Method `clone` must be overridden by `" + pandora.typename(this) + "`");
        }
        var cgBlockClone = new dudeGraph.Block(cgGraph);
        cgBlockClone.cgName = this._cgName;
        _.forEach(this._cgOutputs, function (cgOutput) {
            var cgOutputClone = cgOutput.clone(cgBlockClone);
            cgBlockClone.addPoint(cgOutputClone);
        });
        _.forEach(this._cgInputs, function (cgInput) {
            var cgInputClone = cgInput.clone(cgBlockClone);
            cgBlockClone.addPoint(cgInputClone);
        });
        return cgBlockClone;
    };

    return Block;

})();