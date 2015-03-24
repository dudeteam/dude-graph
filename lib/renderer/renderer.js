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
            "defaultWidth": 300,
            "defaultHeight": 200,
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
        setTimeout(this._render.bind(this), 100); // TODO: First render, all elements have bad size.
        this._graph.on("entity.add", function () {
            this._render();
        }.bind(this));
        this._graph.on("entity.remove", function () {
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
     * @param rootOnly {Boolean?} return only selected entities with the graph as parent.
     * @return {Boolean}
     */
    Renderer.prototype.hasSelectedEntities = function (rootOnly) {
        return this.getSelectedEntities(rootOnly)[0].length > 0;
    };

    /**
     * Return all selected entities.
     * @param rootOnly {Boolean?} return only selected entities with the graph as parent.
     * @return {d3.selection}
     */
    Renderer.prototype.getSelectedEntities = function (rootOnly) {
        return this._rootGroup
            .selectAll(".group.selected, .block.selected")
            .filter(function (entity) {
                return !rootOnly || entity.parent === this._graph;
            }.bind(this));
    };

    /**
     * Return all selected connections.
     * @returns {*}
     */
    Renderer.prototype.getSelectedConnections = function () {
        return this._rootGroup.selectAll(".connection.selected");
    };

    /**
     * Remove select connections and entities.
     */
    Renderer.prototype.removeSelection = function () {
        var renderer = this;
        var selectedConnections = this.getSelectedConnections();
        var selectedEntities = this.getSelectedEntities();
        selectedConnections.each(function (selectedConnection) {
            renderer._graph.removeConnection(selectedConnection);
        });
        selectedEntities.each(function (selectedEntity) {
            renderer._graph.removeEntity(selectedEntity);
        });
    };

    /**
     * Create a group from selection, putting all selected root entities in the children of the newly created group.
     * @param id
     * @param name
     */
    Renderer.prototype.createGroupFromSelection = function (id, name) {
        var renderer = this;
        var selectedEntities = renderer.getSelectedEntities(true);
        var selectionBbox = renderer._getSelectionZoomedSVGBox(selectedEntities);
        var group = new cg.Group(id, name,
            new pandora.Vec2(
                selectionBbox.x - this._config.group.padding,
                selectionBbox.y - this._config.group.padding - this._config.group.heading
            ),
            new pandora.Vec2(
                selectionBbox.width + this._config.group.padding * 2,
                selectionBbox.height + this._config.group.padding * 2 + this._config.group.heading
            )
        );
        renderer._graph.addEntity(group, renderer._graph);
        selectedEntities.each(function (selectedEntity) {
            renderer._graph.moveEntity(selectedEntity, group);
        });
    };

    /**
     * Create an empty group in the center of the viewport.
     * @param id
     * @param name
     */
    Renderer.prototype.createEmptyGroup = function (id, name) {
        var group = new cg.Group(id, name,
            new pandora.Vec2(0, 0),
            new pandora.Vec2(
                this._config.group.defaultWidth,
                this._config.group.defaultHeight
            )
        );
        this._graph.addEntity(group, this._graph);
    };

    /**
     * Create a group from selection if there is a selection, or create an empty group.
     * @param id
     * @param name
     */
    Renderer.prototype.createSmartGroup = function (id, name) {
        if (this.hasSelectedEntities()) {
            return this.createGroupFromSelection(id, name);
        }
        return this.createEmptyGroup(id, name);
    };

    return Renderer;

})();