Raphael.fn.graph = function (data) {
    var actions = {};
    var connections = [];
    window.addEventListener("mouseup", function (e) {
        for (var name in actions) {
            actions[name].disabled = false;
        }
    });
    for (var name in data.actions) {
        if (data.actions.hasOwnProperty(name)) {
            var action = data.actions[name];
            actions[name] = this.action(action.x, action.y, name, action.inputs, action.outputs, function () {
                if (this.disabled) {
                    return false;
                }
                for (var i = 0; i < connections.length; ++i) {
                    connections[i].update();
                }
                return true;
            });
        }
    }
    for (var i = 0; i < data.connections.length; ++i) {
        var from = data.connections[i].from.split('.');
        var to = data.connections[i].to.split('.');
        var connection = this.connection(actions[from[0]].outputs[from[1]], actions[to[0]].inputs[to[1]]);
        connection.attr({stroke: "#ccc", "stroke-width": 2, fill: "none"});
        connections.push(connection);
    }
};