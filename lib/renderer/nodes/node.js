/**
 * Removes the given rendererNode from the renderer
 * Also removes the cgBlock if it is the rendererNode was the last reference on it
 * @param {cg.RendererNode} rendererNode
 * @private
 */
cg.Renderer.prototype._removeRendererNode = function (rendererNode) {
    if (rendererNode.type === "block") {
        this._removeRendererBlock(rendererNode);
    } else {
        this._removeRendererGroup(rendererNode);
    }
};

/**
 * Returns the parent hierarchy of the given rendererNode
 * @param {cg.RendererNode} rendererNode
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
 * @param {cg.RendererNode} rendererNode
 * @param {cg.RendererGroup} rendererGroupParent
 * @private
 */
cg.Renderer.prototype._addRendererNodeParent = function (rendererNode, rendererGroupParent) {
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
 * @param {cg.RendererNode} rendererNode
 * @private
 */
cg.Renderer.prototype._removeRendererNodeParent = function (rendererNode) {
    if (rendererNode.parent) {
        rendererNode.parent.children.splice(rendererNode.parent.children.indexOf(rendererNode), 1);
        rendererNode.parent = null;
    }
};