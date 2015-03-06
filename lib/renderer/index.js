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

        this._zoom = new cg.Zoom(this, paper, this._rootElement);
        this._paperPoint = paper.node.createSVGPoint();
        this._mousePosition = new cg.Vec2();
        this._selectionBox = new cg.Box2();
        this._selectionRectangle = null;
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
