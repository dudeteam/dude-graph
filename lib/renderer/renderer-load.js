/**
 * Initializes rendererGroups and rendererBlocks
 * Add parent and children references, and also cgBlocks references to renderer blocks
 * @param {dudeGraph.Graph} cgGraph
 * @param {Object?} rendererData
 * @param {Object?} rendererConfig
 * @private
 */
dudeGraph.Renderer.prototype._load = function (cgGraph, rendererData, rendererConfig) {
    this._cgGraph = cgGraph;
    this._loadInitialize(rendererData, rendererConfig);
    this._loadRendererBlocks(rendererData);
    this._loadRendererConnections(rendererData);
    this._loadRendererGroups(rendererData);
    this._loadRendererGroupParents(rendererData);
    this._loadListeners();
    this._createSelectionBehavior();
    this._createZoomBehavior();
    this._createD3Blocks();
    this._createD3Connections();
    this._createD3Groups();
};

/**
 * Initializes the renderer
 * @param {Object?} rendererData
 * @param {Object?} rendererConfig
 * @private
 */
dudeGraph.Renderer.prototype._loadInitialize = function (rendererData, rendererConfig) {
    this._d3Svg.selectAll("*").remove();
    this._svgPoint = this._d3Svg.node().createSVGPoint();
    this._d3Root = this._d3Svg.append("svg:g").attr("id", "cg-root");
    this._d3Groups = this._d3Root.append("svg:g").attr("id", "dude-graph-groups");
    this._d3Connections = this._d3Root.append("svg:g").attr("id", "dude-graph-connections");
    this._d3Block = this._d3Root.append("svg:g").attr("id", "dude-graph-blocks");
    this._rendererBlocks = [];
    this._rendererGroups = [];
    this._rendererConnections = [];
    this._rendererBlockIds = d3.map();
    this._rendererGroupIds = d3.map();
    this._rendererBlocksQuadtree = null;
    this._rendererGroupsQuadtree = null;
    this._rendererPointsQuadtree = null;
    if (rendererConfig) {
        this._config = _.defaultsDeep(rendererConfig, dudeGraph.Renderer.defaultConfig);
    }
    if (rendererData && rendererData.zoom) {
        this._zoom = _.defaultsDeep(rendererData.zoom, dudeGraph.Renderer.defaultZoom);
    }
};

/**
 * Creates the rendererBlocks (linked to their respective cgBlocks) and their rendererPoints
 * @param {Object?} rendererData
 * @private
 */
dudeGraph.Renderer.prototype._loadRendererBlocks = function (rendererData) {
    var renderer = this;
    _.forEach(rendererData.blocks, function (blockData) {
        renderer._createRendererBlock(blockData);
    });
};

/**
 * Creates the rendererConnection between the rendererBlocks/rendererPoints
 * @param {Object?} rendererData
 * @private
 */
dudeGraph.Renderer.prototype._loadRendererConnections = function (rendererData) {
    var renderer = this;
    _.forEach(rendererData.connections, function (connectionData) {
        var cgConnection = renderer._cgGraph.cgConnections[connectionData.cgConnectionIndex];
        if (!cgConnection) {
            throw new Error("Connection at index `" + connectionData.cgConnectionIndex + "` does not exists");
        }
        var outputRendererBlock = renderer._getRendererBlockById(connectionData.outputRendererBlockId);
        var inputRendererBlock = renderer._getRendererBlockById(connectionData.inputRendererBlockId);

        if (!outputRendererBlock) {
            throw new Error("Connection at index `" + connectionData.cgConnectionIndex +
                    "`: Cannot find outputRendererBlock `" + connectionData.outputRendererBlockId + "`");
        }
        if (!inputRendererBlock) {
            throw new Error("Connection at index `" + connectionData.cgConnectionIndex +
                    "`: Cannot find inputRendererBlock `" + connectionData.inputRendererBlockId + "`");
        }
        if (outputRendererBlock.cgBlock !== cgConnection.cgOutputPoint.cgBlock) {
            throw new Error("Connection at index `" + connectionData.cgConnectionIndex +
                "`: OutputRendererBlock `" + outputRendererBlock.id +
                "` is not holding a reference to the outputCgBlock `" + cgConnection.cgOutputPoint.cgBlock.cgId + "`");
        }
        if (inputRendererBlock.cgBlock !== cgConnection.cgInputPoint.cgBlock) {
            throw new Error("Connection at index `" + connectionData.cgConnectionIndex +
                "`: InputRendererBlock `" + inputRendererBlock.id +
                "` is not holding a reference to the inputCgBlock `" + cgConnection.cgInputPoint.cgBlock.cgId + "`");
        }
        var outputRendererPoint = renderer._getRendererPointByName(outputRendererBlock, cgConnection.cgOutputPoint.cgName);
        var inputRendererPoint = renderer._getRendererPointByName(inputRendererBlock, cgConnection.cgInputPoint.cgName);
        if (!outputRendererPoint) {
            throw new Error("Connection at index `" + connectionData.cgConnectionIndex +
                "`: Cannot find outputRendererPoint `" + cgConnection.cgOutputPoint.cgName + "`");
        }
        if (!inputRendererPoint) {
            throw new Error("Connection at index `" + connectionData.cgConnectionIndex +
                "`: Cannot find inputRendererPoint `" + cgConnection.cgInputPoint.cgName + "`");
        }
        renderer._createRendererConnection({
            "cgConnection": cgConnection,
            "outputRendererPoint": outputRendererPoint,
            "inputRendererPoint": inputRendererPoint
        }, true);
    });
    // TODO: Check non linked cgConnections <=> rendererConnections
};

