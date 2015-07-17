cg.Block = (function () {

    /**
     * Block is the base class for all codegraph nodes
     * A Block has a list of inputs and outputs points
     * @param cgGraph {cg.Graph}
     * @param cgBlockId {String}
     * @constructor
     */
    var Block = pandora.class_("Block", function (cgGraph, cgBlockId) {
        /**
         * Check the reference to the graph
         */
        (function Initialization() {
            if (!cgGraph) {
                throw new cg.GraphError("Block() Cannot create a Block without a graph");
            }
        })();

        /**
         * Reference to the graph
         * @type {cg.Graph}
         * @private
         */
        this._cgGraph = cgGraph;
        Object.defineProperty(this, "cgGraph", {
            get: function () {
                return this._cgGraph;
            }.bind(this)
        });

        /**
         * Unique id of this block
         * @type {String}
         * @private
         */
        this._cgId = cgBlockId || cgGraph.nextBlockId();
        Object.defineProperty(this, "cgId", {
            get: function () {
                return this._cgId;
            }.bind(this)
        });

        /**
         * Block fancy name
         * @type {String}
         * @emit "cg-block-name-changed" {cg.Block} {String} {String}
         * @private
         */
        this._cgName = pandora.typename(this);
        Object.defineProperty(this, "cgName", {
            get: function () {
                return this._cgName;
            }.bind(this),
            set: function (cgName) {
                var oldCgName = this._cgName;
                this._cgName = cgName;
                this._cgGraph.emit("cg-block-name-changed", this, oldCgName, cgName);
            }.bind(this)
        });

        /**
         * Output points
         * @type {Array<cg.Point>}
         * @private
         */
        this._cgOutputs = [];
        Object.defineProperty(this, "cgOutputs", {
            get: function () {
                return this._cgOutputs;
            }.bind(this)
        });

        /**
         * Input points
         * @type {Array<cg.Point>}
         * @private
         */
        this._cgInputs = [];
        Object.defineProperty(this, "cgInputs", {
            get: function () {
                return this._cgInputs;
            }.bind(this)
        });

    });

    /**
     * Adds an input or an output point
     * @param cgPoint {cg.Point}
     * @emit "cg-point-create" {cg.Block} {cg.Point}
     * @return {cg.Point}
     */
    Block.prototype.addPoint = function (cgPoint) {
        if (cgPoint.cgBlock !== this) {
            throw new cg.GraphError("Block::addPoint() Point is not bound to this block: `{0}`", cgPoint.cgName);
        }
        if (cgPoint.isOutput && this.outputByName(cgPoint.cgName) || !cgPoint.isOutput && this.inputByName(cgPoint.cgName)) {
            throw new cg.GraphError("Block::addPoint() Block has already an {0}: `{1}`", (cgPoint.isOutput ? "output" : "input"), cgPoint.cgName);
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
     * @return {cg.Point|null}
     */
    Block.prototype.outputByName = function (cgOutputName) {
        return pandora.findIf(this._cgOutputs, function (cgOutput) {
            return cgOutput.cgName === cgOutputName;
        });
    };

    /**
     * Returns whether this block contains the specified input
     * @param {String} cgInputName
     * @return {cg.Point|null}
     */
    Block.prototype.inputByName = function (cgInputName) {
        return pandora.findIf(this._cgInputs, function (cgInput) {
            return cgInput.cgName === cgInputName;
        });
    };

    /**
     * Returns a cloned copy of this block
     * @param cgGraph {cg.Graph} The graph on which this cloned block will be attached to
     * @return {cg.Block}
     */
    Block.prototype.clone = function (cgGraph) {
        var cgBlockClone = new cg.Block(cgGraph);
        cgGraph.addBlock(cgBlockClone);
        cgBlockClone.cgName = this._cgName;
        pandora.forEach(this._cgOutputs, function (cgOutput) {
            var cgOutputClone = cgOutput.clone(cgBlockClone);
            cgBlockClone.addPoint(cgOutputClone);
        });
        pandora.forEach(this._cgInputs, function (cgInput) {
            var cgInputClone = cgInput.clone(cgBlockClone);
            cgBlockClone.addPoint(cgInputClone);
        });
        var cgConnections = this._cgGraph.connectionsByBlock(this);
        pandora.forEach(cgConnections, function (cgConnection) {
            try {
                if (cgConnection.cgOutputPoint.cgBlock === this) {
                    cgBlockClone.outputByName(cgConnection.cgOutputPoint.cgName).connect(cgConnection.cgInputPoint);
                } else if (cgConnection.cgInputPoint.cgBlock === this) {
                    cgBlockClone.inputByName(cgConnection.cgInputPoint.cgName).connect(cgConnection.cgOutputPoint);
                }
            } catch (exception) {
                console.error("Block::clone() Connection duplication silenced exception: ", exception);
            }
        }.bind(this));
        return cgBlockClone;
    };

    return Block;

})();