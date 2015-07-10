cg.Connection = (function() {

    var Connection = pandora.class_("Connection", function(input, output) {

        /**
         * @type {Object} {"block": {cg.Block}, "input": "in"}
         * @private
         */
        this._input = input;
        Object.defineProperty(this, "input", {
            get: function() { return this._input; }.bind(this)
        });

        /**
         * @tpe {Object} {"block": {cg.Block}, "output": "out"}
         */
        this._output = output;
        Object.defineProperty(this, "output", {
            get: function() { return this._output; }.bind(this)
        });

        this._validate();

    });

    /**
     * Validate the connection
     * @private
     */
    Connection.prototype._validate = function() {

    };

    return Connection;

})();