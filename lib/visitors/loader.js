
cg.Loader = function () {

    /**
     * TODO
     * @constructor
     */
    function Saver() {

    }

    Loader.prototype.load = function (context, node) {
        this["_load" + node.constructor.name](context, node);
    };

    Loader.prototype.loadGraph = function (context, node) {
        // TODO
    };

    return Saver;

};