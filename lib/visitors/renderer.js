cg.Renderer = function () {

    /**
     * CodeGraph renderer using papersvg.io
     * @constructor
     */
    function Renderer() {

    }

    /**
     *
     * @param paper {Snap.Element}
     * @param node
     */
    Renderer.prototype.render = function (paper, node) {
        console.log(node, node.constructor.name);
        this["_render" + node.constructor.name](paper, node);
    };

    /**
     * Render the graph.
     * @param paper {Snap.Element}
     * @param graph {cg.Graph}
     * @private
     */
    Renderer.prototype._renderGraph = function (paper, graph) {
        // this.render(paper, graph.groups); TODO: Groups support
        this.render(paper, graph.actions);
        this.render(paper, graph.connections);
    };

    /**
     * Render the group.
     * @param paper {Snap.Element}
     * @param container {cg.Container}
     * @private
     */
    Renderer.prototype._renderContainer = function (paper, container) {
        container.forEach(function (node) {
            this.render(paper, node);
        }.bind(this));
    };

    /**
     * Render the action.
     * @param paper {Snap.Element}
     * @param action {cg.Action}
     * @private
     */
    Renderer.prototype._renderAction = function (paper, action) {
        // TODO

        // Get the group for that action
        // If the group does not exist creates it

        var g = paper.g();

      console.log(g)

    };

    /**
     * Render the connection.
     * @param paper {Snap.Element}
     * @param connection {cg.Connection}
     * @private
     */
    Renderer.prototype._renderConnection = function (paper, connection) {
        // TODO
    };

    /**
     * Render the point.
     * @param paper {Snap.Element}
     * @param point {cg.Point}
     * @private
     */
    Renderer.prototype._renderPoint = function (paper, point) {
        // TODO
    };

    /**
     * Enable zoom or re-enable zoom.
     * @param paper {Snap.Element}
     * @private
     */
    Renderer.prototype._enableZoom = function (paper) {
        paper.zpd('destroy');
        paper.zpd();
    };

    return Renderer;

}();