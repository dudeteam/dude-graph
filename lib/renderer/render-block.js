/**
 * Render the action.
 * @param block {cg.Block}
 * @private
 */
cg.Renderer.prototype._renderBlock = function (block) {
    if (block.model.type === "getter") {
        return this._renderBlockGetter(block);
    }
    return this._renderBlockAction(block);
};

cg.Renderer.prototype._renderBlockAction = function (action) {
    var actionGroup = this._actionLayer.g();
    var backgroundGroup = actionGroup.g();
    this._dataBinding(action, actionGroup);
    actionGroup.data('action', action);
    actionGroup.addClass("action");
    var inputs = [];
    var inputMaxWidth = 0;
    for (var inputName in action.inputs) {
        if (action.inputs.hasOwnProperty(inputName)) {
            var inputPoint = action.inputs[inputName];
            var inputGroup = this.render(inputPoint, actionGroup);
            inputMaxWidth = Math.max(inputMaxWidth, inputGroup.getBBox().width);
            inputs.push(inputGroup);
        }
    }
    var outputs = [];
    var outputMaxWidth = 0;
    for (var outputName in action.outputs) {
        if (action.outputs.hasOwnProperty(outputName)) {
            var outputPoint = action.outputs[outputName];
            var outputGroup = this.render(outputPoint, actionGroup);
            outputMaxWidth = Math.max(outputMaxWidth, outputGroup.getBBox().width);
            outputs.push(outputGroup);
        }
    }
    var actionText = actionGroup.text(0, this._config.action["padding"], action.name);
    var actionWidth = Math.max(inputMaxWidth + outputMaxWidth + this._config.action["center-spacing"], actionText.getBBox().width);
    actionWidth += this._config.action["padding"] * 2;
    actionWidth = this._paper.background.round(actionWidth);
    var actionHeight = this._config.action["heading"] + action.height * this._config.point["height"];
    actionHeight = this._paper.background.round(actionHeight);
    var actionRect = backgroundGroup.rect(0, 0, actionWidth, actionHeight, this._config.action["border-radius"]);
    actionRect.addClass("background");
    actionText.transform("T " + actionWidth / 2);
    actionText.addClass("title");
    if (action.model.type === "getter") {
        actionRect.attr("stroke", "#e5678d");
        actionText.attr("fill", "#e5678d");
    }
    action.data.computedHeadingOffset = this._config.action["heading"];
    action.data.computedWidth = actionWidth;
    for (var inputIndex = 0; inputIndex < inputs.length; ++inputIndex) {
        var inputPosition = this._getPointRelativePosition(this._getNode(inputs[inputIndex]));
        inputs[inputIndex].transform(Snap.format("T {x} {y}", {x: inputPosition.x, y: inputPosition.y}));
    }
    for (var outputIndex = 0; outputIndex < outputs.length; ++outputIndex) {
        var outputPosition = this._getPointRelativePosition(this._getNode(outputs[outputIndex]));
        outputs[outputIndex].transform(Snap.format("T {x} {y}", {x: outputPosition.x, y: outputPosition.y}));
    }
    action.on("move", this._updateBlock.bind(this, action, actionGroup));
    action.on("remove", function() { actionGroup.remove(); });
    this._updateBlock(action, actionGroup);
    this._dragNode(action, actionGroup);
    return actionGroup;
};

cg.Renderer.prototype._renderBlockGetter = function (getter) {
    var getterGroup = this._actionLayer.g();
    getterGroup.addClass("getter");
    getterGroup.addClass("type-" + getter.model.outputs[0].type);
    var backgroundGroup = getterGroup.g();
    var text = getterGroup.text(this._config.action["padding"], 0, getter.name);
    text.addClass("title");
    var width = this._paper.background.round(text.getBBox().width + this._config.action["padding"] * 3 + this._config.point["circle-size"]);
    var backgroundRect = backgroundGroup.rect(0, 0, width, this._config.getter["height"], this._config.action["border-radius"]);
    backgroundRect.addClass("background");
    var pointGroup = getterGroup.g();
    getter.data.computedHeadingOffset = this._config.getter["height"] / 2;
    getter.data.computedWidth = width;
    var circlePoint = this._renderPointCircle(getter.getPoint(0, "outputs"), pointGroup);
    circlePoint.transform("T " + [width - this._config.action["padding"], this._config.getter["height"] / 2]);
    text.transform("T " + [0, this._config.getter["height"] / 2 + text.getBBox().height / 4]);
    getter.on("move", this._updateBlock.bind(this, getter, getterGroup));
    getter.on("remove", function() { getterGroup.remove(); });
    this._updateBlock(getter, getterGroup);
    this._dragNode(getter, getterGroup);
    return getterGroup;
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