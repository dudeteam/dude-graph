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
                "color": "rgba(20, 30, 45, 0.8)",
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
        this._paper = null;
        this._zoom = new cg.Zoom();
        this._theme = theme || DEFAULT_THEME;
    }

    /**
     *
     * @param paper {Snap.Element}
     */
    Renderer.prototype.init = function (paper) {
        this._paper = paper;
        this._zoom.init(paper);
    };

    /**
     * @param {Object} node
     * @param {Snap.Element?} element
     */
    Renderer.prototype.render = function (node, element) {
        console.log((element || this._paper).node);
        return this["_render" + node.constructor.name](node, element || this._paper);
    };

    /**
     * Render the graph.
     * @param paper {Snap.Element}
     * @param graph {cg.Graph}
     * @private
     */
    Renderer.prototype._renderGraph = function (graph, paper) {
        var group = paper.g();
        // this.render(paper, graph.groups); TODO: Groups support
        this.render(graph.actions, group);
        this.render(graph.connections, group);
    };

    /**
     * Render the group.
     * @param element {Snap.Element}
     * @param container {cg.Container}
     * @private
     */
    Renderer.prototype._renderContainer = function (container, element) {
        container.forEach(function (node) {
            this.render(node, element);
        }.bind(this));
    };

    /**
     * Render the action.
     * @param element {Snap.Element}
     * @param action {cg.Action}
     * @private
     */
    Renderer.prototype._renderAction = function (action, element) {
        var group = element.g();
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
                this.render(action.inputs[inputName], group);
            }
        }
        for (var outputName in action.outputs) {
            if (action.outputs.hasOwnProperty(outputName)) {
                this.render(action.outputs[outputName], group);
            }
        }
        group.drag(
            function move(dx, dy) {
                group.transform(group.data('originTransform') + (group.data('originTransform') ? "T" : "t") + [dx, dy]);
                var groupBBox = group.getBBox();
                action.position.x = groupBBox.x;
                action.position.y = groupBBox.y;
                action.emit("move");
            }.bind(this),
            function start() {
                group.data('originTransform', group.transform().local);
            }.bind(this),
            cg.defaultCallback
        );
        return group;
    };

    /**
     * Render the connection.
     * @param element {Snap.Element}
     * @param connection {cg.Connection}
     * @private
     */
    Renderer.prototype._renderConnection = function (connection, element) {
        var path = element.path(this._generateConnectionPath(connection));
        path.attr({
            "stroke": this._theme.type_colors[connection.firstPoint.type],
            "strokeWidth": 2,
            "fill": "none"
        });
        path.connection = connection;
        connection.firstPoint.action.on("move", function () {
            path.attr("path", this._generateConnectionPath(path.connection));
        }.bind(this));
        connection.secondPoint.action.on("move", function () {
            path.attr("path", this._generateConnectionPath(path.connection));
        }.bind(this));
        return path;
    };

    /**
     * Render the point.
     * @param element {Snap.Element}
     * @param point {cg.Point}
     * @private
     */
    Renderer.prototype._renderPoint = function (point, element) {
        var group = element.g();
        var position = this._getPointPosition(point);
        var circle = group.circle(position.x, position.y, 3);
        circle.attr({
            "fill": "transparent",
            "stroke": this._theme.type_colors[point.type]
        });
        var text = group.text(position.x + (point.isInput ? 10 : -10), position.y + 3, point.name);
        text.attr({
            "textAnchor": point.isInput ? "start" : "end",
            "fill": this._theme.action.text.color,
            "fontFamily": this._theme.action.text.font_family,
            "fontSize": this._theme.action.text.font_size
        });
        group.drag(
            cg.defaultCallback,
            cg.preventCallback,
            cg.defaultCallback
        );
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