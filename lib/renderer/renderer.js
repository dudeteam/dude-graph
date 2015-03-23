cg.Renderer = (function () {

    /**
     * Contain all the default value of the renderer config, these values will be used when they aren't specified
     * into the config given in parameter.
     * @type {Object}
     */
    var DEFAULT_CONFIG = {
        "zoom": {
            "maxZoom": 5,
            "minZoom": 0.25
        },
        "group": {
            "default-width": 300,
            "default-height": 200,
            "heading": 20,
            "padding": 20,
            "borderRadius": 0
        },
        "block": {
            "borderRadius": 0,
            "padding": 20,
            "heading": 40,
            "centerSpacing": 20
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
         * Renderer configuration.
         * @type {Object}
         */
        this._config = pandora.mergeObjects(config || {}, DEFAULT_CONFIG, true, true);

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
         * The root group created.
         * @type {d3.selection}
         * @private
         */
        this._rootGroup = null;

        /**
         * The group layer.
         * @type {d3.selection}
         * @private
         */
        this._groupLayer = null;

        /**
         * The connection layer.
         * @type {d3.selection}
         * @private
         */
        this._connectionLayer = null;

        /**
         * The layer for temporary connections that are not attached yet to a block but to the cursor instead.
         * @type {null}
         * @private
         */
        this._cursorConnectionLayer = null;

        /**
         * The block layer.
         * @type {d3.selection}
         * @private
         */
        this._blockLayer = null;

        /**
         * If this graph is already rendered.
         * @type {boolean}
         * @private
         */
        this._rendered = false;

        /**
         * Point used for matrix transformations.
         * @type {SVGPoint}
         * @private
         */
        this._svgPoint = null;

        /**
         *
         * @type {d3.selection}
         * @private
         */
        this._selectionRectangle = null;

        /**
         *
         * @type {pandora.Box2}
         * @private
         */
        this._selectionBox = new pandora.Box2();
    });

    /**
     *
     * @private
     */
    Renderer.prototype._initialize = function () {
        this._rootGroup = this._svg.append("svg:g");
        this._groupLayer = this._rootGroup.append("svg:g").attr("id", "group-layer");
        this._connectionLayer = this._rootGroup.append("svg:g").attr("id", "connection-layer");
        this._cursorConnectionLayer = this._rootGroup.append("svg:g").attr("id", "cursor-connection-layer");
        this._blockLayer = this._rootGroup.append("svg:g").attr("id", "block-layer");
        this._svgPoint = this._svg.node().createSVGPoint();
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
        this._render();
        this._renderSelection();
        this._renderZoom();
        this._updateRendererCollisions();
        this._graph.on("entity.add", function () {
            this._render();
        }.bind(this));
        this._graph.on("connection.add", function () {
            this._renderConnections(this.getConnections());
        }.bind(this));
        this._graph.on("connection.remove", function () {
            this._renderConnections(this.getConnections());
        }.bind(this));
        this._updateRendererCollisions();
    };

    /**
     * Return d3 selection for all entities.
     * @return {d3.selection}
     */
    Renderer.prototype.getEntities = function () {
        return this._rootGroup
            .selectAll("#group-layer > .group, #block-layer > .block");
    };

    /**
     * Return d3 selection for all groups.
     * @return {d3.selection}
     */
    Renderer.prototype.getGroups = function () {
        return this._groupLayer
            .selectAll(".group")
            .data(this._graph.groups(), function (group) {
                return group._id;
            });
    };

    /**
     * Return d3 selection for all blocks.
     * @return {d3.selection}
     */
    Renderer.prototype.getBlocks = function () {
        return this._blockLayer
            .selectAll(".block")
            .data(this._graph.blocks(), function (block) {
                return block._id;
            });
    };

    /**
     * Return d3 selection for all points.
     * @return {d3.selection}
     */
    Renderer.prototype.getPoints = function () {
        return this._blockLayer
            .selectAll(".points > .point");
    };
    /**
     * Return d3 selection for all connections.
     * @return {d3.selection}
     */
    Renderer.prototype.getConnections = function () {
        var pointId = function (point) {
            var block = point.block;
            return block._id + "@" + (point.index + (point.isInput ? 0 : block.inputs.length));
        };
        return this._connectionLayer
            .selectAll(".connection")
            .data(this._graph.connections, function (connection) {
                return pointId(connection._inputPoint) + "," + pointId(connection._outputPoint);
            });
    };

    /**
     * Return if there are selected entities.
     * @param rootOnly {Boolean?}
     * @return {Boolean}
     */
    Renderer.prototype.hasSelection = function (rootOnly) {
        return this.getSelectedEntities(rootOnly).length > 0;
    };

    /**
     * Return all selected entities.
     * @param rootOnly {Boolean?} return only selected entities with the graph as parent if rootOnly is true.
     * @return {d3.selection}
     */
    Renderer.prototype.getSelectedEntities = function (rootOnly) {
        return this._rootGroup
            .selectAll(".selected")
            .filter(function (entity) {
                return !rootOnly || entity.parent === this._graph;
            }.bind(this));
    };

    /**
     * Create a group from selection, putting all selected root entities in the children of the newly created group.
     * @param id
     * @param name
     */
    Renderer.prototype.createGroupFromSelection = function (id, name) {
        // TODO: implement
    };

    /**
     * Create an empty group in the center of the viewport.
     * @param id
     * @param name
     */
    Renderer.prototype.createEmptyGroup = function (id, name) {
        // TODO: implement
    };

    /**
     * Create a group from selection if there is a selection, or create an empty group.
     * @param id
     * @param name
     */
    Renderer.prototype.createSmartGroup = function (id, name) {
        if (this.hasSelection()) {
            return this.createGroupFromSelection(id, name);
        }
        return this.createEmptyGroup(id, name);
    };

    return Renderer;

})();