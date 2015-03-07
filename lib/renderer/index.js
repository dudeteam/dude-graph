cg.Renderer = (function () {

    /**
     * CodeGraph renderer using SnapSvg library.
     * @param paper {Object} The Snap Paper element which hold the svg context
     * @constructor
     */
    function Renderer(paper) {

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
        this._actionLayer = null;

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
        this._style = null;

        Renderer.prototype.initialize.call(this);
    }

    /**
     * Initialize Renderer.
     */
    Renderer.prototype.initialize = function () {
        this._paper.background = new cg.BackgroundGrid(this._paper);
        this._rootElement = this._paper.g();
        this._groupLayer = this._rootElement.g();
        this._connectionLayer = this._rootElement.g();
        this._actionLayer = this._rootElement.g();
        this._selectionLayer = this._rootElement.g();
        this._groupLayer.addClass('group-layer');
        this._connectionLayer.addClass('connection-layer');
        this._actionLayer.addClass('action-layer');
        this._selectionLayer.addClass('selection-layer');
        this._zoom = new cg.Zoom(this, this._paper, this._rootElement);
        this._paperPoint = this._paper.node.createSVGPoint();
        this._mousePosition = new cg.Vec2();
        this._selectionBox = new cg.Box2();
        this._style = {
            "group": {
                "heading": 20
            },
            "action": {
                "min-width": 250,
                "border-radius": 5,
                "padding": 10,
                "heading": 40
            },
            "point": {
                "height": 20
            }
        };
        this._zoom.initialize();
    };

    /**
     * Render the given node.
     * @param {cg.Node} node
     * @param {Object?} element
     */
    Renderer.prototype.render = function (node, element) {
        return cg.polymorphicMethod(node.constructor, this, "render", node, element || this._rootElement);
    };

    return Renderer;

})();
