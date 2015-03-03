
cg.Saver = function () {

    /**
     * TODO
     * @constructor
     */
    function Saver() {

    }


    Saver.prototype.save = function (context, node) {
        this["_save" + node.constructor.name](context, node);
    };

    Saver.prototype.saveGraph = function (context, node) {
        // TODO
    };

    return Saver;

};