/**
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.Connection} connection
 * @param {dudeGraph.RenderPoint} outputRenderPoint
 * @param {dudeGraph.RenderPoint} inputRenderPoint
 * @constructor
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
};

/**
 * Updates the svg representation of this renderConnection
 */
dudeGraph.RenderConnection.prototype.update = function () {
    this._d3Connection
        .attr("d", this.computePath());
};

/**
 * Removes the svg representation of this renderConnection
 */
dudeGraph.RenderConnection.prototype.remove = function () {
};

/**
 * Computes the connection path
 * @returns {String}
 */
dudeGraph.RenderConnection.prototype.computePath = function () {
    var outputRenderPointPosition = this._outputRenderPoint.pointAbsolutePosition;
    var inputRenderPointPosition = this._inputRenderPoint.pointAbsolutePosition;
    var step = this._renderer.config.connection.step;
    if (outputRenderPointPosition[0] - inputRenderPointPosition[0] < 0) {
        step += Math.max(-100, outputRenderPointPosition[0] - inputRenderPointPosition[0]);
    }
    return _.templateString("M{x},{y}C{x1},{y1} {x2},{y2} {x3},{y3}", {
        x: outputRenderPointPosition[0], y: outputRenderPointPosition[1],
        x1: outputRenderPointPosition[0] + step, y1: outputRenderPointPosition[1],
        x2: inputRenderPointPosition[0] - step, y2: inputRenderPointPosition[1],
        x3: inputRenderPointPosition[0], y3: inputRenderPointPosition[1]
    });
};

/**
 * RenderConnection factory
 * @param {dudeGraph.Renderer} renderer
 * @param {Object} renderConnectionData
 */
dudeGraph.RenderConnection.buildRenderConnection = function (renderer, renderConnectionData) {
    var connection = renderer._graph.cgConnections[renderConnectionData.cgConnectionIndex];
    if (!connection) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex + "` does not exists");
    }
    var outputRenderBlock = renderer.getRenderBlockById(renderConnectionData.outputRendererBlockId);
    var inputRenderBlock = renderer.getRenderBlockById(renderConnectionData.inputRendererBlockId);
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
    var outputRendererPoint = renderer.getRenderPointByName(outputRenderBlock, connection.cgOutputPoint.cgName);
    var inputRendererPoint = renderer.getRenderPointByName(inputRenderBlock, connection.cgInputPoint.cgName);
    if (!outputRendererPoint) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex +
            "`: Cannot find outputRenderPoint `" + connection.cgOutputPoint.cgName + "`");
    }
    if (!inputRendererPoint) {
        throw new Error("Connection at index `" + renderConnectionData.cgConnectionIndex +
            "`: Cannot find inputRenderPoint `" + connection.cgInputPoint.cgName + "`");
    }
    return new dudeGraph.RenderConnection(renderer, connection, outputRendererPoint, inputRendererPoint);
};