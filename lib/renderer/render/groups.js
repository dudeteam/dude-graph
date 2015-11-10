/**
 * Creates d3Groups with the existing renderGroups
 * @private
 */
dudeGraph.Renderer.prototype._createD3Groups = function () {
    this.d3Groups
        .data(this._renderGroups, function (renderGroup) {
            return renderGroup.nodeId;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (renderGroup) {
            return renderGroup.nodeId;
        })
        .classed("dude-graph-group", true)
        .each(function (renderGroup) {
        renderGroup.create(d3.select(this));
    });
    this._updateD3Groups();
};

/**
 * Creates d3Groups with the existing renderGroups
 * @private
 */
dudeGraph.Renderer.prototype._updateD3Groups = function () {
    this.d3Groups.each(function (renderGroup) {
        renderGroup.update();
    });
};

/**
 * Removes d3Groups when renderGroups are removed
 * @private
 */
dudeGraph.Renderer.prototype._removeD3Groups = function () {
    this.d3Groups
        .data(this._renderGroups, function (renderGroup) {
            return renderGroup.nodeId;
        })
        .exit()
        .each(function (renderGroup) {
            renderGroup.remove();
        })
        .remove();
};