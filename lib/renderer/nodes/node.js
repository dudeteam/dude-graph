/**
 * Removes the given rendererNode from the renderer
 * Also removes the cgBlock if it is the rendererNode was the last reference on it
 * @param {dudeGraph.RendererNode} rendererNode
 * @private
 */
dudeGraph.Renderer.prototype._removeRendererNode = function (rendererNode) {
    if (rendererNode.type === "block") {
        this._removeRendererBlock(rendererNode);
    } else {
        this._removeRendererGroup(rendererNode);
    }
};

/**
 * Returns the parent hierarchy of the given rendererNode
 * @param {dudeGraph.RendererNode} rendererNode
 * @returns {Array<dudeGraph.RendererGroup>}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererNodeParents = function (rendererNode) {
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
 * @param {dudeGraph.RendererNode} rendererNode
 * @param {dudeGraph.RendererGroup} rendererGroupParent
 * @private
 */
dudeGraph.Renderer.prototype._addRendererNodeParent = function (rendererNode, rendererGroupParent) {
    if (rendererNode.parent === rendererGroupParent) {
        return;
    }
    (function checkRendererNodeParentOfRendererGroupParent(checkRendererGroupParent) {
        if (checkRendererGroupParent === rendererNode) {
            throw new Error("Cannot add `" + rendererNode.id + "` as a child of `" + rendererGroupParent.id +
                "`, because `" + rendererNode.id + "` is equal or is a parent of `" + rendererGroupParent.id + "`");
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
 * @param {dudeGraph.RendererNode} rendererNode
 * @private
 */
dudeGraph.Renderer.prototype._removeRendererNodeParent = function (rendererNode) {
    if (rendererNode.parent) {
        rendererNode.parent.children.splice(rendererNode.parent.children.indexOf(rendererNode), 1);
        rendererNode.parent = null;
    }
};