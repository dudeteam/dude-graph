//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * @class
 * @extends {EventEmitter}
 */
dudeGraph.Renderer = function () {
    /**
     * The graph to render
     * @type {dudeGraph.Graph}
     * @private
     */
    this._graph = null;
    Object.defineProperty(this, "graph", {
        get: function () {
            return this._graph;
        }.bind(this)
    });

    /**
     * Renderer configuration
     * @type {Object}
     * @private
     */
    this._config = null;
    Object.defineProperty(this, "config", {
        get: function () {
            return this._config;
        }.bind(this)
    });

    /**
     * Renderer zoom information
     * @type {null}
     * @private
     */
    this._zoom = null;

    /**
     * The root SVG node of the renderer
     * @type {d3.selection}
     * @private
     */
    this._d3Svg = null;

    /**
     * The root group node of the renderer
     * @type {d3.selection}
     * @private
     */
    this._d3Root = null;

    /**
     * The SVG group for the d3Groups
     * @type {d3.selection}
     * @private
     */
    this._d3Groups = null;

    /**
     * The SVG connection for the d3Connections
     * @type {d3.selection}
     * @private
     */
    this._d3Connections = null;

    /**
     * The SVG group for the d3Blocks
     * @type {d3.selection}
     * @private
     */
    this._d3Block = null;

    /**
     * The SVG point to perform SVG matrix transformations
     * @type {SVGPoint}
     * @private
     */
    this._svgPoint = null;

    /**
     * The renderBlocks
     * @type {Array<dudeGraph.RenderBlock>}
     * @private
     */
    this._renderBlocks = null;

    /**
     * The renderGroups
     * @type {Array<dudeGraph.RenderGroup>}
     * @private
     */
    this._renderGroups = null;

    /**
     * The renderConnections
     * @type {Array<dudeGraph.RenderConnection>}
     * @private
     */
    this._renderConnections = null;

    /**
     * The selected renderNodes
     * @type {Array<dudeGraph.RenderNode>}
     * @private
     */
    this._selectedRenderNodes = null;

    /**
     * The renderBlock types
     * @type {d3.map<String, dudeGraph.RenderBlock>}
     * @private
     */
    this._renderBlockTypes = null;

    /**
     * Association map from id to renderBlock
     * @type {d3.map<String, dudeGraph.RenderBlock>}
     * @private
     */
    this._renderBlockIds = null;

    /**
     * Association map from id to renderGroup
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

dudeGraph.Renderer.prototype = _.create(EventEmitter.prototype, {
    "constructor": dudeGraph.Renderer
});

/**
 * Initializes the renderer
 * @param {dudeGraph.Graph} cgGraph
 * @param {SVGElement} svgElement
 * @param {Object} [config]
 */
dudeGraph.Renderer.prototype.initialize = function (cgGraph, svgElement, config) {
    var renderer = this;
    this._graph = cgGraph;
    this._d3Svg = d3.select(svgElement);
    this._d3Root = this._d3Svg.append("svg:g").attr("id", "dude-graph-renderer");
    this._d3Groups = this._d3Root.append("svg:g").attr("id", "dude-graph-groups");
    this._d3Connections = this._d3Root.append("svg:g").attr("id", "dude-graph-connections");
    this._d3Block = this._d3Root.append("svg:g").attr("id", "dude-graph-blocks");
    this._svgPoint = svgElement.createSVGPoint();
    this._renderBlocks = [];
    this._renderGroups = [];
    this._renderConnections = [];
    this._selectedRenderNodes = [];
    this._renderBlockTypes = {
        "Block": dudeGraph.RenderBlock
    };
    this._renderBlockIds = {};
    this._renderGroupIds = {};
    this._renderBlocksQuadtree = null;
    this._renderGroupsQuadtree = null;
    this._renderPointsQuadtree = null;
    this._config = _.defaultsDeep(config || {}, dudeGraph.Renderer.defaultConfig);
    this._zoom = dudeGraph.Renderer.defaultZoom;
    this._graph.on("cg-point-value-change", function (point) {
        var renderBlocks = renderer.renderBlocksByBlock(point.cgBlock);
        _.forEach(renderBlocks, function (renderBlock) {
            renderBlock.update();
        });
    });
    this._graph.on("cg-point-add", function (block, point) {
        var renderBlocks = renderer.renderBlocksByBlock(block);
        _.forEach(renderBlocks, function (renderBlock) {
            renderer.createRenderPoint({
                "renderBlock": renderBlock,
                "point": point
            }, true);
        });
    });
    this._graph.on("cg-point-remove", function (block, point) {
        var renderBlocks = renderer.renderBlocksByBlock(block);
        _.forEach(renderBlocks, function (renderBlock) {
            var renderPoint = renderer.renderPointByName(renderBlock, point.cgName, point.isOutput);
            renderer.removeRenderPoint(renderPoint, true);
        });
    });
    this._createSelectionBehavior();
    this._createZoomBehavior();
};

/**
 * Registers a renderBlock
 * @param {String} renderBlockType
 * @param {dudeGraph.RenderBlock} renderBlockConstructor
 */
dudeGraph.Renderer.prototype.registerRenderBlock = function (renderBlockType, renderBlockConstructor) {
    this._renderBlockTypes[renderBlockType] = renderBlockConstructor;
};