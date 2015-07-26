/**
 * Adds the given `node` to the current selection.
 * @param d3Node {d3.selection} The svg `node` to select
 * @param clearSelection {Boolean?} If true, everything but this `node` will be unselected
 * @private
 */
cg.Renderer.prototype._addToSelection = function (d3Node, clearSelection) {
    if (clearSelection) {
        this._clearSelection();
    }
    d3Node.classed("selected", true);
};

/**
 * Clears the selection
 * @private
 */
cg.Renderer.prototype._clearSelection = function () {
    this.selection.classed("selected", false);
};