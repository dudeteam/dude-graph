/**
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.Connection} connection
 * @param {dudeGraph.RenderPoint} outputRenderPoint
 * @param {dudeGraph.RenderPoint} inputRenderPoint
 * @class
 */
dudeGraph.RenderConnection = function (renderer, connection, outputRenderPoint, inputRenderPoint) {
    /**
     * Reference on the renderer
     * @type {dudeGraph.Renderer}
     * @private
     */
    this._renderer = renderer;

    /**
     * The connection
     * @type {dudeGraph.Connection}
     * @private
     */
    this._connection = connection;
    Object.defineProperty(this, "connection", {
        get: function () {
            return this._connection;
        }.bind(this)
    });

    /**
     * The output renderPoint
     * @type {dudeGraph.RenderPoint}
     * @private
     */
    this._outputRenderPoint = outputRenderPoint;
    Object.defineProperty(this, "outputRenderPoint", {
        get: function () {
            return this._outputRenderPoint;
        }.bind(this)
    });

    /**
     * The input renderPoint
     * @type {dudeGraph.RenderPoint}
     * @private
     */
    this._inputRenderPoint = inputRenderPoint;
    Object.defineProperty(this, "inputRenderPoint", {
        get: function () {
            return this._inputRenderPoint;
        }.bind(this)
    });

    /**
     * Whether this connection is used to draw to dragging connection
     * @type {Boolean}
     * @private
     */
    this._dragging = false;
    Object.defineProperty(this, "dragging", {
        get: function () {
            return this._dragging;
        }.bind(this),
        set: function (dragging) {
            this._dragging = dragging;
        }.bind(this)
    });

    /**
     * Returns the fake dragging point used to draw a connection
     * @type {Object}
     */
    Object.defineProperty(this, "draggingRenderPoint", {
        get: function () {
            if (!this.dragging) {
                throw new Error("Cannot get the dragging renderPoint of a non dragging connection");
            }
            return this._outputRenderPoint instanceof dudeGraph.RenderPoint ?
                this._inputRenderPoint : this._outputRenderPoint;
        }.bind(this)
    });

    /**
     * Returns the real starting renderPoint used to draw a connection
     * @type {dudeGraph.RenderPoint}
     */
    Object.defineProperty(this, "realRenderPoint", {
        get: function () {
            if (!this.dragging) {
                throw new Error("Cannot get the real renderPoint of a non dragging connection");
            }
            return this._outputRenderPoint instanceof dudeGraph.RenderPoint ?
                this._outputRenderPoint : this._inputRenderPoint;
        }.bind(this)
    });

    /**
     * The connection unique id
     * @type {String}
     */
    Object.defineProperty(this, "connectionId", {
        get: function () {
            return this.outputRenderPoint.renderBlock.nodeId + ":" + this.outputRenderPoint.point.cgName + "," +
                this.inputRenderPoint.renderBlock.nodeId + ":" + this.inputRenderPoint.point.cgName;
        }.bind(this)
    });

    /**
     * The d3Connection that holds this renderConnection
     * @type {d3.selection}
     * @private
     */
    this._d3Connection = null;
    Object.defineProperty(this, "d3Connection", {
        get: function () {
            return this._d3Connection;
        }.bind(this)
    });
};

/**
 * Creates the svg representation of this renderConnection
 * @param {d3.selection} d3Connection
 */
dudeGraph.RenderConnection.prototype.create = function (d3Connection) {
    this._d3Connection = d3Connection;
    this._d3Line = d3.svg.line()
        .interpolate("basis");
};

/**
 * Updates the svg representation of this renderConnection
 */
