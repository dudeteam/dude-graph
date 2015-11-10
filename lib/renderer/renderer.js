//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * @constructor
 */
dudeGraph.Renderer = function () {
    /**
     * The graph to render
     * @type {dudeGraph.Graph}
     */
    this._graph = null;

    /**
     * Renderer configuration
     * @type {Object}
     * @private
     */
    this._config = null;

    /**
     * Renderer zoom information
     * @type {null}
     * @private
     */
    this._zoom = null;

    /**
     * The root SVG node of the renderer
     * @type {d3.selection}
     */
    this._d3Svg = null;

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
     * @type {Array<dudeGraph.RenderBlock>}
     * @private
     */
    this._renderBlocks = null;

    /**
     * The renderer groups
     * @type {Array<dudeGraph.RenderGroup>}
     * @private
     */
    this._renderGroups = null;

    /**
     * The renderer connections
     * @type {Array<dudeGraph.RenderConnection>}
     * @private
     */
    this._renderConnections = null;

    /**
     * The renderer block renderers
     * @type {d3.map<String, dudeGraph.RenderBlock>}
     * @private
     */
    this._renderBlockRenders = null;

    /**
     * Association map from id to render block
     * @type {d3.map<String, dudeGraph.RenderBlock>}
     * @private
     */
    this._renderBlockIds = null;

    /**
     * Association map from id to render group
     * @type {d3.map<String, dudeGraph.RenderGroup>}
     * @private
     */
    this._renderGroupIds = null;

    /**
     * The renderBlocks quadtree
     * @type {d3.geom.quadtree}
     * @private
     */
    this._renderBlocksQuadtree = null;

    /**
     * The renderGroups quadtree
     * @type {d3.geom.quadtree}
     * @private
     */
    this._renderGroupsQuadtree = null;

    /**
     * The renderPoints quadtree
     * @type {d3.geom.quadtree}
     * @private
     */
    this._renderPointsQuadtree = null;

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
};

/**
 * @extends {EventEmitter}
 */
dudeGraph.Renderer.prototype = _.create(EventEmitter.prototype, {
    "constructor": dudeGraph.Renderer
});

/**
 * Initializes the renderer
 * @param {dudeGraph.Graph} cgGraph
 * @param {SVGElement} svgElement
 * @param {Object?} config
 */
dudeGraph.Renderer.prototype.initialize = function (cgGraph, svgElement, config) {
    this._graph = cgGraph;
    this._d3Svg = d3.select(svgElement);
    this._d3Root = this._d3Svg.append("svg:g").attr("id", "dude-graph-renderer");
    this._d3Groups = this._d3Root.append("svg:g").attr("id", "dude-graph-groups");
    this._d3Connections = this._d3Root.append("svg:g").attr("id", "dude-graph-connections");
    this._d3Block = this._d3Root.append("svg:g").attr("id", "dude-graph-blocks");
    this._renderBlocks = [];
    this._renderGroups = [];
    this._renderConnections = [];
    this._renderBlockTypes = {
        "Block": dudeGraph.RenderBlock
    };
    this._renderBlockIds = {};
    this._renderGroupIds = {};
    this._renderBlocksQuadtree = null;
    this._renderGroupsQuadtree = null;
    this._renderPointsQuadtree = null;
    this._config = _.defaultsDeep(config || {}, dudeGraph.Renderer.defaultConfig);
};

/**
 * Registers a renderBlock
 * @param {String} renderBlockType
 * @param {dudeGraph.RenderBlock} rendererBlockConstructor
 */
dudeGraph.Renderer.prototype.registerRenderBlock = function (renderBlockType, renderBlockConstructor) {
    this._renderBlockTypes[renderBlockType] = renderBlockConstructor;
};