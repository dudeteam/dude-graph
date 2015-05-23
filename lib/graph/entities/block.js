cg.Block = (function () {

    /**
     * Represent an action instance into the graph.
     * @param _id {Number|String} the unique id within the graph for this kind of entity.
     * @param model {cg.Model} the action model.
     * @param position {pandora.Vec2} the position on the screen.
     * @param value {*}
     * @extends cg.Entity
     * @constructor
     */
    var Block = pandora.class_("Block", cg.Entity, function (_id, model, position, value) {
        cg.Entity.call(this, _id, this.constructor.typename, model.name, position);

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
         * @type {Array<cg.Point>}
         * @private
         */
        this._inputs = [];
        Object.defineProperty(this, "inputs", {
            get: function () { return this._inputs; }.bind(this)
        });

        /**
         * The generated point from the outputs of the model.
         * @type {Array<cg.Point>}
         * @private
         */
        this._outputs = [];
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
                this.emit("change", this.value);
            }.bind(this)
        });

        Block.prototype.initialize.call(this);
    });

    /**
     * Initialize all action points.
     */
    Block.prototype.initialize = function() {
        pandora.forEach(this._model.inputs, function (input, index) {
            this._inputs.push(new cg.Point(this, index, input.type, input.name, input.max, true));
        }.bind(this));
        pandora.forEach(this._model.outputs, function (output, index) {
            this._outputs.push(new cg.Point(this, index, output.type, output.name, output.max, false));
        }.bind(this));
    };

    /**
     * Return a point within the action from its index.
     * @param name {String}
     * @param type {String} "inputs" or "outputs"
     * @returns {cg.Point}
     */
    Block.prototype.getPoint = function (name, type) {
        var foundPoint = null;
        pandora.forEach(this[type], function (point) {
            if (point.name === name) {
                foundPoint = point;
                return true;
            }
        });
        return foundPoint;
    };

    /**
     * Remove the block from the graph.
     * @protected
     * @override
     */
    Block.prototype._remove = function() {
        pandora.forEach(this._inputs, function (input) {
            input.disconnect();
        });
        pandora.forEach(this._outputs, function (output) {
            output.disconnect();
        });
        cg.Entity.prototype._remove.call(this);
    };

    return Block;

})();