dudeGraph.RenderConnection.prototype.update = function () {
    var step = this._renderer.config.connection.step;
    if (this._outputRenderPoint.pointAbsolutePosition[0] > this._inputRenderPoint.pointAbsolutePosition[0]) {
        step += Math.max(
            -this._renderer.config.connection.step,
            Math.min(
                this._outputRenderPoint.pointAbsolutePosition[0] - this._inputRenderPoint.pointAbsolutePosition[0],
                this._renderer.config.connection.step
            )
        );
    }
    var outputRenderPointPosition = this._outputRenderPoint.pointAbsolutePosition;
    var inputRenderPointPosition = this._inputRenderPoint.pointAbsolutePosition;
    var connectionPoints = [
        [outputRenderPointPosition[0], outputRenderPointPosition[1]],
        [outputRenderPointPosition[0] + step, outputRenderPointPosition[1]],
        [inputRenderPointPosition[0] - step, inputRenderPointPosition[1]],
        [inputRenderPointPosition[0], inputRenderPointPosition[1]]
    ];
    var inputColor = this._renderer.config.typeColors[this.inputRenderPoint.point.cgValueType];
    var outputColor = this._renderer.config.typeColors[this.outputRenderPoint.point.cgValueType];
    this._d3Connection
        .attr({
            "d": this._d3Line(connectionPoints),
            "stroke": inputColor || outputColor || this._renderer.config.defaultColor,
            "stroke-linecap": "round"
        });
    if (this._dragging) {
        this._d3Connection
            .attr("stroke-dasharray", "5,5");
    }
};

/**
 * Removes the svg representation of this renderConnection
 */
dudeGraph.RenderConnection.prototype.remove = function () {
};

/**
 * RenderConnection factory
 * @param {dudeGraph.Renderer} renderer
 * @param {Object} renderConnectionData
 * The parameters are either:
 * @param {Number?} renderConnectionData.cgConnectionIndex
 * @param {String?} renderConnectionData.outputRendererBlockId
 * @param {String?} renderConnectionData.inputRendererBlockId
 * Or either:
 * @param {dudeGraph.Connection?} renderConnectionData.connection
 * @param {dudeGraph.RenderBlock?} renderConnectionData.outputRenderBlock
 * @param {dudeGraph.RenderBlock?} renderConnectionData.inputRenderBlock
 */
// TODO: Improve error messages depending on the parameters set used
dudeGraph.RenderConnection.buildRenderConnection = function (renderer, renderConnectionData) {
    var connection = renderConnectionData.connection || renderer._graph.cgConnections[renderConnectionData.cgConnectionIndex];
    if (!connection) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex + "` does not exist");
    }
    var outputRenderBlock = renderConnectionData.outputRenderBlock || renderer.renderBlockById(renderConnectionData.outputRendererBlockId);
    var inputRenderBlock = renderConnectionData.inputRenderBlock || renderer.renderBlockById(renderConnectionData.inputRendererBlockId);
    if (outputRenderBlock === null) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex +
            "`: Cannot find outputRenderBlock `" + renderConnectionData.outputRendererBlockId + "`");
    }
    if (inputRenderBlock === null) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex +
            "`: Cannot find inputRenderBlock `" + renderConnectionData.inputRendererBlockId + "`");
    }
    if (outputRenderBlock.block !== connection.cgOutputPoint.cgBlock) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex +
            "`: output render block `" + outputRenderBlock.nodeFancyName +
            "` is not holding a reference to the output block `" + connection.cgOutputPoint.cgBlock.cgId + "`");
    }
    if (inputRenderBlock.block !== connection.cgInputPoint.cgBlock) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex +
            "`: input render block `" + inputRenderBlock.nodeFancyName +
            "` is not holding a reference to the input block `" + connection.cgInputPoint.cgBlock.cgId + "`");
    }
    var outputRendererPoint = renderer.renderPointByName(outputRenderBlock, connection.cgOutputPoint.cgName);
    var inputRendererPoint = renderer.renderPointByName(inputRenderBlock, connection.cgInputPoint.cgName);
    if (!outputRendererPoint) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex +
            "`: Cannot find outputRenderPoint `" + connection.cgOutputPoint.cgName + "`");
    }
    if (!inputRendererPoint) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex +
            "`: Cannot find inputRenderPoint `" + connection.cgInputPoint.cgName + "`");
    }
    return new this(renderer, connection, outputRendererPoint, inputRendererPoint);
};