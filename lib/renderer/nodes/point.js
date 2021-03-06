/**
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.RenderBlock} renderBlock
 * @param {dudeGraph.Point} point
 * @class
 */
dudeGraph.RenderPoint = function (renderer, renderBlock, point) {
    /**
     * Reference on the renderer
     * @type {dudeGraph.Renderer}
     * @protected
     */
    this._renderer = renderer;
    Object.defineProperty(this, "renderer", {
        get: function () {
            return this._renderer;
        }.bind(this)
    });

    /**
     * The point
     * @type {dudeGraph.Point}
     * @protected
     */
    this._point = point;
    Object.defineProperty(this, "point", {
        get: function () {
            return this._point;
        }.bind(this)
    });

    /**
     * The point index in the renderBlock
     * @type {Number}
     * @protected
     */
    this._index = 0;
    Object.defineProperty(this, "index", {
        get: function () {
            return this._index;
        }.bind(this),
        set: function (index) {
            this._index = index;
        }.bind(this)
    });

    /**
     * The host renderBlock
     * @type {dudeGraph.RenderBlock}
     * @protected
     */
    this._renderBlock = renderBlock;
    Object.defineProperty(this, "renderBlock", {
        get: function () {
            return this._renderBlock;
        }.bind(this)
    });

    /**
     * The renderConnections attached to this renderPoint
     * @type {Array<dudeGraph.RenderConnection>}
     * @protected
     */
    this._renderConnections = [];
    Object.defineProperty(this, "renderConnections", {
        get: function () {
            return this._renderConnections;
        }.bind(this)
    });

    /**
     * Whether the point is hidden in the renderer
     * @type {Boolean}
     * @private
     */
    this._pointHidden = false;
    Object.defineProperty(this, "pointHidden", {
        set: function (pointHidden) {
            this._pointHidden = pointHidden;
        }.bind(this),
        get: function () {
            return this._pointHidden;
        }.bind(this)
    });

    /**
     * The point size in the d3Block
     * @type {Array<Number>}
     * @protected
     */
    this._pointSize = [0, 0];
    Object.defineProperty(this, "pointSize", {
        get: function () {
            return this._pointSize;
        }.bind(this)
    });

    /**
     * The point position in the d3Block
     * @type {Array<Number>}
     * @protected
     */
    this._pointPosition = [0, 0];
    Object.defineProperty(this, "pointPosition", {
        get: function () {
            return this._pointPosition;
        }.bind(this)
    });

    /**
     * The point position in the d3Svg
     * @type {Array<Number>}
     */
    Object.defineProperty(this, "pointAbsolutePosition", {
        get: function () {
            var renderBlockPosition = this._renderBlock.nodePosition;
            return [
                renderBlockPosition[0] + this._pointPosition[0],
                renderBlockPosition[1] + this._pointPosition[1]
            ];
        }.bind(this)
    });

    /**
     * The renderPoint fancyName
     * @type {String}
     */
    Object.defineProperty(this, "pointFancyName", {
        get: function () {
            return (this._point.pointOutput ? "Output " : "Input ") + this._point.pointName;
        }.bind(this)
    });

    /**
     * The d3Point that holds this renderPoint
     * @type {d3.selection}
     * @protected
     */
    this._d3Point = null;
    Object.defineProperty(this, "d3Point", {
        get: function () {
            return this._d3Point;
        }.bind(this)
    });
};

/**
 * Creates the svg representation of this renderPoint
 * @param {d3.selection} d3PointGroup
 */
dudeGraph.RenderPoint.prototype.create = function (d3PointGroup) {
    var r = this._renderer.config.point.radius;
    var renderPoint = this;
    this._d3Point = d3PointGroup;
    this._d3Circle = d3PointGroup
        .append("svg:path")
        .attr("d", function () {
            if (renderPoint._point instanceof dudeGraph.StreamPoint) {
                return "M " + -r + " " + -r * 1.5 + " L " + -r + " " + r * 1.5 + " L " + r + " " + 0 + " Z";
            } else {
                return "M 0,0m " + -r + ", 0a " + [r, r] + " 0 1,0 " + r * 2 + ",0a " + [r, r] + " 0 1,0 " + -(r * 2) + ",0";
            }
        });
    this._d3Title = d3PointGroup
        .append("svg:text")
        .attr({
            "text-anchor": this._point.pointOutput ? "end" : "start",
            "dominant-baseline": "middle",
            "x": (this.point.pointOutput ? -1 : 1) * this._renderer.config.point.padding
        });
    dudeGraph.browserIf(["IE", "Edge"], function () {
        renderPoint._d3Title.attr("y",
            renderPoint._pointPosition[1] + renderPoint._renderer.measureText(renderPoint._d3Title)[1] / 4);
    });
    this.computeSize();
};

/**
 * Updates the svg representation of this renderPoint
 */
dudeGraph.RenderPoint.prototype.update = function () {
    var pointColor = this._renderer.config.typeColors[this.point.pointValueType] || this._renderer.config.defaultColor;
    this._d3Point.attr("transform", "translate(" + this.pointPosition + ")");
    this._d3Circle
        .attr({
            "stroke": pointColor,
            "fill": this.empty() ? "transparent" : pointColor
        });
    this._d3Title
        .text(this._point.pointName);
};

/**
 * Removes the svg representation of this renderPoint
 */
dudeGraph.RenderPoint.prototype.remove = function () {

};

/**
 * Computes the renderPoint size
 */
