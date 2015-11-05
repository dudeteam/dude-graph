//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Creates a new dudeGraph.Renderer from a DOM node and some graph data.
 * @param {SVGElement} svgElement - The svg DOM Element on which the svg will be attached
 * @extends {pandora.EventEmitter}
 * @constructor
 */
dudeGraph.Renderer = function (svgElement) {
    pandora.EventEmitter.call(this);

    /**
     * The cgGraph to render
     * @type {dudeGraph.Graph}
     */
    this._cgGraph = null;

    /**
     * Renderer configuration
     * @type {Object}
     * @private
     */
    this._config = dudeGraph.Renderer.defaultConfig;

    /**
     * Renderer zoom information
     * @type {null}
     * @private
     */
    this._zoom = dudeGraph.Renderer.defaultZoom;

    /**
     * The root SVG node of the renderer
     * @type {d3.selection}
     */
    this._d3Svg = d3.select(svgElement);

    /**
     * The SVG point used for matrix transformations
     * @type {SVGPoint}
     */
    this._svgPoint = null;

    /**
     * The root group node of the renderer
     * @type {d3.selection}
     */
    this._d3Root = null;

    /**
     * The SVG group for the d3Groups
     * @type {d3.selection}
     */
    this._d3Groups = null;

    /**
     * The SVG connection for the d3Connections
     * @type {d3.selection}
     */
    this._d3Connections = null;

    /**
     * The SVG group for the d3Blocks
     * @type {d3.selection}
     */
    this._d3Block = null;

    /**
     * The renderer blocks
     * @type {Array<dudeGraph.RendererBlock>}
     * @private
     */
    this._rendererBlocks = null;

    /**
     * The renderer groups
     * @type {Array<dudeGraph.RendererGroup>}
     * @private
     */
    this._rendererGroups = null;

    /**
     * The renderer connections
     * @type {Array<dudeGraph.RendererConnection>}
     * @private
     */
    this._rendererConnections = null;

    /**
     * Association map from id to renderer block
     * @type {d3.map<String, dudeGraph.RendererBlock>}
     */
    this._rendererBlockIds = null;

    /**
     * Association map from id to renderer group
     * @type {d3.map<String, dudeGraph.RendererGroup>}
     */
    this._rendererGroupIds = null;

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
            return this._d3Root.selectAll(".dude-graph-block, .dude-graph-group");
        }.bind(this)
    });

    /**
     * Returns all d3Blocks
     * @type {d3.selection}
     */
    Object.defineProperty(this, "d3Blocks", {
        get: function () {
            return this._d3Block.selectAll(".dude-graph-block");
        }.bind(this)
    });

    /**
     * Returns all d3Groups
     * @type {d3.selection}
     */
    Object.defineProperty(this, "d3Groups", {
        get: function () {
            return this._d3Groups.selectAll(".dude-graph-group");
        }.bind(this)
    });

    /**
     * Returns all d3Connections
     * @type {d3.selection}
     */
    Object.defineProperty(this, "d3Connections", {
        get: function () {
            return this._d3Connections.selectAll(".dude-graph-connection");
        }.bind(this)
    });

    /**
     * Returns all d3Blocks and d3Groups selected
     * @type {d3.selection}
     */
    Object.defineProperty(this, "d3Selection", {
        get: function () {
            return this._d3Root.selectAll(".dude-graph-selected");
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
                        _.forEach(rendererNode.children, function (childRendererNode) {
                            recurseGroupSelection(childRendererNode);
                        });
                    }
                })(rendererNode);
            });
            return this._getD3NodesFromRendererNodes(selectedRendererNodes);
        }.bind(this)
    });
};

/**
 * @extends {pandora.EventEmitter}
 */
dudeGraph.Renderer.prototype = _.create(pandora.EventEmitter.prototype, {
    "constructor": dudeGraph.Renderer
});

/**
 * Default renderer configuration
 * @type {Object}
 */
dudeGraph.Renderer.defaultConfig = {
    "zoom": {
        "min": 0.25,
        "max": 5,
        "transitionSpeed": 500
    },
    "block": {
        "padding": 10,
        "header": 40,
        "size": [80, 100]
    },
    "group": {
        "padding": 10,
        "header": 30,
        "size": [200, 150]
    },
    "point": {
        "height": 20,
        "radius": 3,
        "offset": 20
    }
};

/**
 * Default renderer zoom
 * @type {Object}
 */
dudeGraph.Renderer.defaultZoom = {
    "translate": [0, 0],
    "scale": 1
};