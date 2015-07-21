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
     * @param data The serialized renderer elements
     * @param cgGraph The graph that will be rendered
     */
    Renderer.prototype.create = function (el, data, cgGraph) {
        var svg = d3.select(el);
        var root = svg.append("svg:g").attr("id", "cgRoot");
        this._createGroups(root, data, cgGraph);
        this._createBlocks(root, data, cgGraph);
    };

    Renderer.prototype._createGroups = function (root, data, cgGraph) {
        root.append("svg:g").attr("id", "cgGroups")
            .selectAll(".cg-group")
            .data(data.cgGroups, function (cgGroup) {
                return cgGroup.cgId;
            })
            .enter()
            .append("svg:g")
            .attr("class", "cg-group")
            .append("svg:rect")
            .attr("transform", function (cgGroup) { return "translate(" + cgGroup.cgPosition + ")"; })
            .attr("rx", 5).attr("ry", 5)
            .attr("width", function (cgGroup) { return cgGroup.cgSize[0]; })
            .attr("height", function (cgGroup) { return cgGroup.cgSize[1]; });
    };

    Renderer.prototype._createBlocks = function (root, data, cgGraph) {
        root.append("svg:g").attr("id", "cgBlocks")
            .selectAll(".cg-block")
            .data(data.cgBlocks, function (cgBlock) {
                return cgBlock.cgId;
            })
            .enter()
            .append("svg:g")
                .attr("class", "cg-block")
                .append("svg:rect")
                    .attr("transform", function (block) { return "translate(" + block.cgPosition + ")"; })
                    .attr("rx", 5).attr("ry", 5)
                    .attr("width", function () { return 100; })
                    .attr("height", function () { return 100; });
    };

    return Renderer;

})();
