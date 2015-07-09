cg.Block = (function() {

    /**
     * Block is the base class for all codegraph nodes
     * A Block has a list of inputs and outputs
     * Inputs and outputs are simple fields in the Block object with get and set properties
     * @extends {pandora.EventEmitter}
     * @param graph {cg.Graph}
     * @param id {number}
     * @constructor
     */
    var Block = pandora.class_("Block", pandora.EventEmitter, function(graph, id) {
        pandora.EventEmitter.call(this);

        if (!graph) {
            throw new cg.GraphError("Block() Cannot create a Block without a graph");
        }

        /**
         * Reference to the graph
         * @type {cg.Graph|null}
         * @private
         */
        this._cgGraph = graph;
        Object.defineProperty(this, "cgGraph", {
            get: function() { return this._cgGraph;}.bind(this)
        });

        /**
         * Unique id of this block
         * @type {cg.Graph|null}
         * @private
         */
        this._cgId = id || graph.nextBlockId();
        Object.defineProperty(this, "cgId", {
            get: function() { return this._cgId; }.bind(this)
        });

        /**
         * Inputs fields names
         * @type {Array<String>}
         * @private
         */
        this._cgInputs = [];
        Object.defineProperty(this, "cgInputs", {
            get: function () { return this._cgInputs; }.bind(this)
        });

        /**
         * Outputs fields names
         * @type {Array<String>}
         * @private
         */
        this._cgOutputs = [];
        Object.defineProperty(this, "cgOutputs", {
            get: function () { return this._cgOutputs; }.bind(this)
        });

    });

    /**
     * Transput is the hypernym of input/output
     * This method is used as a helper to add whether inputs or outputs
     * @param transputs {Array<Object>} [{"x": 0}, {"y": 0}]
     * @param isInput {Boolean} True if we add the transputs to the inputs, False to the outputs
     */
    Block.prototype._addTransputs = function (transputs, isInput) {
        var self = this;
        var transputType = isInput ? "input" : "output";
        var transputContainer = isInput ? this._cgInputs : this._cgOutputs;
        pandora.forEach(transputs, function (transput) {
            var decomposedTransput = pandora.decomposeObject(transput);
            var transputName = decomposedTransput.name;
            var transputValue = decomposedTransput.value;
            if (!self._cgGraph.isTypeAllowed(transputValue)) {
                // TODO: Rethink the concept of types, and allowed types for transputs
                throw new cg.GraphError("The {0} `{1}` was created with an unknown type: {2}", transputType, transputName, pandora.typename(transputValue));
            }
            if (self.hasInput(transputName) || self.hasOutput(transputName)) {
                // TODO: Silently ignore if the transput type and the transput value type is the same, or convertible
                throw new cg.GraphError("Trying to add an {0} but `{1}` already exists as an {2}", transputType, transputName, self.hasInput(transputName) ? "input" : "output");
            }
            transputContainer.push(transputName);
            self["_" + transputName] = transputValue;
            self.emit(pandora.formatString("{0}-{1}-created", transputType, transputName));
            Object.defineProperty(self, transputName, {
                get: function () {
                    return self["_" + transputName];
                },
                set: function (newValue) {
                    var oldValue = self["_" + transputName];
                    if (typeof(oldValue) != typeof(newValue)) {
                        // TODO: Silently ignore if the type is convertible
                        throw new cg.GraphError("The {0} `{1}` was expecting a value of type {2}, but {3} was found instead", transputType, transputName, pandora.typename(oldValue), pandora.typename(newValue));
                    }
                    self["_" + transputName] = newValue;
                    self._cgGraph.emit(pandora.formatString("entity-{0}-{0}-updated", self._cgId, transputName), oldValue, newValue);
                    self.emit(pandora.formatString("{0}-{1}-updated", transputType, transputName), oldValue, newValue);
                }
            });
        });
    };

    /**
     * Add inputs to this block
     * @param inputs {Object} [{"x": 0}, {"y": 0}]
     * @protected
     */
    Block.prototype.addInputs = function (inputs) {
        this._addTransputs(inputs, true);
    };

    /**
     * Add outputs to this block
     * @param outputs {Object} [{"x": 0}, {"y": 0}]
     * @protected
     */
    Block.prototype.addOutputs = function (outputs) {
        this._addTransputs(outputs, false);
    };

    /**
     * Returns whether this block contains the specified input
     * @param {String} inputName
     * @return {boolean}
     */
    Block.prototype.hasInput = function(inputName) {
        return this._cgInputs.indexOf(inputName) !== -1;
    };

    /**
     * Returns whether this block contains the specified input
     * @param {String} outputName
     * @return {boolean}
     */
    Block.prototype.hasOutput  = function(outputName) {
        return this._cgOutputs.indexOf(outputName) !== -1;
    };

    return Block;

})();