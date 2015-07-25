/**
 * Create the groups
 * @private
 */
cg.Renderer.prototype._createGroups = function () {
    var createdGroups = this._groupsSvg
        .selectAll(".cg-group")
        .data(this._groups, function (group) {
            return group.id;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (group) {
            return "cg-group-" + group.id;
        })
        .attr("class", "cg-group")
        .call(this._createDragBehavior());
    createdGroups
        .append("svg:rect");
    createdGroups
        .append("svg:text");
    this._updateGroups();
};

/**
 * Update the groups
 * @private
 */
cg.Renderer.prototype._updateGroups = function () {
    var updatedGroups = this._groupsSvg
        .selectAll(".cg-group");
    updatedGroups
        .select("g")
        .attr("transform", function (cgGroup) {
            return "translate(" + cgGroup.position + ")";
        });
    updatedGroups
        .select("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("width", function (cgGroup) {
            return cgGroup.size[0];
        })
        .attr("height", function (cgGroup) {
            return cgGroup.size[1];
        });
    updatedGroups
        .select("text")
        .text(function (cgGroup) {
            return cgGroup.description;
        })
        .attr("class", "cg-title")
        .attr("text-anchor", "middle")
        .attr("transform", function (cgGroup) {
            return "translate(" + [cgGroup.size[0] / 2, 15] + ")";
        });
};

/**
 * Remove the groups
 * @private
 */
cg.Renderer.prototype._removeGroups = function () {
    var removedGroups = this._groupsSvg
        .selectAll(".cg-group")
        .exit()
        .remove();
};