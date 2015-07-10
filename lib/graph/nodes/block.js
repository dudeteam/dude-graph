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
     * This method is used as a helper to add whether inputs or outputs
     * @param points {Array<Object>} [{"x": 0}, {"y": 0}]
     * @param isInput {Boolean} True if we add the points to the inputs, False to the outputs
     */
    Block.prototype._addPoints = function (points, isInput) {
        var self = this;
        var pointType = isInput ? "input" : "output";
        var pointContainer = isInput ? this._cgInputs : this._cgOutputs;
        pandora.forEach(points, function (point) {
            var decomposedPoint = pandora.decomposeObject(point);
            var pointName = decomposedPoint.name;
            var pointValue = decomposedPoint.value;
            if (!self._cgGraph.isTypeAllowed(pointValue)) {
                // TODO: Rethink the concept of types, and allowed types for points
                throw new cg.GraphError("The {0} `{1}` was created with an unknown type: {2}", pointType, pointName, pandora.typename(pointValue));
            }
            if (self.hasInput(pointName) || self.hasOutput(pointName)) {
                // TODO: Silently ignore if the point type and the point value type is the same, or convertible
                throw new cg.GraphError("Trying to add an {0} but `{1}` already exists as an {2}", pointType, pointName, self.hasInput(pointName) ? "input" : "output");
            }
            pointContainer.push(pointName);
            self["_" + pointName] = pointValue;
            self.emit(pandora.formatString("{0}-{1}-created", pointType, pointName));
            Object.defineProperty(self, pointName, {
                get: function () {
                    return self["_" + pointName];
                },
                set: function (newValue) {
                    var oldValue = self["_" + pointName];
                    if (typeof(oldValue) != typeof(newValue)) {
                        // TODO: Silently ignore if the type is convertible
                        // TODO: Handle connections
                        throw new cg.GraphError("The {0} `{1}` was expecting a value of type {2}, but {3} was found instead", pointType, pointName, pandora.typename(oldValue), pandora.typename(newValue));
                    }
                    self["_" + pointName] = newValue;
                    self._cgGraph.emit(pandora.formatString("entity-{0}-{0}-updated", self._cgId, pointName), oldValue, newValue);
                    self.emit(pandora.formatString("{0}-{1}-updated", pointType, pointName), oldValue, newValue);
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
        this._addPoints(inputs, true);
    };

    /**
     * Add outputs to this block
     * @param outputs {Object} [{"x": 0}, {"y": 0}]
     * @protected
     */
    Block.prototype.addOutputs = function (outputs) {
        this._addPoints(outputs, false);
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