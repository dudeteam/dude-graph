/**
 * Render the group entity and its children.
 * @param group {cg.Group}
 * @private
 */
cg.Renderer.prototype._renderGroup = function (group) {
    this._render(group.children);
};