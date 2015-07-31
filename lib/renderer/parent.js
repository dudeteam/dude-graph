/**
 * Returns whether the given renderer group contains the given renderer node
 * If recurse is set, this method will check recursively all parents
 * @param rendererGroup {cg.RendererGroup}
 * @param rendererNode {cg.RendererNode}
 * @param recurse {Boolean?}
 * @returns {Boolean}
 * @private
 */
cg.Renderer.prototype._isRendererGroupParent = function (rendererGroup, rendererNode, recurse) {
    var isParent = false;
    (function isParentRecurse(parent) {
        if (parent === rendererGroup) {
            isParent = true;
        }
        else if (recurse && parent.parent) {
            isParentRecurse(parent.parent);
        }
    })(rendererNode.parent);
    return isParent;
};

/**
 * Returns whether the given renderer node is contained by the given renderer group
 * If recurse is set, this method will check recursively all children
 * @param rendererNode {cg.RendererNode}
 * @param rendererGroup {cg.RendererGroup}
 * @param recurse {Boolean?}
 * @returns {Boolean}
 * @private
 */
cg.Renderer.prototype._isRendererNodeChild = function (rendererNode, rendererGroup, recurse) {
    var isChild = false;
    (function isChildRecurse(children) {
        if (children.indexOf(rendererNode) !== -1) {
            isChild = true;
        } else if (recurse && children.children) {
            pandora.forEach(children.children, isChildRecurse);
        }
    })(rendererGroup.children);
    return isChild;
};

/**
 * Returns all parents of the given renderer node
 * @type {cg.RendererNode}
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