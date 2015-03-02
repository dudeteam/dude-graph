Raphael.fn.graph = function (data) {
    var self = this;
    var obj = {
        newPoint: null,
        newConnection: null
    };
    var getMatchingPoint = function (pt, radius) {
        var resultPoint = null;
        var xPt = pt.getBBox().x + pt.getBBox().width / 2;
        var yPt = pt.getBBox().y + pt.getBBox().height / 2;
        for (var n in obj.actions) {
            if (obj.actions.hasOwnProperty(n)) {
                var pts = pt.pointType === 'input' ? obj.actions[n].inputs : obj.actions[n].outputs;
                for (var key in pts) {
                    if (pts.hasOwnProperty(key)) {
                        var xOther = pts[key].getBBox().x + pts[key].getBBox().width / 2;
                        var yOther = pts[key].getBBox().y + pts[key].getBBox().height / 2;
                        if (Math.abs(xPt - xOther) <= radius && Math.abs(yPt - yOther) <= radius) {
                            resultPoint = pts[key];
                        }
                    }
                }
            }
        }
        return resultPoint;
    };
    obj.actions = {};
    obj.connections = [];
    window.addEventListener("mousemove", function (e) {
        if (obj.newPoint !== null && obj.newConnection !== null) {
            obj.newPoint.attr('cx', e.x);
            obj.newPoint.attr('cy', e.y);
            obj.newConnection.update();
        }
    });
    window.addEventListener("mouseup", function () {
        if (obj.newPoint !== null) {
            var point = getMatchingPoint(obj.newPoint, 20);
            if (point === null) {
                console.warn("TODO: create a new action");
            } else {
                var connection = self.connection(point, obj.targetPoint, point.pointType === 'input' ? -40 : 40);
                connection.attr({stroke: "#ccc", "stroke-width": 2, fill: "none"});
                obj.connections.push(connection);
            }
            obj.newPoint.remove();
            obj.newPoint = null;
            obj.targetPoint = null;
        }
        if (obj.newConnection !== null) {
            obj.newConnection.remove();
            obj.newConnection = null;
        }
        for (var name in obj.actions) {
            if (obj.actions.hasOwnProperty(name)) {
                obj.actions[name].disabled = false;
            }
        }
    });
    for (var name in data.actions) {
        if (data.actions.hasOwnProperty(name)) {
            var action = data.actions[name];
            obj.actions[name] = this.action(obj, action.x, action.y, name, action.inputs, action.outputs, function () {
                if (this.disabled) {
                    return false;
                }
                for (var i = 0; i < obj.connections.length; ++i) {
                    obj.connections[i].update();
                }
                return true;
            });
        }
    }
    for (var i = 0; i < data.connections.length; ++i) {
        var from = data.connections[i].from.split('.');
        var to = data.connections[i].to.split('.');
        var connection = this.connection(obj.actions[from[0]].outputs[from[1]], obj.actions[to[0]].inputs[to[1]]);
        connection.attr({stroke: "#ccc", "stroke-width": 2, fill: "none"});
        obj.connections.push(connection);
    }
    return obj;
};