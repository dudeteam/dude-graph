/**
 * Initializes rendererGroups and rendererBlocks
 * Add parent and children references, and also cgBlocks references to renderer blocks
 * @private
 */
cg.Renderer.prototype._initialize = function () {
    this._initializeRendererBlocks();
    this._initializeRendererConnections();
    this._initializeRendererGroups();
    this._initializeRendererGroupParents();
    this._initializeListeners();
};

/**
 * Creates the rendererBlocks (linked to their respective cgBlocks) and their rendererPoints
 * @private
 */
cg.Renderer.prototype._initializeRendererBlocks = function () {
    var renderer = this;
    _.forEach(this._data.blocks, function (blockData) {
        renderer._createRendererBlock(blockData);
    });
};

/**
 * Creates the rendererConnection between the rendererBlocks/rendererPoints
 * @private
 */
cg.Renderer.prototype._initializeRendererConnections = function () {
    var renderer = this;
    _.forEach(this._data.connections, function (connectionData) {
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
 * @private
 */
cg.Renderer.prototype._initializeRendererGroups = function () {
    var renderer = this;
    _.forEach(this._data.groups, function (groupData) {
        renderer._createRendererGroup(groupData);
    });
};

/**
 * Assigns rendererGroup parents
 * @private
 */
cg.Renderer.prototype._initializeRendererGroupParents = function () {
    var renderer = this;
    _.forEach(this._data.blocks, function (rendererBlockData) {
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
    _.forEach(this._data.groups, function (rendererGroupData) {
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
 * Initializes the listeners to dynamically creates the rendererBlocks when a cgBlock is added
 * @private
 */
cg.Renderer.prototype._initializeListeners = function () {
    var renderer = this;
    this._cgGraph.on("cg-block-create", this.createRendererBlock.bind(this));
    this._cgGraph.on("cg-block-name-change", function (cgBlock) {
        renderer._updateSelectedD3Blocks(renderer._getD3NodesFromRendererNodes(
            renderer._getRendererBlocksByCgBlock(cgBlock)));
    });
    this._cgGraph.on("cg-point-value-change", function (cgPoint) {
        renderer._updateSelectedD3Blocks(renderer._getD3NodesFromRendererNodes(
            renderer._getRendererBlocksByCgBlock(cgPoint._cgBlock)));
    });
};