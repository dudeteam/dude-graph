/**
 * Set the data-binding between the node and the element with the given key.
 * @param node {cg.Node}
 * @param element {Element}
 * @param key {String?}
 * @private
 */
cg.Renderer.prototype._dataBinding = function (node, element, key) {
    key = key || 'node';
    element.data(key, node);
};

/**
 * Get the node from the given element for the given key.
 * @param element {Element}
 * @param key {String?}
 * @return {cg.Node}
 * @private
 */
cg.Renderer.prototype._getNode = function (element, key) {
    key = key || 'node';
    return element.data(key);
};