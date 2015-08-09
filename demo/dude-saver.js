var DudeSaver = (function() {

    /**
     * Save a graph into JSON
     * @constructor
     */
    var DudeSaver = pandora.class_("DudeSaver", pandora.EventEmitter, function () {
        pandora.EventEmitter.call(this);
    });

    DudeSaver.prototype.save = function (value) {
        return pandora.polymorphicMethod(this, "save", value);
    };

    DudeSaver.prototype._saveGraph = function (graph) {
        var root = {
            "delegates": {},
            "properties": {}
        };
        pandora.forEach(graph.blocksByType("Delegate"), function (cgBlock) {
            var outConnection = cgBlock.cgOutputs[0].cgConnections[0];
            if (outConnection !== undefined) {
                root.delegates[cgBlock.cgName] = this.save(outConnection.cgInputPoint.cgBlock);
            }
        }.bind(this));
        return root;
    };

    return DudeSaver;

})();