cg.Renderer = (function () {

    /**
     * Contain all the default value of the renderer config, these values will be used when they aren't specified
     * into the config given in parameter.
     * @type {Object}
     */
    var DEFAULT_CONFIG = {
        "group": {
            "default-width": 300,
            "default-height": 200,
            "heading": 20,
            "padding": 20,
            "border-radius": 0
        },
        "block": {
            "border-radius": 0,
            "padding": 20,
            "heading": 40,
            "center-spacing": 20
        },
        "getter": {
            "height": 40
        },
        "point": {
            "height": 20,
            "padding": 5,
            "circle-size": 3
        },
        "background-grid": {
            "pattern-size": 10,
            "step-size": 5,
            "line": {
                "stroke": "rgba(0, 0, 0, 0.1)",
                "stroke-width": 2
            },
            "big-line": {
                "stroke": "rgba(0, 0, 0, 0.4)",
                "stroke-width": 3
            }
        }
    };

    /**
     *
     * @extends pandora.EventEmitter
     * @constructor
     */
    var Renderer = pandora.class_("Renderer", pandora.EventEmitter, function (graph, svg, config) {
        pandora.EventEmitter.call(this);

        /**
         * Graph reference.
         * @type {cg.Graph}
         * @private
         */
        this._graph = graph;

        /**
         * The root SVG node this renderer is attached to.
         * @type {d3.selection}
         * @private
         */
        this._svg = d3.select(svg);

        /**
         * Renderer configuration.
         * @type {Object}
         */
        this._config = pandora.mergeObjects(config || {}, DEFAULT_CONFIG, true, true);

        /**
         * The root group created.
         * @type {d3.selection}
         * @private
         */
        this._rootGroup = null;

        /**
         * The group layer.
         * @type {null}
         * @private
         */
        this._groupLayer = null;

        /**
         * The connection layer.
         * @type {null}
         * @private
         */
        this._connectionLayer = null;

        /**
         * The block layer.
         * @type {null}
         * @private
         */
        this._blockLayer = null;

        /**
         * If this graph is already rendered.
         * @type {boolean}
         * @private
         */
        this._rendered = false;
    });

    /**
     *
     * @private
     */
    Renderer.prototype._initialize = function () {
        this._rootGroup = this._svg.append("svg:g");
        this._groupLayer = this._rootGroup
            .append("svg:g")
            .attr("class", "group");
        this._connectionLayer = this._rootGroup
            .append("svg:g")
            .attr("class", "connection");
        this._blockLayer = this._rootGroup
            .append("svg:g")
            .attr("class", "block");
        this._svg.call(d3.behavior.zoom().on('zoom', function () {
            this._rootGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }.bind(this)));
    };

    /**
     * Render the graph.
     */
    Renderer.prototype.render = function () {
        if (this._rendered) {
            this.emit("error", new cg.RendererError("Cannot re-render the graph"));
            return;
        }
        this._rendered = true;
        this._initialize();
        this._groupLayer.append("svg:rect").attr({"fill": "red", "width": 100, "height": 200});
        this._render(this._graph);
        this._graph.on("entity.add", function (entity) {
            this._render(entity);
        }.bind(this));
        this._graph.on("connection.add", function (connection) {
            this._render(connection);
        }.bind(this));
    };

    Renderer.prototype.getGroups = function () {

    };

    Renderer.prototype.getBlocks = function () {

    };

    Renderer.prototype.hasSelection = function () {

    };

    Renderer.prototype.getSelectedEntities = function () {

    };

    Renderer.prototype.createGroupFromSelection = function (id, name) {

    };

    Renderer.prototype.createEmptyGroup = function (id, name) {

    };

    Renderer.prototype.createSmartGroup = function (id, name) {

    };

    return Renderer;

})();