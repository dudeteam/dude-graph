cg.Renderer.prototype._createValueText = function(block, element) {
    element.append("svg:text").attr({
        "class": "title",
        "text-anchor": "start",
        "alignment-baseline": "middle"
    });
};

cg.Renderer.prototype._updateValueText = function(block, element, text) {
    element.select(".title")
        .attr({x: this._config.block.padding, y: this._config.block.padding})
        .text(text);
    block.data.computedWidth += this._getBBox(element.select(".title")).width;
};

cg.Renderer.prototype._createValueBoolean = function(block, element) {
    this._createValueText(block, element);
};

cg.Renderer.prototype._updateValueBoolean = function(block, element) {
    this._updateValueText(block, element, block.value ? "true" : "false");
};

cg.Renderer.prototype._createValueNumber = function(block, element) {
    this._createValueText(block, element);
};

cg.Renderer.prototype._updateValueNumber = function(block, element) {
    this._updateValueText(block, element, block.value);
};

cg.Renderer.prototype._createValueSound = function(block, element) {
    this._createValueText(block, element);
};

cg.Renderer.prototype._updateValueSound = function(block, element) {
    this._updateValueText(block, element, block.value);
};

cg.Renderer.prototype._createValueString = function(block, element) {
    this._createValueText(block, element);
};

cg.Renderer.prototype._updateValueString = function(block, element) {
    this._updateValueText(block, element, "\"" + block.value + "\"");
};

cg.Renderer.prototype._createValueVec2 = function(block, element) {
    this._createValueText(block, element);
};

cg.Renderer.prototype._updateValueVec2 = function(block, element) {
    this._updateValueText(block, element, "Vec2(" + block.value.join(", ") + ")");
};

cg.Renderer.prototype._createValueVec3 = function(block, element) {
    this._createValueText(block, element);
};

cg.Renderer.prototype._updateValueVec3 = function(block, element) {
    this._updateValueText(block, element, "Vec3(" + block.value.join(", ") + ")");
};

cg.Renderer.prototype._createValueColor = function(block, element) {
    element.append("svg:rect")
        .attr({
            "class": "color-rect",
            "rx": this._config.block.borderRadius,
            "ry": this._config.block.borderRadius,
            "width": 40,
            "height": 20,
            "fill": block.value,
            "stroke": block.value
        });
};

cg.Renderer.prototype._updateValueColor = function(block, element) {
    var rect = element.select(".color-rect");
    block.data.computedWidth += parseInt(rect.attr("width"));
    element.select(".color-rect").attr({
        "x": this._config.block.padding,
        "y": rect.attr("height") / 2
    });
};