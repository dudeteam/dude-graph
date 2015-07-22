cg.Renderer = (function () {

    /**
     * Creates a new cg.Renderer from a DOM node and some graph data.
     * @extends {pandora.EventEmitter}
     * @constructor
     * @param svg The svg DOM Element on which the svg will be append
     * @param data The serialized renderer elements
     * @param cgGraph The graph that will be rendered
     */
    var Renderer = pandora.class_("Renderer", pandora.EventEmitter, function (svg, data, cgGraph) {
        pandora.EventEmitter.call(this);
        this._svg = d3.select(svg);
        this._root = this._svg.append("svg:g").attr("id", "cgRoot");
        this._data = data;
        this._cgGraph = cgGraph;

        /**
         * Returns all groups and blocks currently selected.
         * @type {d3.Array}
         */
        Object.defineProperty(this, "selection", {
            get: function () {
                return this._root.selectAll(".selected");
            }.bind(this)
        });
    });

    /**
     * Creates the svg nodes and  listen the graph's events in order to update the rendered svg graph.
     */
    Renderer.prototype.create = function () {
        this._createGroups();
        this._createBlocks();
    };

    Renderer.prototype._createGroups = function () {
        var currentGroup = this._root.append("svg:g").attr("id", "cgGroups")
            .selectAll(".cg-group")
            .data(this._data.cgGroups, function (cgGroup) {
                return cgGroup.cgId;
            })
            .enter()
            .append("svg:g")
                .attr("class", "cg-group")
                .attr("transform", function (cgGroup) { return "translate(" + cgGroup.cgPosition + ")"; })
                .call(this._createDragBehavior());
        currentGroup
            .append("svg:rect")
            .attr("rx", 5).attr("ry", 5)
            .attr("width", function (cgGroup) { return cgGroup.cgSize[0]; })
            .attr("height", function (cgGroup) { return cgGroup.cgSize[1]; });
        currentGroup
            .append("svg:text")
                .text(function (cgGroup) { return cgGroup.cgDescription; })
                .attr("class", "cg-title")
                .attr("text-anchor", "middle")
                .attr("transform", function (cgGroup) { return "translate(" + [cgGroup.cgSize[0] / 2, 15] + ")"; });
    };

    Renderer.prototype._createBlocks = function () {
        var renderer = this;
        var currentBlock = this._root.append("svg:g").attr("id", "cgBlocks")
            .selectAll(".cg-block")
            .data(this._data.cgBlocks, function (cgBlock) {
                return cgBlock.cgId;
            })
            .enter()
            .append("svg:g")
                .attr("class", "cg-block")
                .call(this._createDragBehavior());
        currentBlock
            .append("svg:rect")
                .attr("transform", function (block) { return "translate(" + block.cgPosition + ")"; })
                .attr("rx", 5).attr("ry", 5)
                .attr("width", function () { return 100; })
                .attr("height", function () { return 100; });
    };

    Renderer.prototype._createDragBehavior = function () {
        return d3.behavior.drag()
            .on("dragstart", function () {
                var node = d3.select(this);
                renderer._addToSelection(node, !d3.event.sourceEvent.shiftKey);
            });
    };

    /**
     * Adds the given `node` to the current selection.
     * @param node The svg `node` to select
     * @param clear {Boolean?} If true, everything but this `node` will be unselected
     * @private
     */
    Renderer.prototype._addToSelection = function (node, clear) {
        if (clear) {
            this._clearSelection();
        }
        node.classed("selected", true);
    };

    Renderer.prototype._clearSelection = function () {
        this.selection.classed("selected", false);
    };

    return Renderer;

})();
