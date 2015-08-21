cg.Variable = (function () {

    /**
     *
     * @extends {cg.Block}
     * @param {cg.Graph} cgGraph
     * @param {Object} data
     * @constructor
     */
    return pandora.class_("Variable", cg.Block, function (cgGraph, data) {
        cg.Block.call(this, cgGraph, {
            cgId: data.cgId,
            cgName: data.cgName,
            cgOutputs: [
                {
                    "cgType": "Point",
                    "cgName": "value",
                    "cgValueType": data.cgValueType,
                    "cgMaxConnections": Infinity
                }
            ]
        });

        /**
         * The type of this variable, the block will return a point of this type.
         * @type {String}
         * @private
         */
        this._cgValueType = data.cgValueType;
        Object.defineProperty(this, "cgValueType", {
            get: function () {
                return this._cgValueType;
            }.bind(this)
        });

        /**
         * The current value of the Variable.
         * @type {*}
         * @private
         */
        this._cgValue = data.cgValue;
        Object.defineProperty(this, "cgValue", {
            get: function () {
                return this._cgValue;
            }.bind(this),
            set: function (value) {
                this._cgValue = value;
                this.cgOutputs[0].cgValue = value;
            }.bind(this)
        });

    });

})();
