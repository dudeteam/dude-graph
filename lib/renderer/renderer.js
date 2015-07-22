cg.Renderer = (function () {

    var RENDERER_CONFIG = {
        "zoom": {
            "min": 0.25,
            "max": 5
        }
    };

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
        this._createZoomBehavior();
        this._createGroups();
        this._createBlocks();
    };

    Renderer.prototype._createZoomBehavior = function () {
        var renderer = this;
        this._zoom = d3.behavior.zoom()
            .scaleExtent([RENDERER_CONFIG.zoom.min, RENDERER_CONFIG.zoom.max])
            .on("zoom", function () {
                if (d3.event.sourceEvent) {
                    pandora.preventCallback(d3.event.sourceEvent);
                }
                renderer._root.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                renderer._data.zoom.translate = renderer._zoom.translate();
                renderer._data.zoom.scale = renderer._zoom.scale();
            }.bind(this));
        this._svg.call(this._zoom);
    };

    Renderer.prototype._createGroups = function () {
        var currentGroup = this._root.append("svg:g").attr("id", "cgGroups")
            .selectAll(".cg-group")
            .data(this._data.groups, function (group) {
                return group.id;
            })
            .enter()
            .append("svg:g")
                .attr("class", "cg-group")
                .attr("transform", function (group) { return "translate(" + group.position + ")"; })
                .call(this._createDragBehavior());
        currentGroup
            .append("svg:rect")
            .attr("rx", 5).attr("ry", 5)
            .attr("width", function (group) { return group.size[0]; })
            .attr("height", function (group) { return group.size[1]; });
        currentGroup
            .append("svg:text")
                .text(function (group) { return group.description; })
                .attr("class", "cg-title")
                .attr("text-anchor", "middle")
                .attr("transform", function (group) { return "translate(" + [group.size[0] / 2, 15] + ")"; });
    };

    Renderer.prototype._createBlocks = function () {
        var currentBlock = this._root.append("svg:g").attr("id", "cgBlocks")
            .selectAll(".cg-block")
            .data(this._data.blocks, function (block) {
                return block.id;
            })
            .enter()
            .append("svg:g")
                .attr("class", "cg-block")
                .call(this._createDragBehavior());
        currentBlock
            .append("svg:rect")
                .attr("transform", function (block) { return "translate(" + block.position + ")"; })
                .attr("rx", 5).attr("ry", 5)
                .attr("width", function () { return 100; })
                .attr("height", function () { return 100; });
    };

    Renderer.prototype._createDragBehavior = function () {
        var renderer = this;
        return d3.behavior.drag()
            .on("dragstart", function () {
                var d3Node = d3.select(this);
                renderer._addToSelection(d3Node, !d3.event.sourceEvent.shiftKey);
            })
            .on("drag", function () {
                renderer.selection.each(function (node) {
                    node.position[0] += d3.event.dx;
                    node.position[1] += d3.event.dy;
                });
                renderer.selection.attr("transform", function (node) { return "translate(" + node.position + ")"; });
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

    /**
     * Unselect all the currently selected blocks and groups.
     * @private
     */
    Renderer.prototype._clearSelection = function () {
        this.selection.classed("selected", false);
    };

    return Renderer;

})();
