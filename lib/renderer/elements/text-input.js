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
        this._group.addClass("text-input");
        this._rect = this._group.rect(position.x, position.y, 60, 20, 5);
        this._text = this._group.text(position.x + 5, position.y + 13, this._value);
        this._group.click(function () {
            this._group.addClass("focused");
        }.bind(this));
        document.addEventListener("keydown", function (e) {
            // don't write if any of this modifier is enabled or if the text-input isn't focused
            if (!this._group.hasClass("focused") || e.altKey || e.ctrlKey || e.metaKey) {
                return;
            }
            if (e.keyCode == 8 && this._value.length > 0) {
                this._value = this._value.substr(0, this._value.length - 1);
            } else if (e.keyCode == 13) {
                console.log("submit");
            } else {
                var c = String.fromCharCode(e.keyCode);
                this._value += e.shiftKey ? c : c.toLowerCase();
            }
            this._text.attr("text", this._value);
            cg.preventCallback(0, 0, e);
        }.bind(this));
    }

    cg.mergeObjects(TextInput.prototype, cg.EventEmitter.prototype);

    TextInput.prototype.__proto__ = {
        get value() { return this._value; },
        get rect() { return this._rect; },
        get text() { return this._text; }
    };

    return TextInput;

})();