/**
 * Creates the rendererGroups
 * @param {Object?} rendererData
 * @private
 */
dudeGraph.Renderer.prototype._loadRendererGroups = function (rendererData) {
    var renderer = this;
    _.forEach(rendererData.groups, function (groupData) {
        renderer._createRendererGroup(groupData);
    });
};

/**
 * Assigns rendererGroup parents
 * @param {Object?} rendererData
 * @private
 */
dudeGraph.Renderer.prototype._loadRendererGroupParents = function (rendererData) {
    var renderer = this;
    _.forEach(rendererData.blocks, function (rendererBlockData) {
        var rendererBlock = renderer._getRendererBlockById(rendererBlockData.id);
        if (rendererBlockData.parent) {
            var rendererGroupParent = renderer._getRendererGroupById(rendererBlockData.parent);
            if (!rendererGroupParent) {
                throw new Error("Cannot find rendererBlock parent id `" + rendererBlockData.parent + "`");
            }
            //noinspection JSCheckFunctionSignatures
            renderer._addRendererNodeParent(rendererBlock, rendererGroupParent);
        }
    });
    _.forEach(rendererData.groups, function (rendererGroupData) {
        var rendererGroup = renderer._getRendererGroupById(rendererGroupData.id);
        if (rendererGroupData.parent) {
            var rendererGroupParent = renderer._getRendererGroupById(rendererGroupData.parent);
            if (!rendererGroupParent) {
                throw new Error("Cannot find rendererGroup parent id `" + rendererGroupData.parent + "`");
            }
            //noinspection JSCheckFunctionSignatures
            renderer._addRendererNodeParent(rendererGroup, rendererGroupParent);
        }
    });
};

/**
 * Initializes the listeners to automatically updates the renderer when a graph change occurs
 * @private
 */
dudeGraph.Renderer.prototype._loadListeners = function () {
    var renderer = this;
    this._cgGraph.on("dude-graph-block-create", function (cgBlock) {
        renderer.createRendererBlock(cgBlock);
    });
    this._cgGraph.on("dude-graph-block-remove", function () {
        renderer._removeD3Blocks();
    });
    this._cgGraph.on("dude-graph-block-name-change", function (cgBlock) {
        renderer._updateSelectedD3Nodes(renderer._getD3NodesFromRendererNodes(renderer._getRendererBlocksByCgBlock(cgBlock)));
    });
    this.on("dude-graph-renderer-group-description-change", function (rendererGroup) {
        renderer._updateSelectedD3Nodes(renderer._getD3NodesFromRendererNodes([rendererGroup]));
    });
    this._cgGraph.on("cg-point-value-change", function (cgPoint) {
        renderer._updateSelectedD3Nodes(renderer._getD3NodesFromRendererNodes(renderer._getRendererBlocksByCgBlock(cgPoint._cgBlock)));
    });
};