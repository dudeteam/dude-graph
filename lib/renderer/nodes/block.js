/**
 * @param {dudeGraph.Renderer} renderer
 * @param {String} rendererBlockId
 * @param {dudeGraph.Block} block
 * @param {String} [renderPanel=null]
 * @class
 * @extends {dudeGraph.RenderNode}
 */
dudeGraph.RenderBlock = function (renderer, rendererBlockId, block, renderPanel) {
    dudeGraph.RenderNode.call(this, renderer, rendererBlockId);

    /**
     * The dudeGraph.Block this renderBlock is linked to
     * @type {dudeGraph.Block}
     * @protected
     */
    this._block = block;
    Object.defineProperty(this, "block", {
        get: function () {
            return this._block;
        }.bind(this)
    });

    /**
     * The node name
     * @type {String}
     * @protected
     */
    Object.defineProperty(this, "nodeName", {
        configurable: true,
        get: this._getNodeName,
        set: function (nodeName) {
            this._setNodeName(nodeName);
            if (this.renderGroupParent !== null) {
                this.updateRenderGroupParent();
            }
            _.forEach(this._renderPoints, function (renderPoint) {
                renderPoint.computePosition();
                renderPoint.update();
                _.forEach(renderPoint.renderConnections, function (renderConnection) {
                    renderConnection.update();
                });
            });
        }.bind(this)
    });

    /**
     * The renderBlock renderGroup parent
     * @type {dudeGraph.RenderGroup}
     * @protected
     */
    this._renderGroupParent = null;
    Object.defineProperty(this, "renderGroupParent", {
        configurable: true,
        get: function () {
            return this._renderGroupParent;
        }.bind(this),
        set: function (nodeParent) {
            if (this._renderGroupParent !== null) {
                this._renderGroupParent.removeChild(this);
            }
            if (nodeParent !== null) {
                nodeParent.addChild(this);
            }
            this._renderGroupParent = nodeParent;
        }.bind(this)
    });

    /**
     * The panel used to edit this renderBlock.
     * If null, the default edit block panel will be used.
     * @type {String}
     * @protected
     */
    this._renderPanel = renderPanel || null;
    Object.defineProperty(this, "renderPanel", {
        get: function () {
            return this._renderPanel;
        }.bind(this)
    });

    /**
     * The renderPoints of this renderBlock
     * @type {Array<dudeGraph.RenderPoint>}
     * @private
     */
    this._renderPoints = [];
    Object.defineProperty(this, "renderPoints", {
        get: function () {
            return this._renderPoints;
        }.bind(this),
        set: function (renderPoints) {
            this._renderPoints = renderPoints;
        }.bind(this)
    });

    /**
     * The output renderPoints of this renderBlock
     * @type {Array<dudeGraph.RenderPoint>}
     */
    Object.defineProperty(this, "renderOutputPoints", {
        get: function () {
            return _.filter(this.renderPoints, function (renderPoint) {
                return renderPoint.point.pointOutput;
            });
        }
    });

    /**
     * The input renderPoints of this renderBlock
     * @type {Array<dudeGraph.RenderPoint>}
     */
    Object.defineProperty(this, "renderInputPoints", {
        get: function () {
            return _.filter(this.renderPoints, function (renderPoint) {
                return !renderPoint.point.pointOutput;
            });

        }
    });

    /**
     * The d3Points
     * @type {d3.selection}
     * @protected
     */
    this._d3Points = null;
    Object.defineProperty(this, "d3Points", {
        get: function () {
            return this._d3Points.selectAll(".dude-graph-point");
        }.bind(this)
    });
};

dudeGraph.RenderBlock.prototype = _.create(dudeGraph.RenderNode.prototype, {
    "constructor": dudeGraph.RenderBlock
});

/**
 * Creates the d3Block for this renderBlock
 * @param {d3.selection} d3Block
 * @override
 */
dudeGraph.RenderBlock.prototype.create = function (d3Block) {
    dudeGraph.RenderNode.prototype.create.call(this, d3Block);
    this._d3Rect = this._d3Node.append("svg:rect")
        .attr("rx", this._renderer.config.block.borderRadius)
        .attr("ry", this._renderer.config.block.borderRadius);
    this._d3Title = this._d3Node.append("svg:text")
        .attr("class", "dude-graph-block-title")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "text-before-edge");
    this._d3Points = this._d3Node
        .append("svg:g")
        .classed("dude-graph-points", true);
    this.computeSize();
    this.update();
};

/**
 * Updates the d3Block for this renderBlock
 * @override
 */
dudeGraph.RenderBlock.prototype.update = function () {
    dudeGraph.RenderNode.prototype.update.call(this);
    var renderBlock = this;
    var color = this._renderer.config.blockColors[this._block.blockType];
    if (_.isUndefined(color)) {
        color = this._renderer.config.blockColors.default;
    }
    this._d3Rect
        .attr({
            "width": this._nodeSize[0],
            "height": this._nodeSize[1],
            "fill": color
        });
    this._d3Title
        .text(this._nodeName)
        .attr({
            "x": this._nodeSize[0] / 2,
            "y": this._renderer.config.block.padding
        });
    dudeGraph.browserIf(["IE", "Edge"], function () {
        renderBlock._d3Title.attr("y",
            renderBlock._renderer.config.block.padding +
            renderBlock._renderer.measureText(renderBlock._d3Title)[1] / 2);
    });
    this.d3Points
        .each(function (renderPoint) {
            renderPoint.update();
        });
    this.move();
};

/**
 * Computes the renderBlock size
 * @override
 */
