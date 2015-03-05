cg.Renderer = function () {

    var ACTION_WIDTH = 200;
    var ACTION_BORDER_RADIUS = 5;

    /**
     * Simple point object to create a point which is not attach to an action yet.
     * @param position
     * @param type
     * @param isInput
     * @constructor
     */
    function CursorPoint(position, type, isInput) {
        cg.EventEmitter.call(this);
        this._position = position;
        this._type = type;
        this._isInput = isInput;
    }

    cg.mergeObjects(CursorPoint.prototype, cg.EventEmitter.prototype);

    CursorPoint.prototype.__proto__ = {
        get position() { return this._position; },
        get type() { return this._type; },
        get isInput() { return this._isInput; }
    };

    /**
     * Check collision between this point and the given box.
     * @param box {{x: Number, y: Number, width: Number, height: Number}}
     * @returns {boolean}
     */
    CursorPoint.prototype.collideBox = function (box) {
        return this._position.x >= box.x && this._position.x <= box.x + box.width &&
            this._position.y >= box.y && this._position.y <= box.y + box.height;
    };

    /**
     * Check collision between this point and the given circle.
     * @param center {{x: Number, y: Number}}
     * @param radius {Number}
     * @returns {boolean}
     */
    CursorPoint.prototype.collideCircle = function (center, radius) {
        radius = radius || 5;
        var dx = this._position.x - center.x;
        var dy = this._position.y - center.y;
        return Math.sqrt(dx * dx + dy * dy) < radius * 2;
    };

    /**
     * CodeGraph renderer using SnapSvg library.
     * @param paper {Object} The SnagSvg object which hold the svg context
     * @constructor
     */
    function Renderer(paper) {
        this._rootElement = paper.g();
        this._zoom = new cg.Zoom(this, paper, this._rootElement);
        this._mousePosition = new cg.Vec2(0, 0);
        this._rectSelection = null;
        this._cursorConnection = null;
        this._cursorPoint = null;
        var svgPoint = paper.node.createSVGPoint();
        paper.mousemove(function (e) {
            if (this._rectSelection) {
                var selectionWidth = this._mousePosition.x - this._rectSelection.data("origin").x;
                var selectionHeight = this._mousePosition.y - this._rectSelection.data("origin").y;

                if (selectionWidth < 0) {
                    this._rectSelection.attr("x", this._mousePosition.x);
                    this._rectSelection.attr("width", this._rectSelection.data("origin").x - this._mousePosition.x);
                } else {
                    this._rectSelection.attr("width", selectionWidth);
                }
                if (selectionHeight < 0) {
                    this._rectSelection.attr("y", this._mousePosition.y);
                    this._rectSelection.attr("height", this._rectSelection.data("origin").y - this._mousePosition.y);
                } else {
                    this._rectSelection.attr("height", selectionHeight);
                }
            }
            if (this._cursorConnection != null) { // TODO fix this for the begining.
                this._cursorPoint.position.x = this._mousePosition.x;
                this._cursorPoint.position.y = this._mousePosition.y;
                this._cursorPoint.emit("move");
            }
            svgPoint.x = e.clientX;
            svgPoint.y = e.clientY;
            var relativeMousePosition = svgPoint.matrixTransform(this._rootElement.node.getCTM().inverse());
            this._mousePosition.copy(relativeMousePosition);
        }.bind(this));
        paper.mousedown(function (e) {
            if (e.shiftKey) {
                if (this._rectSelection) {
                    this._rectSelection.remove();
                }
                this._rectSelection = this._rootElement.rect(this._mousePosition.x, this._mousePosition.y, 0, 0);
                this._rectSelection.data("origin", {x: this._mousePosition.x, y: this._mousePosition.y});
                this._rectSelection.attr("id", "selection");
                cg.preventCallback(0, 0, e);
            } else {
                this._rootElement.selectAll('.action').forEach(function (action) {
                    action.removeClass("selected");
                }.bind(this));
            }
        }.bind(this));
        paper.mouseup(function () {
            if (this._rectSelection !== null) {
                this._rootElement.selectAll(".action").forEach(function (action) {
                    if (cg.boxesCollide(action.getBBox(), this._rectSelection.getBBox())) {
                        action.addClass("selected");
                    }
                }.bind(this));
                this._rectSelection.remove();
                this._rectSelection = null;
            }
            if (this._cursorConnection !== null) {
                this._rootElement.selectAll(this._cursorPoint.isInput ? ".input" : ".output").forEach(function (pt) {
                    var circle = pt.select("circle");
                    var text = pt.select("text");
                    if (this._cursorPoint.collideBox(text.getBBox()) ||
                        this._cursorPoint.collideCircle(new cg.Vec2(circle.attr("cx"), circle.attr("cy")), 10)) {
                        console.log("TODO: create connection.", pt);
                    }
                }.bind(this));
                this._cursorConnection.remove();
                this._cursorConnection = null;
                this._cursorPoint = null;
            }
        }.bind(this));
        this._zoom.initialize();
    }

    Renderer.prototype.__proto__ = {
        get mousePosition() {
            return this._mousePosition;
        }
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
        this.render(graph.children, element);
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
     *
     * @param group
     * @param element
     * @private
     */
    Renderer.prototype._renderGroup = function (group, element) {
        var groupG = element.g();
        group.children.forEach(function (node) {
            this.render(node, groupG);
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
        group.addClass("action");
        var rect = group.rect(action.position.x, action.position.y, ACTION_WIDTH, 40 + action.height * 20, ACTION_BORDER_RADIUS);
        rect.attr("cursor", "move");
        var text = group.text(action.position.x + rect.getBBox().width / 2, action.position.y + 20, action.name);
        text.addClass("title");
        text.attr({
            "textAnchor": "middle",
            "cursor": "move"
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
                this._rootElement.selectAll('.action').forEach(function (action) {
                    if (!e.shiftKey && group !== action) {
                        action.removeClass("selected");
                    }
                }.bind(this));
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
        path.addClass("type-" + connection.firstPoint.type);
        path.addClass("empty");
        path.attr("strokeWidth", 2);
        path.connection = connection;
        var updatePath = function () {
            path.attr("path", this._generateConnectionPath(path.connection));
        }.bind(this);
        if (connection.firstPoint instanceof cg.Point) {
            connection.firstPoint.action.on("move", updatePath);
        } else {
            connection.firstPoint.on("move", updatePath);
        }
        if (connection.secondPoint instanceof cg.Point) {
            connection.secondPoint.action.on("move", updatePath);
        } else {
            connection.secondPoint.on("move", updatePath);
        }
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
        var connections = point.connections;
        var group = element.g();
        group.addClass(point.isInput ? "input" : "output");
        var circle = group.circle(position.x, position.y, 3);
        if (connections.length === 0) {
            circle.addClass("empty");
        }
        circle.addClass("type-" + point.type);
        circle.attr("cursor", "pointer");
        var text = group.text(position.x + (point.isInput ? 10 : -10), position.y + 3, point.name);
        text.addClass("text");
        text.attr({
            "textAnchor": point.isInput ? "start" : "end",
            "cursor": "pointer"
        });
        group.drag(
            cg.defaultCallback,
            function (x, y, e) {
                if (e.altKey) {
                    console.log("remove connections: ", connections);
                } else {
                    this._cursorPoint = new CursorPoint(this._mousePosition, point.type, !point.isInput);
                    var cursorConnection = null;
                    if (point.isInput) {
                        cursorConnection = new cg.Connection(this._cursorPoint, point);
                    } else {
                        cursorConnection = new cg.Connection(point, this._cursorPoint);
                    }
                    this._cursorConnection = this.render(cursorConnection, this._rootElement);
                }
                cg.preventCallback(x, y, e);
            }.bind(this),
            cg.defaultCallback
        );
        return group;
    };

    /**
     * Get the position of the point on the screen according its action parent.
     * @param point {CursorPoint|cg.Point}
     * @returns {cg.Vec2}
     * @private
     */
    Renderer.prototype._getPointPosition = function (point) {
        if (point instanceof CursorPoint) {
            return point.position;
        }
        return new cg.Vec2(
            point.action.position.x + (point.isInput ? 10 : ACTION_WIDTH - 10),
            point.action.position.y + 40 + point.index * 20
        );
    };

    /**
     * Generate a SVG path for the given connection.
     * @param connection {cg.Connection}
     * @returns {String}
     * @private
     */
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