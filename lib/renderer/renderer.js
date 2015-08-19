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
        this._d3Svg = d3.select(svg);

        /**
         * The SVG point used for matrix transformations
         * @type {SVGPoint}
         */
        this._svgPoint = this._d3Svg.node().createSVGPoint();

        /**
         * The root group node of the renderer
         * @type {d3.selection}
         */
        this._d3Root = this._d3Svg.append("svg:g").attr("id", "cg-root");

        /**
         * The SVG group for the d3Groups
         * @type {d3.selection}
         */
        this._d3Groups = this._d3Root.append("svg:g").attr("id", "cg-groups");

        /**
         * The SVG connection for the d3Connections
         * @type {d3.selection}
         */
        this._d3Connections = this._d3Root.append("svg:g").attr("id", "cg-connections");

        /**
         * The SVG group for the d3Blocks
         * @type {d3.selection}
         */
        this._d3Block = this._d3Root.append("svg:g").attr("id", "cg-blocks");

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
         * The renderer connections
         * @type {Array<cg.RendererConnection>}
         * @private
         */
        this._rendererConnections = [];

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
         * The rendererBlocks quadtree
         * @type {d3.geom.quadtree}
         * @private
         */
        this._rendererBlocksQuadtree = null;

        /**
         * The rendererGroups quadtree
         * @type {d3.geom.quadtree}
         * @private
         */
        this._rendererGroupsQuadtree = null;

        /**
         * The rendererPoints quadtree
         * @type {d3.geom.quadtree}
         * @private
         */
        this._rendererPointsQuadtree = null;

        /**
         * Returns all d3Nodes (d3Blocks and d3Groups)
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Nodes", {
            get: function () {
                return this._d3Root.selectAll(".cg-block, .cg-group");
            }.bind(this)
        });

        /**
         * Returns all d3Blocks
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Blocks", {
            get: function () {
                return this._d3Block.selectAll(".cg-block");
            }.bind(this)
        });

        /**
         * Returns all d3Groups
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Groups", {
            get: function () {
                return this._d3Groups.selectAll(".cg-group");
            }.bind(this)
        });

        /**
         * Returns all d3Connections (d3Blocks and d3Groups)
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Connections", {
            get: function () {
                return this._d3Connections.selectAll(".cg-connection");
            }.bind(this)
        });

        /**
         * Returns all d3Blocks and d3Groups selected
         * @type {d3.selection}
         */
        Object.defineProperty(this, "d3Selection", {
            get: function () {
                return this._d3Root.selectAll(".cg-selected");
            }.bind(this)
        });

        /**
         * Returns all d3Blocks and d3Groups selected
         * Children are also added to selection even if they are not selected directly
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
     * Creates the cgGraph renderer
     */
    Renderer.prototype.initialize = function () {
        this._initialize();
        this._createSelectionBehavior();
        this._createZoomBehavior();
        this._createD3Blocks();
        this._createD3Connections();
        this._createD3Groups();
    };

    /**
     * Creates a rendererGroup from the current selection.
     * @returns {cg.RendererGroup}
     */
    Renderer.prototype.createGroupFromSelection = function (name) {
        var renderer = this;
        var rendererNodes = this.d3Selection.data();
        var rendererGroup = this._createRendererGroup({
            "id": cg.UUID.generate(),
            "description": name
        });
        pandora.forEach(rendererNodes, function (rendererNode) {
            renderer._removeRendererNodeParent(rendererNode);
            renderer._addRendererNodeParent(rendererNode, rendererGroup);
        });
        this._createD3Groups();
        this._updateD3Groups();
        return rendererGroup;
    };

    /**
     * Creates a rendererBlock from the given cgBlock.
     * @param cgBlock {cg.Block}
     * @returns {cg.RendererBlock}
     */
    Renderer.prototype.createRendererBlock = function (cgBlock) {
        var renderer = this;
        var rendererBlock = renderer._createRendererBlock({
            "id": cg.UUID.generate(),
            "cgBlock": cgBlock.cgId,
            "position": [100, 100],
            "size": [100, 100]
        });
        renderer._createD3Blocks();
        var d3Block = renderer._getD3NodesFromRendererNodes([rendererBlock]);
        renderer._positionRendererBlockBehavior(d3Block);
        return rendererBlock;
    };

    /**
     * Remove the current selection.
     */
    Renderer.prototype.removeSelection = function () {
        var renderer = this;
        pandora.forEach(this.d3Selection.data(), function (rendererNode) {
            renderer._removeRendererNode(rendererNode);
        });
        this._removeD3Blocks();
        this._removeD3Groups();
        this._removeD3Connections();
        this._updateD3Blocks();
        this._updateD3Groups();
    };

    return Renderer;

})();