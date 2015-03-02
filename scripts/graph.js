ACTIONS = {
    "blurShader": {
        "inputs": [],
        "outputs": [{"type": "color", "name": "gl_FragColor"}]
    },
    "bwShader": {
        "inputs": [],
        "outputs": [{"type": "color", "name": "gl_FragColor"}]
    },
    "mix": {
        "inputs": [
            {"type": "color", "name": "first"},
            {"type": "color", "name": "second"},
            {"type": "number", "name": "ratio"}
        ],
        "outputs": [{"type": "color", "name": "gl_FragColor"}]
    },
    "finalOutput": {
        "inputs": [{"type": "color", "name": "result"}],
        "outputs": []
    }
}

Raphael.fn.graph = function (data) {
    var self = this;
    var obj = {
        actions: new Grid(),
        connections: [],
        newPoint: null,
        newConnection: null,
        cursor: {x: 0, y: 0},
        addAction: function (name, x, y) {
            var data = ACTIONS[name];
            var action = obj.actions.push(name, self.action(obj, x, y, name, data.inputs, data.outputs, function () {
                if (this.disabled) {
                    return false;
                }
                for (var i = 0; i < obj.connections.length; ++i) {
                    obj.connections[i].update();
                }
                return true;
            }));
            action.select();
        },
        addConnection: function (data) {
            var from = data.from.split('.');
            var to = data.to.split('.');
            var actionFrom = obj.actions.get(~~from[0]);
            var actionTo = obj.actions.get(~~to[0]);
            var connection = self.connection(actionFrom.outputs[from[1]], actionTo.inputs[to[1]]);
            connection.attr({stroke: "#ccc", "stroke-width": 2, fill: "none"});
            obj.connections.push(connection);
            actionFrom.connections.push(connection);
            actionTo.connections.push(connection);
        }
    };
    var getMatchingPoint = function (pt, radius) {
        var resultPoint = null;
        var xPt = pt.getBBox().x + pt.getBBox().width / 2;
        var yPt = pt.getBBox().y + pt.getBBox().height / 2;
        obj.actions.forEach(function (action) {
            var pts = pt.pointType === 'input' ? action.inputs : action.outputs;
            for (var key in pts) {
                if (pts.hasOwnProperty(key)) {
                    var xOther = pts[key].getBBox().x + pts[key].getBBox().width / 2;
                    var yOther = pts[key].getBBox().y + pts[key].getBBox().height / 2;
                    if (Math.abs(xPt - xOther) <= radius && Math.abs(yPt - yOther) <= radius) {
                        resultPoint = pts[key];
                    }
                }
            }
        });
        return resultPoint;
    };
    window.addEventListener("mousemove", function (e) {
        if (obj.newPoint !== null && obj.newConnection !== null) {
            obj.newPoint.attr('cx', e.x);
            obj.newPoint.attr('cy', e.y);
            obj.newConnection.update();
        }
        obj.cursor.x = e.x;
        obj.cursor.y = e.y;
    });
    window.addEventListener("mouseup", function () {
        if (obj.newPoint !== null) {
            var point = getMatchingPoint(obj.newPoint, 20);
            if (point === null) {
                console.log("TODO add actions that matches the connection type.");
            } else {
                var connection = self.connection(point, obj.targetPoint, point.pointType === 'input' ? -40 : 40);
                connection.attr({stroke: "#ccc", "stroke-width": 2, fill: "none"});
                obj.connections.push(connection);
                obj.targetPoint.action.connections.push(connection);
                point.action.connections.push(connection);
            }
            obj.newPoint.remove();
            obj.newPoint = null;
            obj.targetPoint = null;
        }
        if (obj.newConnection !== null) {
            obj.newConnection.remove();
            obj.newConnection = null;
        }
        obj.actions.forEach(function (action) {
            action.disabled = false;
        });
    });
    for (var name in data.actions) {
        if (data.actions.hasOwnProperty(name)) {
            obj.addAction(name, data.actions[name].x, data.actions[name].y);
        }
    }
    for (var itConnection = 0; itConnection < data.connections.length; ++itConnection) {
        obj.addConnection(data.connections[itConnection]);
    }
    return obj;
};