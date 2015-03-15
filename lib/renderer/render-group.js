/**
 *
 * @param group {cg.Group}
 * @param element {Element}
 * @private
 */
cg.Renderer.prototype._renderGroup = function (group, element) {
    var groupGroup = this._groupLayer.g();
    this._bindGraphData(group, groupGroup);
    groupGroup.addClass('group');
    this.render(group.children, element);
    var groupRect = groupGroup.rect(0, 0, group.size.x, group.size.y, this._config.group["border-radius"]);
    groupRect.addClass("background");
    groupRect.prependTo(groupGroup);
    var textMask = groupGroup.rect(this._config.group["padding"], 0, group.size.x - this._config.group["padding"] * 2, group.size.y);
    textMask.attr("fill", "white");
    var groupText = groupGroup.text(group.size.x / 2, this._config.group["heading"], group.name);
    groupText.attr({
        "text-anchor": "middle",
        "mask": textMask
    });
    groupText.addClass("title");
    group.on("change-parent", this._updateGroup.bind(this, group, groupGroup, groupRect));
    group.on("move", this._updateGroup.bind(this, group, groupGroup, groupRect));
    group.on("remove", function () {
        groupGroup.remove();
    });
    this._updateGroup(group, groupGroup, groupRect);
    this._dragNode(group, groupGroup);
    return groupGroup;
};

/**
 * Update the group position.
 * @param group
 * @param groupGroup
 * @param groupRect
 * @private
 */
cg.Renderer.prototype._updateGroup = function (group, groupGroup, groupRect) {
    groupGroup.appendTo(this._groupLayer);
    groupGroup.transform("T" + group.absolutePosition.toArray());
    groupRect.attr({
        width: group.size.x,
        height: group.size.y
    })
};