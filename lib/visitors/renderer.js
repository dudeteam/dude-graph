/**
 * TODO
 * @constructor
 */
cg.Renderer = function () {
    //
};

cg.Renderer.prototype.render = function (context, node) {
    this["_render" + node.constructor.name](context, node);
};

cg.Renderer.prototype.renderGraph = function (context, node) {
    // TODO
};