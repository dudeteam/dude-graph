cg.Renderer = (function () {

    /**
     * CodeGraph renderer using SnapSvg library.
     * @param paper {Object} The SnagSvg object which hold the svg context
     * @constructor
     */
    function Renderer(paper) {
        this._paper = paper;
        this._paper.background = new cg.BackgroundGrid(paper);
        this._rootElement = paper.g();
        this._groupLayer = this._rootElement.g();
        this._connectionLayer = this._rootElement.g();
        this._actionLayer = this._rootElement.g();
        this._selectionLayer = this._rootElement.g();
        this._groupLayer.addClass('group-layer');
        this._connectionLayer.addClass('connection-layer');
        this._actionLayer.addClass('action-layer');
        this._selectionLayer.addClass('selection-layer');
        this._zoom = new cg.Zoom(this, paper, this._rootElement);
        this._paperPoint = paper.node.createSVGPoint();
        this._mousePosition = new cg.Vec2();
        this._selectionBox = new cg.Box2();
        this._selectionRectangle = null;
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
    }

    /**
     * @param {cg.Node} node
     * @param {Object?} element
     */
    Renderer.prototype.render = function (node, element) {
        return this["_render" + cg.functionName(node.constructor)](node, element || this._rootElement);
    };

    return Renderer;

})();
