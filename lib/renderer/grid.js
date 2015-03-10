cg.Renderer.Grid = (function () {

    /**
     * Create a dynamic background grid.
     * @param paper {Element}
     * @param config {Object}
     * @constructor
     */
    function Grid(paper, config) {
        this._config = config || {
            "pattern-size": 10,
            "step-size": 5,
            "line": {
                "stroke": "rgba(255, 255, 255, 0.05)",
                "stroke-width": 2
            },
            "big-line": {
                "stroke": "rgba(255, 255, 255, 0.2)",
                "stroke-width": 3
            }
        };
        this._paper = paper;
        this._rect = paper.rect(0, 0, "100%", "100%");
        this._cross = this._paper.g();
        this._xLines = [];
        for (var y = 0; y < this._config["step-size"]; ++y) {
            this._xLines.push(this._cross.line(0, 0, 0, 0));
        }
        this._yLines = [];
        for (var x = 0; x < this._config["step-size"]; ++x) {
            this._yLines.push(this._cross.line(0, 0, 0, 0));
        }
        console.log(this._xLines, this._yLines);
    }

    /**
     * Update the grid according the current zoom and pan values.
     * @param zoomTransform {SVGMatrix}
     */
    Grid.prototype.update = function (zoomTransform) {
        var size = zoomTransform.a * this._config["pattern-size"];
        var pan = {x: zoomTransform.e, y: zoomTransform.f};
        var s = this._config["step-size"];
        for (var y = 1; y < s; ++y) {
            this._xLines[y].attr({
                "x1": pan.x,
                "y1": pan.y + y * size,
                "x2": pan.x + size * s,
                "y2": pan.y + y * size
            }).attr(this._config["line"]);
        }
        for (var x = 1; x < s; ++x) {
            this._yLines[x].attr({
                "x1": pan.x + x * size,
                "y1": pan.y,
                "x2": pan.x + x * size,
                "y2": pan.y + size * s
            }).attr(this._config["line"]);
        }
        this._xLines[0].attr({
            "x1": pan.x,
            "y1": pan.y,
            "x2": pan.x + size * s,
            "y2": pan.y
        }).attr(this._config["big-line"]);
        this._yLines[0].attr({
            "x1": pan.x,
            "y1": pan.y,
            "x2": pan.x,
            "y2": pan.y + size * s
        }).attr(this._config["big-line"]);
        this._rect.attr({"fill": this._cross.pattern(pan.x, pan.y, size * s, size * s)});
    };

    /**
     * Round the given value to match grid lines.
     * @param value {Number} the value to round
     * @param bigger {Boolean?} Whether to use the big lines or the small ones.
     */
    Grid.prototype.round = function (value, bigger) {
        var s = bigger ? this._config["pattern-size"] * this._config["step-size"] : this._config["pattern-size"];
        return value % s === 0 ? value : value - value % s + s;
    };

    return Grid;

})();