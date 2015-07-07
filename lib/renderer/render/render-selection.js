/**
 * Enable selection.
 * @private
 */
cg.Renderer.prototype._renderSelection = function() {
    var renderer = this;
    var origin = null;
    this._svg.on('mousedown', function() {
        if (!d3.event.shiftKey) {
            renderer._clearSelection();
            renderer._selectionBox.assign({x: 0, y: 0, width: 0, height: 0});
        }
    });
    this._svg.call(d3.behavior.drag()
            .on('dragstart', function() {
                if (d3.event.sourceEvent.shiftKey) {
                    pandora.preventCallback(d3.event.sourceEvent);
                    renderer._selectionRectangle = renderer._rootGroup.append("svg:rect");
                    renderer._selectionRectangle.attr({
                        "id": "selection"
                    });
                    origin = null;
                }
            })
            .on('drag', function() {
                if (renderer._selectionRectangle) {
                    if (origin === null) {
                        origin = renderer._getZoomedSVGPosition(d3.event.x, d3.event.y, true);
                        renderer._selectionBox.x = origin.x;
                        renderer._selectionBox.y = origin.y;
                        renderer._selectionBox.width = 0;
                        renderer._selectionBox.height = 0;
                    }
                    var position = renderer._getZoomedSVGPosition(d3.event.x, d3.event.y, true);
                    renderer._selectionBox.assign(origin.x, origin.y, position.x - origin.x, position.y - origin.y);
                    if (renderer._selectionBox.width < 0) {
                        renderer._selectionBox.x = position.x;
                        renderer._selectionBox.width = origin.x - position.x;
                    }
                    if (renderer._selectionBox.height < 0) {
                        renderer._selectionBox.y = position.y;
                        renderer._selectionBox.height = origin.y - position.y;
                    }
                    renderer._selectionRectangle.attr({
                        x: renderer._selectionBox.x,
                        y: renderer._selectionBox.y,
                        width: renderer._selectionBox.width,
                        height: renderer._selectionBox.height
                    });
                }
            })
            .on('dragend', function() {
                if (renderer._selectionRectangle) {
                    renderer._selectionRectangle.remove();
                    renderer._selectionRectangle = null;
                }
                if (renderer._selectionBox.width !== 0 && renderer._selectionBox.height !== 0) {
                    var selectedEntities = renderer._getEntitiesInArea(renderer._selectionBox);
                    renderer._addEntitiesToSelection(selectedEntities, !d3.event.sourceEvent.shiftKey);
                }
            })
    );
};

/**
 * Clear the selection.
 * @private
 */
cg.Renderer.prototype._clearSelection = function() {
    this._lastSelectedEntity = null;
    this.getSelectedEntities().classed("selected", false);
};

/**
 * Add entities to selection.
 * @param entitiesSelection {d3.selection}
 * @param clearSelection {Boolean?} clear the previous selection
 */
cg.Renderer.prototype._addEntitiesToSelection = function(entitiesSelection, clearSelection) {
    if (clearSelection) {
        this._clearSelection();
    }
    if (entitiesSelection) {
        if (entitiesSelection.length === 1) {
            this._lastSelectedEntity = d3.select(entitiesSelection[0][0]);
        }
        entitiesSelection.classed("selected", true);
    }
};