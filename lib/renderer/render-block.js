/**
 * Render the action.
 * @param block {cg.Block}
 * @private
 */
cg.Renderer.prototype._renderBlock = function (block) {
    var functionName = "_renderBlock" + cg.camelcase(block.model.type);
    if (this[functionName] === undefined) {
        this.emit("error", new Error("Missing overload function '" + functionName + "'."));
    }
    var blockGroup = this._blockLayer.g();
    blockGroup.addClass("block");
    return this[functionName](block, blockGroup);
};

cg.Renderer.prototype._renderBlockAction = function (action, element) {
    var backgroundGroup = element.g();
    this._dataBinding(action, element);
    element.data('action', action);
    element.addClass("action");
    var inputs = [];
    var inputMaxWidth = 0;
    for (var inputName in action.inputs) {
        if (action.inputs.hasOwnProperty(inputName)) {
            var inputPoint = action.inputs[inputName];
            var inputGroup = this.render(inputPoint, element);
            inputMaxWidth = Math.max(inputMaxWidth, inputGroup.getBBox().width);
            inputs.push(inputGroup);
        }
    }
    var outputs = [];
    var outputMaxWidth = 0;
    for (var outputName in action.outputs) {
        if (action.outputs.hasOwnProperty(outputName)) {
            var outputPoint = action.outputs[outputName];
            var outputGroup = this.render(outputPoint, element);
            outputMaxWidth = Math.max(outputMaxWidth, outputGroup.getBBox().width);
            outputs.push(outputGroup);
        }
    }
    var actionText = element.text(0, this._config.block["padding"], action.name);
    var actionWidth = Math.max(inputMaxWidth + outputMaxWidth + this._config.block["center-spacing"], actionText.getBBox().width);
    actionWidth += this._config.block["padding"] * 2;
    actionWidth = this._paper.background.round(actionWidth);
    var actionHeight = this._config.block["heading"] + action.height * this._config.point["height"];
    actionHeight = this._paper.background.round(actionHeight);
    var actionRect = backgroundGroup.rect(0, 0, actionWidth, actionHeight, this._config.block["border-radius"]);
    actionRect.addClass("background");
    actionText.transform("T " + actionWidth / 2);
    actionText.addClass("title");
    if (action.model.type === "getter") {
        actionRect.attr("stroke", "#e5678d");
        actionText.attr("fill", "#e5678d");
    }
    action.data.computedHeadingOffset = this._config.block["heading"];
    action.data.computedWidth = actionWidth;
    for (var inputIndex = 0; inputIndex < inputs.length; ++inputIndex) {
        var inputPosition = this._getPointRelativePosition(this._getNode(inputs[inputIndex]));
        inputs[inputIndex].transform(Snap.format("T {x} {y}", {x: inputPosition.x, y: inputPosition.y}));
    }
    for (var outputIndex = 0; outputIndex < outputs.length; ++outputIndex) {
        var outputPosition = this._getPointRelativePosition(this._getNode(outputs[outputIndex]));
        outputs[outputIndex].transform(Snap.format("T {x} {y}", {x: outputPosition.x, y: outputPosition.y}));
    }
    action.on("move", this._updateBlock.bind(this, action, element));
    action.on("remove", function() { element.remove(); });
    this._updateBlock(action, element);
    this._dragNode(action, element);
    return element;
};

cg.Renderer.prototype._renderBlockGetter = function (getter, element) {
    element.addClass("getter");
    element.addClass("type-" + getter.model.outputs[0].type);
    var backgroundGroup = element.g();
    var text = element.text(this._config.block["padding"], 0, getter.name);
    text.addClass("title");
    var width = this._paper.background.round(text.getBBox().width + this._config.block["padding"] * 3 + this._config.point["circle-size"]);
    var backgroundRect = backgroundGroup.rect(0, 0, width, this._config.getter["height"], this._config.block["border-radius"]);
    backgroundRect.addClass("background");
    var pointGroup = element.g();
    getter.data.computedHeadingOffset = this._config.getter["height"] / 2;
    getter.data.computedWidth = width;
    var circlePoint = this._renderPointCircle(getter.getPoint(0, "outputs"), pointGroup);
    circlePoint.transform("T " + [width - this._config.block["padding"], this._config.getter["height"] / 2]);
    text.transform("T " + [0, this._config.getter["height"] / 2 + text.getBBox().height / 4]);
    getter.on("move", this._updateBlock.bind(this, getter, element));
    getter.on("remove", function() { element.remove(); });
    this._updateBlock(getter, element);
    this._dragNode(getter, element);
    return element;
};

/**
 * Update the action position.
 * @param block
 * @param group
 * @private
 */
cg.Renderer.prototype._updateBlock = function (block, group) {
    group.transform("T" + block.absolutePosition().toArray());
};