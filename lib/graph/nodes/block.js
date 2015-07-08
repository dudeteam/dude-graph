cg.Block = (function() {

    /**
     * Block is the base class for all codegraph nodes
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
         *
         * @type {Array}
         * @private
         */
        this._cgInputs = [];
        Object.defineProperty(this, "cgInputs", {
            get: function () { return this._cgInputs; }.bind(this)
        });

    });

    /**
     * Returns whether this block has the specified input
     * @param inputName {string}
     * @returns {boolean}
     */
    Block.prototype.hasInput = function (inputName) {
        pandora.forEach(this._cgInputs, function (cgInputValue, cgInputName) {
            if (inputName === cgInputName) {
                return true;
            }
        });
        return false;
    };

    /**
     * Add inputs to this block
     * @param inputs {Object} [{"x": 0}, {"y": 0}]
     * @protected
     */
    Block.prototype.addInputs = function (inputs) {
        var block = this;
        pandora.forEach(inputs, function (input) {
            var decomposedInput = pandora.decomposeObject(input);
            var inputName = decomposedInput.name;
            var inputValue = decomposedInput.value;
            if (!block._cgGraph.isTypeAllowed(inputValue)) {
                throw cg.GraphError("The input `{0}` was created with an unknown type: {1}", inputName, pandora.typename(inputValue));
            }
            block["_" + inputName] = inputValue;
            block.emit(pandora.formatString("{0}-created", inputName));
            Object.defineProperty(block, inputName, {
                get: function () {
                    return block["_" + inputName];
                },
                set: function (newValue) {
                    var oldValue = block["_" + inputName];
                    if (typeof(oldValue) != typeof(newValue)) {
                        // TODO: Handle conversion
                        throw cg.GraphError("The input `{0}` was expecting a value of type {1}, but {2} was found instead", inputName, pandora.typename(oldValue), pandora.typename(newValue));
                    }
                    block["_" + inputName] = newValue;
                    block._cgGraph.emit(pandora.formatString("entity-{0}-{0}-updated", block._cgId, inputName), oldValue, newValue);
                    block.emit(pandora.formatString("{0}-updated", inputName), oldValue, newValue);
                }
            });
        });
    };

    return Block;

})();