dudeGraph.RenderPoint.prototype.computeSize = function () {
    var textBoundingBox = this._renderer.measureText(this._point.pointName);
    this._pointSize = [
        textBoundingBox[0] + this._renderer.config.point.padding * 2,
        this._renderer.config.point.height
    ];
};

/**
 * Computes the renderPoint position
 */
dudeGraph.RenderPoint.prototype.computePosition = function () {
    if (this.point.pointOutput) {
        this._pointPosition = [
            this._renderBlock.nodeSize[0] - this._renderer.config.point.padding,
            this._renderer.config.block.header + this._renderer.config.point.height * this._index
        ];
    } else {
        this._pointPosition = [
            this._renderer.config.point.padding,
            this._renderer.config.block.header + this._renderer.config.point.height * this._index
        ];
    }
};

/**
 * Adds the renderConnection
 * @param {dudeGraph.RenderConnection} renderConnection
 */
dudeGraph.RenderPoint.prototype.addRenderConnection = function (renderConnection) {
    this._renderConnections.push(renderConnection);
};

/**
 * Removes the renderConnection
 * @param {dudeGraph.RenderConnection} renderConnection
 */
dudeGraph.RenderPoint.prototype.removeRenderConnection = function (renderConnection) {
    _.pull(this._renderConnections, renderConnection);
};

/**
 * Removes the connection from the point event
 */
dudeGraph.RenderPoint.prototype.removeConnectionsEvent = function () {
    var renderPoint = this;
    this._d3Circle.call(d3.behavior.mousedown()
        .on("mousedown", function () {
            if (d3.event.sourceEvent.altKey) {
                dudeGraph.preventD3Default();
                dudeGraph.stopD3ImmediatePropagation();
                renderPoint._renderer.emptyRenderPoint(renderPoint, true);
            }
        })
    );
};

/**
 * Creates the connection drag event
 */
dudeGraph.RenderPoint.prototype.dragConnectionEvent = function () {
    var renderPoint = this;
    var renderConnection = null;
    var dragPoint = {
        "renderBlock": {
            "nodeId": "drawing"
        },
        "point": {
            "pointName": "drawing"
        },
        "pointAbsolutePosition": [0, 0]
    };
    renderPoint._d3Circle.call(d3.behavior.drag()
        .on("dragstart", function () {
            dudeGraph.stopD3ImmediatePropagation();
            dragPoint.pointAbsolutePosition = d3.mouse(renderPoint._renderer._d3Root.node());
            if (renderPoint._point.pointOutput) {
                //noinspection JSCheckFunctionSignatures
                renderConnection = new dudeGraph.RenderConnection(renderPoint._renderer, null, renderPoint, dragPoint);
            } else {
                //noinspection JSCheckFunctionSignatures
                renderConnection = new dudeGraph.RenderConnection(renderPoint._renderer, null, dragPoint, renderPoint);
            }
            renderConnection.dragging = true;
            renderPoint._renderer._renderConnections.push(renderConnection);
            renderPoint._renderer.createD3Connections();
        })
        .on("drag", function () {
            dragPoint.pointAbsolutePosition = d3.mouse(renderPoint._renderer._d3Root.node());
            renderConnection.update();
        })
        .on("dragend", function () {
            var position = d3.mouse(renderPoint._renderer._d3Root.node());
            var renderPointFound = renderPoint._renderer.nearestRenderPoint(position);
            if (renderPointFound && renderPoint !== renderPointFound) {
                try {
                    var connection = renderPointFound.point.connect(renderPoint._point);
                    renderPoint._renderer.createRenderConnection({
                        "connectionIndex": renderPoint._renderer.graph.graphConnections.indexOf(connection),
                        "outputRendererBlockId": renderPoint._point.pointOutput ? renderPoint._renderBlock.nodeId : renderPointFound.renderBlock.nodeId,
                        "inputRendererBlockId": renderPoint._point.pointOutput ? renderPointFound.renderBlock.nodeId : renderPoint._renderBlock.nodeId
                    });
                    renderPoint._renderer.createD3Connections();
                    renderPoint.update();
                    renderPointFound.update();
                } catch (ex) {
                    renderPoint._renderer.emit("error", ex);
                }
            } else {
                renderPoint._renderer.emit(
                    "drop-connection",
                    renderConnection,
                    d3.mouse(renderPoint._renderer._d3Root.node()),
                    d3.mouse(document.body));
            }
            _.pull(renderPoint._renderer._renderConnections, renderConnection);
            renderConnection = null;
            renderPoint._renderer.removeD3Connections();
        })
    );
};

/**
 * Returns whether this renderPoint is empty.
 * @returns {Boolean}
 */
dudeGraph.RenderPoint.prototype.empty = function () {
    return _.isEmpty(this.renderConnections) && this._point.emptyValue();
};

/**
 * RenderPoint factory
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.RenderBlock} renderBlock
 * @param {Object} renderPointData
 * @param {dudeGraph.Point} renderPointData.point
 * @param {Object} renderPointData.renderPoint
 * @param {Boolean} [renderPointData.renderPoint.hidden=false]
 * @returns {dudeGraph.RenderPoint}
 */
dudeGraph.RenderPoint.buildRenderPoint = function (renderer, renderBlock, renderPointData) {
    var renderPoint = new this(renderer, renderBlock, renderPointData.point);
    renderPoint.pointHidden = (renderPointData.renderPoint && renderPointData.renderPoint.hidden) || false;
    return renderPoint;
};