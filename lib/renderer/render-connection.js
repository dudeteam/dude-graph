/**
 * Render the connection.
 * @param connection {cg.Connection}
 * @param element {Object}
 * @private
 */
cg.Renderer.prototype._renderConnection = function (connection, element) {
    return;
    var connectionPath = this._connectionLayer.path(this._generateConnectionPath(connection));
    connectionPath.addClass("type-" + connection.firstPoint.type);
    connectionPath.addClass("empty");
    connectionPath.attr("strokeWidth", 2);
    connectionPath.connection = connection;
    var updatePath = function () {
        connectionPath.attr("path", this._generateConnectionPath(connectionPath.connection));
    }.bind(this);
    connection.firstPoint.action.on("move", updatePath);
    connection.secondPoint.action.on("move", updatePath);
    return connectionPath;
};

cg.Renderer.prototype._generateConnectionPath = function (connection) {
    var step = 50;
    var p1 = this._getPointAbsolutePosition(connection.firstPoint);
    var p2 = this._getPointAbsolutePosition(connection.secondPoint);
    return Snap.format("M{x},{y}C{x1},{y1} {x2},{y2} {x3},{y3}", {
        x: p1.x, y: p1.y,
        x1: p1.x + step, y1: p1.y,
        x2: p2.x - step, y2: p2.y,
        x3: p2.x, y3: p2.y
    });
};