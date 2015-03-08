/**
 *
 * @param group {cg.Group}
 * @param element {Element}
 * @private
 */
cg.Renderer.prototype._renderGroup = function (group, element) {
    var groupGroup = this._groupLayer.g();
    this._dataBinding(group, groupGroup);
    groupGroup.addClass('group');
    this.render(group.children, element);
    var groupRect = groupGroup.rect(0, 0, group.size.x, group.size.y, this._config.group["border-radius"]);
    groupRect.addClass("background");
    groupRect.prependTo(groupGroup);
    var groupText = groupGroup.text(group.size.x / 2, this._config.group["heading"], group.name);
    groupText.attr("text-anchor", "middle");
    groupText.addClass("title");
    group.on("move", this._updateBlock.bind(this, group, groupGroup));
    group.on("remove", function() { groupGroup.remove(); });
    this._updateGroup(group, groupGroup);
    this._dragNode(group, groupGroup);
    return groupGroup;
};

/**
 * Update the group position.
 * @param group
 * @param groupGroup
 * @private
 */
cg.Renderer.prototype._updateGroup = function (group, groupGroup) {
    groupGroup.transform("T" + group.absolutePosition().toArray());
};