cg.Renderer = (function () {

    /**
     * Default renderer configuration
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
         * Thr root SVG node of the renderer
         * @type {d3.selection}
         */
        this._svg = d3.select(svg);

        /**
         * The root group node of the renderer
         * @type {d3.selection}
         */
        this._rootSvg = this._svg.append("svg:g").attr("id", "cgRoot");

        /**
         * The SVG group for the cgGroups
         * @type {d3.selection}
         */
        this._groupsSvg = this._rootSvg.append("svg:g").attr("id", "cgGroups");

        /**
         * The SVG group for the cgBlocks
         * @type {d3.selection}
         */
        this._blocksSvg = this._rootSvg.append("svg:g").attr("id", "cgBlocks");

        /**
         * The cgGraph to render
         * @type {cg.Graph}
         */
        this._cgGraph = cgGraph;

        /**
         * Renderer configuration
         * @type {{zoom: {min: Number, max: Number}}}
         * @private
         */
        this._config = data.config;

        /**
         * The renderer groups
         * @type {Array<{id: String, type: "group", parent: {type: "group"}|null, position: [Number, Number]}>}
         * @private
         */
        this._groups = data.groups;

        /**
         * The renderer blocks
         * @type {Array<{id: String, type: "block", parent: {type: "group"}|null, cgBlock: cg.Block, position: [Number, Number]}>}
         * @private
         */
        this._blocks = data.blocks;

        /**
         * Association map from id to renderer group
         * @type {d3.map<String, {id: String, type: "group", parent: {type: "group"}|null, position: [Number, Number]}>}
         */
        this._groupIds = d3.map(data.groups, function (group) {
            return group.id;
        });

        /**
         * Association map from id to renderer block
         * @type {d3.map<String, {id: String, type: "block", parent: {type: "group"}|null, cgBlock: cg.Block, position: [Number, Number]}>}
         */
        this._blockIds = d3.map(data.blocks, function (block) {
            return block.id;
        });

        /**
         * Returns all groups and blocks currently selected.
         * @type {d3.selection}
         */
        Object.defineProperty(this, "selection", {
            get: function () {
                return this._rootSvg.selectAll(".selected");
            }.bind(this)
        });
    });

    /**
     * Creates the svg nodes and listen the graph's events in order to update the rendered svg graph.
     */
    Renderer.prototype.initialize = function () {
        this._initialize();
        this._createZoomBehavior();
        this._createGroups();
        this._createBlocks();
        this._cgGraph.on("cg-block-create", function (cgBlock) {
            this._addCgBlock(cgBlock);
        }.bind(this));
        this._cgGraph.on("cg-block-remove", function (cgBlock) {
            this._removeCgBlock(cgBlock);
        }.bind(this));
        // Helper to remove the selected blocks
        window.removeSelectedBlocks = function () {
            this.selection.each(function (node) {
                if (node.type === "block") {
                    this._cgGraph.removeBlock(node.cgBlock);
                }
            }.bind(this));
        }.bind(this);
        // Helper to add a new cgBlock
        window.addBlock = function() {
            this._cgGraph.addBlock(new cg.Block(this._cgGraph, {"cgId": cg.UUID.generate(), "cgName": "Unknown name"}));
        }.bind(this);
    };

    /**
     * Initialize groups and blocks
     * Add parent and children references, and also cgBlocks references
     * @private
     */
    Renderer.prototype._initialize = function () {
        var addChildToGroup = function (group, child) {
            if (!group.children) {
                group.children = d3.set();
            }
            group.children.add(child);
        };
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
        this._blocks.forEach(function (block) {
            block.type = "block";
            if (block.group) {
                var parent = this._groupIds.get(block.group);
                if (!parent) {
                    throw new cg.RendererError("Renderer::initialize() Cannot find parent `{0}` for block `{1}`", block.group, block.id);
                }
                block.parent = parent;
                block.cgBlock = this._cgGraph.blockById(block.id);
                addChildToGroup(parent, block);
            }
        }.bind(this));
        pandora.forEach(this._cgGraph.cgBlocks, function (cgBlock) {
            if (!this._blockIds.has(cgBlock.cgId)) {
                throw new cg.RendererError("Renderer::initialize() cgBlock `{0}` is not bound to the renderer", cgBlock.cgId);
            }
        }.bind(this));
    };

    /**
     * Creates zoom and pan
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
                renderer._rootSvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                renderer._config.zoom.translate = renderer._zoom.translate();
                renderer._config.zoom.scale = renderer._zoom.scale();
            }.bind(this));
        this._svg.call(this._zoom);
    };

    /**
     * Creates the drag and drop behavior
     * @returns {d3.behavior.drag}
     * @private
     */
    Renderer.prototype._createDragBehavior = function () {
        var renderer = this;
        return d3.behavior.drag()
            .on("dragstart", function () {
                var d3Node = d3.select(this);
                d3.event.sourceEvent.stopPropagation();
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
