/**
 * Returns the renderGroup associated with the given id
 * @param {String} groupId
 * @returns {dudeGraph.RenderGroup|null}
 */
dudeGraph.Renderer.prototype.renderGroupById = function (groupId) {
    return this._renderGroupIds[groupId] || null;
};

/**
 * Creates a renderer group bound to a cgGroup
 * @param {Object} renderGroupData
 * @returns {dudeGraph.RenderGroup}
 * @param {Boolean?} forceUpdate - Whether to force update the renderer
 * @private
 */
dudeGraph.Renderer.prototype._createRenderGroup = function (renderGroupData, forceUpdate) {
    var renderGroup = dudeGraph.RenderGroup.buildRenderGroup(this, renderGroupData);
    if (renderGroup.nodeId === null) {
        throw new Error("Cannot create a renderGroup without an id");
    }
    var renderGroupFound = this.renderGroupById(renderGroup.nodeId);
    if (renderGroupFound !== null) {
        throw new Error("Duplicate renderGroups for id `" + renderGroup.nodeId + "`: `" +
            renderGroupFound.nodeFancyName + "` was here before `" + renderGroup.nodeFancyName + "`");
    }
    this._renderGroups.push(renderGroup);
    this._renderGroupIds[renderGroup.nodeId] = renderGroup;
    if (forceUpdate) {
        this.createD3Groups();
    }
    return renderGroup;
};