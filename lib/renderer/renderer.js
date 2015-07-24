cg.Renderer = (function () {

    /**
     *
     * @type {{zoom: {min: number, max: number}}}
     */
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
     * @param svg The svg DOM Element on which the svg will be attached
     * @param data The serialized renderer elements
     * @param cgGraph The graph that will be rendered
     */
    var Renderer = pandora.class_("Renderer", pandora.EventEmitter, function (svg, data, cgGraph) {
        pandora.EventEmitter.call(this);

        /**
         * @type {d3.selection}
         */
        this._svg = d3.select(svg);

        /**
         * @type {d3.selection}
         */
        this._root = this._svg.append("svg:g").attr("id", "cgRoot");

        /**
         * @type {cg.Graph}
         */
        this._cgGraph = cgGraph;

        /**
         *
         * @type {Object}
         * @private
         */
        this._config = data.config;

        /**
         *
         * @type {Array<{type: "group"}>}
         * @private
         */
        this._groups = data.groups;

        /**
         *
         * @type {Array<{type: "block"}>}
         * @private
         */
        this._blocks = data.blocks;

        /**
         * @type {d3.map<String, {type: "group"}>}
         */
        this._groupIds = d3.map(data.groups, function (group) {
            return group.id;
        });

        /**
         * @type {d3.map<String, {type: "block"}>}
         */
        this._blockIds = d3.map(data.blocks, function (block) {
            return block.id;
        });

        var addChildToGroup = function (group, child) {
            if (!group.children) {
                group.children = d3.set();
            }
            group.children.add(child);
        };

        // Set references to parent
        this._groups.forEach(function (group) {
            group.type = "group";
            if (group.group) {
                var parent = this._groupIds.get(group.group);
                if (!parent) {
                    throw new cg.RendererError("Renderer() Cannot find parent `{0}` for group `{1}`", group.group, group.id);
                }
                group.parent = parent;
                addChildToGroup(parent, group);
            }
        }.bind(this));

        // Set references to parent
        this._blocks.forEach(function (block) {
            block.type = "block";
            if (block.group) {
                var parent = this._groupIds.get(block.group);
                if (!parent) {
                    throw new cg.RendererError("Renderer() Cannot find parent `{0}` for block `{1}`", block.group, block.id);
                }
                block.parent = parent;
                addChildToGroup(parent, block);
            }
        }.bind(this));

        /**
         * Returns all groups and blocks currently selected.
         * @type {d3.selection}
         */
        Object.defineProperty(this, "selection", {
            get: function () {
                return this._root.selectAll(".selected");
            }.bind(this)
        });
    });

    /**
     * Creates the svg nodes and listen the graph's events in order to update the rendered svg graph.
     */
    Renderer.prototype.create = function () {
        this._createZoomBehavior();
        this._createGroups();
        this._createBlocks();
    };

    /**
     * Create zoom and pan
     * @private
     */
    Renderer.prototype._createZoomBehavior = function () {
        var renderer = this;
        this._zoom = d3.behavior.zoom()
            .scaleExtent([RENDERER_CONFIG.zoom.min, RENDERER_CONFIG.zoom.max])
            .on("zoom", function () {
                if (d3.event.sourceEvent) {
                    pandora.preventCallback(d3.event.sourceEvent);
                }
                renderer._root.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                renderer._config.zoom.translate = renderer._zoom.translate();
                renderer._config.zoom.scale = renderer._zoom.scale();
            }.bind(this));
        this._svg.call(this._zoom);
    };

    /**
     * Create the groups
     * @private
     */
    Renderer.prototype._createGroups = function () {
        var currentGroup = this._root.append("svg:g").attr("id", "cgGroups")
            .selectAll(".cg-group")
            .data(this._groups, function (group) {
                return group.id;
            })
            .enter()
            .append("svg:g")
            .attr("class", "cg-group")
            .attr("transform", function (cgGroup) {
                return "translate(" + cgGroup.position + ")";
            })
            .call(this._createDragBehavior());
        currentGroup
            .append("svg:rect")
            .attr("rx", 5).attr("ry", 5)
            .attr("width", function (cgGroup) {
                return cgGroup.size[0];
            })
            .attr("height", function (cgGroup) {
                return cgGroup.size[1];
            });
        currentGroup
            .append("svg:text")
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
     *
     * @private
     */
    Renderer.prototype._createBlocks = function () {
        var currentBlock = this._root.append("svg:g").attr("id", "cgBlocks")
            .selectAll(".cg-block")
            .data(this._blocks, function (block) {
                return block.id;
            })
            .enter()
            .append("svg:g")
            .attr("class", "cg-block")
            .attr("transform", function (block) {
                return "translate(" + block.position + ")";
            })
            .call(this._createDragBehavior());
        currentBlock
            .append("svg:rect")
            .attr("rx", 5).attr("ry", 5)
            .attr("width", function () {
                return 100;
            })
            .attr("height", function () {
                return 100;
            });
    };

    /**
     *
     * @returns {d3.behavior.drag}
     * @private
     */
    Renderer.prototype._createDragBehavior = function () {
        var renderer = this;
        return d3.behavior.drag()
            .on("dragstart", function () {
                d3.event.sourceEvent.stopPropagation();
                var d3Node = d3.select(this);
                renderer._addToSelection(d3Node, !d3.event.sourceEvent.shiftKey);
            })
            .on("drag", function () {
                renderer.selection.each(function (node) {
                    node.position[0] += d3.event.dx;
                    node.position[1] += d3.event.dy;
                });
                renderer.selection.attr("transform", function (node) {
                    return "translate(" + node.position + ")";
                });
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
     * Clears the selection
     * @private
     */
    Renderer.prototype._clearSelection = function () {
        this.selection.classed("selected", false);
    };

    return Renderer;

})();
