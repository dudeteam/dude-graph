/**
 * Creates d3Groups with the existing renderGroups
 */
dudeGraph.Renderer.prototype.createD3Groups = function () {
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
    this.updateD3Groups();
};

/**
 * Creates d3Groups with the existing renderGroups
 */
dudeGraph.Renderer.prototype.updateD3Groups = function () {
    this.d3Groups.each(function (renderGroup) {
        renderGroup.update();
    });
};

/**
 * Removes d3Groups when renderGroups are removed
 */
dudeGraph.Renderer.prototype.removeD3Groups = function () {
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