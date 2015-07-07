/**
 * Render groups.
 * @private
 */
cg.Renderer.prototype._renderGroups = function(groups) {
    this._updateGroupMasks();
    this._createGroups(groups);
    this._heavyUpdateGroups(groups);
    this._removeGroups(groups);
};

/**
 * Update group masks to hide overflow in title.
 * @private
 */
cg.Renderer.prototype._updateGroupMasks = function() {
    var masks = this._svg
        .append("svg:defs")
        .selectAll(".group-text-mask")
        .data(this._graph.groups(), function(group) { return group._id; });
    masks
        .enter()
        .append("svg:mask")
        .attr({
            "id": function(group) { return "group-mask-" + group._id; },
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
            "width": function(group) { return group.size.x - this._config.group.padding * 2;}.bind(this),
            "height": function(group) { return group.size.y; }
        });
    masks
        .exit()
        .remove();
};

/**
 * Create groups.
 * @param groups {d3.selection}
 * @private
 */
cg.Renderer.prototype._createGroups = function(groups) {
    var renderer = this;
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
        .append("svg:rect")
        .attr({
            "fill": "lightblue",
            "fill-opacity": 0.5,
            "class": "group-handle bottom"
        });
    createdGroups
        .append("svg:text")
        .attr({
            "class": "group-text title",
            "text-anchor": "middle",
            "mask": function(group) { return "url('#group-mask-" + group._id + "')"; }
        });
    createdGroups
        .call(this._doubleClick())
        .call(this._renderDrag())
        .each(function(group) {
                group.on("move", renderer._lightUpdateGroups.bind(renderer, d3.select(this)));
                group.on("update", renderer._heavyUpdateGroups.bind(renderer, d3.select(this)));
                group.on("reorder", d3.selection.prototype.moveToFront.bind(d3.select(this)));
        });
};

/**
 * Update group position.
 * @param groups {d3.selection}
 * @private
 */
cg.Renderer.prototype._lightUpdateGroups = function(groups) {
    groups
        .attr("transform", function(group) { return "translate(" + group.absolutePosition.toArray() + ")"; });
};

/**
 * Update groups.
 * @param groups {d3.selection}
 * @private
 */
cg.Renderer.prototype._heavyUpdateGroups = function(groups) {
    groups
        .attr("transform", function(group) { return "translate(" + group.absolutePosition.toArray() + ")"; });
    groups
        .select(".group-rect")
        .attr({
            rx: this._config.group.borderRadius,
            ry: this._config.group.borderRadius,
            x: 0,
            y: 0,
            width: function(group) { return group.size.x; },
            height: function(group) { return group.size.y; }
        });
    groups
        .select(".group-handle.bottom")
        .attr({
            "cursor": "ns-resize",
            "x": function() { return 5; },
            "y": function(group) { return group.size.y - 5; },
            "width": function(group) { return group.size.x - 10; },
            "height": function() { return 10; }
        })
        .call(d3.behavior.drag()
            .origin(Object)
            .on("drag", function(d) {
                //if (isYChecked) {
                //    //Max x on the left is x - width
                //    //Max x on the right is width of screen + (dragbarw/2)
                //    var dragy = Math.max(d.y + (dragbarw/2), Math.min(h, d.y + height + d3.event.dy));
                //
                //    //recalculate width
                //    height = dragy - d.y;
                //
                //    //move the right drag handle
                //    dragbarbottom
                //        .attr("y", function(d) { return dragy - (dragbarw/2) });
                //
                //    //resize the drag rectangle
                //    //as we are only resizing from the right, the x coordinate does not need to change
                //    dragrect
                //        .attr("height", height);
                //    dragbarleft
                //        .attr("height", height - dragbarw);
                //    dragbarright
                //        .attr("height", height - dragbarw);
                //}
            }));
    groups
        .select(".group-text")
        .text(function(group) { return group.description; })
        .attr({
            x: function(group) { return group.size.x / 2; },
            y: this._config.group.heading
        });
};

/**
 * Remove groups.
 * @param groups {d3.selection}
 * @private
 */
cg.Renderer.prototype._removeGroups = function(groups) {
    groups
        .exit()
        .remove();
};