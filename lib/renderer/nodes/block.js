/**
 * @param {dudeGraph.Renderer} renderer
 * @param {String} rendererBlockId
 * @param {dudeGraph.Block} block
 * @class
 * @extends {dudeGraph.RenderNode}
 */
dudeGraph.RenderBlock = function (renderer, rendererBlockId, block) {
    dudeGraph.RenderNode.call(this, renderer, rendererBlockId);

    /**
     * The dudeGraph.Block this renderBlock is linked to
     * @type {dudeGraph.Block}
     * @private
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
                this.renderGroupParent.computePosition();
                this.renderGroupParent.computeSize();
                this.renderGroupParent.update();
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
                return renderPoint.point.isOutput;
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
                return !renderPoint.point.isOutput;
            });

        }
    });

    /**
     * The d3Points
     * @type {d3.selection}
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
    this._d3Rect
        .attr({
            "width": this._nodeSize[0],
            "height": this._nodeSize[1]
        });
    this._d3Title
        .text(this._nodeName)
        .attr({
            "x": this._nodeSize[0] / 2,
            "y": this._renderer.config.block.padding
        });
    _.browserIf(["IE", "Edge"], function () {
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
    var widerOutput = _.max(this.renderOutputPoints, function (renderPoint) {
        return renderPoint.pointSize[0];
    });
    var widerInput = _.max(this.renderInputPoints, function (renderPoint) {
        return renderPoint.pointSize[0];
    });
    var titleWidth = this._renderer.measureText(this._nodeName)[0];
    var maxOutputWidth = widerOutput !== -Infinity ? widerOutput.pointSize[0] : 0;
    var maxInputWidth = widerInput !== -Infinity ? widerInput.pointSize[0] : 0;
    var maxPoints = this.renderOutputPoints.length > this.renderInputPoints.length;
    var maxPointsHeight = _.sum(maxPoints ? this.renderOutputPoints : this.renderInputPoints, function (renderPoint) {
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
    renderPoints
        .enter()
        .append("g")
        .classed("dude-graph-point", true);
    renderPoints
        .exit()
        .each(function (renderPoint) {
            renderPoint.remove();
        })
        .remove();
    this.d3Points
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
                _.stopD3ImmediatePropagation();
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
    var block = renderer.graph.blockById(renderBlockData.cgBlock);
    if (!block) {
        throw new Error("Unknown block `" + renderBlockData.cgBlock + "` for renderBlock `" + renderBlockData.id + "`");
    }
    var renderBlock = new this(renderer, renderBlockData.id, block);
    renderBlock.nodeName = renderBlockData.description || block.cgName || "";
    renderBlock.nodePosition = renderBlockData.position || [0, 0];
    renderBlock.movePosition = renderBlock.nodePosition.slice();
    renderBlock.parentGroup = renderBlockData.parent || null;
    return renderBlock;
};