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
        "block": {
            "padding": 10,
            "header": 40,
            "size": [150, 100]
        },
        "group": {
            "padding": 10,
            "header": 30,
            "size": [200, 150]
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
         * Renderer initial data
         * @type {{config: Object, blocks: Array<Object>, groups: Array<Object>}}
         */
        this._data = data;

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
         * The SVG connection for the d3Connections
         * @type {d3.selection}
         */
        this._connectionsSvg = this._rootSvg.append("svg:g").attr("id", "cg-connections");

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
        this._rendererBlocks = [];

        /**
         * The renderer groups
         * @type {Array<cg.RendererGroup>}
         * @private
         */
        this._rendererGroups = [];

        /**
         * Association map from id to renderer block
         * @type {d3.map<String, cg.RendererBlock>}
         */
        this._rendererBlockIds = d3.map();

        /**
         * Association map from id to renderer group
         * @type {d3.map<String, cg.RendererGroup>}
         */
        this._rendererGroupIds = d3.map();

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
                return this._blocksSvg.selectAll(".cg-block");
            }.bind(this)
        });

        /**
         * Returns all d3Groups
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Groups", {
            get: function () {
                return this._groupsSvg.selectAll(".cg-group");
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
        this._createD3Connections();
        this._computeRendererGroupsPositionAndSize();
        this._createD3Groups();
        this._initializeListeners();
    };

    /**
     * Initializes rendererGroups and rendererBlocks
     * Add parent and children references, and also cgBlocks references to renderer blocks
     * @private
     */
    Renderer.prototype._initialize = function () {
        var renderer = this;
        pandora.forEach(this._data.blocks, function (rendererBlockData) {
            var rendererBlock = renderer._createRendererBlock(rendererBlockData);
        });
        pandora.forEach(this._data.groups, function (rendererGroupData) {
            renderer._createRendererGroup(rendererGroupData);
        });
        this._initializeParents();
    };

    /**
     * Initializes the parents of the rendererNodes
     * @private
     */
    Renderer.prototype._initializeParents = function () {
        var renderer = this;
        pandora.forEach(this._data.blocks, function (rendererBlockData) {
            var rendererBlock = renderer._getRendererBlockById(rendererBlockData.id);
            if (rendererBlockData.parent) {
                var rendererGroupParent = renderer._getRendererGroupById(rendererBlockData.parent);
                if (!rendererGroupParent) {
                    throw new cg.RendererError("Renderer::_initializeParents() Cannot find rendererBlock parent id {0}", rendererBlockData.parent);
                }
                renderer._addRendererNodeParent(rendererBlock, rendererGroupParent);
            }
        });
        pandora.forEach(this._data.groups, function (rendererGroupData) {
            var rendererGroup = renderer._getRendererGroupById(rendererGroupData.id);
            if (rendererGroupData.parent) {
                var rendererGroupParent = renderer._getRendererGroupById(rendererGroupData.parent);
                if (!rendererGroupParent) {
                    throw new cg.RendererError("Renderer::_initializeParents() Cannot find rendererGroup parent id {0}", rendererGroupData.parent);
                }
                renderer._addRendererNodeParent(rendererGroup, rendererGroupParent);
            }
        });
    };

    /**
     * Initialize the listeners to dynamically creates the rendererBlocks when a cgBlock is added
     * @private
     */
    Renderer.prototype._initializeListeners = function () {
        var renderer = this;
        this._cgGraph.on("cg-connection-create", function (cgConnection) {
            renderer._createD3Connections();
        });
        this._cgGraph.on("cg-block-create", function (cgBlock) {
            var rendererBlock = renderer._createRendererBlock({
                "id": cgBlock.cgId,
                "position": [100, 100],
                "size": [100, 100]
            });
            renderer._createD3Blocks();
            var d3Block = renderer._getD3NodesFromRendererNodes([rendererBlock]);
            renderer._createPlacementBehavior(d3Block);
        });
    };

    return Renderer;

})();