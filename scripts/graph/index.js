/**
 * Create a code graph from the given JSON data.
 * @param data {JSON}
 * @returns {{actions: Grid, connections: Array, newPoint: null, newConnection: null, cursor: {x: number, y: number}, _listeners: {}, on: Function, emit: Function, addAction: Function, addConnection: Function, toJSON: Function}}
 */
Raphael.fn.graph = function (data) {
    var self = this;
    var obj = {
        actions: new Grid(),
        connections: [],
        newPoint: null,
        newConnection: null,
        cursor: {x: 0, y: 0},
        _listeners: {},

        /**
         * Add a listener for the given name.
         * @param name
         * @param fn
         */
        on: function (name, fn) {
            if (obj._listeners[name] === undefined) {
                obj._listeners[name] = [];
            }
            obj._listeners[name].push(fn);
        },

        /**
         * Emit an event for the given name.
         * @param name
         */
        emit: function (name) {
            if (obj._listeners[name] === undefined) {
                return;
            }
            for (var i = 0; i < obj._listeners[name].length; ++i) {
                obj._listeners[name][i].apply(obj, Array.prototype.slice.call(arguments, 1));
            }
        },

        /**
         * Add an action into the graph.
         * @param name {String} The name of the action to add.
         * @param x {Number} The x screen's coordinate.
         * @param y {Number} The y screen's coordinate.
         */
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

        /**
         * Add a connection between 2 actions of the graph.
         * @param data.from {String} `action_id`.`point_name`
         * @param data.to {String} `action_id`.`point_name`
         */
        addConnection: function (data) {
            var from = data.from.split('.');
            var to = data.to.split('.');
            var actionFrom = obj.actions.get(~~from[0]);
            var actionTo = obj.actions.get(~~to[0]);
            var connection = self.connection(actionFrom.outputs[from[1]], actionTo.inputs[to[1]]);
            connection.attr({stroke: TYPES[actionFrom.outputs[from[1]].valueType], "stroke-width": 2, fill: "none"});
            obj.connections.push(connection);
            actionFrom.connections.push(connection);
            actionTo.connections.push(connection);
        },

        /**
         * Serialize the graph to a JSON object.
         * @returns {JSON}
         */
        toJSON: function () {
            var result = {};
            result.actions = {};
            result.connections = [];
            obj.actions.forEach(function (action, name) {
                var box = action.getBBox();
                result.actions[name] = {"x": box.x, "y": box.y};
            });
            for (var i = 0; i < obj.connections.length; ++i) {
                result.connections.push({
                    "to": obj.connections[i].obj1.action.id + "." + obj.connections[i].obj1.name,
                    "from": obj.connections[i].obj2.action.id + "." + obj.connections[i].obj2.name
                });
            }
            return result;
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
        if (obj.newConnection !== null) {
            obj.newConnection.destroy();
            obj.newConnection = null;
        }
        if (obj.newPoint !== null) {
            var point = getMatchingPoint(obj.newPoint, 20);
            if (point === null) {
                console.log("TODO add actions that matches the connection type.");
            } else {
                if (obj.targetPoint.valueType !== point.valueType) {
                    obj.emit("error", "Types " + obj.targetPoint.valueType + " and " + point.valueType + " mismatch.");
                } else {
                    var connection = self.connection(point, obj.targetPoint, point.pointType === 'input' ? -40 : 40);
                    connection.attr({stroke: TYPES[obj.targetPoint.valueType], "stroke-width": 2, fill: "none"});
                    obj.connections.push(connection);
                    obj.targetPoint.action.connections.push(connection);
                    point.action.connections.push(connection);
                }
            }
            obj.newPoint.remove();
            obj.newPoint = null;
            obj.targetPoint = null;
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