cg.Container = (function () {

    /**
     * Node container.
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
     * @param node {cg.Node}
     */
    Container.prototype.add = function (node) {
        this._nodes.push(node);
    };

    /**
     * Remove the given node.
     * @param node {cg.Node}
     */
    Container.prototype.remove = function (node) {
        var nodeFound = this._nodes.indexOf(node);

        if (nodeFound === -1) {
            throw new cg.GraphError('Node not found in this container', this, node);
        }
        this._nodes.splice(nodeFound, 1);
    };

    /**
     * Return the node at the given index.
     * @param i {Number}
     * @returns {cg.Node}
     */
    Container.prototype.get = function (i) {
        return this._nodes[i];
    };

    /**
     * Call the callback for each node.
     * @param callback {Function}
     */
    Container.prototype.forEach = function (callback) {
        for (var i = 0; i < this._nodes.length; ++i) {
            if (callback(this._nodes[i])) {
                return true;
            }
        }
        return false;
    };

    return Container;

})();
