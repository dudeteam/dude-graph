cg.TextInput = (function () {

    /**
     * Create a text-input picker in SVG.
     * @param element {Object} The svg element on which the text-input will be attached
     * @param position {cg.Vec2} The position of the text-input on the screen.
     * @constructor
     */
    function TextInput(element, position) {
        cg.EventEmitter.call(this);
        this._value = "value";
        this._group = element.g();
        this._group.addClass("toto");
        this._rect = this._group.rect(position.x, position.y, 60, 20, 5);
        this._text = this._group.text(position.x, position.y, this._value);
    }

    cg.mergeObjects(TextInput.prototype, cg.EventEmitter.prototype);

    TextInput.prototype.__proto__ = {
        get value() { return this._value; },
        get rect() { return this._rect; },
        get text() { return this._text; }
    };

    return TextInput;

})();