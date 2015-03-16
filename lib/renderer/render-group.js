/**
 * Render the group.
 * @param group {cg.Group}
 * @param element {Element}
 * @private
 */
cg.Renderer.prototype._renderGroup = function (group, element) {
    var groupGroup = this._groupLayer.g();
    this._bindGraphData(group, groupGroup);
    groupGroup.addClass('group');
    this.render(group.children, element);
    var groupRect = groupGroup.rect(0, 0, 0, 0);
    groupRect.addClass("background");
    groupRect.prependTo(groupGroup);
    var textMask = groupGroup.rect(0, 0, 0, 0);
    textMask.attr("fill", "white");
    var groupText = groupGroup.text(0, 0, group.name);
    groupText.attr({
        "text-anchor": "middle",
        "mask": textMask
    });
    groupText.addClass("title");
    group.on("change-parent", this._updateGroup.bind(this, group, groupGroup, groupRect, groupText, textMask));
    group.on("move", this._updateGroup.bind(this, group, groupGroup, groupRect, groupText, textMask));
    group.on("remove", function () {
        groupGroup.remove();
    });
    this._updateGroup(group, groupGroup, groupRect, groupText, textMask);
    this._dragNode(group, groupGroup);
    return groupGroup;
};

/**
 * Update the group position.
 * @param group {cg.Group}
 * @param groupGroup {Element}
 * @param groupRect {Element}
 * @param groupText {Element}
 * @param textMask {Element}
 * @private
 */
cg.Renderer.prototype._updateGroup = function (group, groupGroup, groupRect, groupText, textMask) {
    groupGroup.appendTo(this._groupLayer);
    groupGroup.transform("T" + group.absolutePosition.toArray());
    groupRect.attr({
        width: group.size.x,
        height: group.size.y
    });
    textMask.attr({
        x: this._config.group["padding"],
        y: 0,
        width: group.size.x - this._config.group["padding"] * 2,
        height: group.size.y
    });
    groupText.attr({
        x: group.size.x / 2,
        y: this._config.group["heading"]
    })
};