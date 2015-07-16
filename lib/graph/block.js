cg.Block = (function () {

    /**
     * Block is the base class for all codegraph nodes
     * A Block has a list of inputs and outputs points
     * @param cgGraph {cg.Graph}
     * @param cgBlockId {String}
     * @constructor
     */
    var Block = pandora.class_("Block", function (cgGraph, cgBlockId) {
        if (!cgGraph) {
            throw new cg.GraphError("Block() Cannot create a Block without a graph");
        }

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
        return pandora.findIf(this._cgOutputs, function(cgOutput) {
            return cgOutput.cgName === cgOutputName;
        });
    };

    /**
     * Returns whether this block contains the specified input
     * @param {String} cgInputName
     * @return {cg.Point|null}
     */
    Block.prototype.inputByName = function (cgInputName) {
        return pandora.findIf(this._cgInputs, function(cgInput) {
            return cgInput.cgName === cgInputName;
        });
    };

    return Block;

})();