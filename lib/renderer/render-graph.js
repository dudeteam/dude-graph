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
        .origin(this._paper.node)
        .on('down', function(event) {
            this._deselect(event);
        }.bind(this))
        .draggable({
            onstart: function (event) {
                this._createRectangleSelection(event);
            }.bind(this),
            onmove: function (event) {
                this._updateRectangleSelection(event) ||
                this._updatePan(event);
            }.bind(this),
            onend: function (event) {
                this._applyRectangleSelection(event);
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
        var position = this._positionToSvg(event.clientX0, event.clientY0);
        this._selectionRectangle = this._rootElement.rect(position.x, position.y, 0, 0);
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
        var origin = this._positionToSvg(event.clientX0, event.clientY0);
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
 * Update panning
 * @param event {Event}
 * @private
 */
cg.Renderer.prototype._updatePan = function (event) {
    this._vec2.assign(event.dx, event.dy);
    this._zoom.translatePan(this._vec2, true);
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
            this._box2.assign(element.getBBox());
            if (this._selectionBox.collide(this._box2)) {
                element.addClass("selected");
            } else {
                if (!event.ctrlKey) {
                    element.removeClass("selected");
                }
            }
        }.bind(this));
    }
};