/**
 * Render the container content.
 * @param container {cg.Container}
 * @param element {Object}
 * @private
 */
cg.Renderer.prototype._renderContainer = function (container, element) {
    container.forEach(function (node) {
        this.render(node, element);
    }.bind(this));
};