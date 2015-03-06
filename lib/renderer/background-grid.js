cg.BackgroundGrid = (function () {

    /**
     * Create a dynamic background grid.
     * @param paper {Element}
     * @param style {Object}
     * @constructor
     */
    function BackgroundGrid(paper, style) {
        this._style = style || {
            "pattern-size": 10,
            "line": {
                "stroke": "rgba(255, 255, 255, 0.05)",
                "stroke-width": 1
            }
        };
        this._paper = paper;
        this._rect = paper.rect(0, 0, "100%", "100%");
        this.update(1, new cg.Vec2(0, 0));
    }

    /**
     * Update the grid according the current zoom and pan values.
     * @param size {Number}
     * @param pan {cg.Vec2}
     */
    BackgroundGrid.prototype.update = function (size, pan) {
        size *= this._style["pattern-size"];
        var cross = this._paper.g();
        cross.line(pan.x, pan.y + size / 2, pan.x + size, pan.y + size / 2).attr(this._style.line);
        cross.line(pan.x + size / 2, pan.y, pan.x + size / 2, pan.y + size).attr(this._style.line);
        this._rect.attr({fill: cross.pattern(pan.x, pan.y, size, size)});
    };

    return BackgroundGrid;

})();