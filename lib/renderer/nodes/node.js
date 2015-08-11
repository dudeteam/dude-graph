/**
 * Returns the rendererNode associated with the given id
 * @param id
 * @returns {cg.RendererBlock|null}
 * @private
 */
cg.Renderer.prototype._getRendererBlockById = function (id) {
    return this._rendererBlockIds.get(id) || null;
};

/**
 * Returns the rendererGroup associated with the given id
 * @param id
 * @returns {cg.RendererGroup|null}
 * @private
 */
cg.Renderer.prototype._getRendererGroupById = function (id) {
    return this._rendererGroupIds.get(id) || null;
};

/**
 * Creates a renderer block
 * @param rendererBlockData
 * @returns {cg.RendererBlock}
 * @private
 */
cg.Renderer.prototype._createRendererBlock = function (rendererBlockData) {
    if (!rendererBlockData.id) {
        throw new cg.RendererError("Renderer::_createRendererBlock() Cannot create a rendererBlock without an id");
    }
    if (this._getRendererBlockById(rendererBlockData.id) !== null) {
        throw new cg.RendererError("Renderer::_createRendererBlock() Multiple rendererBlocks for id `{0}`", rendererBlockData.id);
    }
    var cgBlock = this._cgGraph.blockById(rendererBlockData.cgBlock);
    if (!cgBlock) {
        throw new cg.RendererError("Renderer::_createRendererBlock() Cannot link cgBlock `{0}` to rendererBlock `{1}`", rendererBlockData.cgBlock, rendererBlockData.id);
    }
    var rendererBlock = pandora.mergeObjects({}, rendererBlockData, true, true);
    rendererBlock.type = "block";
    rendererBlock.parent = null;
    rendererBlock.cgBlock = cgBlock;
    rendererBlock.id = rendererBlockData.id;
    rendererBlock.rendererPoints = [];
    rendererBlock.position = rendererBlockData.position || [0, 0];
    rendererBlock.size = rendererBlockData.size || this._config.block.size;
    this._createsRendererPoints(rendererBlock);
    this._rendererBlocks.push(rendererBlock);
    this._rendererBlockIds.set(rendererBlock.id, rendererBlock);
    return rendererBlock;
};

/**
 * Creates a rendererGroup
 * @param rendererGroupData
 * @returns {cg.RendererGroup}
 * @private
 */
cg.Renderer.prototype._createRendererGroup = function (rendererGroupData) {
    if (!rendererGroupData.id) {
        throw new cg.RendererError("Renderer::_createRendererGroup() Cannot create a rendererGroup without an id");
    }
    if (this._getRendererGroupById(rendererGroupData.id)) {
        throw new cg.RendererError("Renderer::_createRendererGroup() Duplicate rendererGroup for id `{0}`", rendererGroupData.id);
    }
    var rendererGroup = pandora.mergeObjects({}, rendererGroupData, true, true);
    rendererGroup.type = "group";
    rendererGroup.id = rendererGroupData.id;
    rendererGroup.parent = null;
    rendererGroup.children = [];
    rendererGroup.position = rendererGroupData.position || [0, 0];
    rendererGroup.size = rendererGroupData.size || this._config.group.size;
    this._rendererGroups.push(rendererGroup);
    this._rendererGroupIds.set(rendererGroup.id, rendererGroup);
    return rendererGroup;
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