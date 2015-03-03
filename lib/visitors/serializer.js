/**
 * TODO
 * @constructor
 */
cg.Serializer = function () {
    //
};

cg.Serializer.prototype.serialize = function (context, node) {
    this["_render" + node.constructor.name](context, node);
};

cg.Serializer.prototype.serializeGraph = function (context, node) {
    // TODO
};