/**
 * Render the graph.
 * @param graph {cg.Graph}
 * @param element {Object}
 * @private
 */
cg.Renderer.prototype._renderGraph = function (graph, element) {
    this._graph = graph;
    this._dataBinding(graph, element);
    this.render(graph.children, element);
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
            var text = pt.select("text");
            var node = this._getNode(pt);
            if (this._cursorPoint.position.collideCircle(this._getPointAbsolutePosition(node), 5)) {
                var connection = new cg.Connection(this._cursorPoint.sourcePoint, node);
                node.addConnection(connection);
                this._cursorPoint.sourcePoint.addConnection(connection);
                this.render(connection);
            }
        }.bind(this));
        this._cursorPoint.sourcePoint.emit("connection.remove", null);
        this._cursorConnection.remove();
        this._cursorConnection = null;
        this._cursorPoint = null;
    }
};