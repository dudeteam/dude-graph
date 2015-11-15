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