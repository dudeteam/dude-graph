/**
 * Returns the rendererGroup associated with the given id
 * @param {String} id
 * @returns {dudeGraph.RendererGroup|null}
 * @private
 */
dudeGraph.Renderer.prototype._getRendererGroupById = function (id) {
    return this._rendererGroupIds.get(id) || null;
};

/**
 * Creates a rendererGroup
 * @param {Object} rendererGroupData
 * @returns {dudeGraph.RendererGroup}
 * @private
 */
dudeGraph.Renderer.prototype._createRendererGroup = function (rendererGroupData) {
    var renderer = this;
    if (!rendererGroupData.id) {
        throw new Error("Cannot create a rendererGroup without an id");
    }
    if (this._getRendererGroupById(rendererGroupData.id)) {
        throw new Error("Duplicate rendererGroup for id `" + rendererGroupData.id + "`");
    }
    var rendererGroup = _.merge({}, rendererGroupData);
    rendererGroup.type = "group";
    rendererGroup.id = rendererGroupData.id;
    rendererGroup.parent = null;
    rendererGroup.children = [];
    rendererGroup.position = rendererGroupData.position || [0, 0];
    rendererGroup.size = rendererGroupData.size || this._config.group.size;
    rendererGroup._cgDescription = rendererGroup.description;
    Object.defineProperty(rendererGroup, "description", {
        set: function (description) {
            this._cgDescription = description;
            renderer.emit("dude-graph-renderer-group-description-change", this);
        },
        get: function () {
            return this._cgDescription;
        }
    });
    this._rendererGroups.push(rendererGroup);
    this._rendererGroupIds.set(rendererGroup.id, rendererGroup);
    return rendererGroup;
};

/**
 * Removes the rendererGroup
 * @param {dudeGraph.RendererGroup} rendererGroup
 * @private
 */
dudeGraph.Renderer.prototype._removeRendererGroup = function (rendererGroup) {
    var rendererGroupFound = this._rendererGroups.indexOf(rendererGroup);
    if (rendererGroupFound === -1) {
        throw new Error("RendererGroup not found and thus cannot be removed");
    }
    this._removeRendererNodeParent(rendererGroup);
    _.forEach(rendererGroup.children, function (rendererNode) {
       rendererNode.parent = null;
    });
    this._rendererGroups.splice(rendererGroupFound, 1);
};