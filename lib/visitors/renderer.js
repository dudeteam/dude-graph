cg.Renderer = function () {

    var DEFAULT_THEME = {
        "action": {
            "title": {
                "font_family": "Varela Round",
                "font_size": 14,
                "color": "#ccc"
            },
            "text": {
                "font_family": "Varela Round",
                "font_size": 12,
                "color": "#aaa"
            },
            "box": {
                "color": "#161e2b",
                "stroke_color": "#ccc",
                "stroke_size": 2,
                "border_radius": 5
            }
        },
        "type_colors": {
            "boolean": "#1abc9c", // turquoise
            "number": "#2ecc71", // green
            "vec3": "#3498db", // blue
            "vec2": "#2980b9", // blue
            "color": "#9b59b6", // purple
            "list": "#f1c40f", // yellow
            "dictionary": "#e67e22" // orange
        }
    };

    var ACTION_WIDTH = 200;

    /**
     * CodeGraph renderer using snapsvg.io library.
     * @param theme {Object} JSON config for graphic appearance of the graph
     * @constructor
     */
    function Renderer(theme) {
        this._theme = theme || DEFAULT_THEME;
        this._updates = [];
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
        var group = paper.g();
        // this.render(paper, graph.groups); TODO: Groups support
        this.render(group, graph.actions);
        this.render(group, graph.connections);
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
        var box = group.rect(action.position.x, action.position.y, ACTION_WIDTH, 40 + action.height * 20, this._theme.action.box.border_radius);
        box.attr({
            "fill": this._theme.action.box.color,
            "stroke": this._theme.action.box.stroke_color,
            "strokeSize": this._theme.action.box.stroke_size,
            "cursor": "move"
        });
        var text = group.text(action.position.x + box.getBBox().width / 2, action.position.y + 20, action.name);
        text.attr({
            "fontFamily": this._theme.action.title.font_family,
            "fontSize": this._theme.action.title.font_size,
            "textAnchor": "middle",
            "fill": this._theme.action.title.color
        });
        for (var inputName in action.inputs) {
            if (action.inputs.hasOwnProperty(inputName)) {
                this.render(group, action.inputs[inputName]);
            }
        }
        for (var outputName in action.outputs) {
            if (action.outputs.hasOwnProperty(outputName)) {
                this.render(group, action.outputs[outputName]);
            }
        }
        var ox = 0,
            oy = 0,
            lx = 0,
            ly = 0;
        group.drag(function (dx, dy) {
            lx = ox + dx;
            ly = oy + dy;
            action.position.x += dx;
            action.position.y += dy;
            group.transform(Snap.format('t{x},{y}', {x: lx, y: ly}));
            for (var i = 0; i < this._updates.length; ++i) {
                this._updates[i]();
            }
        }.bind(this), function () {
            // TODO don't drag if point clicked.
        }.bind(this), function () {
            ox = lx;
            oy = ly;
        }.bind(this));
        return group;
    };

    /**
     * Render the connection.
     * @param paper {Snap.Element}
     * @param connection {cg.Connection}
     * @private
     */
    Renderer.prototype._renderConnection = function (paper, connection) {
        var path = paper.path(this._generateConnectionPath(connection));
        path.attr({
            "stroke": this._theme.type_colors[connection.firstPoint.type],
            "strokeWidth": 2,
            "fill": "none"
        });
        path.connection = connection;
        this._updates.push(function () {
            path.attr("path", this._generateConnectionPath(path.connection)); // FIXME
        }.bind(this));
        return path;
    };

    /**
     * Render the point.
     * @param paper {Snap.Element}
     * @param point {cg.Point}
     * @private
     */
    Renderer.prototype._renderPoint = function (paper, point) {
        var group = paper.g();
        var position = this._getPointPosition(point);
        var circle = paper.circle(position.x, position.y, 3);
        circle.attr({
            "fill": "transparent",
            "stroke": this._theme.type_colors[point.type]
        });
        var text = paper.text(position.x + (point.isInput ? 10 : -10), position.y + 3, point.name);
        text.attr({
            "textAnchor": point.isInput ? "start" : "end",
            "fill": this._theme.action.text.color,
            "fontFamily": this._theme.action.text.font_family,
            "fontSize": this._theme.action.text.font_size
        });
        group.add(circle);
        group.add(text);
        return group;
    };

    Renderer.prototype._getPointPosition = function (point, relative) {
        return new cg.Vec2(
            point.action.position.x + (point.isInput ? 10 : ACTION_WIDTH - 10),
            point.action.position.y + 40 + point.index * 20
        );
    };

    Renderer.prototype._generateConnectionPath = function (connection) {
        var step = 50,
            p1 = this._getPointPosition(connection.firstPoint, true),
            p2 = this._getPointPosition(connection.secondPoint, true);
        return Snap.format("M{x},{y}C{x1},{y1} {x2},{y2} {x3},{y3}", {
            x: p1.x, y: p1.y,
            x1: p1.x + step, y1: p1.y,
            x2: p2.x - step, y2: p2.y,
            x3: p2.x, y3: p2.y
        });
    };

    return Renderer;

}();