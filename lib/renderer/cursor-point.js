cg.Renderer.CursorPoint = (function () {

    function CursorPoint(type, position, isInput) {
        cg.EventEmitter.call(this);
        this._type = type;
        this._position = position;
        this._isInput = isInput;
    }

    cg.inherit(CursorPoint, cg.EventEmitter);

    CursorPoint.prototype.__proto__ = {
        get type() { return this._type; },
        get position() { return this._position; },
        get isInput() { return this._isInput; }
    };

    return CursorPoint;

})();