cg.Renderer = function () {

    /**
     * CodeGraph renderer using snapsvg.io
     * @constructor
     */
    function Renderer() {

    }

    /**
     *
     * @param snap {Snap}
     * @param node
     */
    Renderer.prototype.render = function (snap, node) {
        this["_render" + node.constructor.name](snap, node);
        console.log('calling', "_render" + node.constructor.name, snap, node);
    };

    /**
     * Render the graph.
     * @param snap {Snap}
     * @param graph {cg.Graph}
     * @private
     */
    Renderer.prototype._renderGraph = function (snap, graph) {
        // TODO
    };

    /**
     * Render the action.
     * @param snap {Snap}
     * @param action {cg.Action}
     * @private
     */
    Renderer.prototype._renderAction = function (snap, action) {
        // TODO
    };

    /**
     * Render the connection.
     * @param snap {Snap}
     * @param connection {cg.Connection}
     * @private
     */
    Renderer.prototype._renderConnection = function (snap, connection) {
        // TODO
    };

    /**
     * Render the point.
     * @param snap {Snap}
     * @param point {cg.Point}
     * @private
     */
    Renderer.prototype._renderPoint = function (snap, point) {
        // TODO
    };

    /**
     * Enable zoom or re-enable zoom.
     * @param snap {Snap}
     * @private
     */
    Renderer.prototype._enableZoom = function (snap) {
        snap.zpd('destroy');
        snap.zpd();
    };

    return Renderer;

}();