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
            "padding": 10,
            "header": 30
        },
        "block": {
            "padding": 10,
            "header": 40
        },
        "point": {
            "height": 20,
            "radius": 3
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
         * The SVG point used for matrix transformations
         * @type {SVGPoint}
         */
        this._svgPoint = this._svg.node().createSVGPoint();

        /**
         * The root group node of the renderer
         * @type {d3.selection}
         */
        this._rootSvg = this._svg.append("svg:g").attr("id", "cg-root");

        /**
         * The SVG group for the d3Groups
         * @type {d3.selection}
         */
        this._groupsSvg = this._rootSvg.append("svg:g").attr("id", "cg-groups");

        /**
         * The SVG group for the d3Blocks
         * @type {d3.selection}
         */
        this._blocksSvg = this._rootSvg.append("svg:g").attr("id", "cg-blocks");

        /**
         * The cgGraph to render
         * @type {cg.Graph}
         */
        this._cgGraph = cgGraph;

        /**
         * The renderer blocks
         * @type {Array<cg.RendererBlock>}
         * @private
         */
        this._rendererBlocks = data.blocks;

        /**
         * The renderer groups
         * @type {Array<cg.RendererGroup>}
         * @private
         */
        this._rendererGroups = data.groups;

        /**
         * Association map from id to renderer block
         * @type {d3.map<String, cg.RendererBlock>}
         */
        this._rendererBlockIds = d3.map(data.blocks, function (rendererBlock) {
            return rendererBlock.id;
        });

        /**
         * Association map from id to renderer group
         * @type {d3.map<String, cg.RendererGroup>}
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
         * Returns all d3Nodes (d3Blocks and d3Groups)
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Nodes", {
            get: function () {
                return this._rootSvg.selectAll(".cg-block, .cg-group");
            }.bind(this)
        });

        /**
         * Returns all d3Blocks
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Blocks", {
            get: function () {
                return this._rootSvg.selectAll(".cg-block");
            }.bind(this)
        });

        /**
         * Returns all d3Groups
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Groups", {
            get: function () {
                return this._rootSvg.selectAll(".cg-group");
            }.bind(this)
        });

        /**
         * Returns all d3Blocks and d3Groups selected
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Selection", {
            get: function () {
                return this._rootSvg.selectAll(".cg-selected");
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
        this._createD3Blocks();
        this._createD3Groups();
        // TODO: Order groups to eliminate this second call
        this._createD3Groups();
        this._cgGraph.on("cg-block-create", function (cgBlock) {
            this._addCgBlock(cgBlock);
        }.bind(this));
        this._cgGraph.on("cg-block-remove", function (cgBlock) {
            this._removeCgBlock(cgBlock);
        }.bind(this));
    };

    /**
     * Initialize rendererGroups and rendererBlocks
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
