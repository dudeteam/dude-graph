/**
 * Render the graph.
 * @param graph {cg.Graph}
 * @param element {Object}
 * @private
 */
cg.Renderer.prototype._renderGraph = function (graph, element) {
    this._setNode(graph, element);
    graph.on("connection.add", function (connection) {
        this.render(connection);
    }.bind(this));
    this._paperMouseEvents();
    this._zoom.initialize();
};

/**
 * Handle paper mouse events.
 * @private
 */
cg.Renderer.prototype._paperMouseEvents = function () {
    this._paper.mousemove(function (e) {
        this._updateMousePosition(e);
        this._updateRectangleSelection(e);
        this._updateCursorPoint(e);
    }.bind(this));
    this._paper.mousedown(function (e) {
        this._createRectangleSelection(e);
        this._applyDeselection(e);
    }.bind(this));
    this._paper.mouseup(function (e) {
        this._applyRectangleSelection(e);
        this._applyCursorPoint(e);
    }.bind(this));
};

/**
 * Update the real mouse position depending on the zoom and the pan.
 * @param e {Event}
 * @private
 */
cg.Renderer.prototype._updateMousePosition = function (e) {
    this._paperPoint.x = e.clientX;
    this._paperPoint.y = e.clientY;
    this._mousePosition.copy(this._paperPoint.matrixTransform(this._rootElement.node.getCTM().inverse()));
};

/**
 * Create the rectangle selection.
 * @param e {Event}
 * @private
 */
cg.Renderer.prototype._createRectangleSelection = function (e) {
    if (e.shiftKey) {
        cg.preventCallback(e);
        if (this._selectionRectangle) {
            this._selectionRectangle.remove();
        }
        this._selectionRectangle = this._rootElement.rect(this._mousePosition.x, this._mousePosition.y, 0, 0);
        this._selectionRectangle.data("cg.origin.selection", new cg.Vec2(this._mousePosition.x, this._mousePosition.y));
        this._selectionRectangle.attr("id", "selection");
    }
};

/**
 * Unselect all elements that are not clicked.
 * @param e {Event}
 * @private
 */
cg.Renderer.prototype._applyDeselection = function (e) {
    this.allElements().forEach(function (element) {
        element.removeClass("selected");
    });
};

/**
 * Update the rectangle selection position and size.
 * @param e {Event}
 * @private
 */
cg.Renderer.prototype._updateRectangleSelection = function (e) {
    if (this._selectionRectangle) {
        var origin = this._selectionRectangle.data("cg.origin.selection");
        this._selectionBox.x = origin.x;
        this._selectionBox.y = origin.y;
        this._selectionBox.width = this._mousePosition.x - origin.x;
        this._selectionBox.height = this._mousePosition.y - origin.y;
        if (this._selectionBox.width < 0) {
            this._selectionBox.x = this._mousePosition.x;
            this._selectionBox.width = origin.x - this._mousePosition.x;
        }
        if (this._selectionBox.height < 0) {
            this._selectionBox.y = this._mousePosition.y;
            this._selectionBox.height = origin.y - this._mousePosition.y;
        }
        this._selectionRectangle.attr({
            x: this._selectionBox.x,
            y: this._selectionBox.y,
            width: this._selectionBox.width,
            height: this._selectionBox.height
        });
    }
};

/**
 * Apply rectangle selection, select all nodes within the selection.
 * @param e {Event}
 * @private
 */
cg.Renderer.prototype._applyRectangleSelection = function (e) {
    if (this._selectionRectangle) {
        this._selectionRectangle.remove();
        this._selectionRectangle = null;
        this.allElements().forEach(function (element) {
            var box = new cg.Box2(element.getBBox());
            if (this._selectionBox.collide(box)) {
                element.addClass("selected");
            } else {
                if (!e.ctrlKey) {
                    element.removeClass("selected");
                }
            }
        }.bind(this));
    }
};

/**
 * Update the position of the cursor point.
 * @private
 */
cg.Renderer.prototype._updateCursorPoint = function () {
    if (this._cursorPoint !== null) {
        this._cursorPoint.position.copy(this._mousePosition);
        this._cursorPoint.emit("move");
    }
};

/**
 * Apply the cursor point to create the connection is possible.
 * @param e {Event}
 * @private
 */
cg.Renderer.prototype._applyCursorPoint = function (e) {
    if (this._cursorPoint !== null) {
        this._rootElement.selectAll(this._cursorPoint.isInput ? ".input" : ".output").forEach(function (pt) {
            var circle = pt.select("circle");
            var destinationPoint = this._getNode(pt);
            if (this._cursorPoint.position.collideCircle(this._getPointAbsolutePosition(destinationPoint), 5)) {
                if (this._cursorPoint.type !== destinationPoint.type) {
                    this._graph.emit("error", {
                        "message": "Cannot create connection between types " + this._cursorPoint.type + " and " + destinationPoint.type,
                        "sourcePoint": this._cursorPoint.sourcePoint,
                        "destinationPoint": destinationPoint
                    });
                } else {
                    var connection = new cg.Connection(this._cursorPoint.sourcePoint, destinationPoint);
                    this._graph.addConnection(connection);
                    this.render(connection);
                }
            }
        }.bind(this));
        this._cursorPoint.sourcePoint.emit("connection.remove", null);
        this._cursorConnection.remove();
        this._cursorConnection = null;
        this._cursorPoint = null;
    }
};