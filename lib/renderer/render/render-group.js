/**
 * Render groups.
 * @private
 */
cg.Renderer.prototype._renderGroups = function () {
    var groups = this._groupLayer
        .selectAll("g")
        .data(this._graph.groups());

    this._updateGroupMasks();
    this._createGroups(groups);
    this._updateGroups(groups);
    this._removeGroups(groups);
};

cg.Renderer.prototype._updateGroupMasks = function() {
    var masks = this._svg
        .append("svg:defs")
        .selectAll(".group-text-mask")
        .data(this._graph.groups());
    masks
        .enter()
        .append("svg:mask")
        .attr({
            "id": function (group) { return "group-mask-" + group._id; },
            "class": "group-text-mask"
        })
        .append("svg:rect")
        .attr({
            "fill": "white"
        });
    masks
        .select("rect")
        .attr({
            "x": this._config.group.padding,
            "y": 0,
            "width": function (group) { return group.size.x - this._config.group.padding * 2;}.bind(this),
            "height": function (group) { return group.size.y; }
        });
    masks
        .exit()
        .remove();
};

cg.Renderer.prototype._createGroups = function (groups) {
    var group = groups
        .enter()
        .append("svg:g")
        .attr({
            "class": "group"
        });
    group
        .append("svg:rect")
        .attr({
            "class": "group-rect background"
        });
    group
        .append("svg:text")
        .attr({
            "class": "group-text title",
            "text-anchor": "middle",
            "mask": function (group) { return "url('#group-mask-" + group._id + "')"; }
        });
};

cg.Renderer.prototype._updateGroups = function (groups) {
    groups
        .attr("transform", function (group) { return "translate(" + group.absolutePosition.toArray() + ")" });
    groups
        .select(".group-rect")
        .attr({
            rx: this._config.group.borderRadius,
            ry: this._config.group.borderRadius,
            x: 0,
            y: 0,
            width: function (group) { return group.size.x; },
            height: function (group) { return group.size.y; }
        });
    groups
        .select(".group-text")
        .text(function (group) { return group.name; })
        .attr({
            x: function (group) { return group.size.x / 2; },
            y: this._config.group["heading"]
        });
};

cg.Renderer.prototype._removeGroups = function (groups) {
    groups
        .exit()
        .remove();
};