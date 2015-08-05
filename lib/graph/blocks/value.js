cg.Value = (function () {

    /**
     *
     * @extends {cg.Block}
     * @param cgGraph {cg.Graph}
     * @param data {Object}
     * @constructor
     */
    var Value = pandora.class_("Value", cg.Block, function (cgGraph, data) {
        cg.Block.call(this, cgGraph, {
            cgId: data.cgId,
            cgName: data.cgValue + "",
            cgOutputs: [
                {
                    "cgType": "Point",
                    "cgName": "value",
                    "cgValueType": data.cgValueType
                }
            ]
        });

        /**
         * The type of this Value, the block will return a point of this type.
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
         * The current value of the Value.
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

    return Value;

})();