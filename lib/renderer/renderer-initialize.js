//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Initializes the renderer
 * @param {dudeGraph.Graph} cgGraph
 * @param {SVGElement} svgElement
 * @param {Object} [config]
 */
dudeGraph.Renderer.prototype.initialize = function (cgGraph, svgElement, config) {
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