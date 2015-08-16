/**
 * Removes the given rendererNode from the renderer
 * Also removes the cgBlock if it is the rendererNode was the last reference on it
 * @param rendererNode {cg.RendererBlock|cg.RendererGroup}
 * @private
 */
cg.Renderer.prototype._removeRendererNode = function (rendererNode) {
    if (rendererNode.type === "block") {
        this._removeRendererBlock(rendererNode);
    }
    this._removeRendererGroup(rendererNode);
};

/**
 * Returns the parent hierarchy of the given rendererNode
 * @type {cg.RendererNode}
 * @returns {Array<cg.RendererGroup>}
 * @private
 */
cg.Renderer.prototype._getRendererNodeParents = function (rendererNode) {
    var parents = [];
    var parent = rendererNode.parent;
    while (parent) {
        parents.push(parent);
        parent = parent.parent;
    }
    return parents;
};

/**
 * Adds the given rendererNode in the rendererGroupParent
 * @param rendererNode {cg.RendererNode}
 * @param rendererGroupParent{cg.RendererGroup}
 * @private
 */
cg.Renderer.prototype._addRendererNodeParent = function (rendererNode, rendererGroupParent) {
    if (rendererNode.parent === rendererGroupParent) {
        return;
    }
    (function checkRendererNodeParentOfRendererGroupParent(checkRendererGroupParent) {
        if (checkRendererGroupParent === rendererNode) {
            throw new cg.RendererError("Renderer::_addRendererNodeParent() Cannot add `{0}` as a child of `{1}`, because `{0}` is equal or is a parent of `{1}`", rendererNode.id, rendererGroupParent.id);
        }
        if (checkRendererGroupParent.parent) {
            checkRendererNodeParentOfRendererGroupParent(checkRendererGroupParent.parent);
        }
    })(rendererGroupParent);
    this._removeRendererNodeParent(rendererNode);
    rendererGroupParent.children.push(rendererNode);
    rendererNode.parent = rendererGroupParent;
};

/**
 * Removes the rendererNode from his parent
 * @param rendererNode {cg.RendererNode}
 * @private
 */
cg.Renderer.prototype._removeRendererNodeParent = function (rendererNode) {
    if (rendererNode.parent) {
        rendererNode.parent.children.splice(rendererNode.parent.children.indexOf(rendererNode), 1);
        rendererNode.parent = null;
    }
};