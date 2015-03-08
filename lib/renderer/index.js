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
    function Renderer(paper) {

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
         * Layer for selected elements and dragging operations.
         * @type {Element}
         * @private
         */
        this._selectionLayer = null;

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
         * Absolute mouse position in the SVG.
         * @type {cg.Vec2}
         * @private
         */
        this._mousePosition = null;

        /**
         * Selection box.
         * @type {cg.Vec2}
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
    }

    /**
     * Initialize Renderer.
     */
    Renderer.prototype.initialize = function (graph, config) {
        this._graph = graph;
        this._config = cg.mergeObjects(config || {}, DEFAULT_CONFIG, true, true);
        this._paper.background = new cg.BackgroundGrid(this._paper, this._config["background-grid"]);
        this._rootElement = this._paper.g();
        this._groupLayer = this._rootElement.g();
        this._connectionLayer = this._rootElement.g();
        this._blockLayer = this._rootElement.g();
        this._selectionLayer = this._rootElement.g();
        this._groupLayer.addClass('group-layer');
        this._connectionLayer.addClass('connection-layer');
        this._blockLayer.addClass('action-layer');
        this._selectionLayer.addClass('selection-layer');
        this._zoom = new cg.Zoom(this, this._paper, this._rootElement);
        this._paperPoint = this._paper.node.createSVGPoint();
        this._mousePosition = new cg.Vec2();
        this._selectionBox = new cg.Box2();
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
        return cg.polymorphicMethod(node.constructor, this, "render", node, element || this._rootElement);
    };

    /**
     * Return all elements.
     */
    Renderer.prototype.allElements = function () {
        return this._paper.selectAll(".group, .block");
    };

    /**
     * Return all selected elements in the renderer.
     */
    Renderer.prototype.selectedElements = function () {
        return this._paper.selectAll(".selected");
    };

    /**
     * Return all selected nodes in the renderer.
     * @return {cg.Container}
     */
    Renderer.prototype.selectedNodes = function () {
        var selectedNodes = new cg.Container();
        this._paper.selectAll(".selected").forEach(function (element) {
            selectedNodes.add(this._getNode(element));
        }.bind(this));
        return selectedNodes;
    };

    /**
     * Create a group.
     * @param id {Number|String}
     * @param name {String}
     * @param width {Number?}
     * @param height {Number?}
     * @param handleSelection {Boolean?}
     */
    Renderer.prototype.createGroup = function (id, name, width, height, handleSelection) {
        var position = this._mousePosition.clone();
        var size = new cg.Vec2(width || this._config.group["default-width"], height || this._config.group["default-height"]);
        if ((handleSelection || true) && this.selectedElements().length !== 0) {
            var selectedNodesBBox = this.selectedElements().getBBox();
            position = new cg.Vec2(selectedNodesBBox.x - this._config.group.padding, selectedNodesBBox.y - this._config.group.padding - this._config.group["heading"]);
            size = new cg.Vec2(selectedNodesBBox.width + this._config.group.padding * 2, selectedNodesBBox.height + this._config.group.padding * 2 + this._config.group["heading"]);
        }
        var group = new cg.Group(id, name, position, size);
        graph.addNode(group, graph);
        this.selectedNodes().forEach(function (node) {
            if (node.parent && node.parent instanceof cg.Graph) {
                group.addChild(node);
            }
        });
    };

    return Renderer;

})();
