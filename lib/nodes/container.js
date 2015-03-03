cg.Container = function () {

    /**
     * Node container
     * @constructor
     */
    function Container() {

        /**
         * Nodes contained in this container.
         * @type {Array<cg.Node>}
         * @private
         */
        this._nodes = [];
    }

    /**
     * Add the given node.
     * @param node {Object}
     */
    Container.prototype.push = function (node) {
        this._nodes.push(node);
    };

    /**
     * Call the callback for each node.
     * @param callback {Function}
     */
    Container.prototype.forEach = function (callback) {
        for (var i = 0; i < this._nodes.length; ++i) {
            callback(this._nodes[i]);
        }
    };

    return Container;

}();