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
        console.log(node, node.constructor.name);
        this["_render" + node.constructor.name](snap, node);
    };

    /**
     * Render the graph.
     * @param snap {Snap}
     * @param graph {cg.Graph}
     * @private
     */
    Renderer.prototype._renderGraph = function (snap, graph) {
        // this.render(snap, graph.groups); TODO: Groups support
        this.render(snap, graph.actions);
        this.render(snap, graph.connections);
    };

    /**
     * Render the group.
     * @param snap {Snap}
     * @param container {cg.Container}
     * @private
     */
    Renderer.prototype._renderContainer = function (snap, container) {
        container.forEach(function (node) {
            this.render(snap, node);
        }.bind(this));
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