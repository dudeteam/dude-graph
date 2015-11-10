/**
 * Returns the renderGroup associated with the given id
 * @param {String} groupId
 * @returns {dudeGraph.RenderGroup|null}
 * @private
 */
dudeGraph.Renderer.prototype._getRenderGroupById = function (groupId) {
    return this._renderGroupIds[groupId] || null;
};

/**
 * Creates a renderer group bound to a cgGroup
 * @param {Object} renderGroupData
 * @returns {dudeGraph.RenderGroup}
 * @private
 */
dudeGraph.Renderer.prototype._createRenderGroup = function (renderGroupData) {
    if (!renderGroupData.id) {
        throw new Error("Cannot create a renderGroup without an id");
    }
    if (this._getRenderGroupById(renderGroupData.id) !== null) {
        throw new Error("Multiple renderGroups for id `" + renderGroupData.id + "`");
    }
    var renderGroup = new dudeGraph.RenderGroup(renderGroupData.id);
    renderGroup.nodeName = renderGroupData.description || "";
    renderGroup.parentGroup = renderGroupData.parent || null;
    this._renderGroups.push(renderGroup);
    this._renderGroupIds[renderGroup.nodeId] = renderGroup;
    return renderGroup;
};