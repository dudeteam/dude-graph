/**
 * Render groups.
 * @private
 */
cg.Renderer.prototype._renderGroups = function () {
    var groups = this.getGroups();
    this._updateGroupMasks();
    this._createGroups(groups);
    this._updateGroups(groups);
    this._removeGroups(groups);
};

/**
 *
 * @private
 */
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

/**
 *
 * @param groups
 * @private
 */
cg.Renderer.prototype._createGroups = function (groups) {
    var createdGroups = groups
        .enter()
        .append("svg:g")
        .attr({
            "class": "group"
        });
    createdGroups
        .append("svg:rect")
        .attr({
            "class": "group-rect background"
        });
    createdGroups
        .append("svg:text")
        .attr({
            "class": "group-text title",
            "text-anchor": "middle",
            "mask": function (group) { return "url('#group-mask-" + group._id + "')"; }
        });
    createdGroups
        .call(this._renderDrag())
        .each(function (group) {
                group.on("move", renderer._updateGroups.bind(renderer, d3.select(this)));
        });
};

/**
 *
 * @param groups
 * @private
 */
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

/**
 *
 * @param groups
 * @private
 */
cg.Renderer.prototype._removeGroups = function (groups) {
    groups
        .exit()
        .remove();
};