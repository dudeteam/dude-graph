cg.Renderer = (function () {

    /**
     * Default renderer configuration
     * @type {{zoom: {min: number, max: number}}}
     */
    var DEFAULT_RENDERER_CONFIG = {
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
    var Renderer = pandora.class_("Renderer", pandora.EventEmitter, function (svg, cgGraph, data) {
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
        this._config = pandora.mergeObjects(data.config, DEFAULT_RENDERER_CONFIG, true, true);

        /**
         * The renderer groups
         * @type {Array<{id: String, type: "group", parent: {type: "group"}|null, position: [Number, Number]}>}
         * @private
         */
        this._rendererGroups = data.groups;

        /**
         * The renderer blocks
         * @type {Array<{id: String, type: "block", parent: {type: "group"}|null, cgBlock: cg.Block, position: [Number, Number]}>}
         * @private
         */
        this._rendererBlocks = data.blocks;

        /**
         * Association map from id to renderer group
         * @type {d3.map<String, {id: String, type: "group", parent: {type: "group"}|null, position: [Number, Number]}>}
         */
        this._rendererGroupIds = d3.map(data.groups, function (group) {
            return group.id;
        });

        /**
         * Association map from id to renderer block
         * @type {d3.map<String, {id: String, type: "block", parent: {type: "group"}|null, cgBlock: cg.Block, position: [Number, Number]}>}
         */
        this._rendererBlockIds = d3.map(data.blocks, function (block) {
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

        /**
         * Returns all groups and blocks currently selected, with groups children
         * @type {d3.selection}
         */
        Object.defineProperty(this, "groupedSelection", {
            get: function () {
                var renderer = this;
                var groupedSelection = d3.set();
                this.selection.each(function (rendererNode) {
                    (function handleGroupSelection(rendererNode) {
                        groupedSelection.add(renderer._getUniqueElementId(rendererNode, true));
                        if (rendererNode.type === "group") {
                            rendererNode.children.forEach(function (childNode) {
                                handleGroupSelection(childNode);
                            });
                        }
                    })(rendererNode);
                });
                return d3.selectAll(groupedSelection.values().join(", "));
            }.bind(this)
        });
    });

    /**
     * Creates the svg nodes and listen the graph's events in order to update the rendered svg graph.
     */
    Renderer.prototype.initialize = function () {
        this._initialize();
        this._createZoomBehavior();
        this._createRendererGroups();
        this._createRendererBlocks();
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
     * Initialize renderer groups and blocks
     * Add parent and children references, and also cgBlocks references to renderer blocks
     * @private
     */
    Renderer.prototype._initialize = function () {
        var addChildToGroup = function (group, child) {
            if (!group.children) {
                group.children = [];
            }
            if (child.children) {
                // Check if the group is not a child of the child we want to add to this group
                (function checkRecursiveChild(children) {
                    children.forEach(function (checkChild) {
                        if (checkChild === group) {
                            throw new cg.RendererError("Renderer::_initialize() Cannot have recursive children");
                        }
                        if (checkChild.children) {
                            checkRecursiveChild(checkChild.children);
                        }
                    });
                })(child.children);
            }
            group.children.push(child);
        };
        this._rendererGroups.forEach(function (group) {
            group.type = "group";
            if (group.group) {
                var parent = this._rendererGroupIds.get(group.group);
                if (!parent) {
                    throw new cg.RendererError("Renderer::_initialize() Cannot find parent `{0}` for group `{1}`", group.group, group.id);
                }
                group.parent = parent;
                addChildToGroup(parent, group);
            }
        }.bind(this));
        this._rendererBlocks.forEach(function (block) {
            block.type = "block";
            if (block.group) {
                var parent = this._rendererGroupIds.get(block.group);
                if (!parent) {
                    throw new cg.RendererError("Renderer::initialize() Cannot find parent `{0}` for block `{1}`", block.group, block.id);
                }
                block.parent = parent;
                block.cgBlock = this._cgGraph.blockById(block.id);
                addChildToGroup(parent, block);
            }
        }.bind(this));
        pandora.forEach(this._cgGraph.cgBlocks, function (cgBlock) {
            if (!this._rendererBlockIds.has(cgBlock.cgId)) {
                throw new cg.RendererError("Renderer::initialize() cgBlock `{0}` is not bound to the renderer", cgBlock.cgId);
            }
        }.bind(this));
    };

    return Renderer;

})();
