cg.Loader = function () {

    /**
     * TODO
     * @constructor
     */
    function Loader() {

    }

    Loader.prototype.load = function (context, node) {
        this["_load" + node.constructor.name](context, node);
    };

    Loader.prototype.loadGraph = function (context, node) {
        // TODO
    };

    return Loader;

};