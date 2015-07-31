cg.Renderer = (function () {

    /**
     * Default renderer configuration
     * @type {{zoom: {min: number, max: number}}}
     */
    var DEFAULT_RENDERER_CONFIG = {
        "zoom": {
            "min": 0.25,
            "max": 5
        },
        "group": {
            "margin": 32
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
         * Renderer configuration
         * @type {{zoom: {min: Number, max: Number}}}
         * @private
         */
        this._config = pandora.mergeObjects(data.config, DEFAULT_RENDERER_CONFIG, true, true);

        /**
         * The root SVG node of the renderer
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
         * The SVG point used for matrix transformations
         * @type {SVGPoint}
         */
        this._svgPoint = this._svg.node().createSVGPoint();

        /**
         * The cgGraph to render
         * @type {cg.Graph}
         */
        this._cgGraph = cgGraph;

        /**
         * The renderer blocks
         * @type {Array<{id: String, type: "block", parent: {type: "group"}|null, cgBlock: cg.Block, position: [Number, Number]}>}
         * @private
         */
        this._rendererBlocks = data.blocks;

        /**
         * The renderer groups
         * @type {Array<{id: String, type: "group", parent: {type: "group"}|null, position: [Number, Number]}>}
         * @private
         */
        this._rendererGroups = data.groups;

        /**
         * Association map from id to renderer block
         * @type {d3.map<String, {id: String, type: "block", parent: {type: "group"}|null, cgBlock: cg.Block, position: [Number, Number]}>}
         */
        this._rendererBlockIds = d3.map(data.blocks, function (rendererBlock) {
            return rendererBlock.id;
        });

        /**
         * Association map from id to renderer group
         * @type {d3.map<String, {id: String, type: "group", parent: {type: "group"}|null, position: [Number, Number]}>}
         */
        this._rendererGroupIds = d3.map(data.groups, function (rendererGroup) {
            return rendererGroup.id;
        });

        /**
         * The renderer nodes quadtree
         * @type {d3.geom.quadtree}
         * @private
         */
        this._rendererNodesQuadtree = null;

        /**
         * Returns all d3Blocks and d3Groups
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Nodes", {
            get: function () {
                return this._rootSvg.selectAll(".cg-block, .cg-group");
            }.bind(this)
        });

        /**
         * Returns all d3Blocks and d3Groups selected
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Selection", {
            get: function () {
                return this._rootSvg.selectAll(".selected");
            }.bind(this)
        });

        /**
         * Returns all d3Blocks and d3Groups selected
         * Groups children are also added to selection even if they are not selected directly
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3GroupedSelection", {
            get: function () {
                var selectedRendererNodes = [];
                this.d3Selection.each(function (rendererNode) {
                    (function recurseGroupSelection(rendererNode) {
                        selectedRendererNodes.push(rendererNode);
                        if (rendererNode.type === "group") {
                            pandora.forEach(rendererNode.children, function (childRendererNode) {
                                recurseGroupSelection(childRendererNode);
                            });
                        }
                    })(rendererNode);
                });
                return this._getD3NodesFromRendererNodes(selectedRendererNodes);
            }.bind(this)
        });
    });

    /**
     * Creates the svg nodes and listen the graph's events in order to update the rendered svg graph.
     */
    Renderer.prototype.initialize = function () {
        this._initialize();
        this._createSelectionBehavior();
        this._createZoomBehavior();
        this._createRendererBlocks();
        this._createRendererGroups();
        // TODO: Order groups to eliminate this second call
        this._createRendererGroups();
        this._cgGraph.on("cg-block-create", function (cgBlock) {
            this._addCgBlock(cgBlock);
        }.bind(this));
        this._cgGraph.on("cg-block-remove", function (cgBlock) {
            this._removeCgBlock(cgBlock);
        }.bind(this));
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
                (function checkRecursiveChild(children) {
                    pandora.forEach(children, function (checkChild) {
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
        pandora.forEach(this._rendererBlocks, function (block) {
            block.type = "block";
            if (block.group) {
                var parent = this._rendererGroupIds.get(block.group);
                if (!parent) {
                    throw new cg.RendererError("Renderer::_initialize() Cannot find parent `{0}` for block `{1}`", block.group, block.id);
                }
                block.parent = parent;
                block.cgBlock = this._cgGraph.blockById(block.id);
                addChildToGroup(parent, block);
            }
        }.bind(this));
        pandora.forEach(this._rendererGroups, function (rendererGroup) {
            rendererGroup.type = "group";
            if (rendererGroup.group) {
                var parent = this._rendererGroupIds.get(rendererGroup.group);
                if (!parent) {
                    throw new cg.RendererError("Renderer::_initialize() Cannot find parent `{0}` for group `{1}`", rendererGroup.group, rendererGroup.id);
                }
                rendererGroup.parent = parent;
                addChildToGroup(parent, rendererGroup);
            }
        }.bind(this));
        pandora.forEach(this._cgGraph.cgBlocks, function (cgBlock) {
            if (!this._rendererBlockIds.has(cgBlock.cgId)) {
                throw new cg.RendererError("Renderer::_initialize() cgBlock `{0}` is not bound to the renderer", cgBlock.cgId);
            }
        }.bind(this));
    };

    return Renderer;

})();
