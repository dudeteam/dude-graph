/**
 * Render entities in the container.
 * @param container {cg.Container}
 * @private
 */
cg.Renderer.prototype._renderContainer = function (container) {
    container.forEach(function (entity) {
        this._render(entity);
    }.bind(this));
};

/**
 * Render entities in the array.
 * @param array {Array<cg.Entity|cg.Point|cg.Connection>}
 * @private
 */
cg.Renderer.prototype._renderArray = function (array) {
    pandora.forEach(array, function (entity) {
        this._render(entity);
    }.bind(this));
};