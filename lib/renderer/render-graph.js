/**
 * Render the graph.
 * @param graph {cg.Graph}
 * @param element {Object}
 * @private
 */
cg.Renderer.prototype._renderGraph = function (graph, element) {
    this._dataBinding(graph, element);
    this.render(graph.children, element);
    this._paperMouseUp();
    this._paperMouseMove();
    this._paperMouseDown();
};

cg.Renderer.prototype._paperMouseMove = function () {
    this._paper.mousemove(function (e) {
        this._updateMousePosition(e);
        this._updateRectangleSelection(e);
    }.bind(this));
};

cg.Renderer.prototype._paperMouseDown = function () {
    this._paper.mousedown(function (e) {
        this._createRectangleSelection(e);
    }.bind(this));
};

cg.Renderer.prototype._paperMouseUp = function () {
    this._paper.mouseup(function (e) {
        this._applyRectangleSelection(e);
    }.bind(this));
};

cg.Renderer.prototype._updateMousePosition = function (e) {
    this._paperPoint.x = e.clientX;
    this._paperPoint.y = e.clientY;
    this._mousePosition.copy(this._paperPoint.matrixTransform(this._rootElement.node.getCTM().inverse()));
};

cg.Renderer.prototype._createRectangleSelection = function (e) {
    if (e.shiftKey) {
        cg.preventCallback(e);
        if (this._selectionRectangle) {
            this._selectionRectangle.remove();
        }
        this._selectionRectangle = this._rootElement.rect(this._mousePosition.x, this._mousePosition.y, 0, 0);
        this._selectionRectangle.data("cg.originSelection", {x: this._mousePosition.x, y: this._mousePosition.y});
        this._selectionRectangle.attr("id", "selection");
    }
};

cg.Renderer.prototype._updateRectangleSelection = function (e) {
    if (this._selectionRectangle) {
        var origin = this._selectionRectangle.data("cg.originSelection");
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

cg.Renderer.prototype._applyRectangleSelection = function (e) {
    if (this._selectionRectangle) {
        this._selectionRectangle.remove();
        this._selectionRectangle = null;
    }
};