dudeGraph.RenderBlock.prototype.computeSize = function () {
    var widerOutput = _.maxBy(this.renderOutputPoints, function (renderPoint) {
        return renderPoint.pointSize[0];
    });
    var widerInput = _.maxBy(this.renderInputPoints, function (renderPoint) {
        return renderPoint.pointSize[0];
    });
    var titleWidth = this._renderer.measureText(this._nodeName)[0];
    var maxOutputWidth = _.isUndefined(widerOutput) ? 0 : widerOutput.pointSize[0];
    var maxInputWidth = _.isUndefined(widerInput) ? 0 : widerInput.pointSize[0];
    var maxPoints = this.renderOutputPoints.length > this.renderInputPoints.length;
    var maxPointsHeight = _.sumBy(maxPoints ? this.renderOutputPoints : this.renderInputPoints, function (renderPoint) {
        return renderPoint.pointSize[1];
    });
    var maxWidth = Math.max(
        titleWidth + this._renderer.config.block.padding * 2,
        maxOutputWidth + maxInputWidth + this._renderer.config.block.pointSpacing
    );
    this._nodeSize = [
        maxWidth,
        maxPointsHeight + this._renderer.config.block.header
    ];
};

/**
 * Updates the d3Blocks to create/remove associated renderPoints
 */
dudeGraph.RenderBlock.prototype.updatePoints = function () {
    var renderPoints = this.d3Points
        .data(this.renderPoints, function (renderPoint) {
            return renderPoint.pointFancyName;
        });
    var createdRenderPoints = renderPoints
        .enter()
        .append("g")
        .classed("dude-graph-point", true);
    renderPoints
        .exit()
        .each(function (renderPoint) {
            renderPoint.remove();
        })
        .remove();
    createdRenderPoints
        .each(function (renderPoint) {
            renderPoint.create(d3.select(this));
            renderPoint.removeConnectionsEvent();
            renderPoint.dragConnectionEvent();
        });
    this.computeSize();
    this.d3Points
        .each(function (renderPoint) {
            renderPoint.computePosition();
            renderPoint.update();
        });
    this.update();
};

/**
 * Updates the size and the position of the renderGroup parent
 */
dudeGraph.RenderBlock.prototype.updateRenderGroupParent = function () {
    this.renderGroupParent.computePosition();
    this.renderGroupParent.computeSize();
    this.renderGroupParent.update();
};

/**
 * Builds a renderPoint from data
 * @param {Object} renderPointData
 * @returns {dudeGraph.RenderPoint}
 */
dudeGraph.RenderBlock.prototype.createRenderPoint = function (renderPointData) {
    var pointType = renderPointData.point.pointType;
    var rendererBlockType = this._renderer._renderPointTypes[pointType];
    if (_.isUndefined(rendererBlockType)) {
        throw new Error("Render point type `" + pointType + "` not registered in the renderer");
    }
    return rendererBlockType.buildRenderPoint(this._renderer, this, renderPointData);
};

/**
 * Adds a renderPoint
 * @param {dudeGraph.RenderPoint} renderPoint
 */
dudeGraph.RenderBlock.prototype.addRenderPoint = function (renderPoint) {
    var renderPointFound = _.find(this._renderPoints, renderPoint);
    if (!_.isUndefined(renderPointFound)) {
        throw new Error("`" + renderPoint.pointFancyName + "` is already a renderPoint of `" + this.nodeFancyName + "`");
    }
    this._renderPoints.push(renderPoint);
    this._updateRenderPointsIndexes();
    this._renderer.emit("render-point-add", this, renderPoint);
};

/**
 * Removes a renderPoint
 * @param {dudeGraph.RenderPoint} renderPoint
 */
dudeGraph.RenderBlock.prototype.removeRenderPoint = function (renderPoint) {
    var renderPointFound = _.find(this._renderPoints, renderPoint);
    if (_.isUndefined(renderPointFound)) {
        throw new Error("`" + renderPoint.pointFancyName + "` is not a renderPoint of `" + this.nodeFancyName + "`");
    }
    _.pull(this._renderPoints, renderPoint);
    this._updateRenderPointsIndexes();
    this._renderer.emit("render-point-remove", this, renderPoint);
};

/**
 * Applies dom events on this renderNode in order to remove it from its parent.
 */
dudeGraph.RenderNode.prototype.removeParentEvent = function () {
    var renderBlock = this;
    this._d3Node.call(d3.behavior.doubleClick()
        .on("dblclick", function () {
            var renderGroupParent = renderBlock.renderGroupParent;
            if (renderGroupParent !== null) {
                dudeGraph.stopD3ImmediatePropagation();
                renderBlock.renderGroupParent = null;
                renderGroupParent.computePosition();
                renderGroupParent.computeSize();
                renderGroupParent.update();
            }
        })
    );
};

/**
 * Updates the indexes of the renderPoints
 * @protected
 */
dudeGraph.RenderBlock.prototype._updateRenderPointsIndexes = function () {
    _.forEach(this.renderOutputPoints, function (renderPoint, index) {
        renderPoint.index = index;
    });
    _.forEach(this.renderInputPoints, function (renderPoint, index) {
        renderPoint.index = index;
    });
};

/**
 * RenderBlock factory
 * @param {dudeGraph.Renderer} renderer
 * @param {Object} renderBlockData
 */
dudeGraph.RenderBlock.buildRenderBlock = function (renderer, renderBlockData) {
    var block = renderer.graph.blockById(renderBlockData.block);
    if (!block) {
        throw new Error("Unknown block `" + renderBlockData.block + "` for renderBlock `" + renderBlockData.id + "`");
    }
    var renderBlock = new this(renderer, renderBlockData.id, block);
    renderBlock.nodeName = renderBlockData.description || block.blockName || "";
    renderBlock.nodePosition = renderBlockData.position || [0, 0];
    renderBlock.parentGroup = renderBlockData.parent || null;
    return renderBlock;
};