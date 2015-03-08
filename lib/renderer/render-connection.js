/**
 * Render the connection.
 * @param connection {cg.Connection}
 * @param element {Object}
 * @private
 */
cg.Renderer.prototype._renderConnection = function (connection, element) {
    var connectionPath = this._connectionLayer.path(this._generateConnectionPath(connection));
    connectionPath.addClass("type-" + connection.outputPoint.type);
    connectionPath.addClass("empty");
    connectionPath.attr("strokeWidth", 2);
    connectionPath.connection = connection;
    var updatePath = function () {
        connectionPath.attr("path", this._generateConnectionPath(connectionPath.connection));
    }.bind(this);
    if (connection.outputPoint instanceof cg.Point) {
        connection.outputPoint.action.on("move", updatePath);
    } else {
        connection.outputPoint.on("move", updatePath);
    }
    if (connection.inputPoint instanceof cg.Point) {
        connection.inputPoint.action.on("move", updatePath);
    } else {
        connection.inputPoint.on("move", updatePath);
    }
    connection.inputPoint.emit("connection.add", connection);
    connection.outputPoint.emit("connection.add", connection);
    return connectionPath;
};

cg.Renderer.prototype._generateConnectionPath = function (connection) {
    var step = 50;
    var p1 = this._getPointAbsolutePosition(connection.outputPoint);
    var p2 = this._getPointAbsolutePosition(connection.inputPoint);
    return Snap.format("M{x},{y}C{x1},{y1} {x2},{y2} {x3},{y3}", {
        x: p1.x, y: p1.y,
        x1: p1.x + step, y1: p1.y,
        x2: p2.x - step, y2: p2.y,
        x3: p2.x, y3: p2.y
    });
};