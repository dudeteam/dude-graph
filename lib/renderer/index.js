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
                "color": "rgba(25, 35, 50, 0.8)",
                "hover_color": "rgba(15, 30, 40, 0.8)",
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
     * @param paper {Object}
     * @param theme {Object} JSON config for graphic appearance of the graph
     * @constructor
     */
    function Renderer(paper, theme) {
        this._rootElement = paper.g();
        this._zoom = new cg.Zoom(this, paper, this._rootElement);
        this._theme = theme || DEFAULT_THEME;
        this._actions = this._rootElement.g();
        this._connections = this._rootElement.g();
        this._mousePosition = {x: 0, y: 0};

        var svgPoint = paper.node.createSVGPoint();
        paper.mousemove(function (e) {
            svgPoint.x = e.clientX;
            svgPoint.y = e.clientY;
            var relativeMousePosition = svgPoint.matrixTransform(this._rootElement.node.getCTM().inverse());
            this._mousePosition = {
                x: relativeMousePosition.x,
                y: relativeMousePosition.y
            };
        }.bind(this));
    }

    Renderer.prototype.__proto__ = {
        get mousePosition() { return this._mousePosition; }
    };

    /**
     * Zoom in/out
     * @param {Number} x
     */
    Renderer.prototype.zoom = function (x) {
        this._zoom.add(x);
    };

    /**
     * @param {Object} node
     * @param {Object?} element
     */
    Renderer.prototype.render = function (node, element) {
        return this["_render" + node.constructor.name](node, element || this._rootElement);
    };

    /**
     * Render the graph.
     * @param graph {cg.Graph}
     * @private
     */
    Renderer.prototype._renderGraph = function (graph, element) {
        var actions = element.g();
        actions.attr("id", "actions");
        this.render(graph.actions, actions);
        var connections = element.g();
        connections.attr("id", "connections");
        this.render(graph.connections, connections);
    };

    /**
     * Render the group.
     * @param element {Object}
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
     * @param element {Object}
     * @param action {cg.Action}
     * @private
     */
    Renderer.prototype._renderAction = function (action, element) {
        var group = element.g();
        var rect = group.rect(action.position.x, action.position.y, ACTION_WIDTH, 40 + action.height * 20, this._theme.action.box.border_radius);
        rect.attr({
            "fill": this._theme.action.box.color,
            "stroke": this._theme.action.box.stroke_color,
            "strokeSize": this._theme.action.box.stroke_size,
            "cursor": "move"
        });
        group.mouseover(function () {
            rect.attr("fill", this._theme.action.box.hover_color);
        }.bind(this));
        group.mouseout(function () {
            rect.attr("fill", this._theme.action.box.color);
        }.bind(this));
        var text = group.text(action.position.x + rect.getBBox().width / 2, action.position.y + 20, action.name);
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
                group.transform(group.data("originTransform") + (group.data("originTransform") ? "T" : "t") + [this._zoom.get(dx), this._zoom.get(dy)]);
                var groupBBox = group.getBBox();
                action.position.x = groupBBox.x;
                action.position.y = groupBBox.y;
                action.emit("move");
            }.bind(this),
            function start(x, y, e) {
                var parent = group.node.parentElement;
                group.node.remove();
                parent.appendChild(group.node);
                group.data("originTransform", group.transform().local);
                group.addClass("selected");
                this._rootElement.selectAll('#actions > g').forEach(function (action) {
                    if (!e.shiftKey && group !== action) {
                        action.removeClass("selected");
                    }
                    action.select('rect').attr("strokeWidth", action.hasClass('selected') ? 2 : 1);
                });
                cg.preventCallback(x, y, e);
            }.bind(this),
            cg.defaultCallback
        );
        return group;
    };

    /**
     * Render the connection.
     * @param element {Object}
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
     * @param element {Object}
     * @param point {cg.Point}
     * @private
     */
    Renderer.prototype._renderPoint = function (point, element) {
        var position = this._getPointPosition(point);
        var connections = [];
        point.action.graph.connections.forEach(function (connection) {
            if (connection.firstPoint === point || connection.secondPoint === point) {
                connections.push(connection);
            }
        });
        var group = element.g();
        var circle = group.circle(position.x, position.y, 3);
        circle.attr({
            "fill": connections.length > 0 ? this._theme.type_colors[point.type] : "transparent",
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
            function (x, y, e) {
                if (e.altKey) {
                    console.log("remove connections: ", connections);
                }
            },
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
        var step = 50;
        var p1 = this._getPointPosition(connection.firstPoint, true);
        var p2 = this._getPointPosition(connection.secondPoint, true);
        return Snap.format("M{x},{y}C{x1},{y1} {x2},{y2} {x3},{y3}", {
            x: p1.x, y: p1.y,
            x1: p1.x + step, y1: p1.y,
            x2: p2.x - step, y2: p2.y,
            x3: p2.x, y3: p2.y
        });
    };

    return Renderer;

}();