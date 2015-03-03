cg.Renderer = function () {

    /**
     * CodeGraph renderer using papersvg.io
     * @constructor
     */
    function Renderer() {
        this._types = {
            "boolean": "#1abc9c", // turquoise
            "number": "#2ecc71", // green
            "vec3": "#3498db", // blue
            "vec2": "#2980b9", // blue
            "color": "#9b59b6", // purple
            "list": "#f1c40f", // yellow
            "dictionary": "#e67e22" // orange
        };
    }

    /**
     *
     * @param paper {Snap.Element}
     * @param node
     */
    Renderer.prototype.render = function (paper, node) {
        return this["_render" + node.constructor.name](paper, node);
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
        var group = paper.g();
        var box = paper.rect(action.position.x, action.position.y, 200, 40 + action.height * 20, 5);
        box.attr({
            "fill": "rgba(0, 0, 0, .4)",
            "stroke": "#ccc",
            "cursor": "move"
        });
        group.add(box);
        var text = paper.text(action.position.x + box.getBBox().width / 2, action.position.y + 20, action.name);
        text.attr({
            "fontFamily": "Varela Round",
            "fontSize": 14,
            "textAnchor": "middle",
            "fill": "#aaa"
        });
        group.add(text);
        for (var inputName in action.inputs) {
            if (action.inputs.hasOwnProperty(inputName)) {
                group.add(this.render(paper, action.inputs[inputName]));
            }
        }
        for (var outputName in action.outputs) {
            if (action.outputs.hasOwnProperty(outputName)) {
                group.add(this.render(paper, action.outputs[outputName]));
            }
        }
        group.drag();
        return group;
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
        var group = paper.g();
        var y = point.action.position.y + 40 + point.index * 20;
        var circle = paper.circle(point.action.position.x + (point.isInput ? 10 : 190), y, 3);
        circle.attr({
            "fill": "#222",
            "stroke": this._types[point.type]
        });
        var text = paper.text(point.action.position.x + (point.isInput ? 20 : 180), y + 3, point.name);
        text.attr({
            "textAnchor": point.isInput ? "start" : "end",
            "fill": "#aaa",
            "fontFamily": "Varela Round",
            "fontSize": 12
        });
        group.add(circle);
        group.add(text);
        return group;
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