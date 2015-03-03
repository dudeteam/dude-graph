cg.Loader = (function () {

    /**
     * Load a graph from JSON data.
     * @constructor
     */
    function Loader() {

    }

    Loader.prototype.load = function (node, data) {
        this["_load" + node.constructor.name](node, data);
    };

    Loader.prototype._loadGraph = function (node, data) {
        // TODO
    };

    return Loader;

})();