
cg.Serializer = function () {

    /**
     * TODO
     * @constructor
     */
    function Serializer() {

    }


    Serializer.prototype.serialize = function (context, node) {
        this["_render" + node.constructor.name](context, node);
    };

    Serializer.prototype.serializeGraph = function (context, node) {
        // TODO
    };

    return Serializer;

};