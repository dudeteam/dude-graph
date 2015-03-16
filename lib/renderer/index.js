cg.Renderer = (function () {

    /**
     * Contain all the default value of the renderer config, these values will be used when they aren't specified
     * into the config given in parameter.
     * @type {Object}
     */
    var DEFAULT_CONFIG = {
        "group": {
            "default-width": 400,
            "default-height": 300,
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
     * CodeGraph renderer using SnapSvg library.
     * @param paper {Object} The Snap Paper element which hold the svg context
     * @constructor
     */
    var Renderer = pandora.class_("Renderer", pandora.EventEmitter, function (paper) {
        pandora.EventEmitter.call(this);

        /**
         * Graph to render.
         * @type {cg.Graph}
         * @private
         */
        this._graph = null;

        /**
         * Snap Paper svg element.
         * @type {Element}
         * @private
         */
        this._paper = paper;

        /**
         * Graph node
         * @type {cg.Graph}
         * @private
         */
        this._graph = null;

        /**
         * Root group element.
         * @type {Element}
         * @private
         */
        this._rootElement = null;

        /**
         * Layer for groups.
         * @type {Element}
         * @private
         */
        this._groupLayer = null;

        /**
         * Layer for connections.
         * @type {Element}
         * @private
         */
        this._connectionLayer = null;

        /**
         * Layer for actions.
         * @type {Element}
         * @private
         */
        this._blockLayer = null;

        /**
         * Zoom manager.
         * @type {cg.Zoom}
         * @private
         */
        this._zoom = null;

        /**
         * Point used for arithmetic operations inside the svg
         * @type {SVGPoint}
         * @private
         */
        this._paperPoint = null;

        /**
         * Point used for one-shots operations.
         * @type {pandora.Vec2}
         * @private
         */
        this._vec2 = new pandora.Vec2();

        /**
         * Box used for one-shots operations.
         * @type {pandora.Box2}
         * @private
         */
        this._box2 = new pandora.Box2();

        /**
         * Absolute mouse position in the SVG.
         * @type {pandora.Vec2}
         * @private
         */
        this._mousePosition = null;

        /**
         * Selection box.
         * @type {pandora.Box2}
         * @private
         */
        this._selectionBox = null;

        /**
         * Selection rectangle.
         * @type {Element}
         * @private
         */
        this._selectionRectangle = null;

        /**
         * Renderer style.
         * @type {Object}
         * @private
         */
        this._config = null;

        /**
         * Contain the instance of CursorPoint for this graph.
         * @type {cg.Renderer.CursorPoint}
         * @private
         */
        this._cursorPoint = null;

        /**
         * Display the connection attached to the cursor point on the screen.
         * @type {Snap.path|null}
         * @private
         */
        this._cursorConnection = null;
    });

    /**
     * Initialize Renderer.
     */
    Renderer.prototype.initialize = function (graph, config) {
        this._graph = graph;
        this._paperPoint = this._paper.node.createSVGPoint();
        this._config = pandora.mergeObjects(config || {}, DEFAULT_CONFIG, true, true);
        this._grid = new cg.Renderer.Grid(this._paper, this._config["background-grid"]);
        this._rootElement = this._paper.g();
        this._groupLayer = this._rootElement.g();
        this._connectionLayer = this._rootElement.g();
        this._blockLayer = this._rootElement.g();
        this._groupLayer.addClass('group-layer');
        this._connectionLayer.addClass('connection-layer');
        this._blockLayer.addClass('action-layer');
        this._zoom = new cg.Zoom(this, this._paper, this._rootElement);
        this._mousePosition = new pandora.Vec2();
        this._selectionBox = new pandora.Box2();
        this.render(graph);
        graph.on('node.add', function (node) {
            this.render(node);
        }.bind(this));
    };

    /**
     * Render the given node.
     * @param {cg.Node|cg.Point|cg.Connection} node
     * @param {Object?} element
     */
    Renderer.prototype.render = function (node, element) {
        return pandora.polymorphicMethod(this, "render", node, element || this._rootElement);
    };

    /**
     * Return all groups.
     */
    Renderer.prototype.allGroups = function () {
        return this._groupLayer.selectAll(".group");
    };

    /**
     * Return all elements.
     */
    Renderer.prototype.allElements = function () {
        return this._paper.selectAll(".group, .block");
    };

    /**
     * Return all selected elements in the renderer.
     * @param filterRootElements {Boolean?} only return element which node has graph as parent
     * @return {Snap.set}
     */
    Renderer.prototype.selectedElements = function (filterRootElements) {
        var selectedElements = Snap.set();
        this._paper.selectAll(".selected").forEach(function (element) {
            if (!filterRootElements || (this.graphData(element).parent === this._graph)) {
                selectedElements.push(element);
            }
        }.bind(this));
        return selectedElements;
    };

    /**
     * Return all selected nodes in the renderer.
     * @param filterRootElements {Boolean?} only return nodes with graph as parent
     * @return {cg.Container}
     */
    Renderer.prototype.selectedNodes = function (filterRootElements) {
        var selectedNodes = new cg.Container();
        this.selectedElements(filterRootElements).forEach(function (element) {
            selectedNodes.add(this.graphData(element));
        }.bind(this));
        return selectedNodes;
    };

    /**
     * Create a group from selection.
     * @param id {Number|String}
     * @param name {String}
     * @return {cg.Group}
     */
    Renderer.prototype.createGroupFromSelection = function (id, name) {
        var selectedNodesBBox = this.selectedElements().getBBox();
        var position = new pandora.Vec2(selectedNodesBBox.x - this._config.group.padding, selectedNodesBBox.y - this._config.group.padding - this._config.group["heading"]);
        var size = new pandora.Vec2(selectedNodesBBox.width + this._config.group.padding * 2, selectedNodesBBox.height + this._config.group.padding * 2 + this._config.group["heading"]);
        var group = new cg.Group(id, name, position, size);
        this._graph.addNode(group, this._graph);
        this.selectedNodes(true).forEach(function (node) {
            this._graph.moveNode(node, group);
        }.bind(this));
        return group;
    };

    /**
     * Remove selected nodes.
     */
    Renderer.prototype.removeSelectedNodes = function () {
        this.selectedNodes(true).forEach(function (node) {
            this._graph.removeNode(node);
        }.bind(this));
    };

    return Renderer;

})();
