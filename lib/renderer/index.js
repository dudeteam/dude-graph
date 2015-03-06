cg.Renderer = (function () {

    // TODO: Rewrite this mess

    var ACTION_MIN_WIDTH = 250;
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
        get position() {
            return this._position;
        },
        get type() {
            return this._type;
        },
        get isInput() {
            return this._isInput;
        }
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

        this._paper = paper;
        this._paper.background = new cg.BackgroundGrid(paper);

        this._rootElement = paper.g();

        this._zoom = new cg.Zoom(this, paper, this._rootElement);
        this._mousePosition = new cg.Vec2(0, 0);
        this._selectionPicker = null;
        this._selectionBBox = new cg.BBox(0, 0, 0, 0);
        this._cursorConnection = null;
        this._cursorPoint = null;
        var svgPoint = paper.node.createSVGPoint();
        paper.mousemove(function (e) {
            if (this._selectionPicker) {
                this._selectionBBox.x = this._selectionPicker.data("origin").x;
                this._selectionBBox.y = this._selectionPicker.data("origin").y;
                this._selectionBBox.width = this._mousePosition.x - this._selectionPicker.data("origin").x;
                this._selectionBBox.height = this._mousePosition.y - this._selectionPicker.data("origin").y;

                if (this._selectionBBox.width < 0) {
                    this._selectionBBox.x = this._mousePosition.x;
                    this._selectionBBox.width = this._selectionPicker.data("origin").x - this._mousePosition.x;
                }
                if (this._selectionBBox.height < 0) {
                    this._selectionBBox.y = this._mousePosition.y;
                    this._selectionBBox.height = this._selectionPicker.data("origin").y - this._mousePosition.y;
                }
                this._selectionPicker.attr({
                    x: this._selectionBBox.x,
                    y: this._selectionBBox.y,
                    width: this._selectionBBox.width,
                    height: this._selectionBBox.height
                });
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
                if (this._selectionPicker) {
                    this._selectionPicker.remove();
                }
                this._selectionPicker = this._rootElement.rect(this._mousePosition.x, this._mousePosition.y, 0, 0);
                this._selectionPicker.data("origin", {x: this._mousePosition.x, y: this._mousePosition.y});
                this._selectionPicker.attr("id", "selection");
                cg.preventCallback(0, 0, e);
            } else {
                this._rootElement.selectAll('.action').forEach(function (action) {
                    action.removeClass("selected");
                }.bind(this));
            }
        }.bind(this));
        paper.mouseup(function (e) {
            if (this._selectionPicker !== null) {
                this._rootElement.selectAll(".action").forEach(function (action) {
                    if (cg.boxesCollide(cg.mergeObjects(action.getBBox(), action.data('action').getAbsolutePosition()), this._selectionBBox)) {
                        action.addClass("selected");
                    } else {
                        if (!e.ctrlKey) {
                            action.removeClass("selected");
                        }
                    }
                }.bind(this));
                this._selectionPicker.remove();
                this._selectionPicker = null;
            }
            if (this._cursorConnection !== null) {
                this._rootElement.selectAll(this._cursorPoint.isInput ? ".input" : ".output").forEach(function (pointGroup) {
                    var point = pointGroup.data("point");
                    var box = cg.mergeObjects(pointGroup.getBBox(), this._getAbsolutePointPosition(point));
                    if (this._cursorPoint.collideBox(box)) {
                        console.log('Success', point);
                    }
                }.bind(this));
                this._cursorConnection.remove();
                this._cursorConnection = null;
                this._cursorPoint = null;
            }
        }.bind(this));
        this._zoom.initialize();
    }

    /**
     * @param {cg.Node} node
     * @param {Object?} element
     */
    Renderer.prototype.render = function (node, element) {
        return this["_render" + cg.functionName(node.constructor)](node, element || this._rootElement);
    };

    /**
     * Render the graph.
     * @param graph {cg.Graph}
     * @param element {Object}
     * @private
     */
    Renderer.prototype._renderGraph = function (graph, element) {
        this.render(graph.children, element);
    };

    /**
     * Render the group.
     * @param container {cg.Container}
     * @param element {Object}
     * @private
     */
    Renderer.prototype._renderContainer = function (container, element) {
        container.forEach(function (node) {
            this.render(node, element);
        }.bind(this));
    };

    /**
     *
     * @param group {cg.Group}
     * @param element {Object}
     * @private
     */
    Renderer.prototype._renderGroup = function (group, element) {
        var groupGroup = element.g();
        group.data.__node = groupGroup;
        groupGroup.transform("T" + group.position.toArray());
        group.children.forEach(function (node) {
            this.render(node, groupGroup);
        }.bind(this));
        return groupGroup;
    };

    /**
     * Render the action.
     * @param action {cg.Action}
     * @param element {Object}
     * @private
     */
    Renderer.prototype._renderAction = function (action, element) {
        var actionGroup = element.g();
        action.data.__node = actionGroup;
        actionGroup.data('action', action);
        actionGroup.addClass("action");
        var actionRect = actionGroup.rect(action.position.x, action.position.y, ACTION_MIN_WIDTH, 40 + action.height * 20, ACTION_BORDER_RADIUS);
        actionRect.attr("cursor", "move");
        var actionText = actionGroup.text(action.position.x + actionRect.getBBox().width / 2, action.position.y + 20, action.name);
        actionText.addClass("title");
        actionText.attr({
            "textAnchor": "middle",
            "cursor": "move"
        });
        for (var inputName in action.inputs) {
            if (action.inputs.hasOwnProperty(inputName)) {
                this.render(action.inputs[inputName], actionGroup);
            }
        }
        for (var outputName in action.outputs) {
            if (action.outputs.hasOwnProperty(outputName)) {
                this.render(action.outputs[outputName], actionGroup);
            }
        }
        actionGroup.drag(
            function move(dx, dy) {
                actionGroup.transform(actionGroup.data("originTransform") + (actionGroup.data("originTransform") ? "T" : "t") + [this._zoom.get(dx), this._zoom.get(dy)]);
                action.position.x = actionRect.getBBox().x + actionGroup.transform().localMatrix.e;
                action.position.y =  actionRect.getBBox().y + actionGroup.transform().localMatrix.f;
                action.emit("move");
            }.bind(this),
            function start(x, y, e) {
                var parent = actionGroup.node.parentElement;
                actionGroup.node.remove();
                parent.appendChild(actionGroup.node);
                actionGroup.data("originTransform", actionGroup.transform().local);
                actionGroup.addClass("selected");
                this._rootElement.selectAll('.action').forEach(function (action) {
                    if (!e.shiftKey && actionGroup !== action) {
                        action.removeClass("selected");
                    }
                }.bind(this));
                cg.preventCallback(x, y, e);
            }.bind(this),
            cg.defaultCallback
        );
        return actionGroup;
    };

    /**
     * Render the point.
     * @param point {cg.Point}
     * @param element {Object}
     * @private
     */
    Renderer.prototype._renderPoint = function (point, element) {
        var pointGroup = element.g();
        point.data.__node = pointGroup;
        pointGroup.data('point', point);
        var position = this._getRelativePointPosition(point);
        var connections = point.connections;
        pointGroup.addClass(point.isInput ? "input" : "output");
        var pointCircle = pointGroup.circle(position.x, position.y, 3);
        point.data.__circle = pointCircle;
        pointCircle.data('point', point);
        pointCircle.addClass("type-" + point.type);
        pointCircle.attr("cursor", "pointer");
        var pointText = pointGroup.text(position.x + (point.isInput ? 10 : -10), position.y + 3, point.name);
        point.data.__text = pointText;
        pointText.data('point', point);
        pointText.addClass("text");
        pointText.attr({
            "textAnchor": point.isInput ? "start" : "end",
            "cursor": "pointer"
        });
        if (connections.length === 0) {
            pointCircle.addClass("empty");
            if (point.isInput) {
                var pickerPosition = position.clone();
                pickerPosition.x += pointText.getBBox().width + 20;
                pickerPosition.y -= 8;
                cg["picker" + cg.camelcase(point.type)](pointGroup, point.value, pickerPosition);
            }
        }
        for (var connectionIndex = 0; connectionIndex < connections.length; ++connectionIndex) {
            var connection = connections[connectionIndex];
            if (connection.firstPoint.action.data.__node && connection.secondPoint.action.data.__node) {
                this.render(connections[connectionIndex], this._rootElement);
            }
        }
        pointCircle.drag(
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
        return pointGroup;
    };

    /**
     * Render the connection.
     * @param connection {cg.Connection}
     * @param element {Object}
     * @private
     */
    Renderer.prototype._renderConnection = function (connection, element) {
        var connectionPath = element.path(this._generateConnectionPath(connection));
        connectionPath.addClass("type-" + connection.firstPoint.type);
        connectionPath.addClass("empty");
        connectionPath.attr("strokeWidth", 2);
        connectionPath.connection = connection;
        var updatePath = function () {
            connectionPath.attr("path", this._generateConnectionPath(connectionPath.connection));
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
        return connectionPath;
    };

    /**
     *
     * @param point
     * @returns {cg.Vec2}
     * @private
     */
    Renderer.prototype._getAbsolutePointPosition = function (point) {
        if (point instanceof CursorPoint) {
            return point.position;
        }
        var actionPosition = point.action.getAbsolutePosition();
        return new cg.Vec2(
            actionPosition.x + (point.isInput ? 10 : ACTION_MIN_WIDTH - 10),
            actionPosition.y + 40 + point.index * 20
        );
    };


    /**
     *
     * @param point
     * @returns {cg.Vec2}
     * @private
     */
    Renderer.prototype._getRelativePointPosition = function (point) {
        return new cg.Vec2(
            point.action.position.x + (point.isInput ? 10 : ACTION_MIN_WIDTH - 10),
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
        var p1 = this._getAbsolutePointPosition(connection.firstPoint);
        var p2 = this._getAbsolutePointPosition(connection.secondPoint);
        return Snap.format("M{x},{y}C{x1},{y1} {x2},{y2} {x3},{y3}", {
            x: p1.x, y: p1.y,
            x1: p1.x + step, y1: p1.y,
            x2: p2.x - step, y2: p2.y,
            x3: p2.x, y3: p2.y
        });
    };

    return Renderer;

})();