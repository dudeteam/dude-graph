cg.Saver = function () {

    /**
     * TODO
     * @constructor
     */
    function Saver() {

    }

    Saver.prototype.save = function (node) {
        return this["_save" + node.constructor.name](node);
    };

    Saver.prototype._saveGraph = function (node) {
        return {};
    };

    return Saver;

};