cg.Renderer = (function () {

    /**
     *
     * @extends {pandora.EventEmitter}
     * @constructor
     */
    var Renderer = pandora.class_("Renderer", pandora.EventEmitter, function () {
        pandora.EventEmitter.call(this);
    });

    /**
     * Creates the svg graph from the given cgGraph. This method will also listen the graph's events in order to
     * updated the rendered svg graph.
     * @param el The canvas DOM Element on which the svg will be append
     * @param cgGraph The graph that will be rendered
     */
    Renderer.prototype.create = function (el, cgGraph) {
        var svg = d3.select(el);
        var root = svg.append("svg:g").attr("id", "root");
        this._createGroups(root, cgGraph);
        this._createConnections(root, cgGraph);
        this._createBlocks(root, cgGraph);
    };

    Renderer.prototype._createGroups = function (root, cgGraph) {
        var groupLayer = root.append("svg:g").attr("id", "groupLayer");
        return groupLayer;
    };

    Renderer.prototype._createConnections = function (root, cgGraph) {
        var connectionLayer = root.append("svg:g").attr("id", "connectionLayer");
        return connectionLayer;
    };

    Renderer.prototype._createBlocks = function (root, cgGraph) {
        var blockLayer = root.append("svg:g").attr("id", "blockLayer");
        return blockLayer;
    };

    return Renderer;

})();
