cg.Block = (function () {

    /**
     * Represent an action instance into the graph.
     * @param _id {Number|String} the unique id within the graph for this kind of node.
     * @param model {cg.Model} the action model.
     * @param position {cg.Vec2} the position on the screen.
     * @param value {*}
     * @constructor
     */
    function Block(_id, model, position, value) {
        cg.Node.call(this, _id, cg.functionName(this.constructor), model.name, position);

        /**
         * The model applied on the block.
         * @type {cg.Model}
         * @private
         */
        this._model = model;
        Object.defineProperty(this, "model", {
            get: function () { return this._model; }.bind(this)
        });

        /**
         * The generated point from the inputs of the model.
         * @type {Object<cg.Point>}
         * @private
         */
        this._inputs = {};
        Object.defineProperty(this, "inputs", {
            get: function () { return this._inputs; }.bind(this)
        });

        /**
         * The generated point from the outputs of the model.
         * @type {Object<cg.Point>}
         * @private
         */
        this._outputs = {};
        Object.defineProperty(this, "outputs", {
            get: function () { return this._outputs; }.bind(this)
        });

        /**
         * The maximal number of points vertically.
         * @type {number}
         * @private
         */
        this._height = Math.max(model.inputs.length, model.outputs.length);
        Object.defineProperty(this, "height", {
            get: function () { return this._height; }.bind(this)
        });

        /**
         * An optional value for this action.
         * @type {*}
         * @private
         */
        this._value = value || this.model.value;
        Object.defineProperty(this, "value", {
            get: function () { return this._value; }.bind(this),
            set: function (value) {
                this._value = value;
                this.emit("change");
            }.bind(this)
        });

        Block.prototype.initialize.call(this);
    }

    cg.inherit(Block, cg.Node);

    /**
     * Remove the block from the graph.
     * @override
     */
    Block.prototype.remove = function() {
        for (var point in this._inputs) {
            if (this._inputs.hasOwnProperty(point)) {
                this._inputs[point].disconnect();
            }
        }
        for (point in this._outputs) {
            if (this._outputs.hasOwnProperty(point)) {
                this._outputs[point].disconnect();
            }
        }
        cg.Node.prototype.remove.call(this);
    };

    /**
     * Initialize all action points.
     */
    Block.prototype.initialize = function() {
        for (var inputIndex = 0; inputIndex < this._model.inputs.length; ++inputIndex) {
            var inputModel = this._model.inputs[inputIndex];
            this._inputs[inputModel.name] = new cg.Point(this, inputIndex, inputModel.type, inputModel.name, true);
        }
        for (var outputIndex = 0; outputIndex < this._model.outputs.length; ++outputIndex) {
            var outputModel = this._model.outputs[outputIndex];
            this._outputs[outputModel.name] = new cg.Point(this, outputIndex, outputModel.type, outputModel.name, false);
        }
    };

    /**
     * Return a point within the action from its index.
     * @param index {Number}
     * @param type {String} "inputs" or "outputs"
     * @returns {cg.Point}
     */
    Block.prototype.getPoint = function (index, type) {
        return this[type][this.model[type][index].name];
    };

    return Block;

})();

