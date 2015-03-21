/**
 * Enable selection.
 * @private
 */
cg.Renderer.prototype._renderSelection = function () {
    var origin = null;
    this._svg.on('mousedown', function() {
        var selected = renderer.getSelectedEntities();
        selected.each(function () {
            d3.select(this).classed("selected", false);
        })
    });
    this._svg.call(d3.behavior.drag()
            .on('dragstart', function () {
                if (d3.event.sourceEvent.shiftKey) {
                    pandora.preventCallback(d3.event.sourceEvent);
                    this._selectionRectangle = this._rootGroup.append("svg:rect");
                    this._selectionRectangle.attr({
                        "id": "selection"
                    });
                    origin = null;
                }
            }.bind(this))
            .on('drag', function () {
                if (this._selectionRectangle) {
                    if (origin === null) {
                        origin = this._getSvgPosition(d3.event.x, d3.event.y).clone();
                        this._selectionBox.x = origin.x;
                        this._selectionBox.y = origin.y;
                        this._selectionBox.width = 0;
                        this._selectionBox.height = 0;
                    }
                    var position = this._getSvgPosition(d3.event.x, d3.event.y);
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
                }
            }.bind(this))
            .on('dragend', function () {
                if (this._selectionRectangle) {
                    this._selectionRectangle.remove();
                    this._selectionRectangle = null;
                }
                if (d3.event.sourceEvent.shiftKey) {
                    this._getEntitiesInArea(this._selectionBox).each(function () {
                        d3.select(this).classed("selected", true);
                    });
                }
            }.bind(this))
    );
};

/**
 *
 * @param entityNode
 * @param clearSelection
 */
cg.Renderer.prototype.addEntityToSelection = function(entityNode, clearSelection) {
    var selected = renderer.getSelectedEntities();
    if (clearSelection && !entityNode.classed("selected")) {
        selected.each(function () {
            d3.select(this).classed("selected", false);
        });
    }
    entityNode.classed("selected", true);
};