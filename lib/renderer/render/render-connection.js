/**
 * Render connections.
 * @private
 */
cg.Renderer.prototype._renderConnections = function () {
    var connections = this._connectionLayer
        .selectAll("g")
        .data(this._graph.connections);

    this._updateGroupMasks();
    this._createConnections(connections);
    this._updateConnections(connections);
    this._removeConnections(connections);
};

cg.Renderer.prototype._createConnections = function (connections) {
    var renderer = this;
    connections
        .enter()
        .append("svg:path")
        .attr({
            "class": function (connection) { return "empty type-" + connection.outputPoint.type },
            "style": "stroke-width: 2px;"
        })
        .each(function (connection) {
            var updatePath = renderer._updateConnections.bind(renderer, d3.select(this));
            if (connection.outputPoint instanceof cg.Point) {
                connection.outputPoint.block.on("move", updatePath);
            } else {
                connection.outputPoint.on("move", updatePath);
            }
            if (connection.inputPoint instanceof cg.Point) {
                connection.inputPoint.block.on("move", updatePath);
            } else {
                connection.inputPoint.on("move", updatePath);
            }
        });
};

cg.Renderer.prototype._updateConnections = function (connections) {
    connections
        .attr({
            "d": function (connection) {
                var step = 50;
                var p1 = this._getPointAbsolutePosition(connection.outputPoint);
                var p2 = this._getPointAbsolutePosition(connection.inputPoint);
                return format("M{x},{y}C{x1},{y1} {x2},{y2} {x3},{y3}", {
                    x: p1.x, y: p1.y,
                    x1: p1.x + step, y1: p1.y,
                    x2: p2.x - step, y2: p2.y,
                    x3: p2.x, y3: p2.y
                });
            }.bind(this)
        });
};

cg.Renderer.prototype._removeConnections = function (connections) {
    connections
        .exit()
        .remove();
};

var format = (function () {
    var tokenRegex = /\{([^\}]+)\}/g,
        objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, // matches .xxxxx or ["xxxxx"] to run over object properties
        replacer = function (all, key, obj) {
            var res = obj;
            key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
                name = name || quotedName;
                if (res) {
                    if (name in res) {
                        res = res[name];
                    }
                    typeof res == "function" && isFunc && (res = res());
                }
            });
            res = (res == null || res == obj ? all : res) + "";
            return res;
        };
    return function (str, obj) {
        return String(str).replace(tokenRegex, function (all, key) {
            return replacer(all, key, obj);
        });
    };
})();