/**
 * Render the graph.
 * @param graph {cg.Graph}
 * @param element {Object}
 * @private
 */
cg.Renderer.prototype._renderGraph = function (graph, element) {
    this._bindGraphData(graph, element);
    graph.on("connection.add", function (connection) {
        this.render(connection);
    }.bind(this));
    this._zoom.initialize();
    this._paperMouseEvents();
};

/**
 * Handle paper mouse events.
 * @private
 */
cg.Renderer.prototype._paperMouseEvents = function () {
    interact(this._paper.node)
        .on('down', function(event) {
            this._deselect(event);
        }.bind(this))
        .draggable({
            onstart: function (event) {
                this._createRectangleSelection(event);
            }.bind(this),
            onmove: function (event) {
                this._updateRectangleSelection(event) ||
                this._updateCursorPoint(event) ||
                this._updatePan(event);
            }.bind(this),
            onend: function (event) {
                this._applyRectangleSelection(event) ||
                this._applyCursorPoint(event);
            }.bind(this)
        });
};

/**
 * Unselect all elements that are not clicked.
 * @param event {Event}
 * @private
 */
cg.Renderer.prototype._deselect = function (event) {
    if (!event.shiftKey) {
        this.allElements().forEach(function (element) {
            element.removeClass("selected");
        });
    }
};

/**
 * Create the rectangle selection.
 * @param event {Event}
 * @private
 */
cg.Renderer.prototype._createRectangleSelection = function (event) {
    if (event.shiftKey) {
        if (this._selectionRectangle) {
            this._selectionRectangle.remove();
        }
        this._selectionRectangle = this._rootElement.rect(this._mousePosition.x, this._mousePosition.y, 0, 0);
        this._selectionRectangle.data("cg.origin.selection", new pandora.Vec2(this._mousePosition.x, this._mousePosition.y));
        this._selectionRectangle.attr("id", "selection");
        return true;
    }
};

/**
 * Update the rectangle selection position and size.
 * @param event {Event}
 * @private
 */
cg.Renderer.prototype._updateRectangleSelection = function (event) {
    if (event.shiftKey && this._selectionRectangle) {
        var origin = this._positionToSvg(event.x0, event.y0);
        var position = this._positionToSvg(event.clientX, event.clientY);
        this._selectionBox.assign(origin.x, origin.y, position.x - origin.x, position.y - origin.y);
        if (this._selectionBox.width < 0) {
            this._selectionBox.x = position.x;
            this._selectionBox.width = origin.x - position.x;
        }
        if (this._selectionBox.height < 0) {
            this._selectionBox.y = position.y;
            this._selectionBox.height = origin.y - position.y;
        }
        this._selectionRectangle.attr({
            x: this._selectionBox.x,
            y: this._selectionBox.y,
            width: this._selectionBox.width,
            height: this._selectionBox.height
        });
        return true;
    }
};

/**
 * Update the position of the cursor point.
 * @private
 */
cg.Renderer.prototype._updateCursorPoint = function (event) {
    if (this._cursorPoint !== null) {
        var position = this._positionToSvg(event.clientX, event.clientY);
        this._cursorPoint.position.assign(position);
        this._cursorPoint.emit("move");
        return true;
    }
};

/**
 * Update panning
 * @param event {Event}
 * @private
 */
cg.Renderer.prototype._updatePan = function (event) {
    this._zoom._zoomTransform.translate(this._zoom.get(event.dx), this._zoom.get(event.dy));
    this._zoom._update();
};

/**
 * Apply rectangle selection, select all nodes within the selection.
 * @param event {Event}
 * @private
 */
cg.Renderer.prototype._applyRectangleSelection = function (event) {
    if (this._selectionRectangle) {
        this._selectionRectangle.remove();
        this._selectionRectangle = null;
        this.allElements().forEach(function (element) {
            var box = new pandora.Box2(element.getBBox());
            if (this._selectionBox.collide(box)) {
                element.addClass("selected");
            } else {
                if (!event.ctrlKey) {
                    element.removeClass("selected");
                }
            }
        }.bind(this));
    }
};

/**
 * Apply the cursor point to create the connection is possible.
 * @param event {Event}
 * @private
 */
cg.Renderer.prototype._applyCursorPoint = function (event) {
    if (this._cursorPoint !== null) {
        this._rootElement.selectAll(this._cursorPoint.isInput ? ".input" : ".output").forEach(function (pointElement) {
            var circle = pointElement.select("circle");
            var destinationPoint = this.graphData(pointElement);
            if (this._cursorPoint.position.collideCircle(this._getPointAbsolutePosition(destinationPoint), 5)) {
                if (this._cursorPoint.type !== destinationPoint.type) {
                    this._graph.emit("error", new cg.GraphError("Cannot create connection between types", this._cursorPoint.type, destinationPoint.type));
                } else {
                    var connection = new cg.Connection(this._cursorPoint.sourcePoint, destinationPoint);
                    this._graph.addConnection(connection);
                }
            }
        }.bind(this));
        this._cursorPoint.sourcePoint.emit("connection.remove", null); // Remove the fake connection
        this._cursorConnection.remove();
        this._cursorConnection = null;
        this._cursorPoint = null;
    }
};