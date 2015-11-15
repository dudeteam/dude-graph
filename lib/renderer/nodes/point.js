/**
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.RenderBlock} renderBlock
 * @param {dudeGraph.Point} point
 * @param {Number} index
 * @constructor
 */
dudeGraph.RenderPoint = function (renderer, renderBlock, point, index) {
    /**
     * Reference on the renderer
     * @type {dudeGraph.Renderer}
     * @protected
     */
    this._renderer = renderer;

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
     * The point index in the renderBlock
     * @type {Number}
     * @protected
     */
    this._index = index;
    Object.defineProperty(this, "index", {
        get: function () {
            return this._index;
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

    /**
     * The point position in the d3Svg
     * @type {Array<Number>}
     * @protected
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
            return this._index + ": " + this._point.cgName;
        }.bind(this)
    });
};

/**
 * Creates the svg representation of this renderPoint
 * @param {d3.selection} d3PointGroup
 */
dudeGraph.RenderPoint.prototype.create = function (d3PointGroup) {
    this._d3Point = d3PointGroup;
    this._d3Circle = d3PointGroup
        .append("svg:circle");
    this._d3Title = d3PointGroup
        .append("svg:text")
        .attr("text-anchor", this._point.isOutput ? "end" : "start")
        .attr("dominant-baseline", "middle");
    this.updateSize();
};

/**
 * Updates the svg representation of this renderPoint
 */
dudeGraph.RenderPoint.prototype.update = function () {
    var renderPoint = this;
    var pointColor = renderPoint._renderer._config.typeColors[renderPoint.point.cgValueType] || "#aaaaaa";
    this._d3Circle
        .attr({
            "cx": this._pointPosition[0] + (this.point.isOutput ? -1 : 1) * this._renderer.config.point.radius / 2,
            "cy": this._pointPosition[1],
            "r": this._renderer.config.point.radius,
            "stroke": pointColor,
            "fill": _.isEmpty(this._renderConnections) ? "transparent" : pointColor
        });
    this._d3Title
        .text(this._point.cgName)
        .attr({
            "x": this._pointPosition[0] + (this.point.isOutput ? -1 : 1) * this._renderer.config.point.padding,
            "y": this._pointPosition[1]
        });
    _.browserIf(["IE", "Edge"], function () {
        renderPoint._d3Title.attr("y",
            renderPoint._pointPosition[1] + renderPoint._renderer.measureText(renderPoint._d3Title)[1] / 4);
    });
};

/**
 * Removes the svg representation of this renderPoint
 */
dudeGraph.RenderPoint.prototype.remove = function () {

};

/**
 * Computes the renderPoint size
 */
dudeGraph.RenderPoint.prototype.updateSize = function () {
    var textBoundingBox = this._renderer.measureText(this._point.cgName);
    this._pointSize = [
        textBoundingBox[0] + this._renderer.config.point.padding * 2,
        this._renderer.config.point.height
    ];
};

/**
 * Computes the renderPoint position
 */
dudeGraph.RenderPoint.prototype.updatePosition = function () {
    if (this.point.isOutput) {
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
 * Removes the connection from the point event
 */
dudeGraph.RenderPoint.prototype.removeConnectionsEvent = function () {
    var renderPoint = this;
    this._d3Circle.call(d3.behavior.mousedown()
        .on("mousedown", function () {
            if (d3.event.sourceEvent.altKey) {
                _.preventD3Default();
                _.stopD3ImmediatePropagation();
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
            "cgName": "drawing"
        },
        "pointAbsolutePosition": [0, 0]
    };
    renderPoint._d3Circle.call(d3.behavior.drag()
        .on("dragstart", function () {
            _.stopD3ImmediatePropagation();
            dragPoint.pointAbsolutePosition = d3.mouse(renderPoint._renderer._d3Root.node());
            if (renderPoint._point.isOutput) {
                renderConnection = new dudeGraph.RenderConnection(renderPoint._renderer, null, renderPoint, dragPoint);
            } else {
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
                        "cgConnectionIndex": renderPoint._renderer.graph.cgConnections.indexOf(connection),
                        "outputRendererBlockId": renderPoint._point.isOutput ? renderPoint._renderBlock.nodeId : renderPointFound.renderBlock.nodeId,
                        "inputRendererBlockId": renderPoint._point.isOutput ? renderPointFound.renderBlock.nodeId : renderPoint._renderBlock.nodeId
                    });
                    renderPoint._renderer.createD3Connections();
                    renderPoint.update();
                    renderPointFound.update();
                } catch (ex) {
                    renderPoint._renderer.emit("error", ex);
                }
            }
            _.pull(renderPoint._renderer._renderConnections, renderConnection);
            renderConnection = null;
            renderPoint._renderer.removeD3Connections();
        })
    );
};