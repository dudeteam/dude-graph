/**
 * Set the data-binding between the node and the element with the given key.
 * @param node {cg.Node}
 * @param element {Element}
 * @param key {String?}
 * @private
 */
cg.Renderer.prototype._dataBinding = function (node, element, key) {
    key = key || 'node';
    node.data[key] = element;
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

/**
 * @deprecated
 * Get the element from the given node for the given key.
 * @param node {cg.Node}
 * @param key {String?}
 * @return {Element}
 * @private
 */
cg.Renderer.prototype._getElement = function (node, key) {
    key = key || 'node';
    return node.data[key];
};

/**
 * Send the element to the front by removing it from his actual parentElement and attaching it to _rootElement.
 * @param element {Element}
 * @private
 */
cg.Renderer.prototype._attachRootElement = function (element) {
    element.remove();
    this._rootElement.add(element);
};

/**
 *
 * @param gElement {Element}
 * @private
 */
cg.Renderer.prototype._getGroupBBox = function (gElement) {
    var bbox = new cg.Box2();

    (function (element) {
        var elementBBox = element.getBBox();
        bbox.x = Math.max(bbox.x, elementBBox.x);
        bbox.y = Math.max(bbox.x, elementBBox.y);
        bbox.width = Math.max(bbox.width, elementBBox.x + elementBBox.width);
        bbox.height = Math.max(bbox.height, elementBBox.y + elementBBox.height);

        console.log(element, elementBBox)

        for (var childIndex = 0; childIndex < element.childElementCount; ++childIndex) {
            arguments.callee(element.childNodes[childIndex]);
        }
    })(gElement.node);
    return bbox;
};