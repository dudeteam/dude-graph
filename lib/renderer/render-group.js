var GROUP_HEADING = 20;

/**
 *
 * @param group {cg.Group}
 * @param element {Object}
 * @private
 */
cg.Renderer.prototype._renderGroup = function (group, element) {
    var groupGroup = element.g();
    this._dataBinding(group, groupGroup);
    groupGroup.addClass('group');
    group.children.forEach(function (node) {
        this.render(node, groupGroup);
    }.bind(this));
    var groupRect = groupGroup.rect(0, 0, group.size.x, group.size.y);
    groupRect.prependTo(groupGroup);
    var groupText = groupGroup.text(group.size.x / 2, GROUP_HEADING, group.name);
    groupText.attr("text-anchor", "middle");
    groupText.addClass("title");
    this._updateGroup(group, groupGroup);
    this._dragGroup(group, groupGroup);
    return groupGroup;
};

/**
 * Drag the group around.
 * @param group {cg.Group}
 * @param groupGroup {Element}
 * @private
 */
cg.Renderer.prototype._dragGroup = function (group, groupGroup) {
    groupGroup.drag(
        function onmove(dx, dy) {
            group.position.x = dx + groupGroup.data("cg.originTransform").x;
            group.position.y = dy + groupGroup.data("cg.originTransform").y;
            group.forEachChild(function (node) {
                node.emit("move");
            });
            group.emit("move");
            this._updateGroup(group, groupGroup);
        }.bind(this),
        function onstart(x, y, e) {
            cg.preventCallback(e);
            var graph = this._getNode(this._rootElement);
            if (group.parent !== graph) {
                group.changeParent(graph);
            }
            this._attachRootElement(groupGroup);
            this._updateGroup(group, groupGroup);
            groupGroup.data("cg.originTransform", group.position.clone());
        }.bind(this),
        function onend() {
            var items = this._rootElement.selectAll(".group").items;
            for (var i = items.length - 1; i >= 0; --i) {
                var node = this._getNode(items[i]);
                if (group !== node && cg.boxesCollide(group.box, node.box)) {
                    console.log("C'est le bon groupe <3");
                }
            }
        }.bind(this)
    );
};

/**
 * Update the group position.
 * @param group
 * @param groupGroup
 * @private
 */
cg.Renderer.prototype._updateGroup = function (group, groupGroup) {
    groupGroup.transform("T" + group.position.toArray());
};